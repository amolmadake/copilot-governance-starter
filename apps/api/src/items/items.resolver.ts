import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => [Item], { name: 'items', description: 'Fetch all items (cached)' })
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, {
    name: 'item',
    nullable: true,
    description: 'Fetch a single item by ID (cached)',
  })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item, { description: 'Create a new item' })
  createItem(@Args('createItemInput') createItemInput: CreateItemInput): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Mutation(() => Item, { description: 'Update an existing item' })
  updateItem(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemInput);
  }

  @Mutation(() => Boolean, { description: 'Delete an item by ID' })
  removeItem(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.itemsService.remove(id);
  }
}
