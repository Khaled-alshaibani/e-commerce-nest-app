import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './sub-category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({
      name: createSubCategoryDto.name,
    });
    if (subCategory) {
      throw new HttpException('Sub-Category already exists', 400);
    }

    const category = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }

    const newsubCategory = await (
      await this.subCategoryModel.create(createSubCategoryDto)
    ).populate('category', '-_id -__v');

    return {
      status: 200,
      message: 'Sub-Category created successfully',
      data: newsubCategory,
    };
  }

  async findAll(query) {
    const { name } = query;
    const subCategory = await this.subCategoryModel
      .find()
      .where('name', new RegExp(name, 'i'))
      .select('-__v')
      .populate('category', '-_id -__v');

    return {
      status: 200,
      message: 'Sub-Categories Found',
      length: subCategory.length,
      isEmpty: subCategory.length > 0 ? 'false' : 'true',
      data: subCategory,
    };
  }

  async findOne(_id: string) {
    const subCategory = await this.subCategoryModel
      .findById({ _id })
      .select('-__v')
      .populate('category', '-_id -__v');
    if (!subCategory) {
      throw new NotFoundException('Sub-Category not Found');
    }
    return {
      status: 200,
      message: 'Sub-Category Found',
      data: subCategory,
    };
  }

  async update(_id: string, updatesubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.findOne({ _id });
    if (!subCategory) {
      throw new NotFoundException('Sub-Category not found');
    }

    const subCategoryIsExist = await this.subCategoryModel.findOne({
      name: updatesubCategoryDto.name,
    });

    if (subCategoryIsExist) {
      throw new BadRequestException('Sub-Category is Already existing!');
    }

    const updatedsubCategory = await this.subCategoryModel
      .findByIdAndUpdate({ _id }, updatesubCategoryDto, { new: true })
      .select('-__v')
      .populate('category', '-_id -__v');

    return {
      status: 200,
      message: 'Sub-Category updated successfully',
      data: updatedsubCategory,
    };
  }

  async remove(_id: string) {
    const subCategory = await this.subCategoryModel.findById({ _id });
    if (!subCategory) {
      throw new NotFoundException('subCategory not Found');
    }

    await this.subCategoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'subCategory Deleted Successfully',
    };
  }
}
