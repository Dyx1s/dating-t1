import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserCard from '../UserCard/UserCard';
import { useAuthStore } from '../../stores/AuthStore';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  about: string;
  photo: string;
  likes: number;
  dislikes: number;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const authStore = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/users');
        /* console.log('Текущий ID:', authStore.user?.id); */
        const filteredUsers = response.data.filter((user: User) => user._id !== authStore.user?.id);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authStore.user?.id]);

  const handleLike = async (user: User) => {
    try {
      const response = await axios.post('http://localhost:3002/api/like', { userId: user._id });
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const handleDislike = async (user: User) => {
    try {
      const response = await axios.post('http://localhost:3002/api/dislike', { userId: user._id });
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
    } catch (error) {
      console.error('Error disliking user:', error);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <AppBar position="static" color='secondary'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Dating App</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar
              alt="Profile Photo"
              src={`http://localhost:3002/uploads/${authStore.user?.photo}?t=${new Date().getTime()}`}
              sx={{ width: 40, height: 40, marginRight: 2 }}
              onClick={() => navigate('/profile')}
            />
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {authStore.user?.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <div>
        {users.length > 0 ? (
          <UserCard users={users} onLike={handleLike} onDislike={handleDislike} />
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
