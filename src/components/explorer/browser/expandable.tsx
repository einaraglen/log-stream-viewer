import { ReactNode } from 'react'
import { Disclosure } from '@headlessui/react'
import { HiChevronRight } from 'react-icons/hi2'
import { classNames } from '../../../utils/tools'

interface Props {
  title: string
  children: ReactNode
}

const Expandable = ({ title, children }: Props) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="p-1 flex justify-startitems-center">
            <div className="h-5 w-5 flex items-center justify-center">
              <HiChevronRight className={classNames(open ? 'rotate-90 transform text-white/90' : "text-white/50", 'h-3 w-3 transition-all duration-200')} />
            </div>
            <span className='text-sm'>{title}</span>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="ml-3 flex flex-col justify-start space-y-1 transition-all duration-100">{children}</div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Expandable
