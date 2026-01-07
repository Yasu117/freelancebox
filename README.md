# ITフリーランスエージェントプラットフォーム MVP

Next.js + Supabase (App Router) で構築されたITフリーランスエージェントWebアプリです。

## 技術スタック
- Framework: Next.js (App Router)
- Language: TypeScript
- Style: Tailwind CSS
- DB: Supabase (PostgreSQL)
- Icons: Lucide React

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local`を作成し、Supabaseのキーを設定してください。
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Backend / Admin用
```

### 3. データベースの構築
SupabaseのSQLエディタで、`supabase/schema.sql`の内容を実行してください。
これにより、以下のテーブルと初期データが作成されます。
- jobs, roles, skills, locations, articles, leads, etc.
- RLSポリシー設定済み

### 4. 開発サーバーの起動
```bash
npm run dev
```
http://localhost:3000 にアクセスしてください。

## ページ構成
- **公開ページ**
  - トップ: `/`
  - 案件検索: `/jobs`
  - 案件詳細: `/jobs/[id]`
  - コラム一覧: `/articles`
  - コラム詳細: `/articles/[slug]`
  - 登録フォーム: `/register`
- **管理ページ** (要Admin権限 / MVPでは簡易実装)
  - ダッシュボード: `/admin`
  - リード一覧: `/admin/leads`

## 注意事項
- 現状の公開ページ（Jobs, Articles）は、DB接続設定が未完了の場合やデータがない場合でも表示を確認できるよう、一部モックデータを使用している箇所があります（`app/(public)/jobs/page.tsx`など）。本番運用の際は、コメントアウトされているSupabaseのフェッチ処理を有効化してください。
- 全文検索にはPostgresの`tsvector`を使用しています。日本語全文検索をより高精度にする場合は `pg_trgm` や `pgroonga` の導入を検討してください（今回は標準の`websearch_to_tsquery`等を想定）。

