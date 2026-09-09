function norm(s) {
  return String(s || "").toLowerCase().trim();
}

const SKILL_ALIASES = {
  "JavaScript": ["javascript", "js", "ecmascript"],
  "TypeScript": ["typescript", "ts"],
  "React": ["react", "reactjs", "react.js"],
  "Next.js": ["next.js", "nextjs", "next js"],
  "Vue.js": ["vue", "vuejs", "vue.js"],
  "Angular": ["angular", "angularjs"],
  "Node.js": ["node", "nodejs", "node.js"],
  "Express": ["express", "expressjs", "express.js"],
  "MongoDB": ["mongodb", "mongo", "mongoose"],
  "PostgreSQL": ["postgres", "postgresql"],
  "MySQL": ["mysql"],
  "SQL": ["sql", "sqlite", "rdbms"],
  "Redis": ["redis"],
  "REST API": ["rest", "rest api", "restful", "apis"],
  "GraphQL": ["graphql"],
  "Git": ["git", "github", "gitlab", "bitbucket"],
  "Docker": ["docker", "container", "containers", "containerization"],
  "Kubernetes": ["kubernetes", "k8s"],
  "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda"],
  "Azure": ["azure"],
  "GCP": ["gcp", "google cloud"],
  "Linux": ["linux", "ubuntu", "debian", "centos", "bash", "shell"],
  "CI/CD": ["ci/cd", "cicd", "continuous integration", "github actions", "jenkins"],
  "Testing": ["testing", "unit testing", "integration testing", "jest", "vitest", "cypress", "mocha"],
  "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
  "Bootstrap": ["bootstrap"],
  "HTML": ["html", "html5"],
  "CSS": ["css", "css3", "sass", "scss"],
  "Responsive Design": ["responsive", "mobile-first", "responsive design"],
  "State Management": ["redux", "zustand", "context api", "mobx", "recoil"],
  "Authentication": ["authentication", "authorization", "jwt", "oauth", "auth"],
  "Python": ["python", "py"],
  "Django": ["django"],
  "Flask": ["flask"],
  "FastAPI": ["fastapi"],
  "Java": ["java", "core java"],
  "Spring Boot": ["spring", "spring boot", "springboot"],
  "C++": ["c++", "cpp"],
  "C#": ["c#", "csharp", "dotnet", ".net"],
  "PHP": ["php", "laravel"],
  "Ruby": ["ruby", "ruby on rails", "rails"],
  "Go": ["golang", "go language"],
  "Rust": ["rust"],
  "Microservices": ["microservices", "microservice architecture"],
  "System Design": ["system design", "system architecture"],
  "Performance Optimization": ["performance optimization", "web performance", "profiling"],
  "Machine Learning": ["machine learning", "ml", "deep learning", "ai", "artificial intelligence"],
  "Data Science": ["data science", "data scientist"],
  "Data Analysis": ["data analysis", "data analytics"],
  "Power BI": ["power bi", "powerbi"],
  "Tableau": ["tableau"],
  "Excel": ["excel", "spreadsheets"],
  "Communication": ["communication", "team collaboration", "presentation", "stakeholder management"],
};

function extractSkillsFromText(text) {
  if (!text || typeof text !== "string") return [];
  const lower = norm(text);

  const found = new Set();
  for (const [skill, aliases] of Object.entries(SKILL_ALIASES)) {
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(^|[^a-zA-Z0-9#+.-])${escaped}([^a-zA-Z0-9#+.-]|$)`, "i");
      if (regex.test(lower)) {
        found.add(skill);
        break;
      }
    }
  }

  return Array.from(found).sort((a, b) => a.localeCompare(b));
}

module.exports = { extractSkillsFromText, SKILL_ALIASES };
