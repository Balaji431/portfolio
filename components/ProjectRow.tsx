import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <article className="project-row relative border-t border-line py-8 transition-colors duration-200">
      <Link
        href={`/work/${project.slug}`}
        prefetch={false}
        className="block focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4">
          <div className="lg:w-1/3">
            <h3 className="project-title font-serif text-3xl sm:text-4xl text-ink font-normal">
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
            <span className="project-action text-sm font-sans text-ink">
              Read case study
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
