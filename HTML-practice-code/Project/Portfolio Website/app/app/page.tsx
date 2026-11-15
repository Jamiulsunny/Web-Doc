'use client';

import React, { useState, useEffect, useId } from 'react';
import {
  Code,
  Layout,
  Server,
  Database,
  Terminal,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  X,
  Menu,
  ChevronRight,
  Download,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Loader2,
  Cpu,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

/* =========================================================================
   TYPE DEFINITIONS & DATA SCHEMAS
   ========================================================================= */

export type ProjectCategory = 'All' | 'Full-Stack' | 'Web' | 'AI' | 'Software';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  metrics: string;
}

export interface SkillGroup {
  category: string;
  icon: React.ElementType;
  skills: { name: string; level: string; desc: string }[];
}

export interface TimelineItem {
  period: string;
  role: string;
  organization: string;
  location: string;
  responsibilities: string[];
  technologies: string[];
}

export interface AchievementItem {
  year: string;
  title: string;
  issuer: string;
  description: string;
  tag: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  benefits: string[];
  tech: string[];
}

/* =========================================================================
   STRUCTURED PORTFOLIO DATA (PLACEHOLDERS READY FOR PRODUCTION REPLACEMENT)
   ========================================================================= */

const PROFILE_DATA = {
  name: '[YOUR NAME]',
  title: 'Senior Full-Stack Software Engineer & Product Architect',
  tagline: 'Designing & building scalable digital systems with clean engineering, intuitive UX, and uncompromising craft.',
  location: '[YOUR LOCATION, e.g., San Francisco, CA / Remote]',
  email: 'contact@yourdomain.com',
  github: 'https://github.com/[YOUR_GITHUB]',
  linkedin: 'https://linkedin.com/in/[YOUR_LINKEDIN]',
  stats: [
    { label: 'Years Experience', value: '6+' },
    { label: 'Production Systems', value: '24+' },
    { label: 'System Uptime SLA', value: '99.98%' },
    { label: 'Code Review Score', value: '100%' },
  ],
  bioParagraphs: [
    'I am an engineer and designer with an obsession for high-performance software and tactile, accessible user interfaces. Bridging the gap between strict distributed systems and refined front-end craftsmanship, I take products from zero to scaled production.',
    'Over the course of my career, I have architected cloud infrastructure, engineered design systems adopted across multi-disciplinary teams, and shipped resilient applications handling millions of operations. My core philosophy is simple: write maintainable code, respect user attention, and prioritize latency and reliability above all.'
  ]
};

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Frontend Engineering',
    icon: Layout,
    skills: [
      { name: 'TypeScript / JavaScript', level: 'Advanced', desc: 'Strict mode, AST, generics, modern ES2024' },
      { name: 'React / Next.js', level: 'Advanced', desc: 'App Router, RSC, SSR/SSG, Suspense, state engines' },
      { name: 'Tailwind CSS', level: 'Expert', desc: 'Design systems, tokens, responsive ergonomics' },
      { name: 'Web Performance & Accessibility', level: 'Advanced', desc: 'Core Web Vitals, WCAG 2.1 AAA, ARIA, bundle trees' }
    ]
  },
  {
    category: 'Backend & Distributed Systems',
    icon: Server,
    skills: [
      { name: 'Node.js & Express', level: 'Advanced', desc: 'Event loop tuning, async streaming, microservices' },
      { name: 'Python / FastAPI / Java', level: 'Proficient', desc: 'High-throughput APIs, concurrency, OOP patterns' },
      { name: 'REST & GraphQL APIs', level: 'Advanced', desc: 'Contract-first design, rate-limiting, idempotency' },
      { name: 'Authentication & Security', level: 'Advanced', desc: 'OAuth 2.0, JWT, RBAC, CSRF/XSS mitigation' }
    ]
  },
  {
    category: 'Database & Data Modeling',
    icon: Database,
    skills: [
      { name: 'PostgreSQL', level: 'Advanced', desc: 'Schema design, indexing strategies, EXPLAIN ANALYZE' },
      { name: 'Redis', level: 'Advanced', desc: 'Distributed caching, pub/sub, rate limiters, session stores' },
      { name: 'MongoDB / Document Stores', level: 'Proficient', desc: 'Aggregation pipelines, horizontal sharding' },
      { name: 'Prisma / Drizzle ORM', level: 'Advanced', desc: 'Type-safe querying, zero-downtime migrations' }
    ]
  },
  {
    category: 'DevOps, Cloud & Architecture',
    icon: Terminal,
    skills: [
      { name: 'Docker & Containerization', level: 'Proficient', desc: 'Multi-stage builds, Alpine optimizations, networks' },
      { name: 'CI/CD Pipelines', level: 'Advanced', desc: 'GitHub Actions, automated quality gates, linting' },
      { name: 'Git & Linux Systems', level: 'Advanced', desc: 'Kernel primitives, shell automation, rebasing' },
      { name: 'AWS & Edge Infrastructure', level: 'Proficient', desc: 'S3, CloudFront, Lambda@Edge, Cloudflare Workers' }
    ]
  }
];

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-1',
    title: '[ENTERPRISE OBSERVABILITY PLATFORM]',
    category: 'Full-Stack',
    tagline: 'Real-time telemetry and metric processing dashboard with sub-50ms query response.',
    problem: 'DevOps engineers lacked unified tracing across hybrid microservices, resulting in 45-minute average root cause discovery times during incident surges.',
    solution: 'Designed an asynchronous ingestion pipeline paired with an interactive canvas dashboard that correlates latency spikes with live container logs.',
    features: [
      'Streaming analytics engine handling 15,000 events/sec via WebSocket connections',
      'Configurable dynamic alert thresholds with immediate webhook triggers',
      'Zero-layout-shift UI built with optimized virtualized data grids',
      'Comprehensive audit logging and role-based permissions'
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/[YOUR_GITHUB]/observability-platform',
    liveUrl: 'https://example.com/demo-observability',
    metrics: '70% reduction in MTTR across pilot infrastructure teams'
  },
  {
    id: 'proj-2',
    title: '[AUTONOMOUS CODE REVIEW AGENT]',
    category: 'AI',
    tagline: 'Automated static analysis and contextual pull-request security scanner powered by LLMs.',
    problem: 'Engineering teams spent 18+ developer hours weekly performing boilerplate style reviews and catching basic OWASP security discrepancies.',
    solution: 'Engineered an asynchronous GitHub bot combining AST parsing with quantized semantic embeddings to deliver verified, non-hallucinated security patches.',
    features: [
      'AST-based differential context builder to minimize token cost by 65%',
      'Detects SQL injection, hard-coded credentials, and prototype pollution',
      'Interactive inline commentary with one-click automated fix proposals',
      'Local model fallback support using Ollama & vLLM'
    ],
    techStack: ['TypeScript', 'Python', 'FastAPI', 'Vector DB', 'GitHub Webhooks', 'Docker'],
    githubUrl: 'https://github.com/[YOUR_GITHUB]/ai-security-agent',
    liveUrl: 'https://example.com/demo-security-agent',
    metrics: '94% developer acceptance rate on automated suggestions'
  },
  {
    id: 'proj-3',
    title: '[COLLABORATIVE DESIGN CANVAS]',
    category: 'Web',
    tagline: 'Infinite whiteboard with real-time cursor replication and vector manipulation.',
    problem: 'Remote distributed product teams needed a zero-latency diagramming environment capable of running smoothly on low-spec hardware.',
    solution: 'Constructed an HTML5 Canvas-backed rendering engine using Conflict-Free Replicated Data Types (CRDTs) over WebRTC mesh networks.',
    features: [
      '60 FPS hardware-accelerated canvas rendering under 2,000+ simultaneous nodes',
      'CRDT-backed conflict resolution ensuring zero lost user edits',
      'Offline-first caching with automatic sync reconciliation',
      'Export support for high-res vector SVG, PDF, and PNG formats'
    ],
    techStack: ['React', 'TypeScript', 'WebRTC', 'Canvas API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/[YOUR_GITHUB]/collaborative-canvas',
    liveUrl: 'https://example.com/demo-canvas',
    metrics: '< 16ms render loop execution time at scale'
  },
  {
    id: 'proj-4',
    title: '[HIGH-PERFORMANCE KV STORAGE ENGINE]',
    category: 'Software',
    tagline: 'Log-Structured Merge-tree (LSM) embedded key-value storage engine in Java/Go.',
    problem: 'Standard relational solutions imposed prohibitive write-amplification penalties on write-intensive event recording engines.',
    solution: 'Implemented an LSM-tree architecture featuring write-ahead logging (WAL), memory tables, and periodic background SSTable compaction.',
    features: [
      'MemTable implementation using concurrent lock-free skip lists',
      'Bloom filters on SSTables reducing redundant disk lookups by 88%',
      'Crash recovery guarantee via sequential zero-allocation WAL logs',
      'Configurable flush thresholds and tier-compacted disk levels'
    ],
    techStack: ['Java', 'C-Bindings', 'Linux System Calls', 'Benchmarking Tooling'],
    githubUrl: 'https://github.com/[YOUR_GITHUB]/lsm-kv-store',
    liveUrl: 'https://example.com/demo-kv-bench',
    metrics: '120k write IOPS on commodity NVMe hardware'
  }
];

