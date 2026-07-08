import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ============================================================
   BHUWAN SINGH — a minimal portfolio that generates itself.
   One timer, one counter, zero desync: the question types,
   a beat of thinking, then point-wise answers stream in.
   First answer auto-generates on load. Click a topic again
   to regenerate. Edit PROFILE / CONTENT to make it yours.
   ============================================================ */

const BG = "#FBFAF7";
const INK = "#141519";
const BODY = "#3E4148";
const DIM = "#8B8F98";
const FAINT = "#D8DADE";
const ACCENT = "#2E4FE0";

const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";
const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'Inter', -apple-system, 'Segoe UI', sans-serif";

const PROFILE = {
  first: "Bhuwan",
  last: "Singh",
  role: "AI-Powered Backend Engineer",
  focus: "FastAPI · Machine Learning · Real-time Systems",
  email: "bhandaribh12@gmail.com",
  github: "github.com/BHUWON12",
  linkedin: "linkedin.com/in/bhuwansingh02",
};

const INTRO =
  "I build intelligent backends with FastAPI and machine learning — and this page answers the same way.";

interface RowLink {
  t: string;
  u: string;
}

interface Row {
  k: string;
  v: string;
  n?: string;
  href?: string;
  links?: RowLink[];
}

interface Topic {
  key: string;
  label: string;
  question: string;
  rows: Row[];
}

