const Koa = require('koa');
const session = require('koa-session');
const { router } = require('./router/router');

const app = new Koa();
const PORT = 3000;
const ENV = process.env.NODE_ENV;

app.keys = ['some secret key'];

app.use(session({
  maxAge: 86400000,
  secure: false
}, app));
app.use(router.routes());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
