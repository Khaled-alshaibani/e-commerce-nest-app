import {
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCouponDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;
  @IsString({ message: 'Expire Date must be a string' })
  @IsDateString(
    {},
    {
      message:
        'Expire Date must be a valid date string in the format YYYY-MM-DD',
    },
  )
  expireDate: Date;

  @IsNumber({}, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount must be less than 0' })
  discount: number;
}
