import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './suppliers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private SupplierModel: Model<Supplier>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.SupplierModel.findOne({
      name: createSupplierDto.name,
    });
    if (supplier) {
      throw new HttpException('Supplier already exists', 400);
    }

    const newSupplier = await this.SupplierModel.create(createSupplierDto);

    return {
      status: 200,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  async findAll() {
    const Supplier = await this.SupplierModel.find().select('-__v');

    return {
      status: 200,
      message: 'Suppliers Found',
      length: Supplier.length,
      isEmpty: Supplier.length > 0 ? 'false' : 'true',
      data: Supplier,
    };
  }

  async findOne(_id: string) {
    const Supplier = await this.SupplierModel.findById({ _id }).select('-__v');
    if (!Supplier) {
      throw new NotFoundException('Supplier not Found');
    }
    return {
      status: 200,
      message: 'Supplier Found',
      data: Supplier,
    };
  }

  async update(_id: string, updateSupplierDto: UpdateSupplierDto) {
    const Supplier = await this.SupplierModel.findOne({ _id });
    if (!Supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const SupplierIsExist = await this.SupplierModel.findOne({
      name: updateSupplierDto.name,
    });

    if (SupplierIsExist) {
      throw new BadRequestException('Supplier is Already existing!');
    }

    const updatedSupplier = await this.SupplierModel.findByIdAndUpdate(
      { _id },
      updateSupplierDto,
      { new: true },
    ).select('-__v');

    return {
      status: 200,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    };
  }

  async remove(_id: string) {
    const Supplier = await this.SupplierModel.findById({ _id });
    if (!Supplier) {
      throw new NotFoundException('Supplier not Found');
    }

    await this.SupplierModel.deleteOne({ _id });
    return {
      status: 200,
      message: 'Supplier Deleted Successfully',
    };
  }
}
