import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    required: true,
    type: String,
    min: [3, 'Name must be at least 3 characters'],
    max: [30, 'Name must be at most 30 characters'],
  })
  name: string;

  @Prop({
    type: Date,
    required: true,
    min: [Date.now(), 'Expire Date must be greater than the current time'],
    max: [
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      'Expire Date must be less than 30 days',
    ],
  })
  expireDate: Date;

  @Prop({
    type: Number,
    required: true,
  })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
