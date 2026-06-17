import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './coupon.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async create(createCouponDto: CreateCouponDto) {
    const Coupon = await this.couponModel.findOne({
      name: createCouponDto.name,
    });
    if (Coupon) {
      throw new HttpException('Coupon already exists', 400);
    }

    const newCoupon = await this.couponModel.create(createCouponDto);

    return {
      status: 200,
      message: 'Coupon created successfully',
      data: newCoupon,
    };
  }

  async findAll() {
    const Coupon = await this.couponModel.find();

    return {
      status: 200,
      message: Coupon.length > 0 ? 'Coupons Found' : 'No Coupons yet!',
      length: Coupon.length,
      isEmpty: Coupon.length > 0 ? 'false' : 'true',
      data: Coupon,
    };
  }

  async findOne(_id: string) {
    const Coupon = await this.couponModel.findById({ _id }).select('-__v');
    if (!Coupon) {
      throw new NotFoundException('Coupon not Found');
    }
    return {
      status: 200,
      message: 'Coupon Found',
      data: Coupon,
    };
  }

  async update(_id: string, updateCouponDto: UpdateCouponDto) {
    const Coupon = await this.couponModel.findOne({ _id });
    if (!Coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const CouponIsExist = await this.couponModel.findOne({
      name: updateCouponDto.name,
    });

    if (CouponIsExist) {
      throw new BadRequestException('Coupon is Already existing!');
    }

    const updatedCoupon = await this.couponModel
      .findByIdAndUpdate({ _id }, updateCouponDto, { new: true })
      .select('-__v');

    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(_id: string) {
    const Coupon = await this.couponModel.findById({ _id });
    if (!Coupon) {
      throw new NotFoundException('Coupon not Found');
    }

    await this.couponModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Coupon Deleted Successfully',
    };
  }
}