const EXPERIENCE_DATA: TimelineItem[] = [
  {
    period: '2023 — Present',
    role: 'Senior Full-Stack Engineer',
    organization: '[PREMIER TECH FIRM / STARTUP]',
    location: 'San Francisco, CA (Hybrid)',
    responsibilities: [
      'Spearheaded the redesign and migration of core micro-frontends to Next.js and TypeScript, elevating Lighthouse performance scores from 64 to 98.',
      'Architected event-driven microservices serving 4M+ daily active sessions with strict adherence to 99.99% availability targets.',
      'Mentored 6 junior/mid-level engineers, instituted automated CI testing pipelines, and drove unit test coverage from 52% to 89%.'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
  },
  {
    period: '2021 — 2023',
    role: 'Full-Stack Software Developer',
    organization: '[INNOVATIVE DIGITAL LABS]',
    location: 'Remote',
    responsibilities: [
      'Engineered customer-facing web applications, payment checkout pipelines (Stripe/PayPal), and internal admin analytics dashboards.',
      'Formulated normalized PostgreSQL database models and implemented multi-tier Redis caching to diminish endpoint latency by 45%.',
      'Collaborated directly with UI/UX leads to build an accessible, reusable component library conforming to WCAG 2.1 guidelines.'
    ],
    technologies: ['TypeScript', 'React', 'Express', 'Redis', 'PostgreSQL', 'Tailwind CSS']
  },
  {
    period: '2019 — 2021',
    role: 'Associate Software Engineer',
    organization: '[ENTERPRISE SOFTWARE SYSTEMS]',
    location: 'Austin, TX',
    responsibilities: [
      'Developed and maintained RESTful services, automated data ETL routines, and fixed critical client integration bottlenecks.',
      'Refactored legacy monolithic endpoints into decoupled REST services, eliminating recurring system memory leaks.'
    ],
    technologies: ['Java', 'Spring Boot', 'MySQL', 'JavaScript', 'HTML5/CSS3']
  }
];

const EDUCATION_DATA = [
  {
    period: '2015 — 2019',
    degree: 'Bachelor of Science in Computer Science',
    institution: '[TOP TIER UNIVERSITY / INSTITUTION]',
    location: '[CITY, COUNTRY]',
    details: 'Graduated with Honors. Core coursework: Distributed Systems, Advanced Algorithms & Data Structures, Database Systems, Computer Networks, Human-Computer Interaction.'
  }
];

const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    year: '2024',
    title: 'First Place Winner — Global Enterprise Hackathon',
    issuer: 'Major Tech Foundation',
    description: 'Constructed an open-source zero-latency peer-to-peer code review terminal used by over 2,000 developers during the competition.',
    tag: 'Award'
  },
  {
    year: '2023',
    title: 'AWS Certified Solutions Architect — Professional',
    issuer: 'Amazon Web Services',
    description: 'Validated mastery in designing distributed systems, cost optimization, fault-tolerant architectures, and cloud networking security.',
    tag: 'Certification'
  },
  {
    year: '2022',
    title: 'Top Contributor & Speaker',
    issuer: 'Regional Web Architecture Summit',
    description: 'Delivered an analytical deep-dive into browser render pipelines, microtask queues, and sub-second React UI optimization.',
    tag: 'Community'
  }
];

