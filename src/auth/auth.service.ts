import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrybt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ResetPasswordDto, SigninDto, SignupDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signup(signupDto: SignupDto) {
    const saltOrRounds = 10;
    const user = await this.userModel.findOne({ email: signupDto.email });
    if (user) {
      throw new HttpException('User already exists', 400);
    }

    const password = await bcrybt.hash(signupDto.password, saltOrRounds);
    const createdUser = {
      password,
      role: 'user',
      active: true,
    };

    const newUser = await this.userModel.create({
      ...signupDto,
      ...createdUser,
    });

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      status: 200,
      messages: 'User created successfully',
      data: newUser,
      access_token: token,
    };
  }

  async signin(signinDto: SigninDto) {
    const user = await this.userModel.findOne({ email: signinDto.email });
    if (!user) {
      throw new NotFoundException('Invalid Email or Password');
    }

    const password = await bcrybt.compare(signinDto.password, user.password);
    if (!password) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      status: 200,
      messages: 'User signed in successfully',
      data: user,
      access_token: token,
    };
  }

  async resetPassword({ email }: ResetPasswordDto) {
    // const saltOrRounds = 10;
    const user = await this.userModel.findOne({
      email: email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Genrate a six digits code
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    await this.userModel.findOneAndUpdate(
      { email },
      { verificationCode: code },
    );
    const htmlMessage = `
      <div>
        <h1 justify-content="center">Forget your password? if you didn't request a password reset, please ignore this email.</h1>
        <p>Your password reset code is: <h3 style= "color: red; font-weight: bold; text-align: center;"><br>${code}</br></h3></p>
        <h6 style= "color: blue; font-weight: bold"> E-commerce-nest.js </h6>
      </div>
    `;

    await this.mailService.sendMail({
      from: `E-commerce-nest.js <${process.env.EMAIL_USERNAME}>`,
      to: `${email}`,
      subject: `Resetting Password From E-commerce-nest.js`,
      html: htmlMessage,
    });

    return {
      status: 200,
      message: `Code sent successfully on your email ${email}`,
    };
  }

  async verifyCode(verifyCode) {
    const user = await this.userModel
      .findOne({ email: verifyCode.email })
      .select('verificationCode');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verificationCode !== verifyCode.code) {
      throw new UnauthorizedException('Invalid verification code');
    }
    // Clear the verification code after successful verification
    await this.userModel.findOneAndUpdate(
      { email: verifyCode.email },
      { verificationCode: null },
    );

    return {
      status: 200,
      message: 'Verification code is valid. You can now reset your password.',
    };
  }

  async changePassword(changePasswordData) {
    const saltOrRounds = 10;
    const user = await this.userModel
      .findOne({ email: changePasswordData.email })
      .select('verificationCode');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const password = await bcrybt.hash(
      changePasswordData.password,
      saltOrRounds,
    );

    await this.userModel.findOneAndUpdate(
      { email: changePasswordData.email },
      { password },
    );

    return {
      status: 200,
      message: 'Password changed successfully',
    };
  }
}
