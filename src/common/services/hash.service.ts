import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly logger = new Logger(HashService.name);

  async hash(data: string): Promise<string> {
    if (Buffer.byteLength(data) > 72) {
      this.logger.error('Data exceeds maximum length for bcrypt hashing');
      throw new InternalServerErrorException('Unable to process the request at this time');
    }
    return bcrypt.hash(data, 12);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
