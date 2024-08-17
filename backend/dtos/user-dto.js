module.exports = class UserDto {
    email;
    id;
    firstName;
    lastName;
    about;
    photo;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.about = model.about;
        this.photo = model.photo;
    }
};
