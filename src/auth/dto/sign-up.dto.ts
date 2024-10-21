import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, isString, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class SignUpDto {
  @Transform(({ value }) => (isString(value) ? value.toLowerCase() : value))
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty()
  @IsStrongPassword()
  @IsString()
  @MinLength(6)
  password: string;
}
