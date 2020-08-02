const assert = require('assert').strict;
const http = require('http');
const https = require('https');
const stream = require('stream');
const urlQuery = require('../url-query/url-query');
const { extractData } = require('../stream-util/stream-util');

function request(url, config = {}) {
  const httpClient = url.startsWith('https')
    ? https
    : http;

  const { body, ...originalConfig } = config;

  return new Promise((resolve, reject) => {
    const req = httpClient.request(url, originalConfig, resolve);

    req.on('error', reject);

    if (body instanceof stream.Stream) {
      body.pipe(req);
    } else {
      req.end(body);
    }
  });
}

function jsonRequest(url, config = {}) {
  const mergedConfig = {
    ...config,
    method: config.method || 'GET',
    headers: {
      ...config.headers,
      'Accept': 'application/json; charset=utf-8',
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(config.body || {})
  };

  assert.notEqual(mergedConfig.method, 'GET', 'GET method is not supported, because the one cannot have request body');

  return request(url, mergedConfig);
}

const extractFrom = {
  async json(response) {
    return JSON.parse(await extractData(response));
  },
  async urlencoded(response) {
    return urlQuery.parse(await extractData(response));
  }
};

exports.request = request;
exports.jsonRequest = jsonRequest;
exports.extractFrom = extractFrom;

