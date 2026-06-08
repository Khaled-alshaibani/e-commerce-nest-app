import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SigninDto, SignupDto } from './dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signup(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signupDto: SignupDto,
  ) {
    return this.authService.signup(signupDto);
  }

  @Post('sign-in')
  signin(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    SigninDto: SigninDto,
  ) {
    return this.authService.signin(SigninDto);
  }

  @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    email: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email);
  }

  @Post('verify-code')
  verifyCode(
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    verifycode: {
      email: string;
      code: string;
    },
  ) {
    return this.authService.verifyCode(verifycode);
  }

  @Post('change-password')
  changePassword(
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    changePasswordData: SigninDto,
  ) {
    return this.authService.changePassword(changePasswordData);
  }
}
