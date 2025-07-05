import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  ValidationPipe,
  UsePipes,
  Query
} from '@nestjs/common';
import { ListService } from '../../application/services/list.service';
import { CreateListDto, UpdateListDto, MoveListDto } from '../../application/dto/list.dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createList(@Body() createListDto: CreateListDto) {
    try {
      const list = await this.listService.createList(createListDto);
      return {
        success: true,
        data: list,
        message: 'リストが正常に作成されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'リスト作成に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async getLists(@Query('boardId') boardId?: string) {
    try {
      let lists;
      if (boardId) {
        lists = await this.listService.getListsByBoardId(boardId);
      } else {
        lists = await this.listService.getAllLists();
      }
      
      return {
        success: true,
        data: lists,
        message: 'リスト一覧を取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'リスト取得に失敗しました'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getListById(@Param('id') id: string) {
    try {
      const list = await this.listService.getListById(id);
      return {
        success: true,
        data: list,
        message: 'リストを取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'リスト取得に失敗しました'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateList(
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto
  ) {
    try {
      const list = await this.listService.updateList(id, updateListDto);
      return {
        success: true,
        data: list,
        message: 'リストが正常に更新されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'リスト更新に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':id/move')
  @UsePipes(new ValidationPipe())
  async moveList(
    @Param('id') id: string,
    @Body() moveListDto: MoveListDto
  ) {
    try {
      const list = await this.listService.moveList(id, moveListDto);
      return {
        success: true,
        data: list,
        message: 'リストが正常に移動されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'リスト移動に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async deleteList(@Param('id') id: string) {
    try {
      await this.listService.deleteList(id);
      return {
        success: true,
        message: 'リストが正常に削除されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'リスト削除に失敗しました'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
}