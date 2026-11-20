import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  discordId: text("discord_id"),
  role: text("role").notNull(),
  team: text("team").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull().default("活動中"),
  category: text("category").notNull().default("研修生"),
  followStatus: text("follow_status").notNull().default("定期的な1on1は不要"),
  lastReminderAt: text("last_reminder_at"),
  interests: text("interests").notNull().default(""),
  challenges: text("challenges").notNull().default(""),
  recentUpdate: text("recent_update").notNull().default(""),
  privateNote: text("private_note").notNull().default(""),
  lastMeetingAt: text("last_meeting_at"),
  nextMeetingAt: text("next_meeting_at"),
  createdAt: text("created_at").notNull(),
});

export const meetings = sqliteTable("meetings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id").notNull().references(() => members.id),
  owner: text("owner").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  status: text("status").notNull().default("未実施"),
  completedAt: text("completed_at"),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const meetingNotes = sqliteTable("meeting_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  meetingId: integer("meeting_id").references(() => meetings.id),
  memberId: integer("member_id").notNull().references(() => members.id),
  heldAt: text("held_at").notNull(),
  recentState: text("recent_state").notNull(),
  topics: text("topics").notNull(),
  concerns: text("concerns").notNull().default(""),
  positives: text("positives").notNull().default(""),
  otherNote: text("other_note").notNull().default(""),
  recorder: text("recorder").notNull().default(""),
  memberAction: text("member_action").notNull().default(""),
  operatorAction: text("operator_action").notNull().default(""),
  transcriptText: text("transcript_text").notNull().default(""),
  externalUrl: text("external_url").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const actions = sqliteTable("actions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id").notNull().references(() => members.id),
  meetingId: integer("meeting_id").references(() => meetings.id),
  content: text("content").notNull(),
  assigneeType: text("assignee_type").notNull(),
  assigneeName: text("assignee_name").notNull(),
  dueAt: text("due_at"),
  status: text("status").notNull().default("未着手"),
  createdAt: text("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  staleDays: integer("stale_days").notNull().default(30),
  updatedAt: text("updated_at").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  summary: text("summary").notNull().default(""),
  leadMemberId: integer("lead_member_id").notNull().references(() => members.id),
  operator: text("operator").notNull().default("未割当"),
  status: text("status").notNull().default("アイデア"),
  progress: text("progress").notNull().default(""),
  nextStep: text("next_step").notNull().default(""),
  targetAt: text("target_at"),
  proposalUrl: text("proposal_url").notNull().default(""),
  resourceUrl: text("resource_url").notNull().default(""),
  relatedMeetingNoteId: integer("related_meeting_note_id").references(() => meetingNotes.id),
  updatedAt: text("updated_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const projectMembers = sqliteTable("project_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id),
  memberId: integer("member_id").notNull().references(() => members.id),
});

export const followTasks = sqliteTable("follow_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id").notNull().references(() => members.id),
  operator: text("operator").notNull(),
  content: text("content").notNull(),
  scheduledAt: text("scheduled_at"),
  kind: text("kind").notNull().default("通常フォロー"),
  status: text("status").notNull().default("未対応"),
  projectId: integer("project_id").references(() => projects.id),
  memo: text("memo").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

// Phase 2の読み取り専用Discord同期で使用する元データ領域。
// member / 1on1 / project の関連は任意で、AI分析結果とは分離して保存する。
export const discordMessages = sqliteTable("discord_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discordMessageId: text("discord_message_id").notNull().unique(),
  channelId: text("channel_id").notNull(),
  authorDiscordId: text("author_discord_id").notNull(),
  content: text("content").notNull(),
  sentAt: text("sent_at").notNull(),
  sourceUrl: text("source_url").notNull().default(""),
  memberId: integer("member_id").references(() => members.id),
  meetingNoteId: integer("meeting_note_id").references(() => meetingNotes.id),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: text("created_at").notNull(),
});
