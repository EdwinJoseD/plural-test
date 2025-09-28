import { logger } from '@/config/logger/logger';
import bcrypt from 'bcrypt';
import { AppError } from '../response.type';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    logger.error('Error hashing password: %s', (error as Error).message);
    throw new AppError({ message: 'Error hashing password' });
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password: %s', (error as Error).message);
    throw new AppError({ message: 'Error comparing password' });
  }
};