const CONTENT: Topic[] = [
  {
    key: "about",
    label: "about me",
    question: "Who are you?",
    rows: [
      {
        k: "who",
        v: "Bhuwan Singh — a backend engineer from India who builds systems that are not just fast and scalable, but intelligent.",
      },
      {
        k: "what I do",
        v: "I design high-performance APIs with FastAPI and integrate machine learning directly into them — bridging raw data and intelligent action.",
      },
      {
        k: "right now",
        v: "Building AI-powered products end to end: real-time chat, ML-driven diagnosis tools, and prediction systems.",
      },
      {
        k: "what drives me",
        v: "Creating software that is not only functional but insightful — capable of learning and adapting to drive real-world impact.",
      },
    ],
  },
  {
    key: "projects",
    label: "projects",
    question: "What have you built?",
    rows: [
      {
        k: "GuffGaaf",
        v: "An anonymous real-time chat platform with WebSocket messaging and Redis-backed matchmaking.",
        n: "FastAPI · WebSockets · Redis · React · Docker",
        links: [{ t: "live", u: "https://guff-gaaf.vercel.app/" }],
      },
      {
        k: "activevacancy",
        v: "A job portal where seekers apply without registration and employers manage everything from a secure admin panel.",
        n: "React · TypeScript · SEO optimized · Excel export",
        links: [{ t: "live", u: "https://activevacancy.vercel.app/" }],
      },
      {
        k: "Vastrimo",
        v: "A premium e-commerce frontend with secure authentication, admin controls, and a fully responsive design.",
        n: "React · TypeScript · Tailwind CSS",
        links: [{ t: "live", u: "https://www.vastrimo.com/" }],
      },
      {
        k: "AgriDoctor",
        v: "An AI tool that diagnoses plant diseases from a photo and returns treatment and prevention advice.",
        n: "TensorFlow · Keras · OpenCV · FastAPI",
        links: [{ t: "live", u: "https://agridoctor.streamlit.app/" }],
      },
      {
        k: "Clear Air Vision",
        v: "An air-quality prediction interface that turns complex AI model output into something anyone can act on.",
        n: "Streamlit · FastAPI · Plotly · Pandas",
        links: [{ t: "live", u: "https://clearairvision.streamlit.app/" }],
      },
    ],
  },
  {
    key: "skills",
    label: "skills",
    question: "What are you good at?",
    rows: [
      {
        k: "Backend",
        v: "Python · FastAPI · WebSockets · REST APIs · SQLAlchemy · Asyncio",
      },
      {
        k: "AI & ML",
        v: "TensorFlow · PyTorch · Keras · OpenCV · Pandas · Scikit-learn · MLOps",
      },
      {
        k: "Data",
        v: "PostgreSQL · MongoDB · Redis · MySQL · Vector Databases",
      },
      {
        k: "Cloud & DevOps",
        v: "Docker · Git · Linux · AWS (S3, EC2, SageMaker) · CI/CD",
      },
      {
        k: "Frontend",
        v: "React · TypeScript · Streamlit · HTML/CSS",
      },
    ],
  },
  {
    key: "approach",
    label: "how I work",
    question: "How do you work?",
    rows: [
      {
        k: "AI-first design",
        v: "Intelligence is part of the architecture from day one, not bolted on later.",
      },
      {
        k: "Performance",
        v: "FastAPI and async everywhere — speed and scalability are features, not afterthoughts.",
      },
      {
        k: "Data-centric",
        v: "Resilient architecture built around the data, so models can be deployed and improved safely.",
      },
    ],
  },
  {
    key: "contact",
    label: "contact",
    question: "How do I reach you?",
    rows: [
      { k: "email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
      { k: "github", v: PROFILE.github, href: `https://${PROFILE.github}` },
      { k: "linkedin", v: PROFILE.linkedin, href: `https://${PROFILE.linkedin}` },
      { k: "based in", v: "Remote / India · UTC+5:30" },
      {
        k: "open to",
        v: "FastAPI backend · ML engineer · AI-powered application roles",
      },
    ],
  },
];

/* ---------- deterministic generation timeline ----------
   Everything is derived from a single tick counter `n`,
   so the animation can never get stuck between stages.   */
const SPEED = 2; // characters per tick
const THINK_TICKS = 30; // pause after the question
const ROW_GAP_TICKS = 11; // pause between rows

type Step =
  | { type: "q"; len: number }
  | { type: "think"; ticks: number }
  | { type: "row"; i: number; len: number }
  | { type: "gap"; ticks: number; after: number };

interface View {
  qChars: number;
  thinking: boolean;
  rows: Record<number, number>;
  typingRow: number;
  cursorRow: number;
  done: boolean;
  total: number;
}

function buildSteps(topic: Topic): Step[] {
  const steps: Step[] = [
    { type: "q", len: topic.question.length },
    { type: "think", ticks: THINK_TICKS },
  ];
  topic.rows.forEach((r, i) => {
    steps.push({ type: "row", i, len: r.v.length });
    steps.push({ type: "gap", ticks: ROW_GAP_TICKS, after: i });
  });
  return steps;
}

const ticksFor = (s: Step) =>
  s.type === "q" || s.type === "row" ? Math.ceil(s.len / SPEED) : s.ticks;

function project(topic: Topic, steps: Step[], n: number): View {
  const view: View = {
    qChars: 0,
    thinking: false,
    rows: {},
    typingRow: -1,
    cursorRow: -1,
    done: false,
    total: 0,
  };
  let cum = 0;
  for (const s of steps) {
    const t = ticksFor(s);
    const local = Math.max(0, Math.min(n - cum, t));
    if (s.type === "q") view.qChars = Math.min(s.len, local * SPEED);
    if (s.type === "think" && local > 0 && local < t) view.thinking = true;
    if (s.type === "row") {
      view.rows[s.i] = Math.min(s.len, local * SPEED);
      if (local > 0 && local < t) view.typingRow = s.i;
      if (local > 0) view.cursorRow = s.i;
    }
    if (s.type === "gap" && local > 0 && local < t) view.cursorRow = s.after;
    cum += t;
  }
  view.total = cum;
  view.done = n >= cum;
  if (view.done) view.cursorRow = -1;
  return view;
}

const Cursor = () => (
  <span className="cursor" style={{ color: ACCENT, marginLeft: 1 }}>
    ▍
  </span>
);

/* ============================================================ */

export default function Index() {
  const [introN, setIntroN] = useState(0);
  const introDone = introN >= INTRO.length;

  const [topicKey, setTopicKey] = useState<string | null>(null);
  const [n, setN] = useState(0);
  const autoStarted = useRef(false);

  const topic = useMemo(
    () => CONTENT.find((c) => c.key === topicKey) || null,
    [topicKey]
  );
  const steps = useMemo(() => (topic ? buildSteps(topic) : null), [topic]);
  const view = useMemo(
    () => (topic && steps ? project(topic, steps, n) : null),
    [topic, steps, n]
  );

  /* intro types itself */
  useEffect(() => {
    if (introDone) return;
    const id = setInterval(
      () => setIntroN((x) => Math.min(INTRO.length, x + 2)),
      16
    );
    return () => clearInterval(id);
  }, [introDone]);

  /* one interval drives the whole answer */
  useEffect(() => {
    if (!topic || (view && view.done)) return;
    const id = setInterval(() => setN((x) => x + 1), 18);
    return () => clearInterval(id);
  }, [topic, view && view.done]);

  /* first answer generates by itself */
  useEffect(() => {
    if (!introDone || autoStarted.current) return;
    autoStarted.current = true;
    const t = setTimeout(() => {
      setTopicKey("about");
      setN(0);
    }, 500);
    return () => clearTimeout(t);
  }, [introDone]);

  const ask = useCallback((key: string | null) => {
    setTopicKey(key);
    setN(0);
  }, []);

  const skip = useCallback(() => {
    if (view) setN(view.total);
  }, [view]);

  const smallLink: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 13.5,
    color: DIM,
    textDecoration: "none",
    borderBottom: `1px solid ${FAINT}`,
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ minHeight: "100vh", background: BG, color: INK, fontFamily: SANS }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
        ::selection { background: rgba(46,79,224,0.12); }
        @keyframes blink { 0%,55% {opacity:1} 56%,100% {opacity:0} }
        @keyframes rise { from {opacity:0; transform:translateY(6px)} to {opacity:1; transform:none} }
        @keyframes dots { 0% {content:"·"} 33% {content:"··"} 66% {content:"···"} }
        .cursor { animation: blink 1s step-end infinite; }
        .rise { animation: rise .5s ease both; }
        .dots::after { content:"···"; animation: dots .9s steps(1) infinite; }
        .tab { transition: color .18s, border-color .18s; }
        .tab:hover { color: ${INK} !important; }
        a:hover { color: ${ACCENT} !important; }
        button:focus-visible, a:focus-visible { outline: 1.5px solid ${ACCENT}; outline-offset: 3px; border-radius: 2px; }
        @media (prefers-reduced-motion: reduce) { .cursor {animation:none} .rise {animation-duration:.01s} .dots::after {animation:none} }
      `}</style>

      <div
        className="w-full px-6 sm:px-10 flex flex-col"
        style={{ maxWidth: 900, paddingTop: 72, paddingBottom: 56 }}
      >
        {/* ---------- name ---------- */}
        <header className="rise">
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(3.4rem, 9vw, 6.6rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              margin: 0,
            }}
          >
            {PROFILE.first} {PROFILE.last}
            <span style={{ color: ACCENT }}>.</span>
          </h1>
          <div
            className="flex flex-wrap items-baseline justify-between"
            style={{ marginTop: 22, gap: "8px 16px" }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12.5,
                letterSpacing: "0.22em",
                color: DIM,
                textTransform: "uppercase",
              }}
            >
              {PROFILE.role} — {PROFILE.focus}
            </div>
            <div className="flex gap-4">
              <a href={`mailto:${PROFILE.email}`} style={smallLink}>
                email
              </a>
              <a
                href={`https://${PROFILE.github}`}
                target="_blank"
                rel="noreferrer"
                style={smallLink}
              >
                github
              </a>
              <a
                href={`https://${PROFILE.linkedin}`}
                target="_blank"
                rel="noreferrer"
                style={smallLink}
              >
                linkedin
              </a>
            </div>
          </div>
        </header>

        <div style={{ height: 1, background: FAINT, marginTop: 30 }} />

        {/* ---------- intro line, typing ---------- */}
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: BODY,
            marginTop: 44,
            minHeight: 62,
            maxWidth: 680,
          }}
        >
          {INTRO.slice(0, introN)}
          {!introDone && <Cursor />}
        </p>

        {/* ---------- topics ---------- */}
        <div
          className="flex flex-wrap items-baseline"
          style={{ gap: "10px 22px", marginTop: 20, minHeight: 22 }}
        >
          {introDone && (
            <>
              <span
                className="rise"
                style={{ fontFamily: MONO, fontSize: 13.5, color: FAINT }}
              >
                ask —
              </span>
              {CONTENT.map((c) => {
                const on = topicKey === c.key;
                return (
                  <button
                    key={c.key}
                    className="tab rise"
                    onClick={() => ask(c.key)}
                    style={{
                      fontFamily: MONO,
                      fontSize: 15,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: on ? ACCENT : DIM,
                      borderBottom: `1.5px solid ${on ? ACCENT : "transparent"}`,
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* ---------- generated answer ---------- */}
        <div aria-live="polite" style={{ marginTop: 44, minHeight: 280 }}>
          {topic && view && (
            <div>
              {/* the question */}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 15,
                  color: DIM,
                  marginBottom: 32,
                  minHeight: 22,
                }}
              >
                <span style={{ color: ACCENT }}>&gt; </span>
                {topic.question.slice(0, view.qChars)}
                {view.qChars < topic.question.length && <Cursor />}
              </div>

              {/* thinking */}
              {view.thinking && (
                <div
                  className="dots"
                  style={{ fontFamily: MONO, fontSize: 16, color: DIM }}
                  aria-label="thinking"
                />
              )}

              {/* rows */}
              <div className="flex flex-col" style={{ gap: 28 }}>
                {topic.rows.map((r, i) => {
                  const chars = view.rows[i] || 0;
                  if (chars === 0) return null;
                  const full = chars >= r.v.length;
                  return (
                    <div
                      key={r.k}
                      className="rise flex flex-col sm:flex-row"
                      style={{ gap: "4px 0" }}
                    >
                      <div
                        style={{
                          fontFamily: MONO,
                          fontSize: 13.5,
                          color: ACCENT,
                          width: 190,
                          flexShrink: 0,
                          paddingTop: 4,
                        }}
                      >
                        {r.k}
                      </div>
                      <div style={{ flex: 1 }}>
                        {full && r.href ? (
                          <a
                            href={r.href}
                            target={r.href.startsWith("http") ? "_blank" : undefined}
                            rel="noreferrer"
                            style={{
                              fontSize: 17.5,
                              lineHeight: 1.65,
                              color: INK,
                              textDecoration: "none",
                              borderBottom: `1px solid ${FAINT}`,
                            }}
                          >
                            {r.v}
                            {view.cursorRow === i && <Cursor />}
                          </a>
                        ) : (
                          <span style={{ fontSize: 17.5, lineHeight: 1.65, color: INK }}>
                            {r.v.slice(0, chars)}
                            {view.cursorRow === i && <Cursor />}
                          </span>
                        )}
                        {full && (r.n || r.links) && (
                          <div
                            className="rise flex flex-wrap items-baseline"
                            style={{ gap: "4px 16px", marginTop: 5 }}
                          >
                            {r.n && (
                              <span
                                style={{ fontFamily: MONO, fontSize: 12.5, color: DIM }}
                              >
                                {r.n}
                              </span>
                            )}
                            {r.links &&
                              r.links.map((l) => (
                                <a
                                  key={l.t}
                                  href={l.u}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    fontFamily: MONO,
                                    fontSize: 12.5,
                                    color: DIM,
                                    textDecoration: "none",
                                    borderBottom: `1px solid ${FAINT}`,
                                  }}
                                >
                                  {l.t} ↗
                                </a>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* controls */}
              <div style={{ marginTop: 30, minHeight: 18 }}>
                {!view.done ? (
                  view.qChars >= topic.question.length && (
                    <button
                      className="tab"
                      onClick={skip}
                      style={{
                        fontFamily: MONO,
                        fontSize: 12.5,
                        color: FAINT,
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        borderBottom: `1px solid ${FAINT}`,
                      }}
                    >
                      skip
                    </button>
                  )
                ) : (
                  <button
                    className="tab rise"
                    onClick={() => ask(topicKey)}
                    style={{
                      fontFamily: MONO,
                      fontSize: 12.5,
                      color: DIM,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      borderBottom: `1px solid ${FAINT}`,
                    }}
                  >
                    ↺ regenerate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ---------- footer ---------- */}
        <footer
          style={{
            marginTop: "auto",
            paddingTop: 72,
            fontFamily: MONO,
            fontSize: 12,
            color: FAINT,
          }}
        >
          © {new Date().getFullYear()} {PROFILE.first} {PROFILE.last} — this page
          writes its own answers.
        </footer>
      </div>
    </div>
  );
}
