// const secretKey = process.env.CRYPTR_SECRET_KEY;
// const cryptr = new Cryptr(`${secretKey}`);
import bcrypt from "bcrypt";

// Function to hash a password using bcrypt
const hashPassword = async (password: string) => {
  const saltRounds = 10; // Number of salt rounds to use
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with its hash using bcrypt
const comparePassword = async (password: string, hashedPassword: string) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export { comparePassword, hashPassword };
