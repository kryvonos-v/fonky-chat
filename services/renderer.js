const nunjucks = require('nunjucks');
const path = require('path');

const ENV = process.env.NODE_ENV;

nunjucks.configure(path.join(__dirname, '..'), {
  watch: (ENV === 'development' || ENV === 'staging')
});

module.exports = nunjucks;

