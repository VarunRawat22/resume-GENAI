import {RouterProvider} from 'react-router-dom'
import {router} from './app.routes.jsx'
// import { useState } from 'react'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from "./features/interview/interview.context.jsx"

function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
