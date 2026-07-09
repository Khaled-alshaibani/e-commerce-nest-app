import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/user/guards/Auth.guard';
import { Roles } from 'src/user/decorators/Roles.decorator';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  createOrUpdate(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createOrUpdate(createTaxDto);
  }

  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @Get()
  findOne() {
    return this.taxService.findOne();
  }

  @UseGuards(AuthGuard)
  @Roles(['admin'])
  @Delete()
  reset() {
    return this.taxService.reset();
  }
}
