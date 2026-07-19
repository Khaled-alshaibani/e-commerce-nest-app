import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, reviewSchema } from './review.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { Product, productSchema } from 'src/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: reviewSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
