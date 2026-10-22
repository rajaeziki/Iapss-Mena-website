"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Group, GroupMember, Profile, Task } from "./types";

/** Loads everything the signed-in user may see (RLS filters it) and refreshes live on task changes. */
export function useWorkspace() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [g, m, t, p] = await Promise.all([
      supabase.from("groups").select("*").order("created_at"),
      supabase.from("group_members").select("*"),
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("full_name"),
    ]);
    setGroups((g.data ?? []) as Group[]);
    setMembers((m.data ?? []) as GroupMember[]);
    setTasks((t.data ?? []) as Task[]);
    setProfiles((p.data ?? []) as Profile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    const ch = supabase
      .channel("workspace-" + Math.random().toString(36).slice(2))
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "group_members" }, () => reload())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [reload]);

  const name = (id: string | null) => profiles.find((p) => p.id === id)?.full_name ?? "Unassigned";
  return { groups, members, tasks, profiles, loading, reload, name };
}

export const pct = (tasks: Task[]) =>
  tasks.length ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0;
