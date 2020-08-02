const { render } = require('../../../services/renderer');

async function homePage(ctx) {
  ctx.body = render('views/index.html');
}

exports.setUp = router => {
  router.get('/', homePage);
};

