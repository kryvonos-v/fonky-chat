const { PassThrough } = require('stream');
const { expect } = require('chai');
const { extractData } = require('./stream-util');

describe('stream-util', () => {
  describe('#extractData', () => {
    it('should extract data correctly (#1 case)', async () => {
      const expected = 'Some message received from stream';
      const stream = createReadStreamWithContent(expected);
      
      expect(await extractData(stream)).to.equal(expected);
    });
    
    it('should extract data correctly (#2 case)', async () => {
      const expected = 'Another message from stream';
      const stream = createReadStreamWithContent(expected);
       
      expect(await extractData(stream)).to.equal(expected);
    });
  });
});

function createReadStreamWithContent(str) {
  const duplexStream = new PassThrough();
  duplexStream.end(str);

  return duplexStream;
}

