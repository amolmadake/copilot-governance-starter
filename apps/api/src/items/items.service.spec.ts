import { Test, TestingModule } from '@nestjs/testing';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Item } from './schemas/item.schema';
import { ItemsService } from './items.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

const mockItem: Item = {
  _id: 'item-id-1',
  name: 'Test Item',
  description: 'A test item',
  isActive: true,
};

const mockItemModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: getModelToken(Item.name), useValue: mockItemModel },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns cached items when cache hit', async () => {
      mockCacheManager.get.mockResolvedValue([mockItem]);

      const result = await service.findAll();

      expect(mockCacheManager.get).toHaveBeenCalledWith('items:all');
      expect(mockItemModel.find).not.toHaveBeenCalled();
      expect(result).toEqual([mockItem]);
    });

    it('fetches from DB and caches on cache miss', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockItemModel.find.mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve([mockItem]) }),
      });

      const result = await service.findAll();

      expect(mockItemModel.find).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalledWith('items:all', [mockItem], 60_000);
      expect(result).toEqual([mockItem]);
    });
  });

  describe('findOne', () => {
    it('returns cached item when cache hit', async () => {
      mockCacheManager.get.mockResolvedValue(mockItem);

      const result = await service.findOne('item-id-1');

      expect(mockCacheManager.get).toHaveBeenCalledWith('items:item-id-1');
      expect(mockItemModel.findById).not.toHaveBeenCalled();
      expect(result).toEqual(mockItem);
    });

    it('fetches from DB and caches on cache miss', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockItemModel.findById.mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(mockItem) }),
      });

      const result = await service.findOne('item-id-1');

      expect(mockItemModel.findById).toHaveBeenCalledWith('item-id-1');
      expect(mockCacheManager.set).toHaveBeenCalledWith('items:item-id-1', mockItem, 60_000);
      expect(result).toEqual(mockItem);
    });

    it('throws NotFoundException when item not found', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockItemModel.findById.mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(null) }),
      });

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates an item and invalidates list cache', async () => {
      const input = { name: 'New Item', description: 'desc' };
      mockItemModel.create.mockResolvedValue({
        toObject: () => ({ ...mockItem, ...input }),
      });

      const result = await service.create(input);

      expect(mockItemModel.create).toHaveBeenCalledWith(input);
      expect(mockCacheManager.del).toHaveBeenCalledWith('items:all');
      expect(result.name).toBe('New Item');
    });
  });

  describe('update', () => {
    it('updates an item and invalidates caches', async () => {
      const input = { name: 'Updated', isActive: false };
      const updated = { ...mockItem, ...input };
      mockItemModel.findByIdAndUpdate.mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(updated) }),
      });

      const result = await service.update('item-id-1', input);

      expect(mockItemModel.findByIdAndUpdate).toHaveBeenCalledWith('item-id-1', input, {
        new: true,
      });
      expect(mockCacheManager.del).toHaveBeenCalledWith('items:all');
      expect(mockCacheManager.del).toHaveBeenCalledWith('items:item-id-1');
      expect(result).toEqual(updated);
    });

    it('throws NotFoundException when item not found', async () => {
      mockItemModel.findByIdAndUpdate.mockReturnValue({
        lean: () => ({ exec: () => Promise.resolve(null) }),
      });

      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes an item and invalidates caches', async () => {
      mockItemModel.findByIdAndDelete.mockReturnValue({
        exec: () => Promise.resolve({ _id: 'item-id-1' }),
      });

      const result = await service.remove('item-id-1');

      expect(mockItemModel.findByIdAndDelete).toHaveBeenCalledWith('item-id-1');
      expect(mockCacheManager.del).toHaveBeenCalledWith('items:all');
      expect(mockCacheManager.del).toHaveBeenCalledWith('items:item-id-1');
      expect(result).toBe(true);
    });

    it('throws NotFoundException when item not found', async () => {
      mockItemModel.findByIdAndDelete.mockReturnValue({
        exec: () => Promise.resolve(null),
      });

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
