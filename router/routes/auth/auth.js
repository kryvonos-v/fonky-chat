const { render } = require('../../../services/renderer');
const config = require('../../../config/config');
const urlQuery = require('../../../libs/url-query/url-query');
const { request, jsonRequest, extractFrom } = require('../../../libs/http-client/http-client');
const { User, newUser } = require('../../../models/user/user');

const authLinks = {
  github: generateLoginUrl('github', ['client_id', 'scope']),
  google: generateLoginUrl('google', ['client_id', 'redirect_uri', 'scope', 'response_type']),
  facebook: generateLoginUrl('facebook', ['client_id', 'redirect_uri', 'scope']),
};

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

const supportedAuthProviders = ['google', 'facebook', 'github'];
const isAuthProviderSupported = (provider) => Boolean(supportedAuthProviders.includes(provider));

async function oauthProvider(ctx) {
  const { authProvider } = ctx.params;

  if (!isAuthProviderSupported(authProvider)) {
    return ctx.throw(400, `${authProvider} auth provider is not supported`);
  }

  const accessToken = await exchangeCodeForAccessToken(authProvider, ctx.request.query.code); 
  const userInfo = await fetchUserInfoFromProvider[authProvider](accessToken);
  let user = await User.findOne({ email: userInfo.email });

  if (!user) {
    user = await newUser({
      ...userInfo,
      password: accessToken
    });
    await user.save();
  }
  
  ctx.session.userId = user._id;
  ctx.redirect('/');
}

async function exchangeCodeForAccessToken(authProvider, code) {
  const { clientId, clientSecret, accessTokenUrl, redirectUri } = config.auth[authProvider];
  const response = await jsonRequest(accessTokenUrl, {
    method: 'POST',
    body: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
      grant_type: 'authorization_code'
    }
  });
  const data = await extractFrom.json(response);

  return data.access_token;
}

const fetchUserInfoFromProvider = {
  async google(accessToken) {
    const userResponse = await request('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const { sub, name, email, picture } = await extractFrom.json(userResponse);

    return {
      id: sub,
      name,
      email,
      avatar: picture
    };
  },

  async github(accessToken) {
    const userInProviderResponse = await request('https://api.github.com/user', {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'nodejs'
      }
    });
    const { id, name, email, avatar_url } = await extractFrom.json(userInProviderResponse);

    return {
      id,
      name,
      email,
      avatar: avatar_url
    };
  },

  async facebook(accessToken) {
    const userResponse = await request('https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=' + accessToken);
    const { id, name, email, picture } = await extractFrom.json(userResponse);

    return {
      id,
      name,
      email,
      avatar: picture.data.url
    };
  }
};

function generateLoginUrl(providerUrl, params) {
  return providerUrl + '?' + urlQuery.stringify(params);
}

function setUp(router) {
  router.get('/login', loginPage);
  router.get('/auth/:authProvider', oauthProvider);
};

exports.setUp = setUp;

