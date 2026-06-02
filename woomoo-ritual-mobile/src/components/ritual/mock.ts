export const MOCK_STATS = [
  { value: "500K+", label: "READINGS" },
  { value: "4.6", label: "APP STORE" },
  { value: "10M+", label: "CARDS DRAWN" },
];

export const SUGGESTION_CHIPS = [
  "Will I find love this year?",
  "Is he the one?",
  "When will love come?",
  "How do I stop overthinking?",
];

export const MOCK_READING = {
  pathLabel: "OPEN HEART PATH",
  summary:
    "You are asking if love is coming your way this year, but right now your energy is stuck looking backward at what did not work out.",
  together:
    "You are moving from deep regret into a calmer balance that eventually leads to a major heart-level decision — but there is one thread from your past that still wants closure.",
  cards: [
    {
      caption: "CURRENT ROMANTIC ENERGY",
      title: "Five of Cups",
      panelLabel: "CURRENT ROMANTIC ENERGY",
      tags: ["Sorrow", "Loss", "Reflection"],
      meaning:
        "This card suggests you may be dwelling on past heartbreaks or missed chances, making it harder to see the good that is still present around you.",
    },
    {
      caption: "POTENTIAL NEW CONNECTIONS",
      title: "Temperance",
      panelLabel: "POTENTIAL NEW CONNECTIONS",
      tags: ["Balance", "Integration", "Patience"],
      meaning:
        "Temperance points to new people arriving once you find your own inner harmony. Slow, steady alignment opens the door to healthier connection.",
    },
    {
      caption: "KEY TO SUCCESS",
      title: "The Lovers",
      panelLabel: "KEY TO SUCCESS",
      tags: ["Love", "Choice", "Compatibility"],
      meaning:
        "The Lovers reminds you that the outcome depends on a conscious choice: staying open and vulnerable while aligning your actions with what your heart truly wants.",
    },
  ],
} as const;

