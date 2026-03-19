import {useAuth} from '../hooks/useAuth.js'
import { Navigate } from 'react-router-dom';
import React, { Children } from 'react'

const Protected = ({ children }) => {
    const{user,loading} = useAuth();
    

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
        return <Navigate to="/login" /> // agar user login nahi hai to login page pe navigate kr denge
    }

return children;
}
export default Protected