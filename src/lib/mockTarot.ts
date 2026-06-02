import { ritualTopicToTone, type RitualTopic } from "@/lib/ritualCopy";

export type TarotCard = {
  id: string;
  name: string;
  keyword: string;
  meaning: string;
  vibe: "still" | "shift" | "charge";
};

const deck: TarotCard[] = [
  {
    id: "the-moon",
    name: "The Moon",
    keyword: "intuition · shadow",
    meaning: "You are navigating uncertainty. Listen to your intuition.",
    vibe: "still",
  },
  {
    id: "the-star",
    name: "The Star",
    keyword: "clarity · grace",
    meaning: "Hope is returning. You are aligned with your purpose.",
    vibe: "still",
  },
  {
    id: "the-lovers",
    name: "The Lovers",
    keyword: "choice · alignment",
    meaning: "A decision wants truth. Choose what matches your values.",
    vibe: "charge",
  },
  {
    id: "the-magician",
    name: "The Magician",
    keyword: "focus · will",
    meaning: "You already have what you need. Direct your focus.",
    vibe: "charge",
  },
  {
    id: "the-hermit",
    name: "The Hermit",
    keyword: "solitude · truth",
    meaning: "You withdrew to protect your energy and seek inner truth.",
    vibe: "still",
  },
  {
    id: "death",
    name: "Death",
    keyword: "ending · renewal",
    meaning: "An ending clears space. Release what is complete.",
    vibe: "shift",
  },
  {
    id: "temperance",
    name: "Temperance",
    keyword: "balance · patience",
    meaning: "Move slowly. Balance returns through gentle discipline.",
    vibe: "still",
  },
  {
    id: "the-tower",
    name: "The Tower",
    keyword: "reveal · release",
    meaning: "A truth breaks through. Let the false structure fall.",
    vibe: "shift",
  },
  {
    id: "strength",
    name: "Strength",
    keyword: "soft power · courage",
    meaning: "Soft power wins. Meet fear without force.",
    vibe: "charge",
  },
  {
    id: "justice",
    name: "Justice",
    keyword: "truth · consequence",
    meaning: "Be precise. What you choose now sets the balance.",
    vibe: "shift",
  },
  {
    id: "the-empress",
    name: "The Empress",
    keyword: "creation · nurture",
    meaning: "Nurture what you’re building. Let it become tangible.",
    vibe: "charge",
  },
  {
    id: "the-chariot",
    name: "The Chariot",
    keyword: "direction · control",
    meaning: "Choose a direction and move. Discipline becomes freedom.",
    vibe: "shift",
  },
];

function sampleWithoutReplacement<T>(arr: T[], count: number) {
  const copy = [...arr];
  const picked: T[] = [];
  while (picked.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

export function drawThreeCards(topic: RitualTopic) {
  const [past, present, future] = sampleWithoutReplacement(deck, 3);

  const tone = ritualTopicToTone(topic);
  const reading = [
    `Past: ${past.name} points to what quietly shaped you — the part you already survived.`,
    `Present: ${present.name} asks for one clean decision today: what stays, what leaves.`,
    `Future: ${future.name} suggests a next chapter if you act with ${tone}.`,
  ].join(" ");

  return { past, present, future, reading };
}
