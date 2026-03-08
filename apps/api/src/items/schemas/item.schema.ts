import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Item {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, trim: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ trim: true })
  description?: string;

  @Field()
  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
