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
import { SigninDto, SignupDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
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
      throw new UnauthorizedException();
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
}
