import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useState } from 'react';
import {useAuth} from '../hooks/useAuth.js'



const Register = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {loading, handleRegister} = useAuth();


const handleSubmit = async (e) => {
e.preventDefault();
// handle registration logic here
await handleRegister({username,email,password});
navigate('/'); // registration hone ke baad home page pe navigate kr denge
} 
if(loading){
    return (<main><h1>Loading...</h1></main>)
}

return (
    <main>
        <div className="form-container">
            <h1>Register</h1> 
            <form onSubmit={handleSubmit} > 

                <div className="input-group">
                    <label htmlFor="username">UserName</label>
                    <input
                    onChange={(e) => setUsername(e.target.value)} //two way data binding for username input
                    type="text" id="username" name="username" placeholder="Enter Username" />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => setEmail(e.target.value)} //two way data binding for email input
                    type="email" id="email" name="email" placeholder="Enter Email Address" />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e) => setPassword(e.target.value)} //two way data binding for password input
                    type="password" id="password" name="password" placeholder="Enter Password" />
                </div>
                <button className="button primary-button ">Register</button>

            </form>


            <p>Already have an account? <Link to="/login">Login here</Link></p>

        </div>
{/* registration form requires three inputs that are email,password and username  */}
    </main>
  )
}

export default Register