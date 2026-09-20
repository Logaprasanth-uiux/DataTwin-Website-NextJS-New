export type JourneyStep = {
  number: string;
  title: string;
  label: string;
  description: string;
};

export const JOURNEY_STEPS: readonly [JourneyStep, JourneyStep, JourneyStep, JourneyStep] = [
  {
    number: "01",
    title: "Help us understand your suspicion",
    label: "No form",
    description: "Describe your process or pick the symptom that you face.",
  },
  {
    number: "02",
    title: "Tell us who you are",
    label: "30 seconds",
    description:
      "Name, work email, company. We come back with what we'd look at first and what it usually turns out to be worth.",
  },
  {
    number: "03",
    title: "Give us read access to yours",
    label: "Read-only",
    description:
      "One period, one process. Read-only, nothing changes. We run Discover and Assess and return your number.",
  },
  {
    number: "04",
    title: "Book 30 minutes",
    label: "The goal",
    description:
      "Walk through of our findings with you. You've seen the number; the meeting is what to collect first, and how fast.",
  },
];
