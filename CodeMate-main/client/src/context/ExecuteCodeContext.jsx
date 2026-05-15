import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CodeExecuteService from "../services/codeExecuteService";
import langMap from "lang-map";
import { useFileSystem } from "./FileContext";
import { useSocket } from "./SocketContext";

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
        const fetchLanguagesAsync = async () => {
            try{
                const responseData = await codeExecuteService.getSupportedLanguages();
                if (responseData.error || !responseData.result) {
                    setSupportedLanguages([]);
                    console.error("Fetch languages error:", responseData.error);
                } else {
                    setSupportedLanguages(responseData.result || []);
                }
            }
            catch(err){
                console.log(err);
                setSupportedLanguages([]);
            }
        }
        
        fetchLanguagesAsync();
    }, []);

    useEffect(() => {
        if (!supportedLanguages || supportedLanguages.length === 0 || !activeFile?.name) return;
    
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
    

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;
        
        const onOutput = (data) => {
            setOutput(prev => prev + data);
        };
        const onEnd = () => {
            setIsRunning(false);
            toast.dismiss();
            toast.success("Execution completed!");
        };

        socket.on('EXECUTION_OUTPUT', onOutput);
        socket.on('EXECUTION_END', onEnd);

        return () => {
            socket.off('EXECUTION_OUTPUT', onOutput);
            socket.off('EXECUTION_END', onEnd);
        };
    }, [socket]);

    const executeCode = async () => {
        if(!selectedLanguage.id) {
            return toast.error("Please select a language");
        } else if(!activeFile) {
            return toast.error("Please open a file to run the code");
        }
        
        toast.loading("Running interactively...");
        setIsRunning(true);
        setIsError(false);
        setOutput(""); // Clear old output

        socket.emit('START_EXECUTION', {
            code: activeFile.content,
            language_id: selectedLanguage.id
        });
    }

    const sendInput = (text) => {
        if (socket && isRunning) {
            socket.emit('EXECUTION_INPUT', text);
            setOutput(prev => prev + text + '\n'); // Echo input
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