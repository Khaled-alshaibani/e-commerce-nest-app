import {
  IsString,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsUrl,
  IsNumber,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  // Name
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

  // Role
  @IsEnum(['admin', 'user'], { message: 'Role must be either admin or user' })
  @IsOptional()
  role: string;

  // Avatar
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar: string;

  // Age
  @IsNumber({}, { message: 'Age must be a number' })
  @IsOptional()
  age: number;

  // Phone Number
  @MinLength(3, { message: 'Phone number must be at least 3 characters' })
  @MaxLength(20, { message: 'Phone number must be at most 20 characters' })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('YE', { message: 'Phone Number must be in a Yemein format' })
  @IsOptional()
  phoneNumber: string;

  // Address
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address: string;

  // Active
  @IsBoolean({ message: 'Active must be boolean' })
  @IsEnum([true, false], { message: 'Active must be either true or false' })
  @IsOptional()
  active: boolean;

  // Verification Code
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 characters' })
  @IsOptional()
  verificationCode: string;

  // Gender
  @IsEnum(['male', 'female'], {
    message: 'Gender must be either male or female',
  })
  @IsOptional()
  gender: string;
}
