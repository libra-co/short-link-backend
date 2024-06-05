import * as crypto from 'crypto';

export const VisitRecordCryptoSecretKey = 'LibraShortCodeSystemTheBestProgm'; // length must be 32
// Initialization vector.
export const VisitRecordCryptoSecretKeyIv = crypto.randomBytes(16);
