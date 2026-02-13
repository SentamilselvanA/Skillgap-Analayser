// Extract skills from a job description using keyword + synonyms matching.

function norm(s) {
  return String(s || "").toLowerCase().trim();
}

// Add more aliases anytime (easy to extend)
const SKILL_ALIASES = {
  "JavaScript": ["javascript", "js", "ecmascript"],
  "TypeScript": ["typescript", "ts"],
  "React": ["react", "reactjs", "react.js"],
  "Node.js": ["node", "nodejs", "node.js"],
  "Express": ["express", "expressjs"],
  "MongoDB": ["mongodb", "mongo"],
  "SQL": ["sql", "mysql", "postgres", "postgresql"],
  "REST API": ["rest", "rest api", "restful", "api", "apis", "http"],
  "Git": ["git", "github", "gitlab", "bitbucket"],
  "Testing": ["testing", "unit testing", "integration testing", "jest", "vitest", "cypress"],
  "Deployment": ["deployment", "deploy", "vercel", "netlify", "render", "aws", "azure"],
  "Docker": ["docker", "container", "containers"],
  "Linux": ["linux", "ubuntu", "bash", "shell"],
  "AWS": ["aws", "ec2", "s3", "iam", "vpc", "cloudwatch"],
  "Authentication": ["authentication", "authorization", "jwt", "oauth", "sessions"],
  "State Management": ["redux", "zustand", "context api", "state management"],
  "API Integration": ["axios", "fetch", "api integration", "api consumption"],
  "HTML": ["html"],
  "CSS": ["css", "tailwind", "bootstrap"],
  "Responsive Design": ["responsive", "mobile-first", "responsivedesign"],
  "Performance Optimization": ["performance", "optimization", "profiling"],
  "Networking Basics": ["networking", "tcp", "ip", "dns", "http"],
  "CI/CD": ["ci/cd", "cicd", "pipeline", "github actions", "jenkins"],
  "Kubernetes": ["kubernetes", "k8s"],
  "Monitoring": ["monitoring", "observability", "logs", "metrics", "prometheus", "grafana"],
  "Python": ["python"],
  "Java": ["java"],
  "Spring Boot": ["spring", "spring boot"],
  "Django/Flask": ["django", "flask"],
  "Power BI": ["power bi", "powerbi"],
  "Tableau": ["tableau"],
  "Excel": ["excel", "spreadsheets"],
  "Statistics": ["statistics", "probability"],
  "Machine Learning": ["machine learning", "ml"],
  "Data Visualization": ["data visualization", "visualization", "charts", "dashboards"],
  "Data Cleaning": ["data cleaning", "data preprocessing", "cleaning"],
  "Communication": ["communication", "presentation", "stakeholder"],
};

export function extractSkillsFromJD(text) {
  const t = norm(text);

  if (!t) return [];

  const found = [];

  for (const [skill, aliases] of Object.entries(SKILL_ALIASES)) {
    const hit = aliases.some((a) => {
      const pattern = norm(a);
      // word-boundary-ish check (works well enough for most JDs)
      return t.includes(pattern);
    });

    if (hit) found.push(skill);
  }

  // sort stable
  return found.sort((a, b) => a.localeCompare(b));
}
