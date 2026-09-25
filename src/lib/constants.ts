import { Skill, Project, Education, Certificate, ServiceItem, SocialProfile } from '../types';

export const INITIAL_SKILLS: Skill[] = [
  // Frontend
  {
    id: 'skill-html',
    name: 'HTML5',
    category: 'Frontend',
    level: 'Comfortable',
    description: 'Semantic markup, accessibility basics, and modern web page structuring.',
    icon: 'Code2',
    order: 1,
  },
  {
    id: 'skill-css',
    name: 'CSS3',
    category: 'Frontend',
    level: 'Comfortable',
    description: 'Modern flexbox, grid, responsive layouts, and clean styling principles.',
    icon: 'Palette',
    order: 2,
  },
  {
    id: 'skill-js',
    name: 'JavaScript',
    category: 'Frontend',
    level: 'Comfortable',
    description: 'Core ES6+ syntax, DOM manipulation, asynchronous programming, and events.',
    icon: 'FileCode2',
    order: 3,
  },
  {
    id: 'skill-responsive',
    name: 'Responsive Web Design',
    category: 'Frontend',
    level: 'Comfortable',
    description: 'Crafting fluid layouts tailored for mobile, tablet, and desktop viewports.',
    icon: 'Smartphone',
    order: 4,
  },
  // Programming
  {
    id: 'skill-cpp',
    name: 'C++',
    category: 'Programming',
    level: 'Learning',
    description: 'Core object-oriented programming, standard template library, and problem solving.',
    icon: 'Cpu',
    order: 5,
  },
  {
    id: 'skill-java',
    name: 'Java',
    category: 'Programming',
    level: 'Learning',
    description: 'Core Java fundamentals, OOP concepts, class architecture, and syntax.',
    icon: 'Coffee',
    order: 6,
  },
  // Tools
  {
    id: 'skill-git',
    name: 'Git',
    category: 'Tools',
    level: 'Comfortable',
    description: 'Version control workflows, branching, commits, and collaborative code management.',
    icon: 'GitBranch',
    order: 7,
  },
  {
    id: 'skill-github',
    name: 'GitHub',
    category: 'Tools',
    level: 'Comfortable',
    description: 'Repository hosting, collaboration, issue tracking, and documentation.',
    icon: 'Github',
    order: 8,
  },
  {
    id: 'skill-vscode',
    name: 'VS Code',
    category: 'Tools',
    level: 'Comfortable',
    description: 'Primary code editor environment, debugging tools, extensions, and CLI setup.',
    icon: 'Terminal',
    order: 9,
  },
  // Currently Learning
  {
    id: 'skill-dsa',
    name: 'Data Structures & Algorithms',
    category: 'Currently Learning',
    level: 'Currently Exploring',
    description: 'Actively studying arrays, strings, recursion, sorting, and algorithmic complexity.',
    icon: 'Binary',
    order: 10,
  },
  {
    id: 'skill-backend',
    name: 'Backend Development',
    category: 'Currently Learning',
    level: 'Currently Exploring',
    description: 'Learning server architecture, REST APIs, routing, and request handling.',
    icon: 'Server',
    order: 11,
  },
  {
    id: 'skill-fullstack',
    name: 'Full-Stack Development',
    category: 'Currently Learning',
    level: 'Currently Exploring',
    description: 'Connecting frontend clients to server routes, authentication, and databases.',
    icon: 'Layers',
    order: 12,
  },
  {
    id: 'skill-ai',
    name: 'AI & AI-Powered Apps',
    category: 'Currently Learning',
    level: 'Currently Exploring',
    description: 'Exploring machine learning concepts and integrating AI services into web applications.',
    icon: 'Sparkles',
    order: 13,
  },
  {
    id: 'skill-modern-web',
    name: 'Modern Web Development',
    category: 'Currently Learning',
    level: 'Currently Exploring',
    description: 'Learning React, component architecture, state management, and modern tooling.',
    icon: 'Globe',
    order: 14,
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Developer Portfolio Platform [Placeholder Project]',
    slug: 'developer-portfolio-platform',
    description: 'A responsive full-stack portfolio built to present development skills, projects, and contact queries in a modern tech interface.',
    longDescription: 'This portfolio serves as both a live showcase of web development fundamentals and an interactive space where recruiters and clients can review skills and submit inquiries. Designed with responsive layouts and dark-mode first aesthetic.',
    problem: 'Traditional resume templates lack interactivity and fail to demonstrate real-world code organization, responsive design, or database interaction.',
    solution: 'Engineered a modern web application featuring clean typography, dynamic project filtering, and persistent message handling.',
    challenges: 'Structuring responsive mobile viewports while preserving subtle glowing accents and seamless dark/light styling.',
    image: '/images/project-portfolio.svg',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Git'],
    features: [
      'Responsive sticky navigation with mobile drawer',
      'Filterable project catalog with deep detail modal',
      'Contact form connected to persistent database',
      'Dark and Light theme switching'
    ],
    category: 'Frontend',
    githubUrl: 'https://github.com/amitkumar7035/amit-kumar-portfolio',
    liveUrl: '#',
    featured: true,
    order: 1
  },
  {
    id: 'proj-2',
    title: 'Algorithm & Sorting Explorer [Placeholder Project]',
    slug: 'algorithm-sorting-explorer',
    description: 'An educational visualizer designed to help understand basic array manipulation, comparison steps, and sorting logic.',
    longDescription: 'Developed while studying Data Structures & Algorithms. Helps visualize element comparisons, swaps, and time complexity in real time.',
    problem: 'Abstract algorithmic concepts like quicksort and mergesort can be difficult to grasp from static code alone.',
    solution: 'Built an animated step-by-step visualizer that highlights pivot points and partition boundaries as the algorithm executes.',
    challenges: 'Managing animation timing and state updates without blocking the browser thread.',
    image: '/images/project-dsa.svg',
    technologies: ['JavaScript', 'C++', 'Data Structures', 'HTML/CSS'],
    features: [
      'Visual sorting bar charts with step-by-step playback',
      'Speed adjustment slider and array size control',
      'Time complexity info panel for each algorithm'
    ],
    category: 'Other',
    githubUrl: 'https://github.com/amitkumar7035/algorithm-visualizer',
    liveUrl: '#',
    featured: true,
    order: 2
  },
  {
    id: 'proj-3',
    title: 'Modern Business Landing Page [Placeholder Project]',
    slug: 'modern-business-landing-page',
    description: 'A responsive, high-converting business website layout designed for local services, studios, or tech startups.',
    longDescription: 'Demonstrates clean layout engineering, mobile-first responsive media queries, accessible forms, and performant asset loading.',
    problem: 'Many small businesses have outdated websites that look broken on mobile devices and take too long to load.',
    solution: 'Designed a clean, semantic web layout focused on fast loading, clear calls to action, and intuitive navigation.',
    challenges: 'Optimizing mobile touch targets and maintaining clean spacing across varying screen sizes.',
    image: '/images/project-responsive.svg',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub'],
    features: [
      'Mobile-first responsive hero section and feature cards',
      'Interactive pricing comparison table',
      'Validated inquiry submission form'
    ],
    category: 'Frontend',
    githubUrl: 'https://github.com/amitkumar7035/business-landing-page',
    liveUrl: '#',
    featured: false,
    order: 3
  }
];

