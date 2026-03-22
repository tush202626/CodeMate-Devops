import Editor from "../editor/Editor";
import FilesTab from "../filesTab/FilesTab";
import { useAppContext } from "../../context/AppContext";
import ACTIVITY_STATE from "../../types/activityState";
import DrawingBoard  from "../drawing/DrawingEditor";

const WorkSpace = () => {
  const { activityState } = useAppContext();

  return (
    <>
      {activityState === ACTIVITY_STATE.DRAWING ? (
        <DrawingBoard />
      ) : (
        <div className="flex flex-col h-screen  border-black  p-2 border-x-[7px] m-4 rounded-3xl">
          {/* Files Tab Section */}
          {/* <div className="flex-none bg-white shadow-md"> */}
            <FilesTab />
          {/* </div> */}

          {/* Editor Section */}
          <div className="flex-1 overflow-auto">
            <div className="w-full bg-white dark:bg-gray-800 border-gray-400 border-[1px] shadow-lg h-full overflow-hidden rounded-xl">
              <Editor />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkSpace;
