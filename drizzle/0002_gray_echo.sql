CREATE TABLE `discord_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discord_message_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`author_discord_id` text NOT NULL,
	`content` text NOT NULL,
	`sent_at` text NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`member_id` integer,
	`meeting_note_id` integer,
	`project_id` integer,
	`created_at` text NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meeting_note_id`) REFERENCES `meeting_notes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discord_messages_discord_message_id_unique` ON `discord_messages` (`discord_message_id`);