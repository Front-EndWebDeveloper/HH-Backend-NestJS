import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class Authenticate2FADto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Token must be a 6-digit number' })
  token: string;
}

