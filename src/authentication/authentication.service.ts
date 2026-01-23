import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  getAuthStatus(): { status: boolean } {
    return { status: true };
  }
}

