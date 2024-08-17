import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { useAuthStore } from '../../stores/AuthStore';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import './Login.css'



const Login: React.FC = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await authStore.login( email, password );
        if (authStore.isAuthenticated) {
            navigate('/home');
        }
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <TextField color='secondary' label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField color='secondary' label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color='secondary' type="submit">Войти</Button>
                <Button variant="contained" color='secondary' onClick={() => navigate('/registration')}>Регистрация</Button>
            </form>
        </div>
    )
})

export default Login
