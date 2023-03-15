import React from 'react'
import { createRoot } from 'react-dom/client'
import List from './components/explorer/browser/list'
import Graph from './components/graph/graph'
import SocketContextProvider from './context/socket_context'
import { DndContext } from '@dnd-kit/core';
import './index.css'

const App = () => {
  return (
    <DndContext>
  <SocketContextProvider>
      <Graph />
      <div className='w-1/2 overflow-y-scroll h-[20rem]'>
      <List />
      </div>
    </SocketContextProvider>
    </DndContext>
  )
}

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App />)
