import React, { use } from "react";
import "../auth.form.scss"
import { useNavigate,Link } from 'react-router-dom'
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";




const Login = () => {

    const {loading, haldleLoading} = useAuth();
    const navigate = useNavigate();

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit = async(e) => {
    e.preventDefault();
    await haldleLoading({email,password});
    // handle login logic here
    navigate('/'); // login hone ke baad home page pe navigate kr denge
    }
    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }



    return(
    <main>
        <div className="form-container">
            <h1>Login</h1> 
            <form onSubmit={handleSubmit} > 

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder="Enter Email Address" />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder="Enter Password" />
                </div>
                <button className="button primary-button ">Login</button>

            </form>

            <p>Don't have an account? <Link to="/register">Register here</Link></p>

        </div>
{/* login form requires two inputs that are email and password  */}
    </main>
    )
}

export default Login;