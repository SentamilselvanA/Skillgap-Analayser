import { roles } from "../data/rolesMock";

// keywords that map to role IDs
const ROLE_KEYWORDS = [
  { id: "frontend-dev", keywords: ["frontend developer", "front end developer", "frontend engineer"] },
  { id: "react-dev", keywords: ["react developer", "react engineer"] },
  { id: "mern-dev", keywords: ["mern developer", "mern stack developer"] },
  { id: "fullstack-dev", keywords: ["full stack developer", "fullstack developer", "full stack engineer"] },
  { id: "backend-node", keywords: ["node developer", "backend developer", "backend node", "node.js developer"] },
  { id: "java-backend", keywords: ["java backend", "java developer", "spring boot developer"] },
  { id: "python-backend", keywords: ["python backend", "django developer", "flask developer"] },
  { id: "data-analyst", keywords: ["data analyst", "business analyst"] },
  { id: "data-scientist", keywords: ["data scientist", "machine learning engineer"] },
  { id: "devops", keywords: ["devops engineer", "site reliability engineer", "sre"] },
  { id: "cloud-aws", keywords: ["cloud engineer", "aws engineer"] },
  { id: "qa-tester", keywords: ["qa tester", "software tester", "quality analyst"] },
  { id: "ui-ux", keywords: ["ui ux designer", "ux designer", "ui designer"] },
];

export function detectRoleFromText(text) {
  const t = (text || "").toLowerCase();

  const hit = ROLE_KEYWORDS.find((r) =>
    r.keywords.some((k) => t.includes(k))
  );

  if (!hit) return null;

  const role = roles.find((r) => r.id === hit.id);
  return role || null;
}
