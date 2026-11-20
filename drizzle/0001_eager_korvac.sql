CREATE TABLE `follow_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`operator` text NOT NULL,
	`content` text NOT NULL,
	`scheduled_at` text,
	`kind` text DEFAULT '通常フォロー' NOT NULL,
	`status` text DEFAULT '未対応' NOT NULL,
	`project_id` integer,
	`memo` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `project_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`member_id` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`lead_member_id` integer NOT NULL,
	`operator` text DEFAULT '未割当' NOT NULL,
	`status` text DEFAULT 'アイデア' NOT NULL,
	`progress` text DEFAULT '' NOT NULL,
	`next_step` text DEFAULT '' NOT NULL,
	`target_at` text,
	`proposal_url` text DEFAULT '' NOT NULL,
	`resource_url` text DEFAULT '' NOT NULL,
	`related_meeting_note_id` integer,
	`updated_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`lead_member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_meeting_note_id`) REFERENCES `meeting_notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `meeting_notes` ADD `recorder` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `meeting_notes` ADD `member_action` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `meeting_notes` ADD `operator_action` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `meeting_notes` ADD `transcript_text` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `meeting_notes` ADD `external_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `category` text DEFAULT '研修生' NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `follow_status` text DEFAULT '定期的な1on1は不要' NOT NULL;--> statement-breakpoint
ALTER TABLE `members` ADD `last_reminder_at` text;
--> statement-breakpoint
INSERT INTO `members` (`name`,`discord_id`,`role`,`team`,`owner`,`status`,`category`,`follow_status`,`interests`,`challenges`,`recent_update`,`private_note`,`last_meeting_at`,`next_meeting_at`,`created_at`) VALUES
('奥歯','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('血反吐','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ハム','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('おべんじょ','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('カタナ','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ティーバー','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ぼるで','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('あかね','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ハスラー','','準運営','運営','未割当','活動中','準運営','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('しぃしぃ','','研修生','研修','ハム','活動中','研修生','継続フォロー対象','','','','','2026-10-10',NULL,'2026-11-20'),
('ノマド','','研修生','研修','おべんじょ','活動中','研修生','現在フォロー中','','','','',NULL,NULL,'2026-11-20'),
('エラー','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ムッタ','','研修生','研修','血反吐','活動中','研修生','継続フォロー対象','','','','','2026-09-30',NULL,'2026-11-20'),
('あふち','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('あとも','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('がるち','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ハフ','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('じゅんた','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('おぱんちゅ','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('いお','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('フィー','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ワース','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('なすら','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('なずよ','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('こっしー','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('おーた','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('ののか','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20'),
('きさき','','研修生','研修','未割当','活動中','研修生','定期的な1on1は不要','','','','',NULL,NULL,'2026-11-20');
--> statement-breakpoint
INSERT INTO `follow_tasks` (`member_id`,`operator`,`content`,`scheduled_at`,`kind`,`status`,`project_id`,`memo`,`created_at`) VALUES
((SELECT id FROM members WHERE name='しぃしぃ'),'ハム','今週、最近の活動状況を聞く',NULL,'通常フォロー','未対応',NULL,'準運営会議で決定','2026-11-20'),
((SELECT id FROM members WHERE name='ムッタ'),'血反吐','次の行動を聞く',NULL,'通常フォロー','未対応',NULL,'日程調整前','2026-11-20');
--> statement-breakpoint
INSERT INTO `projects` (`name`,`summary`,`lead_member_id`,`operator`,`status`,`progress`,`next_step`,`target_at`,`proposal_url`,`resource_url`,`related_meeting_note_id`,`updated_at`,`created_at`) VALUES
('冬の交流イベント','研修生主体の交流イベント', (SELECT id FROM members WHERE name='ノマド'),'おべんじょ','企画中','会場候補を比較中','企画書の初稿を共有する','2026-12-20','','',NULL,'2026-11-20','2026-11-20');
--> statement-breakpoint
INSERT INTO `project_members` (`project_id`,`member_id`) VALUES
((SELECT id FROM projects WHERE name='冬の交流イベント'),(SELECT id FROM members WHERE name='ノマド')),
((SELECT id FROM projects WHERE name='冬の交流イベント'),(SELECT id FROM members WHERE name='しぃしぃ'));
--> statement-breakpoint
UPDATE members SET status='休止中' WHERE status='休止相談中';
