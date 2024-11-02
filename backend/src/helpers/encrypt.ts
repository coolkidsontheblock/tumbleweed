import bcrypt from 'bcrypt';

const saltRounds = 10;

const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password);
  return String(hashedPassword);
};

