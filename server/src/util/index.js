function decodeBase64(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    decodedString = {};

  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  decodedString.type = matches[1];
  decodedString.data = Buffer.from(matches[2], 'base64');

  return decodedString;
}

module.exports = { decodeBase64 };
