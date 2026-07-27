import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  async create(
    createCartDto: CreateCartDto,
    product_id: string,
    user_id: string,
  ) {
    const ifUserHaveCart = await this.cartModel.findOne({ user: user_id });
    if (ifUserHaveCart) {
      // TODO: we'll return later
    } else {
      const product = await this.productModel.findById(product_id);

      if (!product) {
        throw new NotFoundException('Product Not found!');
      }

      if (product.quantity <= 0) {
        throw new NotFoundException('This product is out of stock!');
      }
      const newCart = await this.cartModel.create({
        cartItems: [
          {
            productId: product_id,
          },
        ],
        totalPrice: product.price,
        user: user_id,
      });

      return {
        status: 200,
        message: 'Cart Created Successfully, Product Inserted!',
        data: newCart,
      };
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
