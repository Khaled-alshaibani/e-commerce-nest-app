import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';

interface newUpdateReviewDto extends UpdateReviewDto {
  user: string;
}

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

    // TODO: Rating

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

  async findOne(user_id: string) {
    const review = await this.reviewModel
      .find({ user: user_id })
      .populate('user product', 'name role email title rating')
      .select('-__v');

    if (!review) {
      throw new NotFoundException('Review is not found');
    }

    return {
      status: 200,
      message: 'Review found successfully',
      data: review,
    };
  }

  async update(
    id: string,
    updateReviewDto: newUpdateReviewDto,
    user_id: string,
  ) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review Not Found');
    }

    if (user_id.toString() !== review.user.toString()) {
      throw new UnauthorizedException();
    }

    // TODO: Rating

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(
        id,
        {
          ...updateReviewDto,
          user: user_id,
          product: updateReviewDto.product,
        },
        { new: true },
      )
      .select('-__v');

    return {
      status: 200,
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async remove(id: string, user_id: string) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review Not Found');
    }

    if (user_id.toString() !== review.user.toString()) {
      throw new UnauthorizedException();
    }

    await this.reviewModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Review Deleted Successfully',
    };
  }
}
