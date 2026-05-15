const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { randomUUID } = require('crypto');

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

function runCommand(command, timeoutMs = 5000) {
  return new Promise((resolve) => {
    exec(command, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error && error.killed) {
        resolve({ type: 'stderr', output: 'Execution timed out.' });
      } else if (error) {
        resolve({ type: 'stderr', output: stderr || stdout || error.message });
      } else if (stderr) {
        resolve({ type: 'stderr', output: stderr });
      } else {
        resolve({ type: 'stdout', output: stdout });
      }
    });
  });
}

const vm = require('vm');

async function runLocalJS(code, stdin) {
  return new Promise((resolve) => {
    const logs = [];
    let inputLines = (stdin || "").split('\n');
    let lineIndex = 0;

    const context = {
      console: {
        log: (...args) => logs.push(args.map(String).join(' ')),
        error: (...args) => logs.push('Error: ' + args.map(String).join(' ')),
      },
      prompt: (msg) => {
        if (msg) logs.push(String(msg)); // Optional: print the prompt message
        return inputLines[lineIndex++] || "";
      }
    };
    
    try {
      vm.createContext(context);
      vm.runInContext(code, context, { timeout: 3000 });
      resolve({ type: 'stdout', output: logs.join('\n') || 'Success (No output)' });
    } catch (err) {
      resolve({ type: 'stderr', output: err.message });
    }
  });
}

async function executeLocally(code, language_id, stdin) {
  const jobId = randomUUID();
  let result;
  
  if (language_id == 63) { // JS using internal VM module
    return await runLocalJS(code, stdin);
  }

  // Write stdin to file
  const inputFile = path.join(tempDir, `${jobId}.txt`);
  fs.writeFileSync(inputFile, stdin || "");

  try {
    if (language_id == 71) { // Python
      const filepath = path.join(tempDir, `${jobId}.py`);
      fs.writeFileSync(filepath, code);
      result = await runCommand(`python "${filepath}" < "${inputFile}"`);
      fs.unlinkSync(filepath);
    } 
    else if (language_id == 54) { // C++
      const filepath = path.join(tempDir, `${jobId}.cpp`);
      const outpath = path.join(tempDir, `${jobId}.exe`);
      fs.writeFileSync(filepath, code);
      
      const compileResult = await runCommand(`g++ "${filepath}" -o "${outpath}"`);
      if (compileResult.type === 'stderr') {
        result = compileResult;
      } else {
        result = await runCommand(`"${outpath}" < "${inputFile}"`);
        if (fs.existsSync(outpath)) fs.unlinkSync(outpath);
      }
      fs.unlinkSync(filepath);
    }
    else if (language_id == 50) { // C
      const filepath = path.join(tempDir, `${jobId}.c`);
      const outpath = path.join(tempDir, `${jobId}.exe`);
      fs.writeFileSync(filepath, code);
      
      const compileResult = await runCommand(`gcc "${filepath}" -o "${outpath}"`);
      if (compileResult.type === 'stderr') {
        result = compileResult;
      } else {
        result = await runCommand(`"${outpath}" < "${inputFile}"`);
        if (fs.existsSync(outpath)) fs.unlinkSync(outpath);
      }
      fs.unlinkSync(filepath);
    }
    else {
      result = { type: 'stderr', output: "Local execution for this language is not supported yet." };
    }
  } catch (err) {
    result = { type: 'stderr', output: err.message };
  } finally {
    if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
  }

  return result;
}

async function main(code, language_id, stdin) {
  // We now run EVERYTHING locally!
  const supportedLocal = [50, 54, 63, 71]; 
  if (supportedLocal.includes(Number(language_id))) {
      return await executeLocally(code, language_id, stdin);
  }

  return { type: 'stderr', output: `Language ID ${language_id} is not supported by the local execution engine.` };
}

module.exports = { main };