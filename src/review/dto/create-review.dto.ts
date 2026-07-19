import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Review Text must be string' })
  @IsOptional()
  @MinLength(3, { message: 'Review Text must be at least 3 characters' })
  reviewText: string;

  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1 asterisk' })
  @Max(5, { message: 'Rating must be at most 3 asterisk' })
  rating: number;

  @IsMongoId({ message: 'Product must be a valid mongoId' })
  product: string;
}
