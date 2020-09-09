const webToken = require('jsonwebtoken')

const {sign, SignOptions, verify} = webToken
const saltSecret = '1234567890';

const jwtSign = (payload) => {
  const secretOrPrivateKey  = saltSecret;
  // Eg: 60, "2 days", "10h", "7d" */
  const options = { expiresIn: '30d' };
  const result = sign(payload, secretOrPrivateKey, options);
  return result;
};

const jwtVerify = (token) => {
  const secretOrPrivateKey = saltSecret;
  try {
    const result = verify(token, secretOrPrivateKey);
    return result;
  } catch (e) {
    console.error('jwtVerify error:', e);
    return null;
  }
};

export { jwtSign, jwtVerify };