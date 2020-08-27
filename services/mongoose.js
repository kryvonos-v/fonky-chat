const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.mongoose.URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

exports.mongoose = mongoose;

