import { useAppContext } from "../../context/AppContext";
import { useSocket } from "../../context/SocketContext";
import CodeMirror, { scrollPastEnd } from "@uiw/react-codemirror";
import { useEffect, useMemo, useState, useCallback } from "react";
import { SocketEvent } from "../../types/socket";
import { useFileSystem } from "../../context/FileContext";
import { oneDark } from "@uiw/react-codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { tooltipField, cursorTooltipBaseTheme } from "./tooltip";

// Language imports
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

function Editor() {
    const { users, currentUser } = useAppContext();
    const { activeFile, setActiveFile, setOpenFiles, setFiles, files, openFiles } = useFileSystem();
    const { socket } = useSocket();
    const [timeoutId, setTimeoutId] = useState(null);

    const filteredUsers = useMemo(() => users.filter((u) => u.username !== currentUser.username), [users, currentUser]);

    const languageExtensions = {
        js: javascript(),
        javascript: javascript(),
        py: python(),
        python: python(),
        java: java(),
        c: cpp(),
        cpp: cpp(),
    };

    const getFileExtension = () => {
        if (!activeFile || !activeFile.name) return javascript(); // Default to JS
        const ext = activeFile.name.split(".").pop().toLowerCase();
        return languageExtensions[ext] || javascript();
    };

    const onCodeChange = useCallback(
        (code, view) => {
            if (!activeFile) return;

            const updatedFile = { ...activeFile, content: code };
            setActiveFile(updatedFile);

            const updateFiles = (fileList) =>
                fileList.map((file) => (file._id === activeFile._id ? updatedFile : file));
            setFiles(updateFiles(files));
            setOpenFiles(updateFiles(openFiles));

            const cursorPosition = view.state?.selection?.main?.head;
            socket.emit("TYPING_START", { cursorPosition });

            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile._id,
                newContent: code,
            });

            if (timeoutId) clearTimeout(timeoutId);
            setTimeoutId(setTimeout(() => socket.emit("TYPING_PAUSE"), 1000));
        },
        [activeFile, socket, timeoutId, setActiveFile, setFiles, setOpenFiles, files, openFiles]
    );

    const extensions = useMemo(() => [scrollPastEnd(), autocompletion(), getFileExtension(), tooltipField(filteredUsers), cursorTooltipBaseTheme], [activeFile, filteredUsers]);

    return (
        <div className="flex w-full flex-col overflow-x-auto md:h-screen">
            {activeFile ? (
                <CodeMirror
                    onChange={onCodeChange}
                    value={activeFile.content}
                    extensions={extensions}
                    minHeight="100%"
                    maxWidth="100vw"
                    style={{
                        height: "100vh",
                        position: "relative",
                        fontSize: "18px",
                        fontFamily: "monospace",
                        lineHeight: "1.5",
                    }}
                    theme={oneDark}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full bg-zinc-800 text-slate-200">
                    <div className="text-2xl font-semibold mb-2">No file is open</div>
                    <p className="text-md mb-4">Select a file from the sidebar or create a new one to begin coding...</p>
                </div>
            )}
        </div>
    );
}

export default Editor;
