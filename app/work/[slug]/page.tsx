import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { projects, getProjectBySlug, getNextProject } from '@/data/projects';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project not found | Balaji Dasetti',
    };
  }

  return {
    title: `${project.title} — Balaji Dasetti`,
    description: project.summary,
    alternates: {
      canonical: `https://balajidasetti.space/work/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} — Balaji Dasetti`,
      description: project.summary,
      url: `https://balajidasetti.space/work/${project.slug}`,
      siteName: 'Balaji Dasetti Portfolio',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: 'https://balajidasetti.space/og-image.png',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: `${project.title} — Balaji Dasetti`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Balaji Dasetti`,
      description: project.summary,
      images: ['https://balajidasetti.space/og-image.png'],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);

  return (
    <article className="relative max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-24">
      <div className="relative z-10">
      {/* Back navigation */}
      <div className="mb-12">
        <Link
          href="/#work"
          className="text-sm font-mono text-mute hover:text-ink hover:underline decoration-accent dark:hover:text-accent transition-colors duration-200 border-b border-line hover:border-accent pb-0.5"
        >
          Back to selected work
        </Link>
      </div>

      {/* Header */}
      <header className="mb-14">
        <h1 className="font-serif text-5xl sm:text-7xl text-ink tracking-tight font-normal">
          {project.title}
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-mute leading-relaxed max-w-[65ch]">
          {project.summary}
        </p>

        {/* Live link if present */}
        {project.liveUrl && (
          <div className="mt-6">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-mono text-ink border-b border-accent pb-0.5 hover:underline decoration-accent dark:hover:text-accent transition-colors duration-200"
            >
              {project.liveLabel || 'Visit the live site'}
            </a>
          </div>
        )}
        {project.liveLabel && !project.liveUrl && (
          <div className="mt-6">
            <span className="font-mono text-xs text-mute border border-line px-2 py-1">
              {project.liveLabel}
            </span>
          </div>
        )}

        {/* Metadata info */}
        <div className="mt-8 pt-6 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block font-mono text-xs text-mute">
              Role
            </span>
            <span className="text-ink mt-1 block">{project.role}</span>
          </div>
          <div>
            <span className="block font-mono text-xs text-mute">
              Timeline
            </span>
            <span className="text-ink mt-1 block font-mono">{project.timeline}</span>
          </div>
        </div>

        {/* Tech tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="font-mono text-xs text-ink bg-line/30 border border-line px-2.5 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      </header>

      {/* Media / Screenshot Area */}
      <section
        className="my-14"
        aria-label={
          project.images?.length || project.image
            ? `${project.title} screenshots`
            : 'Project visuals placeholder'
        }
      >
        {project.images && project.images.length > 0 ? (
          <div className="w-full border border-line bg-line/10 p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {project.images.map((img, idx) => (
              <div
                key={img.src}
                className="border border-line overflow-hidden bg-bg mx-auto max-w-[280px] w-full"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="w-full h-auto block"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        ) : project.image ? (
          <div className="w-full border border-line overflow-hidden bg-line/10">
            <Image
              src={project.image}
              alt={project.imageAlt || `${project.title} screenshot`}
              width={project.imageWidth || 1024}
              height={project.imageHeight || 610}
              className="w-full h-auto block"
              priority
            />
          </div>
        ) : (
          <div className="w-full aspect-video border border-line bg-line/20 flex flex-col items-center justify-center p-8 text-center">
            <svg
              className="w-10 h-10 text-mute mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {/* TODO: Replace placeholder frame with real product screen recording or screenshot asset */}
            <p className="font-mono text-xs text-mute">
              Screen recording or screenshot placeholder
            </p>
          </div>
        )}
      </section>

      {/* Structured Case Study Sections */}
      <div className="space-y-16 border-t border-line pt-12">
        {/* Section 1: What I built */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              What I built
            </h2>
          </div>
          <div className="md:col-span-2 space-y-4">
            {project.built.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-ink text-base sm:text-lg leading-relaxed max-w-[65ch]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Section 2: What broke */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-line pt-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              What broke
            </h2>
          </div>
          <div className="md:col-span-2 space-y-4">
            {project.broke.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-ink text-base sm:text-lg leading-relaxed max-w-[65ch]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Section 3: What I learned */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-line pt-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              What I learned
            </h2>
          </div>
          <div className="md:col-span-2 space-y-4">
            {project.learned.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-ink text-base sm:text-lg leading-relaxed max-w-[65ch]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* Next Project Footer */}
      <footer className="mt-20 pt-10 border-t border-line flex justify-between items-center">
        <div>
          <span className="block font-mono text-xs text-mute">
            Next project
          </span>
          <Link
            href={`/work/${nextProject.slug}`}
            className="font-serif text-2xl sm:text-3xl text-ink hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4 transition-colors duration-200 mt-1 inline-block"
          >
            {nextProject.title}
          </Link>
        </div>

        <Link
          href="/#work"
          className="font-mono text-xs text-mute hover:text-ink hover:underline decoration-accent dark:hover:text-accent transition-colors duration-200 border border-line px-3 py-1.5"
        >
          All projects
        </Link>
      </footer>
      </div>
    </article>
  );
}
