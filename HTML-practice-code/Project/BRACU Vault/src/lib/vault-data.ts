// Curriculum + deterministic sample file catalogue (seeded per course code so it never changes).
export type CategoryId = "core" | "electives" | "math" | "gened";
export type FileType = "Notes" | "Slides" | "Assignments" | "Questions" | "Solutions" | "Projects";
export type FileFormat = "pdf" | "pptx" | "ipynb" | "docx" | "code" | "zip";

export const CATEGORIES: { id: CategoryId; label: string; tagline: string; description: string }[] = [
  { id: "core", label: "Core Computer Science", tagline: "The backbone of the degree", description: "Programming, data structures, algorithms, systems, databases, networks, AI and software engineering: the spine of CSE." },
  { id: "electives", label: "Electives", tagline: "Go deep, go specialized", description: "Image processing, NLP, machine learning and data communications: advanced tracks that shape your specialization." },
  { id: "math", label: "Mathematics & Science", tagline: "The rigorous foundation", description: "Calculus, linear algebra, differential equations, physics and statistics: the language underneath the code." },
  { id: "gened", label: "General Education", tagline: "Breadth across five streams", description: "Writing, science, arts & humanities, social science and community: the well-rounded core of the curriculum." },
];

export const COURSE_LIST: { code: string; title: string; category: CategoryId }[] = [
  { code: "CSE110", title: "Programming Language I", category: "core" },
  { code: "CSE111", title: "Programming Language II", category: "core" },
  { code: "CSE220", title: "Data Structures", category: "core" },
  { code: "CSE221", title: "Algorithms", category: "core" },
  { code: "CSE230", title: "Discrete Mathematics", category: "core" },
  { code: "CSE260", title: "Digital Logic Design", category: "core" },
  { code: "CSE321", title: "Operating Systems", category: "core" },
  { code: "CSE330", title: "Numerical Methods", category: "core" },
  { code: "CSE331", title: "Automata & Computability", category: "core" },
  { code: "CSE340", title: "Computer Architecture", category: "core" },
  { code: "CSE370", title: "Database Systems", category: "core" },
  { code: "CSE400", title: "Project & Thesis", category: "core" },
  { code: "CSE420", title: "Compiler Design", category: "core" },
  { code: "CSE421", title: "Computer Networks", category: "core" },
  { code: "CSE422", title: "Artificial Intelligence", category: "core" },
  { code: "CSE423", title: "Computer Graphics", category: "core" },
  { code: "CSE470", title: "Software Engineering", category: "core" },
  { code: "CSE320", title: "Data Communications", category: "electives" },
  { code: "CSE428", title: "Digital Image Processing", category: "electives" },
  { code: "CSE437", title: "Data Science", category: "electives" },
  { code: "CSE440", title: "Natural Language Processing", category: "electives" },
  { code: "CSE471", title: "System Analysis and Design", category: "electives" },
  { code: "CSE489", title: "Mobile Application Development", category: "electives" },
  { code: "MAT110", title: "Mathematics I: Calculus", category: "math" },
  { code: "MAT120", title: "Mathematics II: Calculus", category: "math" },
  { code: "MAT215", title: "Differential Equations", category: "math" },
  { code: "MAT216", title: "Linear Algebra", category: "math" },
  { code: "PHY111", title: "Physics I", category: "math" },
  { code: "PHY112", title: "Physics II", category: "math" },
  { code: "STA201", title: "Statistics & Probability", category: "math" },
  { code: "ENG101", title: "English Fundamentals", category: "gened" },
  { code: "ENG115", title: "English Composition", category: "gened" },
  { code: "CHE101", title: "Introduction to Chemistry", category: "gened" },
  { code: "BNG103", title: "Bangla Language & Literature", category: "gened" },
  { code: "HUM103", title: "Ethics & Culture", category: "gened" },
  { code: "ANT101", title: "Introduction to Anthropology", category: "gened" },
  { code: "BUS201", title: "Introduction to Business", category: "gened" },
  { code: "ECO101", title: "Introduction to Microeconomics", category: "gened" },
  { code: "EMB101", title: "Emergence of Bangladesh", category: "gened" },
  { code: "CST333", title: "Personal Finance for Sustainable Economic Wellbeing", category: "gened" },
];

