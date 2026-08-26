/* ================================================================
   SITE CONFIG — all content lives here
   ================================================================ */
const SITE_CONFIG = {

  name:    { first: 'Eric', last: 'Furspan', display: 'ERICF' },
  tagline: ['Full Stack', 'Cloud + DevOps', 'AppSec'],
  handle:   'eric@dev',

  // Use **double asterisks** to bold a phrase
  bio: 'Software engineer building **secure, cloud-native applications** with a full stack background in **React, TypeScript, and Node.js**.',
  skills: [
    { category: 'Cloud',    items: ['AWS', 'Docker','Bash', 'CI/CD' ]        },
    { category: 'Backend',  items: ['Node.js', 'Python', 'SQL', 'MongoDB']   },
    { category: 'Security', items: ['OAuth 2.0', 'SAST', 'IAM', 'OWASP Top 10']   },
    { category: 'Frontend', items: ['React.js', 'TypeScript', 'Next.js', 'GraphQL']     },
  ],

  certs: [
    {
      short: 'Security+',
      issuer: 'CompTIA',
      year: '2025',
      url: 'https://www.credly.com/badges/4cd4353a-9b80-46cd-9633-6bc1e5f6aba7/public_url',
    },
    {
      short: 'Network+',
      issuer: 'CompTIA',
      year: '2025',
      url: 'https://www.credly.com/badges/a7bf62aa-9299-4e7c-9856-4e01135675b3/public_url',
    },
  ],

  // icon: 'github' | 'linkedin' | 'email' | '' (text only)
  // visible: false hides without deleting
  links: [
    { label: 'GitHub',   url: 'https://github.com/ericfurspan',      icon: 'github',   newTab: true,  visible: true },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/eric-furspan', icon: 'linkedin', newTab: true,  visible: true },
    { label: 'Email',    url: 'mailto:eric.furspan@gmail.com',        icon: 'email',    newTab: false, visible: true },
  ],

  // url: '' = no link; add GitHub/live URL to make the expanded card linkable
  projects: [
    {
      title: 'SwissCheese Pay',
      outcome: 'Exploit, fix, and detection for nine vulnerabilities',
      desc: 'Intentionally vulnerable neobank lab pairing nine real-world web and business-logic exploits with root-cause analysis, secure fixes, and detection rules. Fixed implementations live on main, with unsafe snapshots retained in versioned tags for side-by-side testing.',
      tags: ['AppSec', 'OWASP', 'React', 'Express', 'TypeScript'],
      url: 'https://github.com/ericfurspan/swisscheese-pay',
      linkLabel: 'View Source',
    },
    {
      title: 'Local Hoops Knicks Map',
      outcome: 'Featured by the New York Knicks',
      desc: 'Built and deployed a map-based web application enabling users to locate NYC basketball courts with user-submitted video content. Featured on the official New York Knicks website in partnership with the Local Hoops brand.',
      tags: ['React', 'Google Cloud', 'Node.js', 'Leaflet'],
      url: 'https://www.nba.com/knicks/new-york-hoops',
      linkLabel: 'View Live Project',
    },
    {
      title: 'Wazuh SIEM Home Lab',
      outcome: 'Custom detection rules and real-time alerts',
      desc: 'Self-hosted SIEM on Wazuh for home lab security monitoring — custom threat detection rules, log aggregation pipelines, and real-time alert dashboards.',
      tags: ['Docker', 'Linux', 'SIEM', 'Detection Rules'],
      url: 'https://github.com/ericfurspan/wazuh-siem-homelab',
      linkLabel: 'View Source',
    },
    {
      title: 'DevSecOps CI/CD Pipeline',
      outcome: 'SAST, secrets, and container scanning in CI',
      desc: 'Automated security scanning pipeline integrating SAST, secrets detection, and container vulnerability analysis into GitHub Actions workflows.',
      tags: ['GitHub Actions', 'Semgrep', 'Trivy', 'Gitleaks'],
      url: 'https://github.com/ericfurspan/DevSecOps-pipeline',
      linkLabel: 'View Source',
    },
    {
      title: 'NodeSnip',
      outcome: 'DOM capture with PNG and PDF export',
      desc: 'Chrome extension for capturing individual DOM elements as images. Copy to clipboard, download as PNG, or crop and export as PNG or PDF.',
      tags: ['Chrome Extension', 'JavaScript', 'DOM Capture', 'Web Extension API'],
      url: 'https://github.com/ericfurspan/nodesnip',
      linkLabel: 'View Source',
    },
  ],

  // SHOW_TERMINAL: false → hides terminal entirely (chrome bar hidden too)
  SHOW_TERMINAL: false,

  termAboutExtra: [], // displays in CLI when calling the `about` command
};
