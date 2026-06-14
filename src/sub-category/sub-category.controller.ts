import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { AuthGuard } from 'src/user/guards/Auth.guard';
import { Roles } from 'src/user/decorators/Roles.decorator';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subcategoryService: SubCategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subcategoryService.create(createSubCategoryDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.subcategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidUnknownValues: true }))
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subcategoryService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