const SERVICES_DATA: ServiceItem[] = [
  {
    title: 'Full-Stack Web Architecture',
    description: 'End-to-end engineered web platforms constructed with scalable server infrastructure and pixel-perfect front-ends.',
    benefits: ['Zero-downtime deployment pipelines', 'Scalable component design systems', 'Sub-second page rendering'],
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS']
  },
  {
    title: 'API & Microservice Engineering',
    description: 'Robust, self-documenting REST & GraphQL endpoints equipped with caching, rate limiting, and bulletproof security.',
    benefits: ['Sub-50ms response benchmarks', 'Clean OpenAPI / Swagger specs', 'Idempotent transaction patterns'],
    tech: ['PostgreSQL', 'Redis', 'Docker', 'FastAPI', 'Express']
  },
  {
    title: 'UI/UX Design Systems & Audits',
    description: 'Transforming complex product workflows into clean, accessible, and high-conversion design systems.',
    benefits: ['Full WCAG 2.1 AA/AAA compliance', 'Figma to token-based code alignment', 'Fluid responsive layout guarantees'],
    tech: ['Figma', 'Accessible Semantics', 'Micro-interactions', 'Design Tokens']
  }
];

const PHILOSOPHIES = [
  {
    title: 'Craft Over Hype',
    description: 'Technologies come and go. I focus on fundamentals: algorithms, network latency, data consistency, and clean separation of concerns.'
  },
  {
    title: 'User-Centered Performance',
    description: 'Performance is UX. Every kilobyte, layout shift, and blocking query directly impacts human productivity and trust.'
  },
  {
    title: 'Bulletproof Reliability',
    description: 'Errors are not anomalies; they are expected states. Resilient code gracefully degrades, reports actionable telemetry, and never leaves users stranded.'
  }
];

