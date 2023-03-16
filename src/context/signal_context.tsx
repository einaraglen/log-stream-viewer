import { create } from 'zustand'
import randomColor from "randomcolor"

export type SignalContext = {
  signals: any
  active: any | null
  selected: Metadata[]
  onDragEnd: (event: any) => void
  onDragStart: (event: any) => void
  setSignals: (signals: any) => void
  set: any
}

const addSelected = (set: any, event: any) => {
  const signal = event.active.data.current.signal
  const color = randomColor({
    luminosity: 'light',
    hue: 'random',
    format: 'rgb'
 })
  set((state: SignalContext) => ({ selected: [ ...state.selected, { ...signal, color } ]}))
}

const removeSelected = (set: any, event: any) => {
  const signal = event.active.data.current.signal
  set((state: SignalContext) => ({ selected: state.selected.filter((metadata) => metadata.id != signal.id) }))
}

const onDragStart = (event: any, set: any) => {
  const signal = event.active.data.current.signal
  set({ active: signal })
}

const onDragEnd = (event: any, set: any) => {
  set({ active: null })
  return event.over ? addSelected(set, event) : removeSelected(set, event)
}

export const useSignalContext = create<SignalContext>((set: any) => ({
  signals: null,
  selected: [],
  active: null,
  onDragStart: (event: any) => onDragStart(event, set),
  onDragEnd: (event: any) => onDragEnd(event, set),
  setSignals: (signals: any) => set({ signals }),
  set,
}))
