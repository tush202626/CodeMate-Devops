import Split from "react-split";
import { useViews } from "../../context/ViewContext";
function SplitterComponent({ children }) {
    const { isSidebarOpen } = useViews();

    const getSizes = () => {
        let sizes = [25, 75]
        return isSidebarOpen ? sizes : [0, 350]
    }

    const getMinSizes = () => {
        return isSidebarOpen ? [350, 350] : [50, 0]
    }

    const getGutter = () => {
        const gutter = document.createElement("div")
        gutter.className = "h-full cursor-e-resizer hidden md:block"
        gutter.style.backgroundColor = "#e1e1ffb3"
        return gutter
    }

    const getMaxSizes = () => {
        return isSidebarOpen ? [Infinity, Infinity] : [0, Infinity]
    }

    const getGutterStyle = () => ({
        width: "7px",
        display: isSidebarOpen  ? "block" : "none",
    })
    return (
            <Split
                 sizes={getSizes()} 
                 minSize={getMinSizes()}    
                 gutter={getGutter}
                 maxSize={getMaxSizes()}
                 dragInterval={1}
                 direction="horizontal" 
                 gutterAlign="center"
                 cursor="e-resize"
                 snapOffset={30}
                 gutterStyle={getGutterStyle}
                 className="flex h-screen min-h-screen max-w-full items-center justify-center overflow-hidden" 
            >
            {children}
             </Split>
    );
}

export default SplitterComponent;
