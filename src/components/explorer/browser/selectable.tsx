import React from 'react'
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  signal: any
}

const Selectable = ({ signal }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: signal.id,
      });

      
  return (
    <button style={{  transform: CSS.Translate.toString(transform) }} ref={setNodeRef} {...listeners} {...attributes} className="text-sm flex justify-start items-center p-1">
      <div className="h-5 w-5 flex items-center justify-center">
      </div>
      <span className="text-white">{signal.name}</span>
    </button>
  )
}

export default Selectable
