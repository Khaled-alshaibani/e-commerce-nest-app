import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/Auth.guard';
import { Roles } from './decorators/Roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // For Admin
  @Post()
  @Roles(['admin'])
  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

@Controller('userme')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  // For User
  @Get()
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  updateMe(
    @Req() req,
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(req.user, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  deleteMe(@Req() req) {
    return this.userService.deleteMe(req.user);
  }
}
