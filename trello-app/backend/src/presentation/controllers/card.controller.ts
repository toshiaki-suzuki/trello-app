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
import { CardService } from '../../application/services/card.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from '../../application/dto/card.dto';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createCard(@Body() createCardDto: CreateCardDto) {
    try {
      const card = await this.cardService.createCard(createCardDto);
      return {
        success: true,
        data: card,
        message: 'カードが正常に作成されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'カード作成に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async getCards(@Query('listId') listId?: string) {
    try {
      let cards;
      if (listId) {
        cards = await this.cardService.getCardsByListId(listId);
      } else {
        cards = await this.cardService.getAllCards();
      }
      
      return {
        success: true,
        data: cards,
        message: 'カード一覧を取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'カード取得に失敗しました'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('overdue')
  async getOverdueCards() {
    try {
      const cards = await this.cardService.getOverdueCards();
      return {
        success: true,
        data: cards,
        message: '期限切れのカード一覧を取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || '期限切れカード取得に失敗しました'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('upcoming')
  async getUpcomingCards(@Query('days') days?: string) {
    try {
      const dayCount = days ? parseInt(days) : 7;
      const cards = await this.cardService.getUpcomingCards(dayCount);
      return {
        success: true,
        data: cards,
        message: '期限が近いカード一覧を取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || '期限が近いカード取得に失敗しました'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getCardById(@Param('id') id: string) {
    try {
      const card = await this.cardService.getCardById(id);
      return {
        success: true,
        data: card,
        message: 'カードを取得しました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'カード取得に失敗しました'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto
  ) {
    try {
      const card = await this.cardService.updateCard(id, updateCardDto);
      return {
        success: true,
        data: card,
        message: 'カードが正常に更新されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'カード更新に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':id/move')
  @UsePipes(new ValidationPipe())
  async moveCard(
    @Param('id') id: string,
    @Body() moveCardDto: MoveCardDto
  ) {
    try {
      const card = await this.cardService.moveCard(id, moveCardDto);
      return {
        success: true,
        data: card,
        message: 'カードが正常に移動されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'カード移動に失敗しました'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string) {
    try {
      await this.cardService.deleteCard(id);
      return {
        success: true,
        message: 'カードが正常に削除されました'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'カード削除に失敗しました'
        },
        HttpStatus.NOT_FOUND
      );
    }
  }
}