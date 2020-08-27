const { render } = require('../../../services/renderer');

async function homePage(ctx) {
  ctx.body = render('views/index.html');
}

async function userProfilePage(ctx) {
  ctx.body = render('views/user-profile.html');
}

exports.setUp = router => {
  router.get('/', homePage);
  router.get('/profile', userProfilePage);
};

