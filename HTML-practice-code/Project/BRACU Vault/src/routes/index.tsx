import { createFileRoute, redirect } from "@tanstack/react-router";

// The vault opens straight into the Orbit map.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/orbit" });
  },
  head: () => ({
    meta: [
      { title: "BRACU Vault · The knowledge archive for BRAC University CSE" },
      { name: "description", content: "Notes, slides, labs, past exams and projects for every BRACU CSE course, beautifully organized." },
      { property: "og:title", content: "BRACU Vault · The knowledge archive for BRAC University CSE" },
      { property: "og:description", content: "Notes, slides, labs, past exams and projects for every BRACU CSE course." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
