CREATE TABLE `actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`meeting_id` integer,
	`content` text NOT NULL,
	`assignee_type` text NOT NULL,
	`assignee_name` text NOT NULL,
	`due_at` text,
	`status` text DEFAULT '未着手' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meeting_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meeting_id` integer,
	`member_id` integer NOT NULL,
	`held_at` text NOT NULL,
	`recent_state` text NOT NULL,
	`topics` text NOT NULL,
	`concerns` text DEFAULT '' NOT NULL,
	`positives` text DEFAULT '' NOT NULL,
	`other_note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`owner` text NOT NULL,
	`scheduled_at` text NOT NULL,
	`status` text DEFAULT '未実施' NOT NULL,
	`completed_at` text,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`discord_id` text,
	`role` text NOT NULL,
	`team` text NOT NULL,
	`owner` text NOT NULL,
	`status` text DEFAULT '活動中' NOT NULL,
	`interests` text DEFAULT '' NOT NULL,
	`challenges` text DEFAULT '' NOT NULL,
	`recent_update` text DEFAULT '' NOT NULL,
	`private_note` text DEFAULT '' NOT NULL,
	`last_meeting_at` text,
	`next_meeting_at` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`stale_days` integer DEFAULT 30 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `members` (`name`,`discord_id`,`role`,`team`,`owner`,`status`,`interests`,`challenges`,`recent_update`,`private_note`,`last_meeting_at`,`next_meeting_at`,`created_at`) VALUES
('佐藤 ひなた','hinata_27','企画リーダー','企画','高橋','活動中','春イベントの企画と広報','タスクを抱え込みやすい','協賛候補への初回連絡を完了。企画づくりを楽しめている。','次回は負荷感を丁寧に確認する','2026-11-06','2026-11-21','2026-09-01'),
('鈴木 悠斗','yuto_s','デザイナー','広報','伊藤','活動中','SNSクリエイティブ','学業との両立','投稿テンプレートを刷新。制作ペースは安定。','','2026-10-02',NULL,'2026-09-01'),
('田中 美月','mizuki_t','渉外','渉外','高橋','活動中','企業連携','新規連絡への心理的ハードル','OBから紹介を受け、面談準備を進めている。','','2026-11-12','2026-11-24','2026-09-01'),
('山本 蓮','ren_y','エンジニア','開発','佐々木','活動中','会員サイト改善','要件が曖昧な作業の優先順位','ログイン画面の改善案を共有した。','','2026-09-18','2026-11-18','2026-09-01'),
('小林 さくら','sakura_k','コミュニティ','運営','伊藤','休止相談中','新入生オンボーディング','活動時間を確保しづらい','直近2週間の定例参加が少ない。状況は未確認。','事実確認を優先し、評価的な表現を避ける','2026-10-10','2026-11-27','2026-09-01');
--> statement-breakpoint
INSERT INTO `meetings` (`member_id`,`owner`,`scheduled_at`,`status`,`completed_at`,`note`,`created_at`) VALUES
(1,'高橋','2026-11-21T18:00','未実施',NULL,'オンライン','2026-11-10'),
(2,'伊藤','2026-11-14T17:30','延期',NULL,'再調整が必要','2026-11-01'),
(3,'高橋','2026-11-24T19:00','未実施',NULL,'対面','2026-11-12'),
(4,'佐々木','2026-11-18T20:00','未実施',NULL,'予定日超過','2026-11-02'),
(5,'伊藤','2026-11-27T16:00','未実施',NULL,'活動継続の希望を確認','2026-11-13');
--> statement-breakpoint
INSERT INTO `meeting_notes` (`meeting_id`,`member_id`,`held_at`,`recent_state`,`topics`,`concerns`,`positives`,`other_note`,`created_at`) VALUES
(NULL,1,'2026-11-06','企画準備に手応えがある','協賛候補、当日の役割分担','タスクが集中している','企画そのものを楽しめている','','2026-11-06'),
(NULL,3,'2026-11-12','企業連携の相談先が見つかった','紹介先への連絡準備','最初の連絡文面に迷いがある','自分からOBへ相談できた','','2026-11-12');
--> statement-breakpoint
INSERT INTO `actions` (`member_id`,`meeting_id`,`content`,`assignee_type`,`assignee_name`,`due_at`,`status`,`created_at`) VALUES
(1,NULL,'企画タスクを3つに分解して担当を相談する','本人','佐藤 ひなた','2026-11-20','進行中','2026-11-06'),
(1,NULL,'協賛候補リストをレビューする','運営','高橋','2026-11-19','未着手','2026-11-06'),
(3,NULL,'初回連絡文のたたき台を作る','本人','田中 美月','2026-11-18','完了','2026-11-12'),
(4,NULL,'開発タスクの優先順位を一緒に整理する','運営','佐々木','2026-11-19','未着手','2026-10-02'),
(5,NULL,'活動可能な曜日を整理する','本人','小林 さくら','2026-11-25','未着手','2026-10-10');
--> statement-breakpoint
INSERT INTO `settings` (`id`,`stale_days`,`updated_at`) VALUES (1,30,'2026-11-19');
