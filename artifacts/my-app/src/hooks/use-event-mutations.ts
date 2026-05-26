import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/hooks/use-events";

export interface EventInput {
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

function toRow(input: EventInput) {
  return {
    company: input.company,
    logo: input.logo,
    color: input.color,
    type: input.type,
    mode: input.mode,
    title: input.title,
    date: input.date,
    time: input.time,
    venue: input.venue,
    distance: input.distance,
    city: input.city,
    paid: input.paid,
    price: input.price,
    freebies: input.freebies,
    eligibility: input.eligibility,
    link: input.link,
    tags: input.tags,
    total_seats: input.totalSeats,
    taken: input.taken,
  };
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventInput) => {
      const { error } = await supabase.from("events").insert([toRow(input)]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: EventInput }) => {
      const { error } = await supabase
        .from("events")
        .update(toRow(input))
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taken }: { id: number; taken: number }) => {
      const { error } = await supabase
        .from("events")
        .update({ taken: taken + 1 })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function toEventInput(event: Event): EventInput {
  return {
    company: event.company,
    logo: event.logo,
    color: event.color,
    type: event.type,
    mode: event.mode,
    title: event.title,
    date: event.date,
    time: event.time,
    venue: event.venue,
    distance: event.distance,
    city: event.city,
    paid: event.paid,
    price: event.price,
    freebies: event.freebies,
    eligibility: event.eligibility,
    link: event.link,
    tags: event.tags,
    totalSeats: event.totalSeats,
    taken: event.taken,
  };
}