export const FILE_TYPES: FileType[] = ["Notes", "Slides", "Assignments", "Questions", "Solutions", "Projects"];
const SEMESTERS = ["Spring", "Summer", "Fall"];
const TOPICS: Record<CategoryId, { topics: string[]; tags: string[] }> = {
  core: { topics: ["Recursion", "Graphs", "Dynamic Programming", "Pointers", "Concurrency", "Indexing", "Normalization", "Routing", "Inheritance", "Scheduling"], tags: ["algorithms", "data-structures", "systems", "oop", "databases"] },
  electives: { topics: ["Convolution", "Tokenization", "Embeddings", "Segmentation", "Protocols", "Regression"], tags: ["ml", "nlp", "vision", "networks", "data-science"] },
  math: { topics: ["Limits", "Integration", "Eigenvalues", "Probability", "Vectors", "Series"], tags: ["calculus", "linear-algebra", "statistics", "physics"] },
  gened: { topics: ["Composition", "Ethics", "Microeconomics", "Civilization", "Anthropology"], tags: ["writing", "society", "humanities", "business"] },
};

export interface VaultFile {
  id: string;
  title: string;
  course: string;
  courseTitle: string;
  category: CategoryId;
  type: FileType;
  semester: string;
  year: number;
  format: FileFormat;
  tags: string[];
  size: string;
  popularity: number;
}

