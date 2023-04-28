import BrowserList from "./browser/list";
import SelectedList from "./selected/list";

const Explorer = () => {
  return (
    <div className="flex">
      <div className="w-1/2">
        <BrowserList />
      </div>
      <div className="w-1/2">
        <SelectedList />
      </div>
    </div>
  );
};

export default Explorer;
