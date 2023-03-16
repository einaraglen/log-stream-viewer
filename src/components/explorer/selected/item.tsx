import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { HiOutlineClock } from "react-icons/hi2";
import dayjs from "dayjs"

import relative from "dayjs/plugin/relativeTime"

dayjs.extend(relative)

interface Props {
  signal: Metadata;
}

const Item = ({ signal }: Props) => {
  const duration = signal.size == 1 ? "--" : dayjs(parseInt(signal.from)).to(dayjs(parseInt(signal.to)), true);

  return (
    <div className="flex items-center justify-between bg-white/10 rounded-md px-2 py-1">
      <div className="flex items-center space-x-2">
        <div style={{ background: signal.color }} className="h-7 w-7 rounded-lg shadow-lg" />

      <div className="flex flex-col">
        <span className="text-sm font-semibold">{signal.name}</span>
        <span className="text-xs text-white/50">{signal.path}</span>
      </div>
      </div>
    
      <div className="flex flex-col">
        <div className="flex items-center justify-end space-x-1">
          <span className="text-xs text-white/50">{signal.size}</span>
          <BiTargetLock className="h-3 w-4" />
        </div>
        <div className="flex items-center justify-end space-x-1">
          <span className="text-xs text-white/50">{duration}</span>
          <HiOutlineClock className="h-3 w-4" />
        </div>
      </div>
    </div>
  );
};

export default Item;
