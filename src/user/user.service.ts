import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ status: number; messages: string; data: User }> {
    const ifuserExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (ifuserExists) {
      throw new HttpException('User already exists', 400);
    }
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role ?? 'user',
      active: true,
    });

    return {
      status: 200,
      messages: 'User created successfully',
      data: createdUser,
    };
  }

  // we'll return back to make pagination.
  async findAll(): Promise<{ status: number; data: User[] }> {
    return {
      status: 200,
      data: await this.userModel.find().select('-password -__v'),
    };
  }

  async findOne(id: number): Promise<{ status: number; data: User }> {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    const userExists = await this.userModel
      .findById(id)
      .select('-password -__v');
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    let user = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
      user = { ...updateUserDto, password: hashedPassword };
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { returnDocument: 'after' })
      .select('-password -__v');

    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUser!,
    };
  }

  async remove(id: string): Promise<{
    status: number;
    message: string;
  }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
