# NEXUS Operations Hub

- GitHub Pages入口: https://yuzuran0902-crypto.github.io/nexus-operations-hub/
- 稼働中のアプリ: https://nexus-operations-hub.laborobo.chatgpt.site/

学生団体NEXUSの運営メンバー向けに、メンバー、1on1、フォロー対応、企画・イベント、アクションを一元管理する内部Webアプリです。

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
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_eager_korvac.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_gray_echo.sql
npm run dev
```

ローカルでは `/signin-with-chatgpt?return_to=/` にアクセスすると開発用ユーザーでログインできます。本番はSitesの認証を利用します。

## 利用できる機能

- 認証された運営メンバーだけが閲覧できるダッシュボード
- 準運営／研修生別のメンバー一覧、検索、絞り込み、追加、詳細、編集
- 活動中／休止中／活動終了の論理的な在籍管理
- メンバー登録とは独立した1on1フォロー状態
- 1on1予定の一覧・追加、月間カレンダー
- 日付未定でも保存できる1on1／通常フォロー対応と状態更新
- 記録者、本人／運営アクション、外部URL、文字起こしを含む1on1記録
- 企画・イベントの登録、詳細、進捗更新、複数関係者、外部資料、1on1関連付け
- 本人／運営のアクション作成・期限表示
- 継続フォロー対象に限定した月次リマインダー
- D1への永続保存とデモデータ

## 環境変数

Phase 1では外部APIキーは不要です。将来のDiscord BotトークンとAI APIキーはSitesのサーバー側シークレットとして設定し、フロントエンドやGitに含めません。

## 今後

Discordメッセージの重複排除とメンバー・1on1・企画への関連付けを行うDB領域は用意済みです。Bot同期は読み取り専用で実装します。AIは運営者が明示的に実行し、事実と推測を分け、確認後にだけ保存する方針です。詳細は `DESIGN.md` を参照してください。
