import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';

export type productDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    min: [3, 'Title must be at least 3 characters long'],
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    min: [20, 'Description must be at least 20 characters long'],
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1 Product'],
  })
  quantity: number;

  @Prop({
    type: String,
    required: true,
  })
  imageCover: string;

  @Prop({
    type: Array,
  })
  images: string[];

  @Prop({
    type: Number,
    default: 0,
  })
  sold: number;

  @Prop({
    type: Number,
    required: true,
    min: [100, 'Price must be at least 100 Y.R.'],
    max: [2000000, 'Price must not exceed 2,000,000 Y.R.'],
  })
  price: number;

  @Prop({
    type: Number,
    min: [1, 'Price must be at least 1 Y.R.'],
    max: [2000000, 'Price must not exceed 2,000,000 Y.R.'],
  })
  priceAfterDiscount: number;

  @Prop({
    type: Array,
  })
  colors: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  brand: string;

  @Prop({
    type: Number,
    default: 0,
  })
  ratingsAverage: number;

  @Prop({
    type: Number,
    default: 0,
  })
  ratingsQuantity: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
