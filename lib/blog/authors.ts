// Blog authors. Real people on the Vyavasth team only; never invent a person.
// An author with bio: null cannot be used in a post (the build fails), so a
// post only goes out under a name once that person's one-line bio is approved.
// No em dashes.

export type Author = {
  id: string;
  name: string;
  role: string;
  /** One line, first person not needed. null until approved. */
  bio: string | null;
};

export const AUTHORS: Author[] = [
  {
    id: "abhishek",
    name: "Abhishek",
    role: "Co-founder, Vyavasth",
    bio: "Co-founder of Vyavasth. Spends his weeks with wedding studios across Madhya Pradesh and nearby states, on how they deliver, price and sell.",
  },
  {
    id: "bharat",
    name: "Bharat",
    role: "Co-founder, Vyavasth",
    bio: "Co-founder of Vyavasth. Builds the upload, gallery and delivery systems studios rely on during a wedding.",
  },
  {
    id: "bhartendra",
    name: "Bhartendra",
    role: "ML and AI, Vyavasth",
    bio: "Works on Vyavasth's face search, the AI that finds every guest across thousands of wedding photos.",
  },
  {
    id: "amit",
    name: "Amit",
    role: "Social media growth, Vyavasth",
    bio: "Runs Vyavasth's social media and works with studios on turning Instagram and Google reviews into bookings.",
  },
];

export function authorById(id: string): Author | undefined {
  return AUTHORS.find((a) => a.id === id);
}
