import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { Roles } from 'src/user/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/Auth.guard';

@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createRequestProductDto: any,
    @Req() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException('Unauthorized');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.requestProductService.create({
      ...createRequestProductDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      user: req.user._id,
    });
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.requestProductService.findAll();
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.requestProductService.findOne(id, req);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRequestProductDto: any,
    @Req() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.requestProductService.update(id, {
      ...updateRequestProductDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      user: req.user._id,
    });
  }
  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user_id = req.user._id;
    return this.requestProductService.remove(id, user_id);
  }
}
