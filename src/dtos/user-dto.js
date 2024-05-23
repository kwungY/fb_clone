module.exports = class UserDto {
  name;
  role;
  email;
  id;
  isActivated;

  constructor(model) {
    this.name = model.name;
    this.role = model.role;
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}