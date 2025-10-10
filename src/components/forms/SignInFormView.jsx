import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import AuthService from '../../service/auth/AuthService.js';
import APIUtil from '../../core/system/APIUtil.js';
import Token from '../../model/auth/Token.js';

const SignInFormView = () => {
    const [userName,setUserName] = useState('')
    const [password,setPassword] = useState('')

    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        if (!userName && !password) {
            toast.error('Please fill out all fields.', { position: 'top-right' });
        } else if (!password) {
            toast.warning('Please provide password.', { position: 'top-right' });
        } else if(!userName){
            toast.warning('Please provide user name.', { position: 'top-right' });
        }
         else {
    
            // If the form is successfully submitted, show a success toast
            const authService = new AuthService();
            authService.login(userName, password)
            .then((response) => {
                const toeken = Token.build(response, userName);
                authService.saveToken(toeken);
                
                toast.success('Login successful!', { position: 'top-right' });

                setUserName('');
                setPassword('');

                if (APIUtil.validateSession()) {
                    APIUtil.redirectIfAuthenticated(navigate);
                }
            }).catch((error) => {
                console.error('Login failed:', error);
                toast.error('Login failed. Please check your credentials.', { position: 'top-right' });
            });
        }
      };
    
  return (
    <form action="#" onSubmit={handleFormSubmit}>
        <input 
        type="text" 
        name="login-username" 
        id="login-username" 
        placeholder="Usuario"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        />
        <input 
        type="password" 
        name="login-password" 
        id="login-password" 
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="fz-1-banner-btn single-form-btn">Entrar</button>
    </form>
  )
}

export default SignInFormView