/* =========================================================================
   SUB-COMPONENTS: HEADER & NAVIGATION
   ========================================================================= */

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'services', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-[#222222] py-3.5 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 text-white font-mono font-bold text-lg tracking-wider focus:outline-none"
          aria-label="Portfolio Home"
        >
          <span className="w-8 h-8 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-center text-[#36EF10] font-black group-hover:border-[#36EF10] transition-colors">
            &gt;_
          </span>
          <span className="tracking-tight">
            SYSTEM<span className="text-[#36EF10]">.DEV</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111111]/80 border border-[#222222] rounded-full px-4 py-1.5 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3.5 py-1.5 text-xs uppercase font-mono tracking-wider rounded-full transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-[#1e1e1e] text-[#36EF10] font-semibold border border-[#36EF10]/30 shadow-[0_0_12px_rgba(54,239,16,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#181818]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider text-black bg-[#36EF10] hover:bg-[#2fe00c] rounded-md transition-all shadow-[0_0_18px_rgba(54,239,16,0.25)] hover:shadow-[0_0_24px_rgba(54,239,16,0.45)] transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-[#141414] border border-[#242424] text-gray-300 hover:text-white hover:border-[#36EF10] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5 text-[#36EF10]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0c0c0c] border-b border-[#222222] px-6 py-6 transition-all duration-300 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 text-sm font-mono tracking-wide transition-colors flex items-center justify-between border-b border-[#1c1c1c] ${
                  activeSection === link.id ? 'text-[#36EF10] font-semibold' : 'text-gray-300 hover:text-[#36EF10]'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#36EF10] rounded-md"
            >
              Get In Touch
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* =========================================================================
   SUB-COMPONENTS: HERO SECTION
   ========================================================================= */

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-36 pb-20 flex flex-col justify-center overflow-hidden border-b border-[#1a1a1a]"
    >
      {/* Decorative Grid Mesh & Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#222222 1px, transparent 1px), linear-gradient(to bottom, rgba(8,8,8,0) 0%, #080808 100%)',
          backgroundSize: '32px 32px, 100% 100%',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[#36EF10]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-[#242424] text-xs font-mono text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#36EF10] animate-pulse" />
          <span className="text-gray-300">Available for Contract & Senior Engineering Roles</span>
        </div>

        {/* Main Pitch */}
        <div className="max-w-4xl">
          <p className="font-mono text-xs sm:text-sm text-[#36EF10] tracking-widest uppercase mb-3 font-semibold">
            Hello, World — I Am
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            {PROFILE_DATA.name}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 text-3xl sm:text-5xl lg:text-5xl font-bold mt-2">
              {PROFILE_DATA.title}
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-400 leading-relaxed max-w-2xl mb-10">
            {PROFILE_DATA.tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#36EF10] text-black font-mono font-bold text-sm tracking-wide hover:bg-[#2ee00c] transition-all shadow-[0_0_24px_rgba(54,239,16,0.3)] hover:shadow-[0_0_32px_rgba(54,239,16,0.5)] transform hover:-translate-y-0.5"
            >
              <span>Explore Featured Systems</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#121212] text-white border border-[#292929] font-mono text-sm tracking-wide hover:border-[#36EF10] hover:bg-[#181818] transition-all"
            >
              <Mail className="w-4 h-4 text-[#36EF10]" />
              <span>Initiate Contact</span>
            </a>

            <a
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                alert('Place your verified PDF resume file in the public folder and update this download link.');
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#121212] text-gray-300 border border-[#222222] font-mono text-sm tracking-wide hover:text-white hover:border-gray-500 transition-all"
              title="Download Verified Curriculum Vitae"
            >
              <Download className="w-4 h-4 text-gray-400" />
              <span>Resume (PDF)</span>
            </a>
          </div>
        </div>

        {/* Micro Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#1c1c1c]">
          {PROFILE_DATA.stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0f0f0f] border border-[#1e1e1e]">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white flex items-center gap-1.5">
                <span className="text-[#36EF10] font-normal text-lg">#</span>
                {stat.value}
              </div>
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: ABOUT SECTION
   ========================================================================= */

function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#080808] border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-[#36EF10]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#36EF10] font-semibold">01. Architecture & Background</h2>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-white mb-12 tracking-tight">
          Engineering with Intentionality & Discipline.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Meta Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#111111] border border-[#222222] p-4 overflow-hidden group">
              <div className="relative w-full aspect-square rounded-xl bg-[#161616] border border-[#262626] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                {/* Visual Placeholder for Engineer Avatar */}
                <div className="w-28 h-28 rounded-full bg-[#202020] border-2 border-[#36EF10]/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Cpu className="w-12 h-12 text-[#36EF10]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{PROFILE_DATA.name}</h3>
                <p className="text-xs font-mono text-gray-400 mb-4">{PROFILE_DATA.location}</p>

                <div className="w-full pt-4 border-t border-[#222222] flex justify-center gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36EF10]" /> Status: Active
                  </span>
                  <span>|</span>
                  <span>UTC-8 / Flexible</span>
                </div>
              </div>

              {/* Terminal-style metadata block */}
              <div className="mt-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1c1c1c] font-mono text-xs text-gray-400 space-y-1.5">
                <div className="text-gray-500">// System Profile Attributes</div>
                <div><span className="text-gray-300">Specialization:</span> Scalable Platforms & High UX Fidelity</div>
                <div><span className="text-gray-300">Primary Language:</span> TypeScript, Python, Java, SQL</div>
                <div><span className="text-gray-300">Methodology:</span> Clean Code, TDD, Modular Architecture</div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Principles */}
          <div className="lg:col-span-7 space-y-6 text-gray-300 leading-relaxed text-base">
            {PROFILE_DATA.bioParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#111111] border border-[#1e1e1e]">
                <h4 className="font-mono text-xs text-[#36EF10] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#36EF10]" /> Code Integrity
                </h4>
                <p className="text-xs text-gray-400 leading-normal">
                  Strict type coverage, automated CI linting, end-to-end testing, and zero tolerance for fragile shortcuts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111111] border border-[#1e1e1e]">
                <h4 className="font-mono text-xs text-[#36EF10] font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#36EF10]" /> System Scalability
                </h4>
                <p className="text-xs text-gray-400 leading-normal">
                  Designing database schemas, caching policies, and stateless nodes capable of handling surge workloads seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: SKILLS & TECHNOLOGIES
   ========================================================================= */

function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-[#0a0a0a] border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-[#36EF10]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#36EF10] font-semibold">02. Technical Arsenal</h2>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          Tools, Frameworks & Deep Competencies.
        </p>
        <p className="text-sm text-gray-400 max-w-2xl mb-12">
          Verified practical mastery across modern application layers. No decorative percentage bars; only competencies deployed in live client and enterprise environments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_GROUPS.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#111111] border border-[#222222] p-6 hover:border-[#36EF10]/40 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1c1c1c]">
                  <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center text-[#36EF10]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg tracking-wide">{group.category}</h3>
                </div>

                <div className="space-y-4">
                  {group.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-[#0c0c0c] border border-[#1a1a1a] flex flex-col gap-1 hover:border-[#282828] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white tracking-wide">{skill.name}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#161616] text-[#36EF10] border border-[#36EF10]/30 font-medium">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{skill.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: PROJECTS SHOWCASE & CASE STUDY MODAL
   ========================================================================= */

function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories: ProjectCategory[] = ['All', 'Full-Stack', 'Web', 'AI', 'Software'];

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 bg-[#080808] border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#36EF10]" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#36EF10] font-semibold">03. Selected Works</h2>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production Systems & Case Studies.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#36EF10] text-black font-bold shadow-[0_0_12px_rgba(54,239,16,0.3)]'
                    : 'bg-[#121212] text-gray-400 border border-[#222222] hover:text-white hover:border-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-[#101010] border border-[#222222] overflow-hidden hover:border-[#36EF10]/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Visual Card Banner */}
              <div className="relative h-52 bg-[#151515] border-b border-[#1f1f1f] p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#36EF10]/5 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between z-10">
                  <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#0a0a0a]/80 text-[#36EF10] border border-[#36EF10]/20 font-semibold">
                    {project.category}
                  </span>
                  <div className="flex gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md bg-[#0d0d0d] text-gray-400 hover:text-white hover:border-[#36EF10] transition-colors"
                      aria-label={`${project.title} GitHub repository`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md bg-[#0d0d0d] text-gray-400 hover:text-white hover:border-[#36EF10] transition-colors"
                      aria-label={`${project.title} Live URL`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Abstract Visual Wireframe Representation */}
                <div className="z-10 mt-auto">
                  <div className="font-mono text-xs text-gray-500 mb-1">// System Metric</div>
                  <div className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#36EF10]" />
                    {project.metrics}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#36EF10] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 text-[11px] font-mono rounded bg-[#181818] text-gray-300 border border-[#262626]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] text-white border border-[#262626] hover:border-[#36EF10] font-mono text-xs uppercase tracking-wider font-semibold transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-[#36EF10]" />
                  <span>Inspect Case Study</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Full Modal Dialog */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e0e0e] border border-[#2a2a2a] p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalProject(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-[#181818] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#36EF10] transition-colors"
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-12 mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#36EF10] font-semibold">
                Architecture Breakdown • {activeModalProject.category}
              </span>
              <h3 id="modal-title" className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {activeModalProject.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2 font-mono">
                {activeModalProject.tagline}
              </p>
            </div>

            {/* Case Study Pillars */}
            <div className="space-y-6 text-sm text-gray-300">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#222222]">
                <h4 className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold mb-1">
                  [The Challenge / Problem]
                </h4>
                <p className="leading-relaxed">{activeModalProject.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222222]">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#36EF10] font-bold mb-1">
                  [Engineered Solution]
                </h4>
                <p className="leading-relaxed">{activeModalProject.solution}</p>
              </div>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-300 font-bold mb-3">
                  Key Technical Features & Benchmarks
                </h4>
                <ul className="space-y-2">
                  {activeModalProject.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <span className="text-[#36EF10] font-bold mt-0.5">•</span>
                      <span className="text-gray-300 text-xs sm:text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Applied */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-300 font-bold mb-2">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded bg-[#1a1a1a] text-gray-200 border border-[#2a2a2a] text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* External CTA Links */}
              <div className="pt-6 border-t border-[#222222] flex flex-wrap gap-4">
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#36EF10] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#2fe00c] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live System</span>
                </a>
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#181818] text-white border border-[#2c2c2c] font-mono text-xs uppercase tracking-wider hover:border-[#36EF10] transition-colors"
                >
                  <Github className="w-4 h-4 text-gray-300" />
                  <span>Source Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: EXPERIENCE & EDUCATION TIMELINES
   ========================================================================= */

function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-[#0a0a0a] border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-[#36EF10]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#36EF10] font-semibold">04. Trajectory & Track Record</h2>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-white mb-12 tracking-tight">
          Professional Work Experience & Education.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Work History */}
          <div className="lg:col-span-8">
            <h3 className="font-mono text-sm uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#36EF10]" /> Career Experience
            </h3>

            <div className="relative border-l border-[#222222] ml-3 sm:ml-4 space-y-10">
              {EXPERIENCE_DATA.map((item, idx) => (
                <div key={idx} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#1c1c1c] border border-gray-600 group-hover:border-[#36EF10] group-hover:bg-[#36EF10] transition-colors duration-200" />

                  <div className="p-6 rounded-2xl bg-[#111111] border border-[#202020] hover:border-[#2a2a2a] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="text-lg font-bold text-white tracking-wide">{item.role}</h4>
                      <span className="font-mono text-xs text-[#36EF10] font-semibold">{item.period}</span>
                    </div>

                    <div className="text-xs font-mono text-gray-400 mb-4">
                      {item.organization} • {item.location}
                    </div>

                    <ul className="space-y-2 mb-5">
                      {item.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="text-xs sm:text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-[#36EF10] font-mono leading-none mt-1">›</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1c1c1c]">
                      {item.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#161616] text-gray-400 border border-[#222222]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Rigor */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="font-mono text-sm uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#36EF10]" /> Academic Education
              </h3>

              <div className="space-y-6">
                {EDUCATION_DATA.map((edu, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#111111] border border-[#202020]">
                    <span className="font-mono text-xs text-[#36EF10] font-semibold">{edu.period}</span>
                    <h4 className="text-base font-bold text-white mt-1">{edu.degree}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-1 mb-3">{edu.institution}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Snippet Box */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#202020]">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#36EF10] font-bold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#36EF10]" /> Milestones & Certs
              </h4>
              <div className="space-y-4">
                {ACHIEVEMENTS_DATA.map((ach, idx) => (
                  <div key={idx} className="border-b border-[#1c1c1c] pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-white">{ach.title}</span>
                      <span className="font-mono text-[10px] text-gray-500">{ach.year}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: SERVICES & PHILOSOPHY
   ========================================================================= */

function ServicesAndPhilosophySection() {
  return (
    <section id="services" className="py-24 bg-[#080808] border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-[#36EF10]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#36EF10] font-semibold">05. Client Solutions & Principles</h2>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          High-Leverage Engineering Capabilities.
        </p>
        <p className="text-sm text-gray-400 max-w-2xl mb-12">
          Tailored technical capabilities delivered to early-stage ventures and enterprise platforms requiring rapid, resilient execution.
        </p>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {SERVICES_DATA.map((service, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#36EF10]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{service.description}</p>

                <div className="space-y-2 mb-6">
                  {service.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-[#36EF10] font-bold">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1c1c1c] flex flex-wrap gap-1.5">
                {service.tech.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-gray-400 border border-[#242424]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Philosophy Cards */}
        <div className="rounded-2xl bg-[#0e0e0e] border border-[#202020] p-8">
          <div className="max-w-2xl mb-8">
            <h3 className="font-mono text-xs text-[#36EF10] font-semibold uppercase tracking-wider mb-2">
              Engineering Mindset
            </h3>
            <p className="text-2xl font-bold text-white">Principles That Dictate Every Commit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PHILOSOPHIES.map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#141414] border border-[#1e1e1e]">
                <div className="font-mono text-xs text-[#36EF10] font-bold mb-2">0{idx + 1}.</div>
                <h4 className="text-base font-bold text-white mb-1.5">{p.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: CONTACT SECTION & SECURE FORM VALIDATION STATE MACHINE
   ========================================================================= */

function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Sanitization & Validation
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setStatus('error');
      setErrorMessage('Please ensure all required fields are filled out accurately.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid, deliverable email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Realistic asynchronous dispatch simulation (connects cleanly to Formspree, Resend, or custom API route)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Failed to transmit message. Please contact me directly via email.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-[#36EF10]" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#36EF10] font-semibold">06. Dispatch & Inquiries</h2>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          Let’s Build Something Exceptional.
        </p>
        <p className="text-sm text-gray-400 max-w-2xl mb-12">
          Interested in discussing a senior engineering engagement, architecture audit, or new product venture? My inbox is monitored daily.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222]">
              <h3 className="font-bold text-white text-base mb-4">Direct Channels</h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${PROFILE_DATA.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0c0c] border border-[#1e1e1e] text-gray-300 hover:text-white hover:border-[#36EF10] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#36EF10]" />
                  <div>
                    <div className="text-[11px] font-mono text-gray-500 uppercase">Direct Email</div>
                    <div className="text-sm font-semibold">{PROFILE_DATA.email}</div>
                  </div>
                </a>

                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0c0c] border border-[#1e1e1e] text-gray-300 hover:text-white hover:border-[#36EF10] transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-[#36EF10]" />
                  <div>
                    <div className="text-[11px] font-mono text-gray-500 uppercase">LinkedIn Profile</div>
                    <div className="text-sm font-semibold">Connect on LinkedIn</div>
                  </div>
                </a>

                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0c0c] border border-[#1e1e1e] text-gray-300 hover:text-white hover:border-[#36EF10] transition-colors"
                >
                  <Github className="w-5 h-5 text-[#36EF10]" />
                  <div>
                    <div className="text-[11px] font-mono text-gray-500 uppercase">GitHub Activity</div>
                    <div className="text-sm font-semibold">Inspect Source Code</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222]">
              <h4 className="font-mono text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                Response SLA
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Standard turnaround for new client scopes and technical inquiries is under 24 hours Monday through Friday.
              </p>
            </div>
          </div>

          {/* Functional Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Form Alert States */}
                {status === 'success' && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-[#0b2409] border border-[#36EF10] text-[#36EF10] text-xs font-mono flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Transmission received! Thank you for reaching out. I will respond to your inquiry shortly.</span>
                  </div>
                )}

                {status === 'error' && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-[#290d0d] border border-red-500 text-red-300 text-xs font-mono flex items-center gap-3"
                  >
                    <HelpCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor={nameId} className="block text-xs font-mono text-gray-300 uppercase mb-2">
                      Full Name <span className="text-[#36EF10]">*</span>
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm focus:border-[#36EF10] focus:ring-1 focus:ring-[#36EF10] outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label htmlFor={emailId} className="block text-xs font-mono text-gray-300 uppercase mb-2">
                      Work Email <span className="text-[#36EF10]">*</span>
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                      placeholder="jane@enterprise.com"
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm focus:border-[#36EF10] focus:ring-1 focus:ring-[#36EF10] outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={subjectId} className="block text-xs font-mono text-gray-300 uppercase mb-2">
                    Subject / Project Context
                  </label>
                  <input
                    id={subjectId}
                    type="text"
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    placeholder="New Full-Stack Platform Architecture"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm focus:border-[#36EF10] focus:ring-1 focus:ring-[#36EF10] outline-none transition-all placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor={messageId} className="block text-xs font-mono text-gray-300 uppercase mb-2">
                    Message Details <span className="text-[#36EF10]">*</span>
                  </label>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Outline your timeline, goals, and technical requirements..."
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm focus:border-[#36EF10] focus:ring-1 focus:ring-[#36EF10] outline-none transition-all placeholder:text-gray-600 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-lg bg-[#36EF10] text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-[#2fe00c] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(54,239,16,0.2)]"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUB-COMPONENTS: FOOTER
   ========================================================================= */

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded bg-[#111111] border border-[#222222] flex items-center justify-center text-[#36EF10] font-mono font-bold text-xs">
            #
          </span>
          <span className="text-xs font-mono text-gray-400">
            {PROFILE_DATA.name} • Production Architecture & Design
          </span>
        </div>

        <div className="text-xs font-mono text-gray-500">
          © {currentYear} • Handcrafted with Next.js, Tailwind CSS &amp;{' '}
          <span className="text-[#36EF10]">#36EF10</span>.
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <a href="#home" className="hover:text-white transition-colors">Top ↑</a>
          <span>•</span>
          <a href={PROFILE_DATA.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <span>•</span>
          <a href={PROFILE_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   ROOT PAGE COMPONENT
   ========================================================================= */

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-[#36EF10] selection:text-black">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ServicesAndPhilosophySection />
      <ContactSection />
      <Footer />
    </main>
  );
}