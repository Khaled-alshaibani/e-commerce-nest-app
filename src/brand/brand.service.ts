import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Brand } from './brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandModel.findOne({
      name: createBrandDto.name,
    });

    if (brand) {
      throw new HttpException('Brand Already Exist!', 400);
    }

    const newBrand = await this.brandModel.create(createBrandDto);

    return {
      status: 200,
      message: 'Brand Created Successfully!',
      data: newBrand,
    };
  }

  async findAll(query) {
    const { name } = query;
    const brands = await this.brandModel
      .find()
      .where('name', new RegExp(name, 'i'))
      .select('-__v');

    return {
      status: 200,
      message: brands.length > 0 ? 'Brands Found' : 'No Brands yet!',
      isEmpty: brands.length > 0 ? 'false' : 'true',
      data: brands,
    };
  }

  async findOne(_id: string) {
    const brand = await this.brandModel.findById(_id).select('-__v');

    if (!brand) {
      throw new NotFoundException('Brand is not Found');
    }

    return {
      status: 200,
      message: 'Brand Found Successfully',
      data: brand,
    };
  }

  async update(_id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findById({ _id });

    if (!brand) {
      throw new NotFoundException('Brand not Found');
    }

    const updatedBrand = await this.brandModel
      .findByIdAndUpdate({ _id }, updateBrandDto, { new: true })
      .select('-__v');

    return {
      status: 200,
      message: 'Brand Updated Successfully',
      data: updatedBrand,
    };
  }

  async remove(_id: string) {
    const brand = await this.brandModel.findById({ _id });

    if (!brand) {
      throw new NotFoundException('Brand not Found');
    }

    await this.brandModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Brand Deleted Successfully',
    };
  }
}
