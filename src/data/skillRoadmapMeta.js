export const SKILL_META = {
  "HTML": {
    tip: "Focus on semantic tags, forms, and accessibility (a11y).",
    miniProject: "Build a simple portfolio page with sections + contact form UI.",
    prerequisites: [],
  },
  "CSS": {
    tip: "Learn Flexbox + Grid + responsive breakpoints. Practice layouts daily.",
    miniProject: "Clone a landing page layout (navbar, hero, cards, footer).",
    prerequisites: ["HTML"],
  },
  "JavaScript": {
    tip: "Master fundamentals: functions, arrays, objects, async/await, DOM basics.",
    miniProject: "Build a todo app with localStorage + search/filter.",
    prerequisites: ["HTML", "CSS"],
  },
  "TypeScript": {
    tip: "Learn types, interfaces, generics, and type narrowing.",
    miniProject: "Convert your React components to TypeScript.",
    prerequisites: ["JavaScript"],
  },
  "React": {
    tip: "Build UI using components + hooks, and practice API fetching.",
    miniProject: "Build a job-listing UI with filters + API data (mock).",
    prerequisites: ["JavaScript"],
  },
  "State Management": {
    tip: "Use Context for small apps, Redux/Zustand for larger apps.",
    miniProject: "Add global state for login + theme + saved jobs.",
    prerequisites: ["React"],
  },
  "REST API": {
    tip: "Understand HTTP methods, status codes, headers, and JSON.",
    miniProject: "Test APIs using Postman and build a small CRUD UI.",
    prerequisites: ["JavaScript"],
  },
  "API Integration": {
    tip: "Practice Fetch/Axios, error handling, loading states, and retries.",
    miniProject: "Integrate a public API and show data with pagination.",
    prerequisites: ["JavaScript", "REST API"],
  },
  "Node.js": {
    tip: "Learn runtime basics, modules, async patterns, and file I/O.",
    miniProject: "Create a simple REST API server that returns JSON.",
    prerequisites: ["JavaScript", "REST API"],
  },
  "Express": {
    tip: "Build routes, middleware, validation, and error handling.",
    miniProject: "Create CRUD endpoints + middleware logging.",
    prerequisites: ["Node.js"],
  },
  "MongoDB": {
    tip: "Learn collections, schemas, indexing, and aggregation basics.",
    miniProject: "Build a notes app backend with MongoDB CRUD.",
    prerequisites: ["REST API"],
  },
  "SQL": {
    tip: "Practice SELECT, JOIN, GROUP BY, and subqueries.",
    miniProject: "Design a small schema and write 20 query exercises.",
    prerequisites: [],
  },
  "Authentication": {
    tip: "Understand hashing, sessions/JWT, and secure auth patterns.",
    miniProject: "Add login/signup to your API with protected routes.",
    prerequisites: ["REST API", "Node.js"],
  },
  "Authentication (JWT)": {
    tip: "Implement JWT login, refresh token idea, and route protection.",
    miniProject: "Create auth + protected profile endpoint in Express.",
    prerequisites: ["Authentication"],
  },
  "Git": {
    tip: "Learn commit discipline, branches, pull requests, and merge conflicts.",
    miniProject: "Create a GitHub repo and push daily progress with branches.",
    prerequisites: [],
  },
  "Testing": {
    tip: "Learn unit testing + component testing; focus on edge cases.",
    miniProject: "Write tests for one component + one API function.",
    prerequisites: ["JavaScript"],
  },
  "Deployment": {
    tip: "Learn build process, environment variables, and hosting basics.",
    miniProject: "Deploy frontend on Vercel and backend on Render.",
    prerequisites: ["Git"],
  },
};
