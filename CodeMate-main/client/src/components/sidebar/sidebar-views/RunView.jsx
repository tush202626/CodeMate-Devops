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

      {/* Input Section */}
      <div className="flex-1 flex flex-col">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Standard Input
        </label>
        <textarea
          className="w-full flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl p-4 
                    font-mono text-sm focus:border-black focus:ring-2 focus:ring-blue-200 
                    resize-none transition-all duration-200 placeholder:text-gray-400"
          placeholder="Enter input here..."
          onChange={(e) => setInput(e.target.value)}
        />
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

      {/* Output Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-600">Output</label>
          <button 
            onClick={copyOutput}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 
                      hover:text-gray-800 tooltip"
            data-tip="Copy Output"
          >
            <IoCopyOutline className="w-5 h-5" />
          </button>
        </div>
        <div className="relative flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl 
                      overflow-hidden has-[pre]:p-4">
          <pre className={`absolute left-2 top-2 inset-0 overflow-auto font-mono text-sm 
                        whitespace-pre-wrap ${isError ? 'text-red-600' : 'text-gray-800' }`}>
            {output || "// Your program output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RunView;