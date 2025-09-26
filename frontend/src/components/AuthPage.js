import React, { useState } from 'react';
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const togglePanel = (isRight) => {
    setIsRightPanelActive(isRight);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare login data (using email field)
      const loginCredentials = {
        email: loginData.email,
        password: loginData.password
      };
      
      console.log('Logging in user:', loginCredentials);
      
      // Call the backend login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Login successful:', data);
        alert('Login successful!');
        onLogin(); // Call the parent callback to set authenticated state
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your connection and try again.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (registerData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    try {
      // Prepare data for backend API (map username to name, email to email)
      const userData = {
        name: registerData.username,
        email: registerData.email, // Use the actual email field
        password: registerData.password
      };
      
      console.log('Registering user:', userData);
      
      // Call the backend registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Please login with your credentials.');
        // Clear form
        setRegisterData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Switch to login panel
        togglePanel(false);
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check your connection and try again.');
    }
  };

  return (
    <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Create Account</h1>
          <span>Register</span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={registerData.username}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>
          <span>Welcome back</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Already Registered?</h1>
            <p>Welcome back</p>
            <button onClick={() => togglePanel(false)}>Login</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>New here?</h1>
            <p>Register with usto easily organize your bills!</p>
            <button onClick={() => togglePanel(true)}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;