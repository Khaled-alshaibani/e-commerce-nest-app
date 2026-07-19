import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user_id: string) {
    const review = await this.reviewModel.findOne({
      user: user_id,
      product: createReviewDto.product,
    });

    if (review) {
      throw new HttpException(
        'User Already created a review on this product',
        400,
      );
    }

    const newReview = await (
      await this.reviewModel.create({
        ...createReviewDto,
        user: user_id,
      })
    ).populate('product user', 'title description imageCover name email');

    return {
      status: 200,
      message: 'Review created Successfully',
      data: newReview,
    };
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: string) {
    return `This action returns a #${id} review`;
  }

  update(id: string, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: string) {
    return `This action removes a #${id} review`;
  }
}
