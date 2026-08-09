/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { isNotEmpty } from 'class-validator';

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
    const cart = await this.cartModel
      .findOne({ user: user_id })
      .populate('cartItems.productId', 'price');
    const product = await this.productModel.findById(product_id);
    if (!product) {
      throw new NotFoundException('Product Not found!');
    }
    if (product.quantity <= 0) {
      throw new NotFoundException('This product is out of stock!');
    }
    if (cart) {
      // item added for the first time

      let alreadyExsits: {
        ifAdd: boolean;
        indexProduct: number;
      } = { ifAdd: false, indexProduct: 0 };
      let totalPriceBeforeAdd = 0;
      cart.cartItems.forEach((item, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const itemProductId =
          typeof item.productId === 'object' && item.productId !== null
            ? (item.productId as any)._id?.toString()
            : item.productId?.toString();

        if (product_id.toString() === itemProductId) {
          alreadyExsits = {
            ifAdd: true,
            indexProduct: index,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const itemPrice = (item.productId as any)?.price ?? product.price;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const itemQty = (item.productId as any)?.quantity ?? item.quantity;
        totalPriceBeforeAdd += itemPrice * itemQty;
      });
      const cloneCartItems = cart.cartItems;
      if (alreadyExsits.ifAdd) {
        ++cloneCartItems[alreadyExsits.indexProduct].quantity;
      } else {
        cloneCartItems.push({
          productId: product_id,
          color: '',
          quantity: 1,
        });
      }

      // item added to an existing cart with a previous quantity of the same product

      if (!product) throw new NotFoundException('Product Not found!');
      const updateCart = await this.cartModel.findOneAndUpdate(
        { user: user_id },
        {
          cartItems: cloneCartItems,
          totalPrice: alreadyExsits.ifAdd
            ? totalPriceBeforeAdd +
              (cloneCartItems[alreadyExsits.indexProduct].productId as any)
                .price
            : totalPriceBeforeAdd + product.price,
        },
        {
          new: true,
        },
      );

      return {
        status: 200,
        message: 'Product Added to Cart Successfully!',
        data: updateCart,
      };
    } else {
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
