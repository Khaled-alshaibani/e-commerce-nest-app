import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type requestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
  @Prop({
    required: true,
    type: String,
  })
  titleNeed: string;

  @Prop({
    type: String,
    min: [5, 'Details must be at least 5 characters'],
    required: true,
  })
  details: string;

  @Prop({
    type: Number,
    min: [1, 'Quantity must be at least 1 product'],
    required: true,
  })
  quantity: number;

  @Prop({
    type: String,
  })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;
}

export const requestProductSchema =
  SchemaFactory.createForClass(RequestProduct);
