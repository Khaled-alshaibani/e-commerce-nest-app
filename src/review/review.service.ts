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
import { Product } from 'src/product/product.schema';

interface newUpdateReviewDto extends UpdateReviewDto {
  user: string;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
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

    const product = await this.productModel.findById(createReviewDto.product);

    if (!product) {
      throw new NotFoundException('Product Not Found!');
    }

    const newReview = await (
      await this.reviewModel.create({
        ...createReviewDto,
        user: user_id,
      })
    ).populate('product user', 'title description imageCover name email');

    const reviewsOnSignleProduct = await this.reviewModel
      .find({
        product: createReviewDto.product,
      })
      .select('rating');

    const ratingQuantity = reviewsOnSignleProduct.length;
    let totalRatings: number = 0;

    for (let i = 0; i < ratingQuantity; i++) {
      totalRatings += reviewsOnSignleProduct[i].rating;
    }

    const ratingAverages = totalRatings / ratingQuantity;

    await this.productModel.findByIdAndUpdate(createReviewDto.product, {
      ratingsAverage: ratingAverages,
      ratingsQuantity: ratingQuantity,
    });

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

    const product = await this.productModel.findById(updateReviewDto.product);

    if (!product) {
      throw new NotFoundException('Product Not Found!');
    }

    if (user_id.toString() !== review.user.toString()) {
      throw new UnauthorizedException();
    }

    const reviewsOnSignleProduct = await this.reviewModel
      .find({
        product: updateReviewDto.product,
      })
      .select('rating');

    const ratingQuantity = reviewsOnSignleProduct.length;
    let totalRatings: number = 0;

    for (let i = 0; i < ratingQuantity; i++) {
      totalRatings += reviewsOnSignleProduct[i].rating;
    }

    const ratingAverages = totalRatings / ratingQuantity;

    await this.productModel.findByIdAndUpdate(updateReviewDto.product, {
      ratingAverages,
      ratingQuantity,
    });

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

    const reviewsOnSignleProduct = await this.reviewModel
      .find({
        product: review.product,
      })
      .select('rating');

    const ratingQuantity = reviewsOnSignleProduct.length;
    let totalRatings: number = 0;

    for (let i = 0; i < ratingQuantity; i++) {
      totalRatings += reviewsOnSignleProduct[i].rating;
    }

    const ratingAverages = totalRatings / ratingQuantity;

    await this.productModel.findByIdAndUpdate(review.product, {
      ratingAverages,
      ratingQuantity,
    });
    return {
      status: 200,
      message: 'Review Deleted Successfully',
    };
  }
}
