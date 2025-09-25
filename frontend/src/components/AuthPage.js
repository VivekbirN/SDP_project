import React, { useState } from 'react';
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loginData, setLoginData] = useState({ clubId: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    clubName: '', 
    clubId: '', 
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', loginData);
    // Simple demo authentication - in production, this would call your backend
    if (loginData.clubId && loginData.password) {
      onLogin();
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Register submitted:', registerData);
    // Simple demo registration - in production, this would call your backend
    if (registerData.clubName && registerData.clubId && registerData.email && registerData.password) {
      alert('Registration successful! Please login with your credentials.');
      togglePanel(false);
    }
  };

  return (
    <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Create Account</h1>
          <span>Register your club with CampusConnect</span>
          <input
            type="text"
            name="clubName"
            placeholder="Club Name"
            value={registerData.clubName}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="text"
            name="clubId"
            placeholder="Club ID"
            value={registerData.clubId}
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
          <span>Welcome back, Club Admins!</span>
          <input
            type="text"
            name="clubId"
            placeholder="Club ID"
            value={loginData.clubId}
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
            <p>Welcome back, Club Admins! Login with your Club ID and password to manage your activities.</p>
            <button onClick={() => togglePanel(false)}>Login</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>New Club on Campus?</h1>
            <p>Register your club with CampusConnect to easily organize events, share resources, and engage with students!</p>
            <button onClick={() => togglePanel(true)}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;