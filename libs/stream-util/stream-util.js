async function extractData(stream, encoding = 'utf-8') {
  stream.setEncoding(encoding);

  let body = '';
  for await (const chunk of stream) {
    body += chunk;
  }

  return body;
};

module.exports = { extractData };

