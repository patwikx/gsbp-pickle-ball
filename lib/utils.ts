import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateQRCode(userId: string): string {
  // Generate a unique code with prefix USER_ followed by 10 random characters
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
  return `USER_${nanoid()}`;
}