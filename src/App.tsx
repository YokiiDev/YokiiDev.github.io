import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

/* ---------- Data ---------- */

const projects = [
  {
    title: "A Friend?",
    description:
      "A psychological horror game, powered by Godot Engine.",
    tags: ["Game Design", "Godot Engine", "In progress"],
    link: "https://yokiidev.itch.io/a-friend",
  },
  {
    title: "Zwix Downloader",
    description:
      "Simple command-line tool to download videos/audio of ANY WEBSITE as MP4 or MP3.",
    tags: ["Python", "Tool"],
    link: "https://github.com/yokiidev",
  },
  {
    title: "CPS Guard website",
    description:
      "Website for CPS Guard app.",
    tags: ["CSS", "Html", "Javascript"],
    link: "https://github.com/YokiiDev/cps-guard-web",
  },
];

const roles = ["Full Stack Engineer", "Game Designer"];
const sections = ["home", "about", "projects", "contact"];

/* ---------- Hooks ---------- */

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let delay = deleting ? 40 : 90;

    if (!deleting && text === word) delay = 1600;
    else if (deleting && text === "") delay = 400;

    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(
          deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return text;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function useSmoothScroll() {
  useEffect(() => {
    let current = window.scrollY;
    let target = current;
    let speed = 9;
    let raf = 0;
    let last = 0;

    const maxY = () =>
      document.documentElement.scrollHeight - window.innerHeight;
    const clamp = (v: number) => Math.min(Math.max(v, 0), maxY());

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      current += (target - current) * (1 - Math.exp(-dt * speed));

      if (Math.abs(target - current) < 0.3) {
        current = target;
        window.scrollTo(0, current);
        raf = 0;
        return;
      }
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      current = target = window.scrollY;
    };

    // Keyboard, scrollbar drag, etc. -> keep our state in sync
    const onScroll = () => {
      if (!raf) current = target = window.scrollY;
    };

    const onWheel = (e: globalThis.WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented) return; // pinch-zoom
      e.preventDefault();
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 16;
      else if (e.deltaMode === 2) d *= window.innerHeight;
      speed = 9;
      target = clamp(target + d);
      start();
    };

    const onClick = (e: globalThis.MouseEvent) => {
      const a = (e.target as HTMLElement).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      if (!raf) current = window.scrollY;
      speed = 5;
      target = clamp(
        id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY - 70
      );
      start();
      history.replaceState(null, "", `#${id}`);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);
}

/* ---------- Components ---------- */

function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: "up" | "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dir = from === "left" ? "reveal-left" : from === "right" ? "reveal-right" : "";

  return (
    <div
      ref={ref}
      className={`reveal ${dir} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ProjectCard({ p }: { p: (typeof projects)[number] }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--ry", `${(x / r.width - 0.5) * 12}deg`);
    el.style.setProperty("--rx", `${-(y / r.height - 0.5) * 12}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <a
      ref={ref}
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="card flex flex-col h-full p-6 rounded-[20px] border-2 border-[#bcbed1]/30"
    >
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-2xl [font-family:Palatino,serif] font-bold">{p.title}</h3>
        <ArrowIcon />
      </div>
      <p className="relative z-10 mt-3 opacity-80 leading-relaxed flex-1">{p.description}</p>
      <ul className="relative z-10 flex flex-wrap gap-2 mt-5">
        {p.tags.map((t) => (
          <li key={t} className="text-sm px-3 py-1 rounded-full border border-[#bcbed1]/40">
            {t}
          </li>
        ))}
      </ul>
    </a>
  );
}

const GithubIcon = () => (
  <svg className="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="h-5 arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/* ---------- App ---------- */

export default function App() {
  const role = useTypewriter(roles);
  const active = useActiveSection(sections);
  useSmoothScroll();

  // Mouse spotlight
  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      const s = document.documentElement.style;
      s.setProperty("--x", `${e.clientX}px`);
      s.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Magnetic buttons
  const magnet = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.25;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const unmagnet = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "";
  };

  const navLink = (id: string, label: string) => (
    <a className={`nav-link ${active === id ? "is-active" : ""}`} href={`#${id}`}>
      {label}
    </a>
  );

  return (
    <>
      <div aria-hidden className="spotlight" />
      <div aria-hidden className="blob blob-1" />
      <div aria-hidden className="blob blob-2" />

      <header className="fixed top-0 inset-x-0 z-50 flex justify-center py-4 px-4 backdrop-blur-md bg-[#2b2c3a]/70 fade-down">
        <nav className="flex items-center gap-3 sm:gap-8 text-sm min-[400px]:text-base sm:text-xl">
          {navLink("home", "Home")}
          {navLink("about", "About")}
          {navLink("projects", "Projects")}
          <a
            href="#contact"
            id="contact-button"
            onMouseMove={magnet}
            onMouseLeave={unmagnet}
            className="contact-btn flex items-center justify-center w-[4.5rem] min-[400px]:w-20 sm:w-24 h-8 min-[400px]:h-9 sm:h-10 cursor-pointer border-2 border-[#bcbed1] rounded-[20px]"
          >
            Contact
          </a>
        </nav>
      </header>

      <main className="relative z-10">
        <section id="home" className="min-h-[100svh] relative flex items-center px-6 pt-24">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
            <div className="logo-wrap float">
              <span aria-hidden className="ring" />
              <span aria-hidden className="ring ring-2" />
              <img
                src="assets/images/logo.png"
                alt="logo"
                className="relative rounded-full w-32 sm:w-40 pop-in"
              />
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex gap-3 mb-4 fade-up" style={{ animationDelay: "0.1s" }}>
                <a className="icon-link" href="https://github.com/yokiidev" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubIcon />
                </a>
                <a className="icon-link" href="https://linkedin.com/in/ton-profil" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
              </div>

              <h1 className="text-6xl sm:text-7xl [font-family:Palatino,serif] font-bold" aria-label="Yokii">
                {"Yokii".split("").map((c, i) => (
                  <span key={i} aria-hidden className="letter">
                    <span className="letter-in" style={{ animationDelay: `${0.25 + i * 0.06}s` }}>
                      {c}
                    </span>
                  </span>
                ))}
              </h1>

              <span className="text-lg sm:text-xl md:ml-5 h-8 fade-up" style={{ animationDelay: "0.6s" }}>
                {role}
                <span className="cursor">|</span>
              </span>
            </div>
          </div>

          <a href="#about" aria-label="Scroll down" className="scroll-hint">
            <span />
          </a>
        </section>

        <section id="about" className="px-6 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto text-left">
            <Reveal from="left">
              <h2 className="section-title align-left">About</h2>
            </Reveal>
            <div className="max-w-xl">
              <Reveal from="left" delay={60}>
                <p className="text-lg sm:text-xl leading-relaxed opacity-90">
                  Fullstack web developer with a passion for game design. My work is driven by
                  a deep passion for code and immersive storytelling. Currently working on
                  "A Friend?".
                </p>
              </Reveal>
              <Reveal from="left" delay={120}>
                <p className="mt-6 text-lg sm:text-xl leading-relaxed opacity-90">
                  Take a look at some recent{" "}
                  <a className="text-link" href="https://yokiidev.github.io/#">work</a>, download
                  my <a className="text-link" href="https://yokiidev.github.io/#">resume</a> or{" "}
                  <a className="text-link" href="mailto:hello@yokii.dev">send me an email</a>.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="projects" className="px-6 py-20 sm:py-24 max-w-6xl mx-auto">
          <Reveal className="text-center">
            <h2 className="section-title">Projects</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section px-6 pt-32 pb-20 sm:pt-44 sm:pb-28">
          <div className="relative z-10 max-w-6xl mx-auto">
            <Reveal from="right">
              <div className="capsule relative overflow-hidden rounded-[36px] sm:rounded-[64px]">
                <div aria-hidden className="shape shape-square" />
                <div aria-hidden className="shape shape-square shape-square-2" />
                <div aria-hidden className="shape shape-circle" />

                <div className="relative z-10 flex flex-col items-end text-right p-8 sm:p-14">
                  <h2 className="section-title align-right">Contact</h2>
                  <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-sm">
                    Got a project in mind? Let's talk.
                  </p>
                  <a
                    href="mailto:hello@yokii.dev"
                    onMouseMove={magnet}
                    onMouseLeave={unmagnet}
                    className="contact-btn inline-flex items-center justify-center px-8 h-12 border-2 border-[#bcbed1] rounded-[20px] text-lg"
                  >
                    Say hello
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

    </>
  );
}
