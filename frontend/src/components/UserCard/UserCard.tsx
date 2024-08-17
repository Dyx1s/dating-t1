import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        about: string;
        photo: string;
        likes: number;
        dislikes: number;
    }

    interface UserCardProps {
        users: User[];
        onLike: (user: User) => void;
        onDislike: (user: User) => void;
    }

    const UserCard: React.FC<UserCardProps> = ({ users, onLike, onDislike }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleLike = () => {
        if (currentIndex < users.length) {
            const currentUser = users[currentIndex];
            onLike(currentUser);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleDislike = () => {
        if (currentIndex < users.length) {
            const currentUser = users[currentIndex];
            onDislike(currentUser);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    if (users.length === 0) return <Typography>Нет доступных пользователей.</Typography>;

    if (currentIndex >= users.length) {
        return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4, textAlign: 'center' }}>
            <CardContent>
                <Typography variant="h5">Вы просмотрели всех пользователей!</Typography>
                <Box>
                    <img 
                        src="https://www.funnyart.club/uploads/posts/2023-02/1675540526_www-funnyart-club-p-kot-mem-kartinki-52.jpg" 
                        alt="kotend"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                </Box>
            </CardContent>
        </Card>
        );
    }

    const currentUser = users[currentIndex];

    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {currentUser.about}
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        height: 200,
                        overflow: 'hidden',
                        mb: 2,
                    }}
                    >
                    <img
                        src={`http://localhost:3002/uploads/${currentUser.photo}`}
                        alt="User"
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        }}
                    />
                </Box>
                <Button onClick={handleLike} startIcon={<ThumbUp />} color="primary">
                    Like
                </Button>
                <Button onClick={handleDislike} startIcon={<ThumbDown />} color="secondary">
                    Dislike
                </Button>
            </CardContent>
        </Card>
    );
    };

export default UserCard;
