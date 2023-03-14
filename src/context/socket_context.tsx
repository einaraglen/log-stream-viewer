import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { useDataHandler } from '../components/graph/handlers/data'

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
  const { add } = useDataHandler()

  const onResponse = (payload: any) => {
    add(payload)
  }

  useEffect(() => {
    socket.on('connect', onConnect)
    socket.on('disconnect', () => onDisconnect)

    socket.on('response', onResponse)
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)

      socket.off('response', onResponse)
    }
  }, [])

  return <>{children}</>
}

export default SocketContextProvider
