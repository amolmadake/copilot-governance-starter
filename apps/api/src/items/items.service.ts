import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Injectable()
export class ItemsService {
  /** TTL in milliseconds (cache-manager v7 uses ms) */
  private readonly CACHE_TTL_MS = 60_000; // 60 seconds
  private readonly ALL_ITEMS_KEY = 'items:all';

  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<Item[]> {
    const cached = await this.cacheManager.get<Item[]>(this.ALL_ITEMS_KEY);
    if (cached) return cached;

    const items = await this.itemModel.find().lean<Item[]>().exec();
    await this.cacheManager.set(this.ALL_ITEMS_KEY, items, this.CACHE_TTL_MS);
    return items;
  }

  async findOne(id: string): Promise<Item> {
    const cacheKey = `items:${id}`;
    const cached = await this.cacheManager.get<Item>(cacheKey);
    if (cached) return cached;

    const item = await this.itemModel.findById(id).lean<Item>().exec();
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    await this.cacheManager.set(cacheKey, item, this.CACHE_TTL_MS);
    return item;
  }

  async create(input: CreateItemInput): Promise<Item> {
    const created = await this.itemModel.create(input);
    await this.cacheManager.del(this.ALL_ITEMS_KEY);
    return created.toObject<Item>();
  }

  async update(id: string, input: UpdateItemInput): Promise<Item> {
    const updated = await this.itemModel
      .findByIdAndUpdate(id, input, { new: true })
      .lean<Item>()
      .exec();
    if (!updated) throw new NotFoundException(`Item ${id} not found`);

    await this.cacheManager.del(this.ALL_ITEMS_KEY);
    await this.cacheManager.del(`items:${id}`);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.itemModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Item ${id} not found`);

    await this.cacheManager.del(this.ALL_ITEMS_KEY);
    await this.cacheManager.del(`items:${id}`);
    return true;
  }
}
