import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { HiOutlineClock, HiXCircle } from "react-icons/hi2";
import dayjs from "dayjs"
import relative from "dayjs/plugin/relativeTime"
import { useDrawHandler } from "../../graph/handlers/draw";

dayjs.extend(relative)

interface Props {
  signal: Metadata;
}

const Item = ({ signal }: Props) => {
  const { remove } = useDrawHandler()

  const onRemove = () => {
    remove(signal)
  }

  return (
    <div className="flex items-center justify-between bg-black/30 shadow-lg rounded-md px-2 py-1">
      <div className="flex items-center space-x-2">
        <div style={{ background: signal.color }} className="h-7 w-7 rounded-lg shadow-lg" />

      <div className="flex flex-col">
        <span className="text-sm font-semibold">{signal.name}</span>
        <span className="text-xs text-white/50">{signal.path}</span>
      </div>
      </div>
    
      <div className="flex space-x-2 items-center">
        <div className="flex flex-col">
        <div className="flex items-center justify-end space-x-1">
          <span className="text-xs text-white/50">--</span>
          <BiTargetLock className="h-3 w-4" />
        </div>
        <div className="flex items-center justify-end space-x-1">
          <span className="text-xs text-white/50">--</span>
          <HiOutlineClock className="h-3 w-4" />
        </div>
        </div>
        <button onClick={onRemove}>
        <HiXCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Item;
