import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/sub-category.schema';
import { Brand } from 'src/brand/brand.schema';
import { Product } from './product.schema';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.findOne({
      title: createProductDto.title,
    });

    if (product) {
      throw new HttpException('Product Already Exists', 400);
    }

    if (
      createProductDto.category &&
      createProductDto.subCategory &&
      createProductDto.brand
    ) {
      const category = await this.categoryModel.findById(
        createProductDto.category,
      );

      if (!category) {
        throw new HttpException('Category does not exist', 400);
      }

      const subCategory = await this.subCategoryModel.findById(
        createProductDto.subCategory,
      );

      if (!subCategory) {
        throw new HttpException('Category does not exist', 400);
      }

      const brand = await this.brandModel.findById(createProductDto.brand);

      if (!brand) {
        throw new HttpException('Category does not exist', 400);
      }
    }

    const newProduct = await (
      await this.productModel.create(createProductDto)
    ).populate('category subCategory brand', '-__v');

    return {
      status: 200,
      message: 'Product Created Successfully',
      data: newProduct,
    };
  }

  async findAll(query: any) {
    //* 1) Filter
    let requestQuery = { ...query };
    const removeQuery = [
      'page',
      'limit',
      'sort',
      'keyword',
      'category',
      'fields',
    ];
    removeQuery.forEach((singleQuery) => {
      delete requestQuery[singleQuery];
    });

    const newQuery = {};

    for (const key in requestQuery) {
      const match = key.match(/(.+)\[(gte|lte|gt|lt)\]/);

      if (match) {
        const field = match[1];
        const operator = match[2];

        newQuery[field] = {
          ...(newQuery[field] || {}),
          [`$${operator}`]: Number(requestQuery[key]),
        };
      } else {
        newQuery[key] = requestQuery[key];
      }
    }

    requestQuery = newQuery;

    //* 2) Pagination
    const page = query?.page || 1;
    const limit = query?.limit || 5;
    const skip = (page - 1) * limit;

    //* 3) Sorting

    let sort = query?.sort || 'asc';
    sort = sort.split(',').join(' ');

    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException('Invalid Sort', 400);
    }
    //* 4) Fields
    let fields = query?.fields || '';
    fields = fields.split(',').join(' ');

    //* 5) Search
    const findData = { ...requestQuery };
    if (query.keyword) {
      findData.$or = [
        { title: { $regex: query.keyword } },
        { description: { $regex: query.keyword } },
      ];
    }
    if (query.category) {
      findData.category = query.category.toString();
    }

    console.log(query);
    console.log(requestQuery);
    console.log(findData);

    const products = await this.productModel
      .find(findData)
      .limit(limit)
      .skip(skip)
      .sort({ title: sort })
      .select(fields);

    return {
      status: 200,
      message: products.length > 0 ? 'Products Found' : 'No Products Found',
      isEmpty: products.length > 0 ? 'Flase' : 'True',
      length: products.length,
      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category subCategory brand', '-__v');
    if (!product) {
      throw new NotFoundException('Product not Found');
    }
    return {
      status: 200,
      message: 'Product Found Successfully',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    if (
      updateProductDto.sold !== undefined &&
      updateProductDto.sold > product.quantity
    ) {
      throw new HttpException('This Quantity is lower than sold products', 400);
    }
    if (
      updateProductDto.category &&
      updateProductDto.subCategory &&
      updateProductDto.brand
    ) {
      const category = await this.categoryModel.findById(
        updateProductDto.category,
      );

      if (!category) {
        throw new HttpException('Category does not exist', 400);
      }

      const subCategory = await this.subCategoryModel.findById(
        updateProductDto.subCategory,
      );

      if (!subCategory) {
        throw new HttpException('Category does not exist', 400);
      }

      const brand = await this.brandModel.findById(updateProductDto.brand);

      if (!brand) {
        throw new HttpException('Category does not exist', 400);
      }
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category subCategory brand', '-__v');
    return {
      status: 200,
      message: 'Product Updated Successfully',
      data: updatedProduct,
    };
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    await this.productModel.findByIdAndDelete(id);
  }
}
