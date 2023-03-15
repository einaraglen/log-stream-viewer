import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { useDataHandler } from '../components/graph/handlers/data'
import { useSignalContext } from './signal_context'

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080/stream'

export const useSocketContext = create((set: any) => ({
  socket: io(URL!),
  isConnected: false,
  onConnect: () => set({ isConnected: true }),
  onDisconnect: () => set({ isConnected: false }),
  set,
}))

interface Props {
  children: ReactNode
}

const SocketContextProvider = ({ children }: Props) => {
  const { socket, onConnect, onDisconnect } = useSocketContext()
  const { set } = useSignalContext()
  const { add } = useDataHandler()

  const onResponse = (payload: any) => {
    add(payload[0].values.map((value) => ({ ...value, x_axis: parseInt(value.x_axis)})))
  }

  const onSignals = (payload: any) => {
    console.log(payload)
    set({ signals: payload })
  }

  useEffect(() => {
    socket.on('connect', onConnect)
    socket.on('disconnect', () => onDisconnect)

    socket.on('response', onResponse)
    socket.on('signals', onSignals)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)

      socket.off('response', onResponse)
      socket.off('signals', onSignals)
    }
  }, [])

  return <>{children}</>
}

export default SocketContextProvider
