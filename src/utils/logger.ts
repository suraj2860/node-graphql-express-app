import winston from 'winston';
import S3Transport from './s3Transport';

// S3 Bucket Name
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 's3-bucket-name';

// Sensitive Data Masking Function
const maskSensitiveData = (key: string, value: unknown) =>
  ['password', 'authToken', 'refreshToken', 'apiKey', 'secret'].includes(key)
    ? '***HIDDEN***'
    : value;

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json({ replacer: maskSensitiveData })
);

// Request & Response Logger
export const requestResponseLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' }),
    new S3Transport({ bucket: S3_BUCKET_NAME, folder: 'logs/requests', logType: 'request' }),
  ],
});

// Error Logger
export const errorLogger = winston.createLogger({
  level: 'error',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log' }),
    new S3Transport({ bucket: S3_BUCKET_NAME, folder: 'logs/errors', logType: 'error' }),
  ],
});
