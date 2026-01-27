import { TokenInterface } from '../interfaces/token.interface';

export class TokenSerializer implements TokenInterface {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;

  constructor(partial: Partial<TokenSerializer>) {
    Object.assign(this, partial);
  }
}
