export type RitualTopic = "love" | "career" | "self" | "random";

export const ritualTopics: Array<{
  id: RitualTopic;
  label: string;
  hint: string;
}> = [
  { id: "love", label: "Love", hint: "connection, distance, devotion" },
  { id: "career", label: "Career", hint: "direction, leverage, timing" },
  { id: "self", label: "Self", hint: "identity, boundaries, healing" },
  { id: "random", label: "Random Guidance", hint: "whatever needs to surface" },
];

export function ritualTopicToTone(topic: RitualTopic) {
  switch (topic) {
    case "love":
      return "tender honesty";
    case "career":
      return "precision";
    case "self":
      return "compassion";
    case "random":
      return "quiet attention";
  }
}

