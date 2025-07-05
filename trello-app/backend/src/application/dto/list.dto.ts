import { IsString, IsOptional, IsNotEmpty, MaxLength, IsNumber, Min } from 'class-validator';

// リクエストDTO
export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;
}

export class UpdateListDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;
}

export class MoveListDto {
  @IsNumber()
  @Min(0)
  position: number;
}

// レスポンスDTO
export class ListDto {
  id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    boardId: string,
    title: string,
    position: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.boardId = boardId;
    this.title = title;
    this.position = position;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}