import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { RequestProduct } from './request-product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface newCreateRequestProductDto extends CreateRequestProductDto {
  user: string;
}

interface newUpdateRequestProductDto extends UpdateRequestProductDto {
  user: string;
}

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestProductModel: Model<RequestProduct>,
  ) {}
  async create(createRequestProductDto: newCreateRequestProductDto) {
    const requestProduct = await this.requestProductModel.findOne({
      titleNeed: createRequestProductDto.titleNeed,
      user: createRequestProductDto.user,
    });

    if (requestProduct) {
      throw new HttpException('Request Product already exists', 400);
    }
    const newRequestProduct = await (
      await this.requestProductModel.create(createRequestProductDto)
    ).populate('user', '-password -__v -role');

    return {
      status: 200,
      message: 'Request Product created successfully',
      data: newRequestProduct,
    };
  }

  async findAll() {
    const requestProducts = await this.requestProductModel
      .find()
      .populate('user', '-password -__v -role')
      .select('-__v');

    if (!requestProducts) {
      throw new HttpException('No Request Products yet!', 404);
    }

    return {
      status: 200,
      message:
        requestProducts.length > 0
          ? 'Request Products fetched successfully'
          : 'No Request Products yet!',
      length: requestProducts.length,
      isEmpty: requestProducts.length > 0 ? 'false' : 'true',
      data: requestProducts,
    };
  }

  async findOne(_id: number, req: any) {
    const requestProduct = await this.requestProductModel
      .findById(_id)
      .select('-__v')
      .populate('user', '-password -__v ');

    console.log(requestProduct);

    if (!requestProduct) {
      throw new HttpException('Request Product not found', 404);
    }

    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      req.user._id.toString() !== requestProduct.user._id.toString() &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      req.user.role.toLowerCase() !== 'admin'
    ) {
      throw new UnauthorizedException();
    }
    return {
      status: 200,
      data: requestProduct,
    };
  }

  async update(
    _id: number,
    updateRequestProductDto: newUpdateRequestProductDto,
  ) {
    const requestProduct = await this.requestProductModel
      .findById(_id)
      .select('-__v')
      .populate('user', '-password -role');

    if (!requestProduct) {
      throw new NotFoundException('Request Product not found');
    }

    if (
      updateRequestProductDto.user.toString() !==
      requestProduct.user._id.toString()
    ) {
      throw new UnauthorizedException();
    }

    const updatedRequestProduct =
      await this.requestProductModel.findByIdAndUpdate(
        _id,
        updateRequestProductDto,
        { new: true },
      );

    return {
      status: 200,
      message: 'Request Product updated successfully',
      data: updatedRequestProduct,
    };
  }
  async remove(id: number, user_id: string) {
    const requestProduct = await this.requestProductModel.findById(id);
    if (!requestProduct) {
      throw new NotFoundException('Request Product not Found');
    }

    if (user_id.toString() !== requestProduct.user._id.toString()) {
      throw new UnauthorizedException();
    }

    await this.requestProductModel.findByIdAndDelete(id);

    return {
      status: 200,
      message: 'Request Product Deleted Successfully',
    };
  }
}
