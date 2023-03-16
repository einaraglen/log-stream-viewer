import React, { ReactNode, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { classNames } from "../../../utils/tools";
import { useSignalContext } from "../../../context/signal_context";
import { useGraphContext } from "../../../context/graph_context";

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

  const isSelected = useMemo(
    () => selected.find((metadata) => metadata.id == signal.id),
    [selected]
  );

  const isActive = useMemo(
    () => active && active.id == signal.id,
    [active]
  );

  if (isSelected) {
    return null;
  }

  return (
    <div>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={classNames(isActive && "opacity-0", "flex flex-shrink justify-start items-center")}
      >
        {children}
      </div>
    </div>
  );
};

const Label = ({ active }: { active: boolean }) => {
  return (
    <div className={classNames(active ? "bg-green-700" : "bg-red-700", "text-xs rounded-md shadow-md w-24 flex justify-center px-0.5")}>
      {active ? <span>In Range</span> : <span>Out of Range</span>}
    </div>
  )
}

const Selectable = ({ signal }: Props) => {
  // const { range } = useGraphContext()

  // const active = () => {
  //   if (range == null) {
  //     return false
  //   }

  //   const from = range.from > signal.from && range.from < signal.to
  //   const to = range.to > signal.from && range.to < signal.to

  //   console.log(from, to)


  //   return from || to
  // }

  return (
    <>
      <div className="h-5 w-5 flex items-center justify-center text-sm"></div>
      <div className="text-white text-sm space-x-2 items-center flex">
      <span>{signal.name}</span>
      <span className="text-xs text-white/50">{`(${signal.size})`}</span>
      {/* <Label active={active()} /> */}

      </div>
      <div className="h-5 w-5 flex items-center justify-center text-sm"></div>
    </>
  );
};

export default Selectable;
