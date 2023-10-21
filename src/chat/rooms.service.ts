import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async findOrCreateByCrewId(crewId: number): Promise<Room> {
    let room = await this.roomModel.findOne({ roomId: crewId }).exec();
    if (!room) {
      room = new this.roomModel({ roomId: crewId, roomName: `Room-${crewId}` });
      await room.save();
    }
    return room;
  }
}
