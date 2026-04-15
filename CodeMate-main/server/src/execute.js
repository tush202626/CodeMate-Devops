const baseUrl = 'https://judge0-ce.p.rapidapi.com';

async function execute(code, language_id, stdin) {
  const url = `${baseUrl}/submissions?base64_encoded=true&wait=true`;
  let encoded_code = btoa(code);
  let encoded_input = btoa(stdin);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': process.env.API_KEY || "",
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
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