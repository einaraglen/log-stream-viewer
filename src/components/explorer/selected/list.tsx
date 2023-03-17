import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Indicator from "./indicator";
import { useSignalContext } from "../../../context/signal_context";
import Item from "./item";

const SelectedList = () => {
  const { selected } = useSignalContext();
  const { isOver, setNodeRef } = useDroppable({
    id: "active_area",
  });
  
  return (
    <div className="relative">
      <div ref={setNodeRef} className="overflow-y-scroll h-[20rem]">
        <div className="flex flex-col justify-start space-y-3 p-1 ">
          {selected.map((metadata) => (
            <Item key={metadata.id} signal={metadata} />
          ))}
        </div>
      </div>
      <Indicator open={isOver} />
    </div>
  );
};

export default SelectedList;
