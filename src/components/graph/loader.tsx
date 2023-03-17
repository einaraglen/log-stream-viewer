import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Loader from "../misc/loader";

interface Props {
  open: boolean;
}

const GraphLoader = ({ open }: Props) => {
  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transform transition duration-500"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transform duration-700 transition ease-in-out delay-[200ms]"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="absolute top-2 right-2">
        <Loader />
      </div>
    </Transition>
  );
};

export default GraphLoader;
