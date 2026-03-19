import {RouterProvider} from 'react-router-dom'
import {router} from './app.routes.jsx'
// import { useState } from 'react'
import { AuthProvider } from './features/auth/context.auth.jsx'

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
