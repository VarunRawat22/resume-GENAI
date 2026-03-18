import React from 'react'
import { useNavigate,Link } from 'react-router-dom'



const Register = () => {

    const navigate = useNavigate()

    const handleSubmit = (e) => {
    e.preventDefault()
    // handle registration logic here
}

return (
    <main>
        <div className="form-container">
            <h1>Register</h1> 
            <form onSubmit={handleSubmit} > 

                <div className="input-group">
                    <label htmlFor="username">UserName</label>
                    <input type="text" id="username" name="username" placeholder="Enter Username" />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter Email Address" />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter Password" />
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