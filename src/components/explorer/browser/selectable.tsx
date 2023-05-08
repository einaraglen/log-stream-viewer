import React, { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { classNames } from "../../../utils/tools";
import { useSignalContext } from "../../../context/signal_context";

interface Props {
  signal: any;
}

export const Draggable = ({ signal, children }: Props & { children: ReactNode }) => {
  const { selected, active } = useSignalContext();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: signal.id,
    data: {
      signal,
    },
  });

  const isSelected = React.useMemo(
    () => selected.find((metadata) => metadata.id == signal.id),
    [selected]
  );

  const isActive = React.useMemo(
    () => active && active.id == signal.id,
    [active]
  );

  if (isSelected) {
    return null;
  }

  return (
    <div className="flex flex-shrink">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={classNames(isActive && "opacity-0", "flex flex-shrink justify-start items-center rounded-md bg-black/30 shadow-lg py-0.5")}
      >
        {children}
      </div>
    </div>
  );
};

const Selectable = ({ signal }: Props) => {
  return (
    <>
      <div className="h-5 w-5 flex items-center justify-center text-sm"></div>
      <div className="text-white text-sm space-x-2 items-center flex">
      <span>{signal.name}</span>
      {/* <span className="text-xs text-white/50">{`(${signal.size})`}</span> */}
      </div>
      <div className="h-5 w-5 flex items-center justify-center text-sm"></div>
    </>
  );
};

export default Selectable;