export const INITIAL_EDUCATION: Education[] = [
  {
    id: 'edu-1',
    degree: 'BTech in Computer Science',
    field: 'Computer Science & Engineering',
    institution: '[ADD COLLEGE NAME]',
    duration: '[ADD START YEAR - END YEAR]',
    status: 'In Progress',
    description: 'Undergraduate study focused on computer science fundamentals, programming concepts, mathematics, and problem solving.',
    order: 1
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Responsive Websites',
    description: 'Modern websites meticulously crafted to work smoothly across mobile phones, tablets, laptops, and desktop displays.',
    icon: 'Smartphone',
    tags: ['Mobile First', 'Cross-Browser', 'Fluid Layouts']
  },
  {
    id: 'srv-2',
    title: 'Business Websites',
    description: 'Professional websites for startups, local businesses, salons, restaurants, and service providers looking for a digital presence.',
    icon: 'Building2',
    tags: ['Brand Identity', 'Fast Loading', 'Clean Aesthetics']
  },
  {
    id: 'srv-3',
    title: 'Frontend Development',
    description: 'Translating concepts and wireframes into clean, semantic, and maintainable HTML, CSS, and modern JavaScript code.',
    icon: 'Code',
    tags: ['Semantic HTML', 'Modern CSS', 'Accessible UI']
  },
  {
    id: 'srv-4',
    title: 'Website Redesign',
    description: 'Upgrading existing websites with modernized visual aesthetics, streamlined navigation, and improved mobile responsiveness.',
    icon: 'Sparkles',
    tags: ['UI Overhaul', 'Speed Optimization', 'Better UX']
  },
  {
    id: 'srv-5',
    title: 'Full-Stack Web Applications',
    description: 'Developing data-driven applications connecting user interfaces to secure backend services, APIs, and cloud databases.',
    icon: 'Database',
    tags: ['CRUD Operations', 'API Integration', 'Persistent Storage']
  }
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/amitkumar7035',
  linkedin: 'https://www.linkedin.com/in/amit-kumar-42a9b442a/',
  instagram: 'https://www.instagram.com/amitkashyap.__/',
  facebook: 'https://www.facebook.com/amitkumar70335/'
};

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    name: 'GitHub',
    platform: 'github',
    handle: '@amitkumar7035',
    url: 'https://github.com/amitkumar7035',
    description: 'Explore code repositories, projects, and version-controlled commits.',
    isPlaceholder: false
  },
  {
    name: 'LinkedIn',
    platform: 'linkedin',
    handle: 'Amit Kumar',
    url: 'https://www.linkedin.com/in/amit-kumar-42a9b442a/',
    description: 'Connect professionally, track educational milestones, and networking.',
    isPlaceholder: false
  },
  {
    name: 'Instagram',
    platform: 'instagram',
    handle: '@amitkashyap.__',
    url: 'https://www.instagram.com/amitkashyap.__/',
    description: 'Follow my developer journey, updates, and student life.',
    isPlaceholder: false
  },
  {
    name: 'Facebook',
    platform: 'facebook',
    handle: 'Amit Kumar',
    url: 'https://www.facebook.com/amitkumar70335/',
    description: 'Connect and chat with me on Facebook.',
    isPlaceholder: false
  },
  {
    name: 'LeetCode',
    platform: 'leetcode',
    handle: 'amit_coder (Practice)',
    url: 'https://leetcode.com',
    description: 'Tracking problem solving, data structures, and algorithm practice.',
    isPlaceholder: true
  },
  {
    name: 'GeeksforGeeks',
    platform: 'geeksforgeeks',
    handle: 'amit_gfg (Practice)',
    url: 'https://geeksforgeeks.org',
    description: 'Computer science fundamentals, syntax learning, and programming articles.',
    isPlaceholder: true
  }
];
