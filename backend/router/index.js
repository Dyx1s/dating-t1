const Router = require('express').Router;
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

// Сохранение фоток на диск
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //папка с фотками
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Генерация уникального имени файла
    },
});

const upload = multer({ storage });

router.post('/registration',
    upload.single('photo'),
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/like', userController.likeUser);
router.post('/dislike', userController.dislikeUser);
router.get('/users', userController.getAllUsers);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.single('photo'), userController.updateProfile);

module.exports = router;
