import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  discordId: text("discord_id"),
  role: text("role").notNull(),
  team: text("team").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull().default("活動中"),
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
