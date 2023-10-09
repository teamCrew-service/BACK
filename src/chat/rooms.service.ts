import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(name: string): Promise<Room> {
    const newRoom = new this.roomModel({ roomName: name });
    return await newRoom.save();
  }

  async findOne(roomId: string): Promise<Room> {
    return await this.roomModel.findById(roomId).exec();
  }
}
