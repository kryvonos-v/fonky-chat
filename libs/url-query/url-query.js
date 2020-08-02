module.exports = {
  stringify(obj) {
    const query = [];
    const addPair = (encodedKey, value) => {
      const encodedValue = encodeURIComponent(value);

      query.push(`${encodedKey}=${encodedValue}`);
    };

    for (const key in obj) {
      const encodedKey = encodeURIComponent(key);
      const value = obj[key];

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; ++i) {
          addPair(encodedKey, value[i]);
        }
      } else {
        addPair(encodedKey, value);
      }
    }

    return query.join('&');
  },

  parse(str) {
    const obj = {};
    const parts = str.split('&');

    parts.forEach(part => {
      const [encodedKey, encodedValue] = part.split('=');
      if (!encodedKey) return;

      const key = decodePart(encodedKey);
      const value = decodePart(encodedValue);
      const objValue = obj[key];

      if (Array.isArray(objValue)) {
        objValue.push(value);
      } else if (key in obj) {
        obj[key] = [objValue, value];
      } else {
        obj[key] = value;
      }
    });

    return obj;
  }
};

function decodePart(encodedPart) {
  return decodeURIComponent(encodedPart).replace(/\+/g, ' ');
}
