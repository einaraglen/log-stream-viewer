import { create } from 'zustand'

export type SignalContext = {
  signals: any
  set: any
}

export const useSignalContext = create<SignalContext>((set: any) => ({
  signals: null,
  set,
}))
