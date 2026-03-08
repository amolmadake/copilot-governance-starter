import { Item, ItemSchema } from './schemas/item.schema';

import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }])],
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
