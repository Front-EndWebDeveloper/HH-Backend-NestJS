import { IsNotEmpty, IsEmail } from 'class-validator';

export class Enable2FADto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
