interface StackGroup {
  category: string;
  skills: string[];
}

const stackGroups: StackGroup[] = [
  {
    category: 'Front of the house',
    skills: ['Flutter', 'Dart', 'React.js', 'HTML5', 'CSS3', 'Firebase'],
  },
  {
    category: 'Back of the house',
    skills: ['PHP 8.2 REST APIs', 'JWT authentication', 'MySQL 8.0', 'PostgreSQL', 'Java'],
  },
  {
    category: 'Getting it live',
    skills: ['AWS', 'Docker', 'Docker Compose', 'Nginx', 'Linux cron jobs', 'Git', 'GitHub'],
  },
];

export function StackSection() {
  return (
    <section id="stack" className="py-20 border-t border-line scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
            Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {stackGroups.map((group) => (
            <div key={group.category} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl text-ink mb-6 font-normal">
                {group.category}
              </h3>
              <ul className="space-y-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="font-mono text-sm text-ink flex items-baseline gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-line inline-block shrink-0" aria-hidden="true" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
