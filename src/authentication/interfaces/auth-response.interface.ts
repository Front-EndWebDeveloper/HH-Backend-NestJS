export interface AuthResponseInterface {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    isTwoFaEnabled: boolean;
    roles: string[];
  };
  requiresTwoFactor?: boolean;
}
