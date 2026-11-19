# NEXUS 運営支援システム 設計案

## 推奨技術スタック

- フロント／バックエンド: React + TypeScriptを単一アプリで運用。画面とサーバー処理を同じ型で保守する。
- DB: Cloudflare D1（SQLite互換）+ Drizzle ORM。初期コストが小さく、将来PostgreSQLへ移行しやすい。
- 認証: Sitesのプラットフォーム認証。Site自体を非公開にし、運営アカウントのみ許可する。
- Discord: TypeScript製Botを別Workerまたはコンテナで稼働。Guilds、Guild Messages、Message Content Intentのみを使い、送信権限は付与しない。
- AI: Phase 3でOpenAI APIをサーバー側から呼ぶ。出力は下書きとして保存し、事実・推測・根拠IDを別フィールドで保持する。
- デプロイ: Sites + Workers + D1。アプリ、認証、DBを同一基盤に寄せて初期運用を単純化する。

## 全体構成図

```text
運営メンバー ──認証──> NEXUS Web App (React / Worker)
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
              D1 DB     Discord取得Worker   AI API
            会員/面談      読み取り専用      要約/面談準備
            行動/監査       重複排除・保存    根拠IDを保存
```

## データベース設計

Phase 1は `members`、`meetings`、`meeting_notes`、`actions`、`settings`。Phase 2で `discord_channels`、`discord_messages`、`member_discord_links`、`sync_runs`、Phase 3で `ai_insights`、`ai_briefs`、`ai_citations` を追加する。削除は将来 `deleted_at` を使う論理削除、重要更新は `audit_logs` に差分を記録する。

主な関連は、member 1:N meeting、member 1:N meeting_note、meeting 1:N action。DiscordメッセージはDiscord message IDに一意制約を置き、重複取得を防ぐ。

## 画面構成

- ダッシュボード: 今週、超過、未設定、未面談、未完了アクションと優先フォロー。
- メンバー: 検索・担当・所属・面談状態の絞り込み。詳細ではプロフィール、履歴、Discord、行動、次回予定をタブ表示。
- 1on1予定／カレンダー: 一覧と月・週表示、登録・変更・削除。
- 面談記録: テンプレート入力、時系列、予定との紐付け。
- アクション: 本人／運営別、期限・状態別の一覧。
- Discord情報、AI面談準備、管理者設定: Phase 2以降。

## 実装計画

1. Phase 1: 基本管理、認証、D1、カレンダー、期限判定、デモデータ。本リポジトリで実装済み。
2. Phase 2: 読み取り専用Discord Bot、過去・新規投稿同期、メンバー紐付け、取得監視。
3. Phase 3: 根拠付き要約、変化比較、前回アクション確認、編集可能な面談進行案。
4. Phase 4: 変化の可視化、フォロー抽出精度、担当者負荷、監査・バックアップ強化。

## 想定運用コスト

少人数運用なら、Sites/Workers/D1は無料枠または低額枠内に収まりやすい。AI費用はPhase 3開始後に発生し、要約対象期間と再生成回数を制限して月数百〜数千円程度から開始する想定。Discord Botは常時接続方式を選ぶ場合、別途月数百〜千円程度の小型実行環境が必要。正式導入前に最新料金と団体のメッセージ量で再試算する。

## セキュリティ方針

Siteは非公開。書き込みはすべてサーバー側で認証・権限確認する。DiscordトークンとAIキーは秘密変数へ保存する。Botに送信・DM・管理者権限を与えない。AIは人格・能力を断定せず、事実・推測・不明を明示し、根拠と日時を必ず表示する。録音・文字起こしは事前同意を運用要件とする。
