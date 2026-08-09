import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product.name,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
  })
  cartItems: [
    {
      productId: Types.ObjectId | string | { _id: string; price: number };
      quantity: number;
      color: string;
    },
  ];

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;

  @Prop({
    type: Number,
  })
  totalPriceAfterDiscount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: string;

  @Prop({
    type: [
      {
        name: {
          type: String,
        },
        copounId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Coupon.name,
        },
      },
    ],
  })
  copouns: [
    {
      name: string;
      couponId: string;
    },
  ];
}

export const cartSchema = SchemaFactory.createForClass(Cart);
