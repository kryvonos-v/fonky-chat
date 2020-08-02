const { expect } = require('chai');
const urlQuery = require('./url-query');

describe('URL query', () => {
  describe('#stringify', () => {
    it('should return empty string for empty object', () => {
      expect(urlQuery.stringify({})).to.equal('');
    });

    it('should transform correctly object with single prop', () => {
      const obj = {
        user: 'kryvonos_v'
      };
      const expected = 'user=kryvonos_v';

      expect(urlQuery.stringify(obj)).to.equal(expected);
    });

    it('should encode value as URI component', () => {
      const obj = {
        user: 'Вова К'
      };
      const expected = 'user=%D0%92%D0%BE%D0%B2%D0%B0%20%D0%9A';
      
      expect(urlQuery.stringify(obj)).to.equal(expected);
    });

    it('should encode key as URI component', () => {
      const obj = {
        'мой ключ': 'value'
      };
      const expected = '%D0%BC%D0%BE%D0%B9%20%D0%BA%D0%BB%D1%8E%D1%87=value';

      expect(urlQuery.stringify(obj)).to.equal(expected);
    });

    it('should transform correctly object with multiple props', () => {
      const obj = {
        productTitle: 'Apple MacBook Pro 16',
        price: '$3500'
      };
      const expected = 'productTitle=Apple%20MacBook%20Pro%2016&price=%243500';

      expect(urlQuery.stringify(obj)).to.equal(expected);
    });

    it('should transform correctly object with array value', () => {
      const obj = {
        category: ['laptops', 'books']
      };
      const expected = 'category=laptops&category=books';

      expect(urlQuery.stringify(obj)).to.equal(expected);
    });
  });

  describe('#parse', () => {
    it('should return empty object for empty string', () => {
      const result = urlQuery.parse('');

      expect(result).to.be.an('object').that.is.empty;
    });

    it('should parse single key-value pair', () => {
      const result = urlQuery.parse('user=kryvonos_v');
      const expected = {
        user: 'kryvonos_v'
      };

      expect(result).to.deep.equal(expected);
    });

    it('should decode value as URI component', () => {
      const encoded = 'user=%D0%92%D0%BE%D0%B2%D0%B0%20%D0%9A';
      const expected = {
        user: 'Вова К'
      };

      expect(urlQuery.parse(encoded)).to.deep.equal(expected);
    });

    it('should decode key as URI component', () => {
      const encoded = '%D0%BA%D0%BE%D1%80%D0%B8%D1%81%D1%82%D1%83%D0%B2%D0%B0%D1%87=kryvonos_v';
      const expected = {
        'користувач': 'kryvonos_v'
      };

      expect(urlQuery.parse(encoded)).to.deep.equal(expected);
    });

    it('should parse + sign as space', () => {
      const encoded = 'name=Volodymyr+Kryvonos';
      const expected = {
        name: 'Volodymyr Kryvonos'
      };

      expect(urlQuery.parse(encoded)).to.deep.equal(expected);
    });

    it('should parse correctly string with multiple key-values', () => {
      const encoded = 'productTitle=Apple%20MacBook%20Pro%2016&price=%243500';
      const expected = {
        productTitle: 'Apple MacBook Pro 16',
        price: '$3500'
      };

      expect(urlQuery.parse(encoded)).to.deep.equal(expected);
    });

    it('should work correctly with redundant delimiters (&)', () => {
      const encoded = '&user=kryvonos&';
      const expected = {
        user: 'kryvonos'
      };

      expect(urlQuery.parse(encoded)).to.deep.equal(expected);
    });

    it('should parse correctly key-value which represents an array', () => {
      const encoded = 'category=laptops&category=books';
      const expected = {
        category: ['laptops', 'books']
      };

      expect(urlQuery.parse(encoded)).to.deep.equal(expected);
    });
  });
});
