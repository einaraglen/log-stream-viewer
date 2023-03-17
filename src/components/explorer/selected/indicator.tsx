import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { HiInboxArrowDown } from "react-icons/hi2";

interface Props {
  open: boolean;
}

const Indicator = ({ open }: Props) => {
  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transform transition duration-500"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transform duration-700 transition ease-in-out"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="absolute z-10 rounded-md bg-black/50 backdrop-blur-md shadow-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center space-x-2 p-3">
          <HiInboxArrowDown className="h-6 w-6 text-white/60" />
          <span>Drop to View</span>
        </div>
      </div>
    </Transition>
  );
};

export default Indicator;
