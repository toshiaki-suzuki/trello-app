import { IsString, IsOptional, IsNotEmpty, MaxLength, IsNumber, Min, IsDateString } from 'class-validator';

// リクエストDTO
export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class MoveCardDto {
  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsNumber()
  @Min(0)
  position: number;
}

// レスポンスDTO
export class CardDto {
  id: string;
  listId: string;
  title: string;
  description: string;
  position: number;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    listId: string,
    title: string,
    description: string,
    position: number,
    dueDate: Date | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.listId = listId;
    this.title = title;
    this.description = description;
    this.position = position;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}