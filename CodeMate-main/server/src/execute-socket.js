const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const activeProcesses = new Map();

function handleExecutionSockets(socket) {
    socket.on('START_EXECUTION', ({ code, language_id }) => {
        if (activeProcesses.has(socket.id)) {
            activeProcesses.get(socket.id).kill();
        }

        const jobId = randomUUID();
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        let filepath, command, args;

        if (language_id == 71) { // Python
            filepath = path.join(tempDir, `${jobId}.py`);
            fs.writeFileSync(filepath, code);
            command = 'python';
            args = ['-u', filepath]; // -u forces unbuffered output so it streams immediately
        } else if (language_id == 63) { // JS
            filepath = path.join(tempDir, `${jobId}.js`);
            fs.writeFileSync(filepath, code);
            command = 'node';
            args = [filepath];
        } else if (language_id == 54 || language_id == 50) { // C/C++
            const ext = language_id == 54 ? 'cpp' : 'c';
            filepath = path.join(tempDir, `${jobId}.${ext}`);
            const outpath = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(filepath, code);
            const compiler = language_id == 54 ? 'g++' : 'gcc';
            
            const compileProc = spawn(compiler, [filepath, '-o', outpath]);
            compileProc.stderr.on('data', d => socket.emit('EXECUTION_OUTPUT', d.toString()));
            compileProc.on('close', (code) => {
                if (code === 0) startProc(outpath, [], outpath, filepath);
                else socket.emit('EXECUTION_END');
            });
            return;
        } else {
            socket.emit('EXECUTION_OUTPUT', "Language not supported for interactive execution.");
            socket.emit('EXECUTION_END');
            return;
        }

        startProc(command, args, null, filepath);

        function startProc(cmd, argsList, exePath, srcPath) {
            const proc = spawn(cmd, argsList);
            activeProcesses.set(socket.id, proc);

            proc.stdout.on('data', d => socket.emit('EXECUTION_OUTPUT', d.toString()));
            proc.stderr.on('data', d => socket.emit('EXECUTION_OUTPUT', d.toString()));

            proc.on('close', () => {
                socket.emit('EXECUTION_END');
                activeProcesses.delete(socket.id);
                try {
                    if (exePath && fs.existsSync(exePath)) fs.unlinkSync(exePath);
                    if (srcPath && fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
                } catch(e) {}
            });
        }
    });

    socket.on('EXECUTION_INPUT', (data) => {
        const proc = activeProcesses.get(socket.id);
        if (proc) {
            proc.stdin.write(data + '\n');
        }
    });

    socket.on('disconnect', () => {
        const proc = activeProcesses.get(socket.id);
        if (proc) {
            proc.kill();
            activeProcesses.delete(socket.id);
        }
    });
}

module.exports = handleExecutionSockets;
