const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

UserSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    const document = this;

    bcrypt.hash(this.password, saltRounds, function (err, hashed) {
      document.password = hashed
      next()
    });
  }
})

UserSchema.methods.isCorrectPassword = function (password, callback) {

  bcrypt.compare(password, this.password).then((res) => {
    console.log(res)
    callback(!res);
  });
}

module.exports = mongoose.model('User', UserSchema)