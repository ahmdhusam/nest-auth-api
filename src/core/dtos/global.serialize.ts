import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GlobalSerialize {
  @ApiResponseProperty()
  @Expose()
  message: string;

  @Exclude()
  password?: never;
}
