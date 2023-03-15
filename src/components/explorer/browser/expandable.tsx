import React, { ReactNode } from 'react'
import { Disclosure } from '@headlessui/react'
import { HiPlay, HiChevronRight } from 'react-icons/hi2'
import { classNames } from '../../../utils/tools'

interface Props {
  title: string
  children: ReactNode
}

const Expandable = ({ title, children }: Props) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div className=''>
          <Disclosure.Button className="p-1 flex justify-start text-sm items-center">
            <div className="h-5 w-5 flex items-center justify-center">
              <HiChevronRight className={classNames(open ? 'rotate-90 transform text-white/90' : "text-white/50", 'h-3 w-3 transition-all duration-200')} />
            </div>
            <span>{title}</span>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="ml-3 flex flex-col justify-start space-y-1 pb-1">{children}</div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

export default Expandable
