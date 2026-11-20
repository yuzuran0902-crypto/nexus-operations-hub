"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { actions, followTasks, meetingNotes, meetings, members, projectMembers, projects, settings } from "@/db/schema";
import { eq } from "drizzle-orm";

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function addMember(form: FormData) {
  const name = value(form, "name");
  if (!name) throw new Error("名前は必須です");
  await getDb().insert(members).values({
    name,
    discordId: value(form, "discordId"),
    role: "研修生",
    team: "研修",
    owner: value(form, "owner") || "未割当",
    category: "研修生",
    followStatus: value(form, "followStatus") || "定期的な1on1は不要",
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
    recorder: value(form, "recorder"),
    memberAction: value(form, "memberAction"),
    operatorAction: value(form, "operatorAction"),
    transcriptText: value(form, "transcriptText"),
    externalUrl: value(form, "externalUrl"),
    createdAt: new Date().toISOString(),
  });
  await getDb().update(members).set({ lastMeetingAt: heldAt }).where(eq(members.id, memberId));
  revalidatePath("/");
}

export async function updateMeetingNote(form: FormData) {
  const id = Number(value(form, "id"));
  const memberId = Number(value(form, "memberId"));
  const heldAt = value(form, "heldAt");
  await getDb().update(meetingNotes).set({
    heldAt, recentState: value(form, "recentState"), topics: value(form, "topics"),
    concerns: value(form, "concerns"), positives: value(form, "positives"), otherNote: value(form, "otherNote"),
    recorder: value(form, "recorder"), memberAction: value(form, "memberAction"), operatorAction: value(form, "operatorAction"),
    transcriptText: value(form, "transcriptText"), externalUrl: value(form, "externalUrl"),
  }).where(eq(meetingNotes.id, id));
  await getDb().update(members).set({ lastMeetingAt: heldAt }).where(eq(members.id, memberId));
  revalidatePath("/");
}

export async function updateMember(form: FormData) {
  const id = Number(value(form, "id"));
  if (!id) throw new Error("メンバーが見つかりません");
  const category = value(form, "category") || "研修生";
  await getDb().update(members).set({
    name: value(form, "name"), discordId: value(form, "discordId"), category,
    role: category, team: category === "準運営" ? "運営" : "研修",
    owner: value(form, "owner") || "未割当", status: value(form, "status") || "活動中",
    followStatus: value(form, "followStatus") || "定期的な1on1は不要",
    interests: value(form, "interests"), challenges: value(form, "challenges"),
    recentUpdate: value(form, "recentUpdate"), privateNote: value(form, "privateNote"),
  }).where(eq(members.id, id));
  revalidatePath("/");
}

export async function addFollowTask(form: FormData) {
  const memberId = Number(value(form, "memberId"));
  const content = value(form, "content");
  if (!memberId || !content) throw new Error("対象メンバーと対応内容は必須です");
  await getDb().insert(followTasks).values({
    memberId, operator: value(form, "operator") || "未割当", content,
    scheduledAt: value(form, "scheduledAt") || null, kind: value(form, "kind") || "通常フォロー",
    status: value(form, "status") || "未対応", projectId: Number(value(form, "projectId")) || null,
    memo: value(form, "memo"), createdAt: new Date().toISOString(),
  });
  revalidatePath("/");
}

export async function updateFollowTask(form: FormData) {
  const id = Number(value(form, "id"));
  await getDb().update(followTasks).set({ status: value(form, "status") }).where(eq(followTasks.id, id));
  revalidatePath("/");
}

export async function addProject(form: FormData) {
  const leadMemberId = Number(value(form, "leadMemberId"));
  const name = value(form, "name");
  if (!leadMemberId || !name) throw new Error("企画名と主担当は必須です");
  const now = new Date().toISOString();
  const [created] = await getDb().insert(projects).values({
    name, summary: value(form, "summary"), leadMemberId, operator: value(form, "operator") || "未割当",
    status: value(form, "status") || "アイデア", progress: value(form, "progress"), nextStep: value(form, "nextStep"),
    targetAt: value(form, "targetAt") || null, proposalUrl: value(form, "proposalUrl"), resourceUrl: value(form, "resourceUrl"),
    relatedMeetingNoteId: Number(value(form, "relatedMeetingNoteId")) || null, updatedAt: now, createdAt: now,
  }).returning({ id: projects.id });
  const ids = [...new Set([leadMemberId, ...form.getAll("memberIds").map(Number).filter(Boolean)])];
  if (ids.length) await getDb().insert(projectMembers).values(ids.map(memberId => ({ projectId: created.id, memberId })));
  revalidatePath("/");
}

export async function updateProject(form: FormData) {
  const id = Number(value(form, "id"));
  await getDb().update(projects).set({
    name: value(form, "name"), summary: value(form, "summary"), leadMemberId: Number(value(form, "leadMemberId")),
    operator: value(form, "operator"), status: value(form, "status"), progress: value(form, "progress"),
    nextStep: value(form, "nextStep"), targetAt: value(form, "targetAt") || null,
    proposalUrl: value(form, "proposalUrl"), resourceUrl: value(form, "resourceUrl"),
    relatedMeetingNoteId: Number(value(form, "relatedMeetingNoteId")) || null, updatedAt: new Date().toISOString(),
  }).where(eq(projects.id, id));
  await getDb().delete(projectMembers).where(eq(projectMembers.projectId, id));
  const ids = [...new Set([Number(value(form, "leadMemberId")), ...form.getAll("memberIds").map(Number).filter(Boolean)])].filter(Boolean);
  if (ids.length) await getDb().insert(projectMembers).values(ids.map(memberId => ({ projectId: id, memberId })));
  revalidatePath("/");
}

export async function updateSettings(form: FormData) {
  const staleDays = Math.min(365, Math.max(7, Number(value(form, "staleDays")) || 30));
  await getDb().update(settings).set({ staleDays, updatedAt: new Date().toISOString() }).where(eq(settings.id, 1));
  revalidatePath("/");
}
