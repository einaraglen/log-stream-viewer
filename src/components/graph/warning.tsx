import { Transition } from "@headlessui/react";
import React, { Fragment } from "react"
import { HiExclamationTriangle } from "react-icons/hi2";

interface Props {
    open: boolean;
}

const Warning = ({ open }: Props) => {
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
        <div className="absolute bottom-8 right-2">
          <HiExclamationTriangle className="h-6 w-6 text-yellow-600" />
        </div>
      </Transition>
    )
}   

export default Warning;