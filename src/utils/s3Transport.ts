import TransportStream from 'winston-transport';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

// Initialize AWS SDK v3 S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface S3TransportOptions extends TransportStream.TransportStreamOptions {
  bucket: string;
  folder: string;
  logType: string;
}

class S3Transport extends TransportStream {
  private bucket: string;
  private folder: string;
  private logType: string;

  constructor(opts: S3TransportOptions) {
    super(opts);
    this.bucket = opts.bucket;
    this.folder = opts.folder;
    this.logType = opts.logType;
  }

  // 🔒 Sensitive Data Masking Function
  private maskSensitiveData(obj: any): any {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        ['password', 'authToken', 'refreshToken', 'apiKey', 'secret'].includes(key) ? '***HIDDEN***' : value
      )
    );
  }

  async log(info: any, callback: () => void) {
    try {
      // 📌 Mask sensitive data before logging
      const maskedLog = this.maskSensitiveData(info);

      const requestId = this.logType == 'error' ? info.requestId : this.logType == 'request' ? info.message.requestId : `unknown-${Date.now()}`;

      // 📌 Generate unique log filename
      const logKey = `${this.folder}/${requestId}.json`;

      const logEntry = {
        level: maskedLog.level,
        message: maskedLog.message, 
        timestamp: maskedLog.timestamp || new Date().toISOString(),
      };

      const params: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: logKey,
        Body: JSON.stringify(logEntry) + '\n',
        ContentType: 'application/json',
        ACL: 'private',
      };

      await s3.send(new PutObjectCommand(params));
    } catch (err) {
      console.error('S3 Logging Error:', err);
    }

    callback();
  }
}

export default S3Transport;
