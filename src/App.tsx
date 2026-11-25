import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";


const linkClass =
  "text-[#aaa49a] underline underline-offset-4 transition-colors duration-200 hover:text-white";

export default function App() {
  return (
    <>
      <main className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 items-center gap-10 px-[7%] py-[55px] min-[801px]:grid-cols-[1fr_0.85fr] min-[801px]:gap-[100px] min-[801px]:py-[65px]">
        {/* Content */}
        <section className="max-w-[650px]">
          <h1 className="mb-5 text-[clamp(3rem,5vw,4.5rem)] font-normal tracking-[-2px] min-[801px]:mb-[30px]">
            Victor.
          </h1>

          <p className="mb-[25px] text-[1.1rem] leading-[1.9] text-[#d2cec7]">
            Fullstack web developer with a passion for game design. My work is
            driven by a deep passion for code and immersive storytelling.
            Currently working on "A Friend?".
          </p>

          <p className="mb-[25px] text-[1.1rem] leading-[1.9] text-[#d2cec7]">
            Take a look at some recent{" "}
            <a
              href="https://yokiidev.github.io/#"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              work
            </a>
            , download my{" "}
            <a
              href="https://yokiidev.github.io/#"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              resume
            </a>{" "}
            or{" "}
            <a href="mailto:hello@yokii.dev" className={linkClass}>
              send me an email
            </a>
            .
          </p>

          {/* Social Links */}
          <div className="mt-[35px] text-base leading-[2] text-[#aaa49a]">
            <a
              href="https://github.com/yokiidev"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              GitHub
            </a>

            <span className="mx-[9px] text-[#77716a]">·</span>

            <a
              href="https://yokiidev.github.io/#"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Portfolio
            </a>

            <span className="mx-[9px] text-[#77716a]">·</span>

            <a href="mailto:hello@yokii.dev" className={linkClass}>
              Email
            </a>
          </div>
        </section>

        {/* Photo */}
        <img
          src="/assets/images/rue_du_gros_horloge_rouen.jpg"
          alt="Rue du Gros-Horloge, Rouen"
          className="h-[400px] w-full rounded-[14px] object-cover min-[801px]:h-[78vh] min-[801px]:max-h-[850px]"
        />
      </main>
    </>
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
