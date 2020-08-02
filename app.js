const Koa = require('koa');
const { router } = require('./router/router');

const app = new Koa();
const PORT = 3000;

app.use(router.routes());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
