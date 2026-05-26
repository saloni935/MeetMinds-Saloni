import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Event {
  id: number;
  company: string;
  logo: string;
  color: string;
  type: "Workshop" | "Hackathon" | "Seminar";
  mode: "offline" | "virtual" | "hybrid";
  title: string;
  date: string;
  time: string;
  venue: string;
  distance: number;
  city: string;
  paid: boolean;
  price: number;
  freebies: string[];
  eligibility: string[];
  link: string;
  tags: string[];
  totalSeats: number;
  taken: number;
}

function mapRow(row: Record<string, unknown>): Event {
  return {
    id: row.id as number,
    company: row.company as string,
    logo: row.logo as string,
    color: row.color as string,
    type: row.type as Event["type"],
    mode: row.mode as Event["mode"],
    title: row.title as string,
    date: row.date as string,
    time: row.time as string,
    venue: row.venue as string,
    distance: (row.distance as number) ?? 0,
    city: row.city as string,
    paid: (row.paid as boolean) ?? false,
    price: (row.price as number) ?? 0,
    freebies: (row.freebies as string[]) ?? [],
    eligibility: (row.eligibility as string[]) ?? [],
    link: row.link as string,
    tags: (row.tags as string[]) ?? [],
    totalSeats: row.total_seats as number,
    taken: (row.taken as number) ?? 0,
  };
}

async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export function useEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}
