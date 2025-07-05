import { IsString, IsOptional, IsNotEmpty, MaxLength, Matches } from 'class-validator';

// リクエストDTO
export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: '背景色は有効なHEXカラーコード（例: #0079bf）で指定してください' })
  backgroundColor?: string;
}

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: '背景色は有効なHEXカラーコード（例: #0079bf）で指定してください' })
  backgroundColor?: string;
}

// レスポンスDTO
export class BoardDto {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    backgroundColor: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.backgroundColor = backgroundColor;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}