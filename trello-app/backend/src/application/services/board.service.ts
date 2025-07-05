import { Injectable } from '@nestjs/common';
import { Board } from '../../domain/entities/board';
import { BoardId } from '../../domain/value-objects/board-id';
import { BoardRepository } from '../../domain/repositories/board-repository.interface';
import { CreateBoardDto, UpdateBoardDto, BoardDto } from '../dto/board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  // ボード作成
  async createBoard(dto: CreateBoardDto): Promise<BoardDto> {
    const board = Board.create(
      dto.title,
      dto.description,
      dto.backgroundColor
    );

    await this.boardRepository.save(board);

    return this.toDto(board);
  }

  // ボード取得
  async getBoardById(id: string): Promise<BoardDto> {
    const boardId = new BoardId(id);
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new Error(`ボード（ID: ${id}）が見つかりません`);
    }

    return this.toDto(board);
  }

  // 全ボード取得
  async getAllBoards(): Promise<BoardDto[]> {
    const boards = await this.boardRepository.findAll();
    return boards.map(board => this.toDto(board));
  }

  // ボード更新
  async updateBoard(id: string, dto: UpdateBoardDto): Promise<BoardDto> {
    const boardId = new BoardId(id);
    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new Error(`ボード（ID: ${id}）が見つかりません`);
    }

    board.updateInfo(dto.title, dto.description, dto.backgroundColor);
    await this.boardRepository.save(board);

    return this.toDto(board);
  }

  // ボード削除
  async deleteBoard(id: string): Promise<void> {
    const boardId = new BoardId(id);
    const exists = await this.boardRepository.exists(boardId);

    if (!exists) {
      throw new Error(`ボード（ID: ${id}）が見つかりません`);
    }

    await this.boardRepository.delete(boardId);
  }

  // ボード存在確認
  async boardExists(id: string): Promise<boolean> {
    const boardId = new BoardId(id);
    return await this.boardRepository.exists(boardId);
  }

  // ドメインエンティティをDTOに変換
  private toDto(board: Board): BoardDto {
    const primitives = board.toPrimitives();
    return new BoardDto(
      primitives.id,
      primitives.title,
      primitives.description,
      primitives.backgroundColor,
      primitives.createdAt,
      primitives.updatedAt
    );
  }
}