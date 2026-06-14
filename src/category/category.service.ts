import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (category) {
      throw new HttpException('Category already exists', 400);
    }

    const newCategory = await this.categoryModel.create(createCategoryDto);

    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async findAll(query) {
    const { name } = query;
    const category = await this.categoryModel
      .find()
      .where('name', new RegExp(name, 'i'));

    return {
      status: 200,
      message: 'Categories Found',
      length: category.length,
      isEmpty: category.length > 0 ? 'false' : 'true',
      data: category,
    };
  }

  async findOne(_id: string) {
    const category = await this.categoryModel.findById({ _id }).select('-__v');
    if (!category) {
      throw new NotFoundException('Category not Found');
    }
    return {
      status: 200,
      message: 'Category Found',
      data: category,
    };
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({ _id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const categoryIsExist = await this.categoryModel.findOne({
      name: updateCategoryDto.name,
    });

    if (categoryIsExist) {
      throw new BadRequestException('Category is Already existing!');
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate({ _id }, updateCategoryDto, { new: true })
      .select('-__v');

    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(_id: string) {
    const category = await this.categoryModel.findById({ _id });
    if (!category) {
      throw new NotFoundException('Category not Found');
    }

    await this.categoryModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Category Deleted Successfully',
    };
  }
}
