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
  HttpException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/user/guards/Auth.guard';
import { Roles } from 'src/user/decorators/Roles.decorator';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    createCouponDto: CreateCouponDto,
  ) {
    const expireDate = new Date(createCouponDto.expireDate) > new Date();
    if (!expireDate) {
      throw new HttpException('Coupon is Expired', 400);
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    if (new Date(createCouponDto.expireDate) > maxDate) {
      throw new HttpException('Expire date must be within 30 days', 400);
    }
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
