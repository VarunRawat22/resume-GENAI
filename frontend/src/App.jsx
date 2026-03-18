import {RouterProvider} from 'react-router-dom'
import {router} from './app.routes.jsx'
// import { useState } from 'react'

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
