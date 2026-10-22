export type Profile = { id: string; full_name: string; email: string; role: "super_admin" | "member"; status: "pending" | "approved" | "rejected" };
export type SiteItem = { id: string; kind: "team" | "partner" | "project"; title: string; subtitle: string; description: string; link: string; sort: number; created_at: string };
export type Group = { id: string; name: string; description: string; leader_id: string | null; created_at: string };
export type GroupMember = { group_id: string; user_id: string };
export type Status = "todo" | "in_progress" | "review" | "done";
export type Priority = "low" | "medium" | "high";
export type Task = {
  id: string; group_id: string; title: string; description: string;
  assignee_id: string | null; priority: Priority; status: Status;
  due_date: string | null; created_by: string | null; created_at: string;
};
export type Message = { id: string; group_id: string | null; sender_id: string; content: string; created_at: string };
export type Todo = { id: string; user_id: string; text: string; done: boolean; due_date: string | null; created_at: string };

export const STATUSES: { key: Status; label: string; dot: string }[] = [
  { key: "todo", label: "To do", dot: "bg-slate-400" },
  { key: "in_progress", label: "In progress", dot: "bg-blue-500" },
  { key: "review", label: "Review", dot: "bg-amber-500" },
  { key: "done", label: "Done", dot: "bg-emerald-500" },
];
export const PRIORITY_STYLE: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-50 text-blue-700",
  high: "bg-rose-50 text-rose-700",
};
export const isOverdue = (t: Task) =>
  !!t.due_date && t.status !== "done" && new Date(t.due_date + "T23:59:59") < new Date();
