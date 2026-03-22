import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CodeExecuteService from "../services/codeExecuteService";
import langMap from "lang-map";
import { useFileSystem } from "./FileContext";

const ExecuteCodeContext = createContext(null)

export const useExecuteCode = () => {
    const cxt = useContext(ExecuteCodeContext);

    if(cxt === null)
    {
        throw new Error("useExecuteCode must be used within a ExecuteCodeContextProvider");
    }
    return cxt;
}

const ExecuteCodeContextProvider = ({children}) => {

    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [supportedLanguages, setSupportedLanguages] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState({
        id: null,
        name: "",
    });
    const [isError, setIsError] = useState(false);

    // file contains id, name, content
    const { activeFile } = useFileSystem();

    const codeExecuteService = new CodeExecuteService();

    useEffect(() => {
        const fetchLanguages = async () => {
            try{
                const fetchLanguages = await codeExecuteService.getSupportedLanguages();
                setSupportedLanguages(fetchLanguages.result);
                // selectedLanguage = activeFile;
            }
            catch(err){
                console.log(err);
                toast.error("Failed to fetch languages");
            }
        }
        
        fetchLanguages();
    }, []);

    useEffect(() => {
        if (supportedLanguages.length === 0 || !activeFile?.name) return;
    
        const ext = activeFile.name.split(".").pop();
        if (ext) {
            const languageNames = langMap.languages(ext); // Returns an array of possible languages
            if (languageNames && languageNames.length > 0) {
                const languageName = languageNames[0]; // Pick the first matching language
    
                const language = supportedLanguages.find(
                    (l) => l.name.toLowerCase().includes(languageName.toLowerCase())
                );
    
                if (language) {
                    setSelectedLanguage({
                        id: language.id,
                        name: language.name,
                    });
                }
            }
        } else {
            setSelectedLanguage({ id: null, name: "" });
        }
    }, [activeFile, supportedLanguages]);
    

    const executeCode = async () => {
        try
        {
            if(!selectedLanguage.id)
            {
                return toast.error("Please select a language");
            }
            else if(!activeFile)
            {
                return toast.error("Please open a file to run the code");
            }
            else
            {
                toast.loading("Running code...");
            }

            setIsRunning(true);

            const res = await codeExecuteService.executeCode(activeFile.content, selectedLanguage.id, input);

            if(res.success)
            {
                setIsError(false);
                setOutput(res.output);
            }
            else
            {
                setIsError(true);
                setOutput(res.error);
            }
            
            setIsRunning(false);
            toast.dismiss();
        }
        catch(err)
        {
            console.error(err);
            setIsRunning(false);
            toast.dismiss();
            toast.error("Failed to run the code");
        }
    }

    return (
        <ExecuteCodeContext.Provider
            value={{
                setInput,
                output,
                isRunning,
                supportedLanguages,
                selectedLanguage,
                isError,
                setSelectedLanguage,
                executeCode
            }}
        >
            {children}
        </ExecuteCodeContext.Provider>
    )
}

export { ExecuteCodeContextProvider };
export default ExecuteCodeContext;