import React, { useState } from 'react';
import { useAuthStore } from '../stores/AuthStore';
import { Box, TextField, Button, Typography, Avatar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(authStore.user?.firstName || '');
    const [lastName, setLastName] = useState(authStore.user?.lastName || '');
    const [about, setAbout] = useState(authStore.user?.about || '');
    const [photo, setPhoto] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
        }
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('about', about);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await axios.put('http://localhost:3002/api/profile', formData, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            authStore.fetchUserProfile();
            setSuccess('Ваши данные успешно сохранены!');
            navigate('/home');
        } catch (error: any) {
            console.error('Ошибка при обновлении профиля:', error);
            setError('Произошла ошибка при сохранении данных.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 500,
                margin: 'auto',
                mt: 4,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
        <Typography variant="h4" gutterBottom>
            Профиль
        </Typography>
        <Avatar
            alt="Profile Photo"
            src={photo ? URL.createObjectURL(photo) : `http://localhost:3002/uploads/${authStore.user?.photo}`}
            sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Button variant="contained" component="label">
            Загрузить новое фото
            <input type="file" hidden onChange={handlePhotoChange} />
        </Button>
        <TextField
            label="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
        />
        <TextField
            label="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
        />
        <TextField
            label="Обо мне"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            fullWidth
            multiline
            rows={4}
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Сохранить
        </Button>
        </Box>
    );
};

export default Profile;
