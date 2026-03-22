const baseUrl = 'https://judge0-ce.p.rapidapi.com';
const apiKey = process.env.API_KEY;
// const apiKey = '9ca6e813f8msh2369d4f279cd875p1086f7jsn9e6b171bc3f8';

async function execute(code, language_id, stdin) {
  const url = `${baseUrl}/submissions?base64_encoded=true&wait=true`;
  let encoded_code = btoa(code);
  let encoded_input = btoa(stdin);
  
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language_id: language_id,
      source_code: encoded_code,
      stdin: encoded_input
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in execute:', error);
    throw new Error('Failed to submit code.');
  }
}

async function main(code, language_id, stdin) {
  const submissionResult = await execute(code, language_id, stdin);
  if (submissionResult && submissionResult.token) {
    if (submissionResult.status.id === 3) {
      return { type: 'stdout', output: atob(submissionResult.stdout) };
    }
    else {
      if (submissionResult.compile_output) {
        return { type: 'stderr', output: atob(submissionResult.compile_output) };
      }
      else if (submissionResult.stderr) {
        return { type: 'stderr', output: atob(submissionResult.stderr) };
      }
      else {
        return { type: 'stderr', output: 'Unknown Error.' };
      }
    }
  } else {
    throw new Error('Submission token not found!');
  }
}

module.exports = { main };