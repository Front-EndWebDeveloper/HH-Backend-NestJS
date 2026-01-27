import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('v1/api/auth-status')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get()
  getAuthStatus(): { status: boolean } {
    return this.authenticationService.getAuthStatus();
  }
}

