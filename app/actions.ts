"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { actions, meetingNotes, meetings, members } from "@/db/schema";
import { eq } from "drizzle-orm";

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function addMember(form: FormData) {
  const name = value(form, "name");
  if (!name) throw new Error("名前は必須です");
  await getDb().insert(members).values({
    name,
    discordId: value(form, "discordId"),
    role: value(form, "role") || "メンバー",
    team: value(form, "team") || "未所属",
    owner: value(form, "owner") || "未割当",
    interests: value(form, "interests"),
    challenges: value(form, "challenges"),
    recentUpdate: value(form, "recentUpdate"),
    privateNote: "",
    createdAt: new Date().toISOString(),
  });
  revalidatePath("/");
}

export async function addMeeting(form: FormData) {
  const memberId = Number(value(form, "memberId"));
  const scheduledAt = value(form, "scheduledAt");
  if (!memberId || !scheduledAt) throw new Error("メンバーと日時は必須です");
  await getDb().insert(meetings).values({
    memberId,
    owner: value(form, "owner"),
    scheduledAt,
    note: value(form, "note"),
    createdAt: new Date().toISOString(),
  });
  await getDb().update(members).set({ nextMeetingAt: scheduledAt.slice(0, 10) }).where(eq(members.id, memberId));
  revalidatePath("/");
}

export async function addAction(form: FormData) {
  const memberId = Number(value(form, "memberId"));
  const content = value(form, "content");
  if (!memberId || !content) throw new Error("メンバーと内容は必須です");
  await getDb().insert(actions).values({
    memberId,
    content,
    assigneeType: value(form, "assigneeType"),
    assigneeName: value(form, "assigneeName"),
    dueAt: value(form, "dueAt") || null,
    createdAt: new Date().toISOString(),
  });
  revalidatePath("/");
}

export async function addMeetingNote(form: FormData) {
  const memberId = Number(value(form, "memberId"));
  const heldAt = value(form, "heldAt");
  if (!memberId || !heldAt) throw new Error("メンバーと実施日は必須です");
  await getDb().insert(meetingNotes).values({
    memberId,
    heldAt,
    recentState: value(form, "recentState"),
    topics: value(form, "topics"),
    concerns: value(form, "concerns"),
    positives: value(form, "positives"),
    otherNote: value(form, "otherNote"),
    createdAt: new Date().toISOString(),
  });
  await getDb().update(members).set({ lastMeetingAt: heldAt }).where(eq(members.id, memberId));
  revalidatePath("/");
}
