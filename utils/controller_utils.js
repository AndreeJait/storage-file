import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const createJwtToken = (_id, expires) => {
  return jwt.sign({ id: _id }, process.env.SECRET_KEY, { expiresIn: expires });
};

export const decryptPassword = async (password) => {
  let salt = await bcrypt.hash(password, 10);
  return salt;
};

export const comparePassword = async (password, hashpassword) => {
  let compare = await bcrypt.compare(password, hashpassword);
  return compare;
};

export const randomString = (len, charSet)=> {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}