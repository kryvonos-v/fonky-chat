const { render } = require('../../../services/renderer');
const config = require('../../../config/config');
const urlQuery = require('../../../libs/url-query/url-query');

async function loginPage(ctx) {
  const { github, google, facebook } = config.auth;

  ctx.body = render('views/auth-login.html', {
    auth: {
      github: generateLoginUrl(github.identityUrl, {
        client_id: github.clientId,
        scope: github.scope
      }),
      google: generateLoginUrl(google.identityUrl, {
        client_id: google.clientId,
        redirect_uri: google.redirectUri,
        scope: google.scope,
        response_type: google.responseType
      }), 
      facebook: generateLoginUrl(facebook.identityUrl, {
        client_id: facebook.clientId,
        redirect_uri: facebook.redirectUri,
        scope: facebook.scope
      })
    }
  });
}

function generateLoginUrl(providerUrl, params) {
  return providerUrl + '?' + urlQuery.stringify(params);
}

function setUp(router) {
  router.get('/login', loginPage);
};

exports.setUp = setUp;

