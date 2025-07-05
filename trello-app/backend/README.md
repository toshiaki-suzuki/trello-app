# Trello App バックエンド

Trello風タスク管理アプリケーション用のNestJSベースバックエンドAPI

## 機能

- **ボード**: プロジェクトボードの作成と管理
- **リスト**: カスタマイズ可能なリストでタスクを整理
- **カード**: 説明と期限付きの詳細なタスクカードの作成
- **TypeORM**: SQLiteを使用したデータベース操作
- **CORS**: クロスオリジンリソース共有を有効化

## 技術スタック

- **フレームワーク**: NestJS
- **データベース**: SQLite with TypeORM
- **言語**: TypeScript
- **ランタイム**: Node.js

## インストール

```bash
npm install
```

## 開発

```bash
# 開発サーバーを起動
npm run start:dev

# デバッグモードで起動
npm run start:debug
```

## 本番環境

```bash
# アプリケーションをビルド
npm run build

# 本番サーバーを起動
npm run start:prod
```

## テスト

```bash
# 単体テストを実行
npm test

# ウォッチモードでテストを実行
npm test:watch

# カバレッジ付きでテストを実行
npm test:cov

# E2Eテストを実行
npm run test:e2e
```

## APIエンドポイント

サーバーはデフォルトでポート3001で動作します。

### データモデル

- **Board**: 複数のリストを含み、タイトル、説明、背景色を持つ
- **List**: ボードに属し、複数のカードを含み、位置順序を持つ
- **Card**: リストに属し、タイトル、説明、位置、オプションの期限を持つ

## プロジェクト構造

```
src/
├── entities/          # TypeORMエンティティ
│   ├── board.entity.ts
│   ├── list.entity.ts
│   └── card.entity.ts
├── app.controller.ts   # メインコントローラー
├── app.module.ts      # メインモジュール
├── app.service.ts     # メインサービス
└── main.ts           # アプリケーションエントリーポイント
```