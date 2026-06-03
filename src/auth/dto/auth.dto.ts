import { MinLength, MaxLength, IsString, IsEmail } from 'class-validator';

export class SignupDto {
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  // Email
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  // Password
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

export class SigninDto {
  // Email
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  // Password
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
