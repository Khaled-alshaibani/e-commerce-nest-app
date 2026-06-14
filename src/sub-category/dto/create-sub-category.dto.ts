import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;

  @IsString({ message: 'Category must be a string' })
  @IsMongoId({ message: 'Category must be a valid mongoId' })
  category: string;
}
