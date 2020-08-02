const http = require('http');
const fs = require('fs');
const path = require('path');
const { assert, expect } = require('chai');
const { request, jsonRequest } = require('./http-client');

describe('http-client', function() {
  this.timeout(50);

  describe('#request', () => {
    it('should reach server', done => {
      after(done => server.close(done));

      const server = http.createServer(async (req, res) => {
        res.end();
        done();
      })
        .listen(3001, () => {
          request('http://localhost:3001')        
        });
    });

    it('should send headers to a server', done => {
      after(done => server.close(done));

      const server = http.createServer((req, res) => {
        res.end();
        expect(req.headers).to.own.include({
          'content-type': 'application/json'
        });
        done();
      })
        .listen(3002, () => {
          request('http://localhost:3002', {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        })
    });

    it('should send text body data to a server', done => {
      after(done => server.close(done));

      const server = http.createServer(async (req, res) => {
        let body = '';

        for await (const chunk of req) {
          body += chunk;
        }
        res.end();

        try {
          expect(body).to.equal('Some user data');
          done();
        } catch(err) {
          done(err);
        }
      });

      server.listen(3003, () => {
        request('http://localhost:3003', {
          method: 'POST',
          body: 'Some user data'
        });
      });
    });

    it('should send data as a stream to a server', done => {
      after(done => server.close(done));

      const server = http.createServer(async (req, res) => {
        const body = [];
        for await (const chunk of req) {
          body.push(chunk);
        }
        const data = Buffer.concat(body).toString();
        res.end();

        try {
          expect(data).to.equal('Some data received from a stream\n');
          done();
        } catch (error) {
          done(error);
        }
      });

      server.listen(3004, () => {
        const filePath = path.join(__dirname, '__fixtures', 'hello.txt');
        const fileStream = fs.createReadStream(filePath);

        const simpleReq = request('http://localhost:3004', {
          method: 'POST',
          body: fileStream
        });
      });
    });
  });

  describe('#jsonRequest', () => {
    it('should send request with proper \'Content-Type\' and \'Accept\' headers', done => {
      after(done => server.close(done));

      const server = http.createServer(async (req, res) => {
        res.end();
        expect(req.headers).to.own.include({
          'content-type': 'application/json; charset=utf-8'
        });
        done();
      });

      server.listen(3005, () => {
        jsonRequest('http://localhost:3005', { method: 'POST' });
      });
    });

    it('should stringify request body', done => {
      after(done => server.close(done));

      const server = http.createServer(async (req, res) => {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        res.end();
        expect(body).to.equal('{"firstName":"Volodymyr","lastName":"Kryvonos"}');
        done();
      });

      server.listen(3006, () => {
        jsonRequest('http://localhost:3006', {
          method: 'POST',
          body: {
            firstName: 'Volodymyr',
            lastName: 'Kryvonos'
          }
        });
      });
    });
  });
});

