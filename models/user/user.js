const { mongoose } = require('../../services/mongoose');
const { generatePasswordSalt, encryptPassword } = require('./user.utils');

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  passwordHash: {
    type: String,
    required: true
  },
  passwordSalt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: () => new Date().toUTCString()
  }
});

User.methods.checkPassword = async function(password) {
  const encyprtedPassword = await encryptPassword(password, this.passwordSalt);
  
  return encryptedPassword === this.passwordHash;
};

const UserModel = mongoose.model('user', User);

async function newUser(data) {
  const { password, ...restData } = data;

  const passwordSalt = await generatePasswordSalt();
  const passwordHash = await encryptPassword(password, passwordSalt);

  return new UserModel({
    ...restData,
    passwordSalt,
    passwordHash
  }); 
}

exports.User = UserModel;
exports.newUser = newUser;
