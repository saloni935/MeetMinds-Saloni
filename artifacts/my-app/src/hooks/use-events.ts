import { useQuery } from "@tanstack/react-query";
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

async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    company: row.company,
    logo: row.logo,
    color: row.color,
    type: row.type,
    mode: row.mode,
    title: row.title,
    date: row.date,
    time: row.time,
    venue: row.venue,
    distance: row.distance ?? 0,
    city: row.city,
    paid: row.paid ?? false,
    price: row.price ?? 0,
    freebies: row.freebies ?? [],
    eligibility: row.eligibility ?? [],
    link: row.link,
    tags: row.tags ?? [],
    totalSeats: row.total_seats,
    taken: row.taken ?? 0,
  }));
}

export function useEvents() {
  return useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}
