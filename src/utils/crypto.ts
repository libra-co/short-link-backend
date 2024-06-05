import * as crypto from 'crypto';
import { VisitRecordCryptoSecretKey, VisitRecordCryptoSecretKeyIv } from 'config/local.config';

export const encryptVisitRecordId = (id: number) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(VisitRecordCryptoSecretKey), VisitRecordCryptoSecretKeyIv);
  let encrypted = cipher.update(id.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decryptVisitRecordId = (encryptedData: string) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(VisitRecordCryptoSecretKey), VisitRecordCryptoSecretKeyIv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return parseInt(decrypted, 10);
  } catch (error) {
    return null;
  }
};
