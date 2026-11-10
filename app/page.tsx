import { projects } from '@/data/projects';
import { HeroSection } from '@/components/HeroSection';
import { ProjectRow } from '@/components/ProjectRow';
import { StackSection } from '@/components/StackSection';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Selected Work Section */}
      <section id="work" className="relative overflow-hidden py-20 border-t border-line scroll-mt-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
              Selected Work
            </h2>
          </div>

          <div className="space-y-2">
            {projects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <StackSection />

      {/* About Section */}
      <section id="about" className="relative overflow-hidden py-20 border-t border-line scroll-mt-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
            <div className="lg:w-1/3">
              <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
                About
              </h2>
            </div>
            <div className="lg:w-2/3">
              <p className="text-ink text-lg sm:text-xl leading-relaxed max-w-[65ch]">
                I am a Junior Full Stack Developer based in Chennai. I completed my B.E. in Computer Science and Engineering at Saveetha School of Engineering (2022-2026). Since April 2026 I have worked at VianaSoft Private Limited on VStay, where I develop and maintain the web and mobile application, handle its AWS deployment, and manage its releases on Google Play and the Apple App Store. Before that I was a Full Stack Web Developer intern at Smart Learned Tech (June to August 2025). I speak English, Telugu and Hindi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative overflow-hidden py-24 border-t border-line scroll-mt-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="mb-10">
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
              Contact
            </h2>
          </div>

          <div className="my-10">
            <a
              href="mailto:dasettisribalu@gmail.com"
              className="font-serif text-[clamp(1.75rem,5.5vw,4.5rem)] leading-tight text-ink underline decoration-accent hover:decoration-butter decoration-2 sm:decoration-4 underline-offset-8 break-all sm:break-normal block w-fit"
            >
              dasettisribalu@gmail.com
            </a>
          </div>

          <div className="pt-8 border-t border-line flex flex-wrap items-center gap-x-8 gap-y-4 text-base">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-accent pb-0.5 hover:underline decoration-butter hover:text-accent transition-colors duration-200"
            >
              Resume (PDF)
            </a>
            <a
              href="https://github.com/Balaji431"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-accent pb-0.5 hover:underline decoration-butter hover:text-accent transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/balaji-d-1675a9324"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink border-b border-accent pb-0.5 hover:underline decoration-butter hover:text-accent transition-colors duration-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
