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
  UsePipes
} from '@nestjs/common';
import { BoardService } from '../../application/services/board.service';
import { CreateBoardDto, UpdateBoardDto } from '../../application/dto/board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    try {
      const board = await this.boardService.createBoard(createBoardDto);
      return {
        success: true,
        data: board,
        message: 'ボードが正常に作成されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'ボード作成に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async getAllBoards() {
    try {
      const boards = await this.boardService.getAllBoards();
      return {
        success: true,
        data: boards,
        message: 'ボード一覧を取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'ボード取得に失敗しました'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getBoardById(@Param('id') id: string) {
    try {
      const board = await this.boardService.getBoardById(id);
      return {
        success: true,
        data: board,
        message: 'ボードを取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'ボード取得に失敗しました'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto
  ) {
    try {
      const board = await this.boardService.updateBoard(id, updateBoardDto);
      return {
        success: true,
        data: board,
        message: 'ボードが正常に更新されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'ボード更新に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async deleteBoard(@Param('id') id: string) {
    try {
      await this.boardService.deleteBoard(id);
      return {
        success: true,
        message: 'ボードが正常に削除されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'ボード削除に失敗しました'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
}