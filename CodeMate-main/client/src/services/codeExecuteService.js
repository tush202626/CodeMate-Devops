class CodeExecuteService
{
    url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

    async getSupportedLanguages()
    {
        let response;

        try
        {
            response = await fetch(
                this.url + "api/code/languages",
                {
                    method: "GET"
                }
            );
        }
        catch(err)
        {
            console.log(err);
            return { error: "Network error", success: false };
        }
        if (!response) return { error: "Server unreachable", success: false };

        // will get result array of objects containing [{ id, name }]
        return (await response.json());
    }

    async executeCode(currentFileCode, languageId, stdin)
    {
        let response;
        try
        {
            response = await fetch(
                this.url + "api/code/execute",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: currentFileCode,
                        language_id: languageId,
                        stdin: stdin
                    })
                }
            );
        }
        catch(err)
        {
            console.log(err);
            return { error: "Network error", success: false };
        }
        if (!response) return { error: "Server unreachable", success: false };

        return (await response.json());
    }
}

export default CodeExecuteService;