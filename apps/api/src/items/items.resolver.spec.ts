import { Test, TestingModule } from '@nestjs/testing';

import { CreateItemInput } from './dto/create-item.input';
import { Item } from './schemas/item.schema';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { UpdateItemInput } from './dto/update-item.input';

const mockItem: Item = {
  _id: 'item-id-1',
  name: 'Test Item',
  description: 'A test item',
  isActive: true,
};

const mockItemsService: jest.Mocked<ItemsService> = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
} as unknown as jest.Mocked<ItemsService>;

describe('ItemsResolver', () => {
  let resolver: ItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsResolver, { provide: ItemsService, useValue: mockItemsService }],
    }).compile();

    resolver = module.get<ItemsResolver>(ItemsResolver);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all items from service', async () => {
      mockItemsService.findAll.mockResolvedValue([mockItem]);

      const result = await resolver.findAll();

      expect(mockItemsService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockItem]);
    });
  });

  describe('findOne', () => {
    it('returns a single item by ID', async () => {
      mockItemsService.findOne.mockResolvedValue(mockItem);

      const result = await resolver.findOne('item-id-1');

      expect(mockItemsService.findOne).toHaveBeenCalledWith('item-id-1');
      expect(result).toEqual(mockItem);
    });
  });

  describe('createItem', () => {
    it('creates and returns a new item', async () => {
      const input: CreateItemInput = { name: 'New Item', description: 'desc' };
      const created: Item = { ...mockItem, ...input };
      mockItemsService.create.mockResolvedValue(created);

      const result = await resolver.createItem(input);

      expect(mockItemsService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(created);
    });
  });

  describe('updateItem', () => {
    it('updates and returns the item', async () => {
      const input: UpdateItemInput = { name: 'Updated', isActive: false };
      const updated: Item = { ...mockItem, ...input, isActive: false };
      mockItemsService.update.mockResolvedValue(updated);

      const result = await resolver.updateItem('item-id-1', input);

      expect(mockItemsService.update).toHaveBeenCalledWith('item-id-1', input);
      expect(result.name).toBe('Updated');
      expect(result.isActive).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('removes an item and returns true', async () => {
      mockItemsService.remove.mockResolvedValue(true);

      const result = await resolver.removeItem('item-id-1');

      expect(mockItemsService.remove).toHaveBeenCalledWith('item-id-1');
      expect(result).toBe(true);
    });
  });
});
