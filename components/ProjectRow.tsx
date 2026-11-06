'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  const rowRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (lineRef.current && rowRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, rowRef);

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={rowRef}
      className="group relative border-t border-line py-8 transition-colors duration-200"
    >
      {/* 2px accent line animated with ScrollTrigger (scaleX 0 to 1 once at 85% of viewport) */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 w-full h-[2px] bg-accent origin-left pointer-events-none will-change-transform"
        aria-hidden="true"
      />

      <Link
        href={`/work/${project.slug}`}
        prefetch={false}
        className="block focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4">
          <div className="lg:w-1/3">
            <h3 className="font-serif text-3xl sm:text-4xl text-ink group-hover:underline group-hover:decoration-accent decoration-2 underline-offset-4 dark:group-hover:text-accent transition-all duration-250 font-normal">
              {project.title}
            </h3>
          </div>

          <div className="lg:w-1/2">
            <p className="text-mute text-base sm:text-lg mb-4 leading-relaxed">
              {project.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs text-mute border border-line px-2 py-0.5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:w-auto self-start lg:self-center">
            <span className="text-sm font-sans text-mute group-hover:text-ink group-hover:underline group-hover:decoration-accent dark:group-hover:text-accent transition-all duration-250">
              Read case study
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
