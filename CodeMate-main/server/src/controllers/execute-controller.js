require("dotenv").config()
const { main } = require("../execute");

const executeCode = async (req, res) => {
    const code = req.body.code;
    const language_id = req.body.language_id;
    const stdin = req.body.stdin;

    if (!code) {
        return res.status(400).json({ error: "Code is required" });
    }
    if (!language_id) {
        return res.status(400).json({ error: "Language ID is required" });
    }

    try {
        const { type, output } = await main(code, language_id, stdin);

        if (type === 'stdout') {
            res.status(200).json({ success: true, output });
        }
        else if (type === 'stderr') {
            res.status(200).json({ success: false, error: output });
        }
    }
    catch (error) {
        console.error("Error during code execution:", error);
        res.status(500).json({ error: "An error occurred during code execution" });
    }
};

function cmp(a, b)
{
    return a.id < b.id ? -1 : 1;
}

const fallbackLanguages = [
  { id: 50, name: "C (GCC Local)" },
  { id: 54, name: "C++ (GCC Local)" },
  { id: 63, name: "JavaScript (Node.js Local)" },
  { id: 71, name: "Python (3.x Local)" },
];

const getLanguages = async (req, res) => {
  const baseUrl = "https://judge0-ce.p.rapidapi.com";

  try {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.API_KEY || "",
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    };

    const response = await fetch(`${baseUrl}/languages`, options);

    if (!response.ok) {
      return res.status(200).json({ result: fallbackLanguages });
    }

    let result = await response.json();
    result = result.filter((l) => l.id <= 80).sort((a, b) => (a.id < b.id ? -1 : 1));

    res.status(200).json({ result });
  } catch (error) {
    res.status(200).json({ result: fallbackLanguages });
  }
};

module.exports = {
    executeCode,
    getLanguages,
}