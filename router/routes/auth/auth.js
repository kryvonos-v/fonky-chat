const { render } = require('../../../services/renderer');
const config = require('../../../config/config');
const urlQuery = require('../../../libs/url-query/url-query');

async function loginPage(ctx) {
  ctx.body = render('views/auth-login.html', {
    auth: {
      github: `${config.auth.github.identityUrl}?` + urlQuery.stringify({
        client_id: config.auth.github.clientId,
        scope: 'user:email'
      }), 
      google: config.auth.google.identityUrl + '?' + urlQuery.stringify({
        client_id: config.auth.google.clientId,
        redirect_uri: config.auth.google.redirectUri,
        scope: config.auth.google.scope,
        response_type: config.auth.google.responseType
      }), 
      facebook: config.auth.facebook.identityUrl + '?' + urlQuery.stringify({
        client_id: config.auth.facebook.clientId,
        redirect_uri: config.auth.facebook.redirectUri,
        scope: config.auth.facebook.scope,
        auth_type: 'rerequest'
      })  
    }
  });
}

function setUp(router) {
  router.get('/login', loginPage);
};

exports.setUp = setUp;

