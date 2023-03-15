import React, { useMemo } from 'react'
import { useSignalContext } from '../../../context/signal_context'
import Expandable from './expandable'
import Selectable from './selectable'

const render = (object: any) => {
  const keys = Object.keys(object)

  return keys.map((key) => {
    if (Object.keys(object[key]).includes('id')) {
      return <Selectable key={object[key].id} signal={object[key]} />
    }

    return (
      <Expandable key={key} title={key}>
        {render(object[key])}
      </Expandable>
    )
  })
}

const List = () => {
  const { signals } = useSignalContext()

  const content = useMemo(() => signals && render(signals), [signals])

  return <div className="flex flex-col justify-start space-y-1 rounded-lg p-1">{content}</div>
}

export default List
