import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Delete,
  Res,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageService } from './image.service';
import { SaveImageDto } from './dto/saveImage.dto';
import { CrewService } from 'src/crew/crew.service';
import { MemberService } from 'src/member/member.service';

@Controller('image')
@ApiTags('Image API')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
  ) {}

  /* image 저장 */
  @Post('saveImage/:crewId')
  @ApiOperation({
    summary: '이미지 저장 API',
    description: '이미지를 저장합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 201,
    description: '이미지 저장 성공',
  })
  @ApiBearerAuth('accessToken')
  async saveImage(
    @Body() saveImageDto: SaveImageDto,
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      const member = await this.memberService.findAllMember(crewId);
      const exImages = await this.imageService.findMyImages(crewId, userId);
      if (crew.userId === userId || member.member_userId === userId) {
        // 이미지는 최대 5개까지만 저장 가능합니다.
        if (exImages.length === 5) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: '이미지 저장은 최대 5개까지 가능합니다.' });
        }
        const newImage = await this.imageService.saveImage(
          saveImageDto,
          crewId,
          userId,
        );
        return res.status(HttpStatus.OK).json({ message: '이미지 저장 성공' });
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '이미지 저장 권한이 없습니다.' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('ImageController/saveImage');
    }
  }

  /* image 조회 */
  @Get(':crewId')
  @ApiOperation({
    summary: '이미지 조회 API',
    description: '이미지를 조회합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        image: [
          {
            imageId: 1,
            crewId: 23,
            userId: 1,
            image: 'url',
          },
          { imageId: 2, crewId: 23, userId: 3, image: 'url' },
        ],
      },
    },
  })
  async findCrewImages(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      const member = await this.memberService.findAllMember(crewId);
      if (crew.userId === userId || member.member_userId === userId) {
        const image = await this.imageService.findCrewImages(crewId);
        return res.status(HttpStatus.OK).json(image);
      }
    } catch (e) {
      console.error(e);
      throw new Error('ImageController/findCrewImages');
    }
  }

  /* image 삭제 */
  @Delete('delete/:crewId/:imageId')
  @ApiOperation({
    summary: '이미지 삭제 API',
    description: '이미지를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '이미지를 삭제합니다.',
    schema: {
      example: {
        message: '이미지를 성공했습니다.',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async deleteImage(
    @Param('crewId') crewId: number,
    @Param('imageId') imageId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const myImage = await this.imageService.findMyImages(crewId, userId);
      if (myImage.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '이미지 삭제 권한이 없습니다.' });
      } else {
        const deleteImage = await this.imageService.deleteImage(imageId);
        if (!deleteImage) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: '이미지 삭제 실패' });
        }
        return res.status(HttpStatus.OK).json({ message: '이미지 삭제 성공' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('ImageController/deleteImage');
    }
  }
}
