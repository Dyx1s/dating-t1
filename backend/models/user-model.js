const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    firstName: {type: String, default: 'Нет имени'},
    lastName: {type: String, default: 'Нет фамилии'},
    about: {type: String, default: 'Пользователь не добавил информацию о себе'},
    photo: {type: String, default: 'Нет фотографии'},
})

module.exports = model('User', UserSchema)