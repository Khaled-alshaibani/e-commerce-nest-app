import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/user/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/Auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user_id = req.user._id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.reviewService.create(createReviewDto, user_id);
  }

  @Get('get-all/:id')
  findAll(@Param('id') product_id: string) {
    return this.reviewService.findAll(product_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user_id = req.user._id;
    // @typescript-eslint/no-unsafe-argument
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.reviewService.update(id, updateReviewDto, user_id);
  }

  @Delete(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user_id = req.user._id;
    // eslint-disable-next-line
    return this.reviewService.remove(id, user_id);
  }
}
