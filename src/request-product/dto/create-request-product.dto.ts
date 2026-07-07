import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestProductDto {
  @IsString({ message: 'Title must be a string' })
  titleNeed: string;

  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Details must be at least 5 characters' })
  details: string;

  @IsNumber({}, { message: 'Quantity must be a Number' })
  @Min(1, { message: 'Quantity must be at least one product' })
  quantity: number;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsString({ message: 'User must be a string' })
  @IsMongoId({ message: 'User must be a MongoId' })
  user: string;
}
