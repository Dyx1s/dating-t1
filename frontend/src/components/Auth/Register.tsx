import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/AuthStore';
import { Box, TextField, Button, Typography, Alert, Input, Avatar } from '@mui/material';

const Register: React.FC = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [about, setAbout] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      setPhoto(target.files[0]);
      setPhotoPreview(URL.createObjectURL(target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('about', about);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await authStore.register(formData);
      navigate('/home');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError('Пользователь с таким email уже существует');
      } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        mt: 3,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Зарегистрироваться
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Имя"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Фамилия"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Обо мне"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />

      {photoPreview && (
        <Avatar
          src={photoPreview}
          alt="Preview"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
      )}

      <Button
        variant="contained"
        component="label"
        color="primary"
        sx={{ width: '100%' }}
      >
        Выбрать фото
        <Input
          type="file"
          onChange={handlePhotoChange}
          sx={{ display: 'none' }}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}
      <Button type="submit" variant="contained" color="secondary" fullWidth>
        Зарегистрироваться
      </Button>
    </Box>
  );
};

export default Register;
