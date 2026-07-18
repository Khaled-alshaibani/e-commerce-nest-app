import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @MinLength(20, { message: 'Description must be at least 20 characters long' })
  description: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1 Product' })
  quantity: number;

  @IsString({ message: 'Image Cover must be a URL' })
  @IsUrl({}, { message: 'Image Cover must be a valid URL' })
  imageCover: string;

  @IsArray({ message: 'Images must be an Array' })
  @IsOptional()
  images: string[];

  @IsNumber({}, { message: 'Sold must be a number' })
  @IsOptional()
  sold: number;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(100, { message: 'Price must be at least 100 Y.R.' })
  @Max(2000000, { message: 'Price must be at must 2,000,000 Y.R.' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Price after discount must be a number' })
  @Min(100, { message: 'Price after discount must be at least 100 Y.R.' })
  @Max(2000000, {
    message: 'Price after discount must be at must 2,000,000 Y.R.',
  })
  priceAfterDiscount: number;

  @IsArray({ message: 'Colors must be an Array' })
  @IsOptional()
  colors: string[];

  @IsMongoId({ message: 'Category must be a valid MongoID' })
  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsMongoId({ message: 'subCategory must be a valid MongoID' })
  @IsString({ message: 'subCategory must be a string' })
  @IsOptional()
  subCategory: string;

  @IsMongoId({ message: 'Brand must be a valid MongoID' })
  @IsString({ message: 'Brand must be a string' })
  @IsOptional()
  brand: string;
}
