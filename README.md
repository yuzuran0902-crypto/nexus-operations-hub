# NEXUS Operations Hub

学生団体NEXUSの運営メンバー向けに、メンバー情報、1on1予定・記録、アクションを一元管理する内部Webアプリです。Phase 1を実装しています。

## 技術構成

- Vinext / React / TypeScript
- Cloudflare Workers + D1（Drizzle ORM）
- Sitesのプラットフォーム認証（非認証アクセスを遮断）
- レスポンシブな独自管理画面UI

## ローカル起動

Node.js 22.13以上を用意し、次を実行します。

```bash
npm install
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_misty_master_mold.sql
npm run dev
```

ローカルでは `/signin-with-chatgpt?return_to=/` にアクセスすると開発用ユーザーでログインできます。本番はSitesの認証を利用します。

## Phase 1で利用できる機能

- 認証された運営メンバーだけが閲覧できるダッシュボード
- メンバーの一覧・追加、担当者・所属・面談状況の表示
- 1on1予定の一覧・追加、月間カレンダー
- 面談記録の作成・時系列表示
- 本人／運営のアクション作成・期限表示
- 面談超過、次回未設定、30日以上未面談、期限超過の自動抽出
- D1への永続保存とデモデータ

## 環境変数

Phase 1では外部APIキーは不要です。将来のDiscord BotトークンとAI APIキーはSitesのサーバー側シークレットとして設定し、フロントエンドやGitに含めません。

## 今後

Phase 2はDiscordの読み取り専用Bot、Phase 3は根拠参照付きAI面談準備、Phase 4は変化・担当者負荷の高度な可視化です。詳細は `DESIGN.md` を参照してください。
