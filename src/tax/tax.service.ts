import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { Model } from 'mongoose';
import { Tax } from './tax.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private taxModel: Model<Tax>) {}

  async createOrUpdate(createTaxDto: CreateTaxDto) {
    const tax = await this.taxModel.findOne({});

    // Create Tax
    if (!tax) {
      const newTax = await this.taxModel.create(createTaxDto);
      return {
        status: 200,
        message: 'Tax created successfully',
        data: newTax,
      };
    }

    // Update Tax
    const updatedTax = await this.taxModel.findOneAndUpdate({}, createTaxDto, {
      new: true,
    });
    return {
      status: 200,
      message: 'Tax updated successfully',
      data: updatedTax,
    };
  }

  async findOne() {
    const tax = await this.taxModel.findOne({});

    return {
      status: 200,
      message: 'Tax Found Successfully!',
      data: tax,
    };
  }

  async reset(): Promise<void> {
    await this.taxModel.updateOne({}, { taxPrice: 0, taxShipping: 0 });
  }
}
