import { useMemo } from 'react'
import { useSignalContext } from '../../../context/signal_context'
import Expandable from './expandable'
import Selectable, { Draggable } from './selectable'

const render = (object: any) => {
  const keys = Object.keys(object)

  return keys.map((key) => {
    if (Object.keys(object[key]).includes('name')) {
      return (
        <Draggable key={object[key].name} signal={object[key]}>
          <Selectable signal={object[key]} />
        </Draggable>
      )
    }

    return (
      <Expandable key={key} title={key}>
        {render(object[key])}
      </Expandable>
    )
  })
}

const BrowserList = () => {
  const { signals } = useSignalContext()

  const content = useMemo(() => {
    if (signals == null) {
      return
    }

    if (Array.isArray(signals)) {
      return signals.map((signal) => (
        <Draggable key={signal.id} signal={signal}>
          <Selectable signal={signal} />
        </Draggable>
      ))
    }

    return render(signals)
  }, [signals])

  return <div className="flex flex-col justify-start space-y-1 p-1 overflow-y-scroll h-[20rem] transition-all duration-100">{content}</div>
}

export default BrowserList
