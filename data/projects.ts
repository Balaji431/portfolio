export interface Project {
  slug: string;
  title: string;
  summary: string;
  role: string;
  timeline: string;
  stack: string[];
  built: string;
  broke: string;
  learned: string;
  liveUrl?: string;
  liveLabel?: string;
}

export const projects: Project[] = [
  {
    slug: 'vstay',
    title: 'VStay',
    summary: 'College accommodation platform at VianaSoft.',
    role: 'Junior Full Stack Developer, VianaSoft Private Limited',
    timeline: 'April 2026 to present',
    stack: ['Flutter', 'PHP 8.2', 'REST API', 'MySQL', 'AWS'],
    built:
      'I develop and maintain VStay, a web and mobile application used in production. I handle its deployment on AWS and support its production operation. I manage its releases on Google Play and the Apple App Store, and I maintain it with ongoing updates.',
    liveUrl: 'https://vstay.saveetha.com',
    liveLabel: 'Visit the live site',
    // TODO: write your real story
    broke: 'TODO: write your real story.',
    // TODO: write your real story
    learned: 'TODO: write your real story.',
  },
  {
    slug: 'internship-hostel-app',
    title: 'Internship project at Smart Learned Tech',
    summary: 'Full stack hostel application built during my internship.',
    role: 'Full Stack Web Developer Intern',
    timeline: 'June 2025 to August 2025',
    stack: [
      'Flutter',
      'Dart',
      'PHP 8.2',
      'MySQL',
      'Docker Compose',
      'Nginx',
      'Firebase Cloud Messaging',
    ],
    built:
      'Flutter UI screens for web and mobile following Material Design. More than 15 PHP 8.2 REST API endpoints covering authentication, hostel room management, fee tracking and push notifications. JWT authentication with role-based access control for four roles: Admin, Warden, Student and Security. A three-service Docker Compose setup: Flutter Web served by Nginx, the PHP backend on Apache, and MySQL. Firebase Cloud Messaging push notifications sent from the PHP backend. API testing with Postman.',
    // TODO: write your real story
    broke: 'TODO: write your real story.',
    // TODO: write your real story
    learned: 'TODO: write your real story.',
  },
  {
    slug: 'mind-care',
    title: 'Mind Care',
    summary: 'AI-based mental wellness Android app. Patent filed.',
    role: 'Android Developer',
    timeline: '2024 – 2025',
    stack: [
      'Java',
      'Android Studio',
      'Firebase Auth',
      'Firebase Realtime Database',
      'Room',
      'REST API',
    ],
    built:
      'An Android application in Java with AI-based wellness assessment features and a Material Design interface. Firebase Authentication for login, Firebase Realtime Database for data sync, Room Database for offline storage, and REST APIs that return AI-generated wellness recommendations.',
    // TODO: write your real story
    broke: 'TODO: write your real story.',
    // TODO: write your real story
    learned: 'TODO: write your real story.',
  },
  {
    slug: 'house-hunting',
    title: 'House Hunting',
    summary: 'Responsive property search web app.',
    role: 'Frontend Developer',
    timeline: '2024',
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    built:
      'A responsive property browsing site using HTML5 and CSS3 Flexbox and Grid, with vanilla JavaScript search filters, smooth-scroll navigation and interactive listings. Deployed on Neocities.',
    // Live link: TODO (I will add the Neocities URL)
    liveLabel: 'TODO: I will add the Neocities URL',
    // TODO: write your real story
    broke: 'TODO: write your real story.',
    // TODO: write your real story
    learned: 'TODO: write your real story.',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}
