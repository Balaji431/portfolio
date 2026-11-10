export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

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
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  images?: ProjectImage[];
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
    image: '/vstay-screenshot.jpg',
    imageAlt: 'SIMATS VStay portal sign-in screen',
    imageWidth: 1024,
    imageHeight: 610,
    broke:
      'When real transactions and hostel allocations went live, security audits exposed critical privilege escalation and IDOR risks across payment callbacks and data endpoints. Backend routes were trusting client-supplied identifiers without strict server-side tenancy verification.',
    learned:
      "Never trust the client. A working feature isn't complete until it's hardened. I learned to enforce strict JWT validation, HMAC webhook verification, and atomic database transactions—shifting my engineering mindset from just building features to designing resilient, zero-trust systems.",
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
    image: '/internship-certificate.jpg',
    imageAlt: 'Smart Learn Ed Tech Certificate of Achievement in Full Stack Web Development',
    imageWidth: 1024,
    imageHeight: 682,
    built:
      'Flutter UI screens for web and mobile following Material Design. More than 15 PHP 8.2 REST API endpoints covering authentication, hostel room management, fee tracking and push notifications. JWT authentication with role-based access control for four roles: Admin, Warden, Student and Security. A three-service Docker Compose setup: Flutter Web served by Nginx, the PHP backend on Apache, and MySQL. Firebase Cloud Messaging push notifications sent from the PHP backend. API testing with Postman.',
    broke:
      'Getting the three Docker Compose services to talk to each other was the first real problem. The PHP container started before MySQL was ready to accept connections, so the API crashed on boot until I added health checks and a proper startup order. Flutter Web served through Nginx then hit CORS errors against the PHP backend, and I spent a long time before I understood that the fix belonged in the API headers and the Nginx config, not in the Flutter code.\n\nRole-based access was another weak spot. Early on, some endpoints checked that a JWT was valid but not which role it belonged to, so a Student token could reach Warden-only routes. I caught it while testing in Postman and moved the role check into shared middleware. Push notifications were the third. Firebase messages worked on my device but silently failed for users whose FCM tokens had expired or changed.\n\nThe biggest limit showed up in chat. HTTP polling was slow and wasteful, which pushed me to plan a WebSocket migration.',
    learned:
      'Most of my bugs were not in the code I wrote. They were in how the pieces connect: containers, proxies, tokens and networks. Now I debug at those boundaries first.\n\nI learned to treat security as a design decision, not a final step. Authentication only proves who someone is, and authorization has to be enforced on every endpoint. I also learned that Postman collections are worth the time, because testing each role against each endpoint caught problems that would never have appeared in the UI.\n\nReal-time features taught me the cost of polling and why a WebSocket layer with Redis pub/sub scales better. I also learned to roll changes out gradually, behind a feature flag, with the old path kept as a fallback. Finally, I learned to read logs before guessing and to write down what broke, so the same mistake doesn’t cost me twice.',
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
    images: [
      {
        src: '/mindcare-welcome.png',
        alt: 'MindCare welcome screen',
        width: 322,
        height: 656,
      },
      {
        src: '/mindcare-home.jpg',
        alt: 'MindCare mood tracker and AI insights screen',
        width: 322,
        height: 672,
      },
      {
        src: '/mindcare-journal.jpg',
        alt: 'MindCare journal and entries screen',
        width: 322,
        height: 630,
      },
    ],
    built:
      'An Android application in Java with AI-based wellness assessment features and a Material Design interface. Firebase Authentication for login, Firebase Realtime Database for data sync, Room Database for offline storage, and REST APIs that return AI-generated wellness recommendations.',
    broke:
      'Going live taught me things that local testing never did. When the production server failed, the live app broke for real users, so I had to find the root cause from server logs, fix the backend, and ship a new app build when the fix touched the client too. Every client-side fix meant a new release. I bumped the version and build number, built a signed release, and re-uploaded it to the Play Store and App Store. Store review time meant a fix was never instant, so I learned to keep a server-side fix and a client-side fix separate wherever I could.',
    learned:
      'I learned the full release cycle of a mobile app: building signed release versions (keystore for Android, certificates and provisioning for iOS), managing version codes and build numbers, and uploading to Google Play Console and App Store Connect. I learned that a mobile release is harder to undo than a web deploy, because users update on their own schedule and old versions stay in the wild. So the backend has to stay backward compatible with older app versions.\n\nProduction failures also taught me incident handling: check the logs first, reproduce the bug, fix it, test the new build properly, and only then release. I now test release builds, not just debug builds, before uploading, and I use staged rollouts when I can, so a bad build reaches a small share of users first.',
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
