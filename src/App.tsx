import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const App = () => {
  return (
    <div>test</div>
  )
}

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App />)