export interface Course {
  code: string;
  title: string;
  category: CategoryId;
  files: VaultFile[];
  counts: Record<FileType, number>;
  fileCount: number;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(code: string) {
  let r = hash(code);
  return () => {
    r |= 0;
    let e = Math.imul((r = (r + 1831565813) | 0) ^ (r >>> 15), 1 | r);
    return (((e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e) ^ (e >>> 14)) >>> 0) / 4294967296;
  };
}

function fileTitle(type: FileType, n: number, topic: string, sem: string, year: number, rnd: () => number) {
  switch (type) {
    case "Notes": return rnd() < 0.5 ? `Lecture ${n} · ${topic}` : `${topic} · Notes`;
    case "Slides": return rnd() < 0.5 ? `Week ${n} Slides` : `${topic} Slides`;
    case "Assignments": return `Assignment ${n} · ${topic}`;
    case "Questions": return `${sem} ${year} ${rnd() < 0.5 ? "Midterm" : "Final"}`;
    case "Solutions": return rnd() < 0.5 ? `Lab ${n} Solution` : `Assignment ${n} Solution`;
    case "Projects": return `Project · ${topic}`;
  }
}

function fileFormat(type: FileType, rnd: () => number): FileFormat {
  switch (type) {
    case "Slides": return "pptx";
    case "Questions": return "pdf";
    case "Notes": return rnd() < 0.82 ? "pdf" : "ipynb";
    case "Assignments": return rnd() < 0.6 ? "pdf" : "docx";
    case "Solutions": return rnd() < 0.6 ? "ipynb" : "code";
    case "Projects": return rnd() < 0.6 ? "zip" : "code";
  }
}

function fileSize(format: FileFormat, rnd: () => number) {
  const mb = (a: number, b: number) => (a + rnd() * (b - a)).toFixed(1) + " MB";
  const kb = (a: number, b: number) => Math.round(a + rnd() * (b - a)) + " KB";
  switch (format) {
    case "pptx": return mb(2, 24);
    case "pdf": return rnd() < 0.5 ? kb(180, 980) : mb(1, 8);
    case "zip": return mb(5, 60);
    case "ipynb": return kb(40, 800);
    case "docx": return kb(60, 700);
    case "code": return kb(2, 120);
  }
}

function buildFiles(code: string, title: string, category: CategoryId): VaultFile[] {
  const rnd = seeded(code);
  const t = TOPICS[category];
  const counts: Record<FileType, number> = {
    Notes: 3 + Math.floor(4 * rnd()),
    Slides: 2 + Math.floor(4 * rnd()),
    Assignments: Math.floor(4 * rnd()),
    Questions: 2 + Math.floor(6 * rnd()),
    Solutions: Math.floor(3 * rnd()),
    Projects: Math.floor(3 * rnd()),
  };
  if (category === "core") { counts.Projects += 1; counts.Assignments += 1; }
  if (category === "math") { counts.Notes += 2; counts.Projects = Math.max(0, counts.Projects - 1); }
  if (category === "gened") counts.Slides += 1;

  const files: VaultFile[] = [];
  for (const type of FILE_TYPES) {
    for (let n = 0; n < counts[type]; n++) {
      const semester = SEMESTERS[Math.floor(rnd() * SEMESTERS.length)]!;
      const year = 2021 + Math.floor(4 * rnd());
      const topic = t.topics[Math.floor(rnd() * t.topics.length)]!;
      const ftitle = fileTitle(type, n + 1, topic, semester, year, rnd);
      const format = fileFormat(type, rnd);
      const tags = Array.from(new Set([type.toLowerCase(), topic.toLowerCase().replace(/\s+/g, "-"), t.tags[Math.floor(rnd() * t.tags.length)]!]));
      files.push({
        id: `${code}-${type}-${n + 1}`.replace(/\s+/g, ""),
        title: ftitle,
        course: code,
        courseTitle: title,
        category,
        type,
        semester,
        year,
        format,
        tags,
        size: fileSize(format, rnd),
        popularity: Math.floor(100 * rnd()),
      });
    }
  }
  return files.sort((a, b) => b.popularity - a.popularity);
}

export const COURSES: Course[] = COURSE_LIST.map((c) => {
  const files = buildFiles(c.code, c.title, c.category);
  const counts = FILE_TYPES.reduce((acc, t) => {
    acc[t] = files.filter((f) => f.type === t).length;
    return acc;
  }, {} as Record<FileType, number>);
  return { ...c, files, counts, fileCount: files.length };
});

export const ALL_FILES: VaultFile[] = COURSES.flatMap((c) => c.files);

const norm = (s: string) => s.toLowerCase().replace(/[\s-]+/g, "");
export function findCourse(code: string): Course | null {
  const n = norm(code);
  return COURSES.find((c) => norm(c.code) === n) ?? null;
}
export function findFile(id: string): VaultFile | null {
  return ALL_FILES.find((f) => f.id === id) ?? null;
}
export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

/* ---------- Orbit layout ---------- */
export const RING_ORDER: CategoryId[] = ["core", "math", "electives", "gened"];
export const RING_RADIUS: Record<CategoryId, number> = { core: 3.8, math: 6, electives: 7.9, gened: 9.6 };
export const RING_COLOR: Record<CategoryId, string> = { core: "#C17A2B", math: "#6F7A52", electives: "#A0633D", gened: "#C2A878" };

export interface OrbitNode {
  code: string;
  title: string;
  category: CategoryId;
  fileCount: number;
  tags: string[];
  ringIndex: number;
  radius: number;
  angle: number;
  color: string;
  x: number;
  z: number;
}
export interface OrbitRing { category: CategoryId; label: string; radius: number; color: string; count: number }
export interface OrbitData { rings: OrbitRing[]; nodes: OrbitNode[]; maxRadius: number }

export function buildOrbit(): OrbitData {
  const rings: OrbitRing[] = [];
  const nodes: OrbitNode[] = [];
  RING_ORDER.forEach((cat, ringIndex) => {
    const list = COURSES.filter((c) => c.category === cat);
    const radius = RING_RADIUS[cat];
    const color = RING_COLOR[cat];
    rings.push({ category: cat, label: categoryLabel(cat), radius, color, count: list.length });
    const m = Math.max(1, list.length);
    list.forEach((c, n) => {
      const angle = (n / m) * Math.PI * 2 + 0.5 * ringIndex;
      const tagCounts = new Map<string, number>();
      for (const f of c.files) for (const t of f.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
      const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map((e) => e[0]);
      nodes.push({ code: c.code, title: c.title, category: cat, fileCount: c.fileCount, tags, ringIndex, radius, angle, color, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius });
    });
  });
  return { rings, nodes, maxRadius: RING_RADIUS.gened };
}

/* ---------- Fuzzy search ---------- */
export function fuzzyScore(query: string, text: string) {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;
  let pos = 0, score = 0, streak = 0, first = -1;
  for (let i = 0; i < q.length; i++) {
    const ch = q[i]!;
    let found = -1;
    for (let j = pos; j < t.length; j++) if (t[j] === ch) { found = j; break; }
    if (found === -1) return -1;
    if (first < 0) first = found;
    if (found === pos) score += 6 + ++streak;
    else {
      streak = 0;
      score += 1;
      if (t[found - 1] === " " || t[found - 1] === "-") score += 4;
    }
    pos = found + 1;
  }
  return score + Math.max(0, 12 - first);
}

export function highlightParts(text: string, query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx >= 0)
    return [
      { text: text.slice(0, idx), match: false },
      { text: text.slice(idx, idx + q.length), match: true },
      { text: text.slice(idx + q.length), match: false },
    ].filter((p) => p.text.length > 0);
  const out: { text: string; match: boolean }[] = [];
  let qi = 0, plain = "", hit = "";
  for (let i = 0; i < text.length; i++) {
    if (qi < q.length && lower[i] === q[qi]) {
      if (plain) { out.push({ text: plain, match: false }); plain = ""; }
      hit += text[i];
      qi++;
    } else {
      if (hit) { out.push({ text: hit, match: true }); hit = ""; }
      plain += text[i];
    }
  }
  if (hit) out.push({ text: hit, match: true });
  if (plain) out.push({ text: plain, match: false });
  return out;
}
