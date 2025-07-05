import { Injectable } from '@nestjs/common';
import { List } from '../../domain/entities/list';
import { ListId } from '../../domain/value-objects/list-id';
import { BoardId } from '../../domain/value-objects/board-id';
import { ListRepository } from '../../domain/repositories/list-repository.interface';
import { BoardRepository } from '../../domain/repositories/board-repository.interface';
import { CreateListDto, UpdateListDto, MoveListDto, ListDto } from '../dto/list.dto';

@Injectable()
export class ListService {
  constructor(
    private readonly listRepository: ListRepository,
    private readonly boardRepository: BoardRepository
  ) {}

  // リスト作成
  async createList(dto: CreateListDto): Promise<ListDto> {
    // ボード存在確認
    const boardId = new BoardId(dto.boardId);
    const boardExists = await this.boardRepository.exists(boardId);
    
    if (!boardExists) {
      throw new Error(`ボード（ID: ${dto.boardId}）が見つかりません`);
    }

    // ポジション設定（未指定の場合は末尾に追加）
    let position = dto.position;
    if (position === undefined) {
      const listCount = await this.listRepository.countByBoardId(boardId);
      position = listCount;
    }

    const list = List.create(dto.boardId, dto.title, position);
    await this.listRepository.save(list);

    return this.toDto(list);
  }

  // リスト取得
  async getListById(id: string): Promise<ListDto> {
    const listId = new ListId(id);
    const list = await this.listRepository.findById(listId);

    if (!list) {
      throw new Error(`リスト（ID: ${id}）が見つかりません`);
    }

    return this.toDto(list);
  }

  // ボード指定でリスト一覧取得
  async getListsByBoardId(boardId: string): Promise<ListDto[]> {
    const boardIdObj = new BoardId(boardId);
    const lists = await this.listRepository.findByBoardId(boardIdObj);
    
    // ポジション順にソート
    lists.sort((a, b) => a.position.value - b.position.value);
    
    return lists.map(list => this.toDto(list));
  }

  // 全リスト取得
  async getAllLists(): Promise<ListDto[]> {
    const lists = await this.listRepository.findAll();
    return lists.map(list => this.toDto(list));
  }

  // リスト更新
  async updateList(id: string, dto: UpdateListDto): Promise<ListDto> {
    const listId = new ListId(id);
    const list = await this.listRepository.findById(listId);

    if (!list) {
      throw new Error(`リスト（ID: ${id}）が見つかりません`);
    }

    list.updateInfo(dto.title, dto.position);
    await this.listRepository.save(list);

    return this.toDto(list);
  }

  // リスト移動
  async moveList(id: string, dto: MoveListDto): Promise<ListDto> {
    const listId = new ListId(id);
    const list = await this.listRepository.findById(listId);

    if (!list) {
      throw new Error(`リスト（ID: ${id}）が見つかりません`);
    }

    list.changePosition(dto.position);
    await this.listRepository.save(list);

    return this.toDto(list);
  }

  // リスト削除
  async deleteList(id: string): Promise<void> {
    const listId = new ListId(id);
    const exists = await this.listRepository.exists(listId);

    if (!exists) {
      throw new Error(`リスト（ID: ${id}）が見つかりません`);
    }

    await this.listRepository.delete(listId);
  }

  // リスト存在確認
  async listExists(id: string): Promise<boolean> {
    const listId = new ListId(id);
    return await this.listRepository.exists(listId);
  }

  // ドメインエンティティをDTOに変換
  private toDto(list: List): ListDto {
    const primitives = list.toPrimitives();
    return new ListDto(
      primitives.id,
      primitives.boardId,
      primitives.title,
      primitives.position,
      primitives.createdAt,
      primitives.updatedAt
    );
  }
}