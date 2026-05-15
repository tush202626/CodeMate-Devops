import toast from "react-hot-toast";
import { useExecuteCode } from "../../../context/ExecuteCodeContext";
import { FaCaretDown } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";

const RunView = () => {
  const {
    setInput,
    output,
    isRunning,
    supportedLanguages,
    selectedLanguage,
    setSelectedLanguage,
    executeCode,
    isError
  } = useExecuteCode();

  const handleLngChange = (ev) => {
    const language = JSON.parse(ev.target.value);
    setSelectedLanguage(language);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Output copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-5 border-black border-4 rounded-3xl">
      <h1 className="text-2xl font-bold text-gray-800">Code Runner</h1>

      {/* Language Selector */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Programming Language
        </label>
        <div className="relative">
          <select
            className="w-full bg-white border-2 border-gray-200 rounded-xl py-2.5 pl-4 pr-8 
                      appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                      transition-all duration-200 hover:border-gray-300 cursor-pointer"
            value={JSON.stringify(selectedLanguage)}
            onChange={handleLngChange}
          >
            <option value="" className="text-gray-400">
              Select Language
            </option>
            {supportedLanguages
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((l, i) => (
                <option key={i} value={JSON.stringify(l)} className="text-gray-800">
                  {l.name}
                </option>
              ))}
          </select>
          <FaCaretDown className="absolute right-4 top-3.5 text-gray-500" />
        </div>
      </div>

      {/* Run Button */}
      <button
        className="w-full bg-black text-white py-3 rounded-xl font-semibold 
                  hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all duration-200 transform hover:scale-[1.01] shadow-sm"
        onClick={executeCode}
        disabled={isRunning}
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse">⚡</span> Executing...
          </span>
        ) : (
          "Run Code"
        )}
      </button>

      {/* Interactive Terminal Section */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-600">Interactive Terminal</label>
          <button 
            onClick={copyOutput}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 
                      hover:text-gray-800 tooltip"
            data-tip="Copy Output"
          >
            <IoCopyOutline className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 bg-gray-900 border-2 border-gray-700 rounded-xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            <pre className={`font-mono text-sm whitespace-pre-wrap ${isError ? 'text-red-400' : 'text-green-400' }`}>
              {output || "// Interactive output will appear here..."}
            </pre>
          </div>
          {isRunning && (
            <input 
              autoFocus
              className="w-full bg-gray-800 text-green-400 p-3 font-mono text-sm border-t border-gray-700 outline-none placeholder:text-gray-500"
              placeholder="Type input and press Enter..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendInput(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RunView;