import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
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
}
