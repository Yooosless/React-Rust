import React, { useState } from 'react'
import './loginSignup.css'
import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'
import { useNavigate } from 'react-router-dom'; 

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(""); // State for error messages

    const navigate = useNavigate();
    const handleSubmit = () => {
        if (!email || !password || (action === "Sign Up" && !name)) {
            setError("All fields are required.");
            return;
        }

        console.log('Action:', action);
        console.log('Email:', email);
        console.log('Password:', password);

        const userData = {
            email: email,
            password: password,
            name: name
        };

        const endpoint = action === "Sign Up" ? "signup" : "login";

        fetch(`http://localhost:8080/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(async response => {
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message )
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from backend:', data);
            // Store JWT token
            localStorage.setItem('token', data.token); // Assuming the token is in data.token
            setError("");
            if (action === "Login") {
                navigate('/'); // Use navigate to go to /welcome
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            // Handle error here
            setError(error.message)
        });
    };

    const handleActionChange = (newAction) => {
        setAction(newAction);
        setEmail("");
        setPassword("");
        setName("");
        setError("");
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
            {error && <div className="error-message">{error}</div>} 

                {action === "Login" ? null : 
                
                    <div className="input">
                        <img src={user_icon} alt="User Icon" />
                        <input type="text" value={name} placeholder='Name' onChange={(e) => setName(e.target.value)} />
                    </div>}

                <div className="input">
                    
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>

            {action === "Sign Up" ? null :
                <div className="lost-password">Forgot Password? <span>Click here</span></div>}
                
            <div className="submit-container">
                <div className="submit" onClick={handleSubmit}>
                    {action}
                </div>
                <div className="toggle" onClick={() => handleActionChange(action === "Login" ? "Sign Up" : "Login")}>
                    {action === "Login" ? "Go to Sign Up" : "Go to Login"}
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
