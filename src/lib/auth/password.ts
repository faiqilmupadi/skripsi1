import bcrypt from 'bcryptjs';

export const hashPassword = (input: string) => bcrypt.hash(input, 10);
export const comparePassword = (input: string, hash: string) => bcrypt.compare(input, hash);
