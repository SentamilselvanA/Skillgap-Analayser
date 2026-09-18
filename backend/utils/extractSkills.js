function norm(s) {
  return String(s || "").toLowerCase().trim();
}

const SKILL_ALIASES = {
  // ── Languages ──────────────────────────────────────────────────────────────
  "JavaScript": ["javascript", "js", "ecmascript", "es6", "es2015", "es2016", "es2017", "es2018", "es2019", "es2020", "vanilla js", "vanillajs"],
  "TypeScript": ["typescript", "ts", "typescript.js"],
  "Python": ["python", "python3", "python2", "py"],
  "Java": ["java", "core java", "java se", "java ee"],
  "C++": ["c++", "cpp", "c plus plus"],
  "C#": ["c#", "csharp", "c sharp", "dotnet", ".net", "asp.net", "aspnet"],
  "C": ["c language", "c programming"],
  "Go": ["go", "golang", "go language"],
  "Rust": ["rust", "rust-lang"],
  "Ruby": ["ruby", "ruby on rails", "rails", "ror"],
  "PHP": ["php", "php7", "php8"],
  "Swift": ["swift", "swiftui"],
  "Kotlin": ["kotlin"],
  "Scala": ["scala"],
  "R": ["r language", "r programming"],
  "MATLAB": ["matlab"],
  "Dart": ["dart"],
  "Lua": ["lua"],
  "Perl": ["perl"],
  "Haskell": ["haskell"],
  "Elixir": ["elixir"],
  "Clojure": ["clojure"],

  // ── Frontend Frameworks / Libraries ────────────────────────────────────────
  "React": ["react", "reactjs", "react.js", "react js", "react library"],
  "Next.js": ["next.js", "nextjs", "next js", "next"],
  "Vue.js": ["vue", "vuejs", "vue.js", "vue js", "vue 3", "vue3"],
  "Nuxt.js": ["nuxt", "nuxtjs", "nuxt.js", "nuxt js"],
  "Angular": ["angular", "angularjs", "angular.js", "angular 2", "angular2", "angular 14", "angular 15", "angular 16", "angular 17"],
  "Svelte": ["svelte", "sveltejs", "svelte.js", "sveltekit"],
  "Remix": ["remix", "remix.run"],
  "Gatsby": ["gatsby", "gatsbyjs", "gatsby.js"],
  "Ember.js": ["ember", "emberjs", "ember.js"],
  "Backbone.js": ["backbone", "backbonejs", "backbone.js"],
  "jQuery": ["jquery", "jquery.js"],
  "Alpine.js": ["alpine", "alpinejs", "alpine.js"],
  "Lit": ["lit", "lit-element", "lithtml"],
  "Stencil": ["stencil", "stenciljs"],
  "Preact": ["preact"],
  "Solid.js": ["solid", "solidjs", "solid.js"],
  "Qwik": ["qwik"],
  "Astro": ["astro"],

  // ── Backend Frameworks ──────────────────────────────────────────────────────
  "Node.js": ["node", "nodejs", "node.js", "node js"],
  "Express": ["express", "expressjs", "express.js", "express js", "express framework"],
  "NestJS": ["nest", "nestjs", "nest.js"],
  "Fastify": ["fastify"],
  "Koa": ["koa", "koajs", "koa.js"],
  "Hapi": ["hapi", "hapijs"],
  "Django": ["django", "django rest framework", "drf"],
  "Flask": ["flask"],
  "FastAPI": ["fastapi", "fast api"],
  "Spring Boot": ["spring", "spring boot", "springboot", "spring framework", "spring mvc"],
  "Laravel": ["laravel"],
  "Symfony": ["symfony"],
  "CodeIgniter": ["codeigniter"],
  "ASP.NET": ["asp.net core", "aspnet core", "asp.net mvc"],
  "Gin": ["gin", "gin-gonic"],
  "Echo": ["echo framework"],
  "Fiber": ["fiber", "gofiber"],
  "Actix": ["actix", "actix-web"],
  "Phoenix": ["phoenix", "phoenix framework"],

  // ── Databases ───────────────────────────────────────────────────────────────
  "MongoDB": ["mongodb", "mongo", "mongoose"],
  "PostgreSQL": ["postgres", "postgresql", "psql"],
  "MySQL": ["mysql", "mysql2"],
  "SQLite": ["sqlite", "sqlite3"],
  "SQL": ["sql", "rdbms", "relational database"],
  "Redis": ["redis", "redis cache"],
  "Cassandra": ["cassandra", "apache cassandra"],
  "DynamoDB": ["dynamodb", "dynamo db", "amazon dynamodb"],
  "Firebase": ["firebase", "firestore", "firebase realtime database"],
  "Supabase": ["supabase"],
  "Elasticsearch": ["elasticsearch", "elastic search", "opensearch"],
  "Neo4j": ["neo4j", "graph database"],
  "CouchDB": ["couchdb"],
  "InfluxDB": ["influxdb"],
  "MariaDB": ["mariadb"],
  "Oracle DB": ["oracle", "oracle db", "oracle database"],
  "Microsoft SQL Server": ["mssql", "sql server", "microsoft sql server", "t-sql"],
  "PlanetScale": ["planetscale"],
  "Prisma": ["prisma", "prisma orm"],
  "Sequelize": ["sequelize", "sequelize orm"],
  "TypeORM": ["typeorm"],
  "Hibernate": ["hibernate"],

  // ── Cloud & DevOps ──────────────────────────────────────────────────────────
  "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda", "cloudfront", "rds", "ecs", "eks", "sqs", "sns", "iam", "cloudwatch"],
  "Azure": ["azure", "microsoft azure", "azure devops"],
  "GCP": ["gcp", "google cloud", "google cloud platform", "gke", "bigquery", "cloud run"],
  "Docker": ["docker", "dockerfile", "docker compose", "docker-compose", "container", "containers", "containerization"],
  "Kubernetes": ["kubernetes", "k8s", "kubectl", "helm"],
  "Terraform": ["terraform", "terraform iac", "hcl"],
  "Ansible": ["ansible"],
  "Pulumi": ["pulumi"],
  "CI/CD": ["ci/cd", "cicd", "continuous integration", "continuous deployment", "continuous delivery", "github actions", "jenkins", "gitlab ci", "circleci", "travis ci", "bitbucket pipelines", "argocd"],
  "Linux": ["linux", "ubuntu", "debian", "centos", "rhel", "fedora", "bash", "shell", "shell scripting", "unix"],
  "Nginx": ["nginx"],
  "Apache": ["apache", "apache httpd"],
  "Serverless": ["serverless", "serverless framework", "faas"],
  "Prometheus": ["prometheus"],
  "Grafana": ["grafana"],
  "Datadog": ["datadog"],

  // ── APIs & Communication ────────────────────────────────────────────────────
  "REST API": ["rest", "rest api", "restful", "restful api", "restful apis", "apis", "http api"],
  "GraphQL": ["graphql", "graph ql"],
  "gRPC": ["grpc", "g-rpc", "protocol buffers", "protobuf"],
  "WebSockets": ["websockets", "websocket", "ws", "socket.io", "socketio"],
  "tRPC": ["trpc", "t-rpc"],

  // ── Version Control ─────────────────────────────────────────────────────────
  "Git": ["git", "github", "gitlab", "bitbucket", "version control", "source control"],

  // ── Testing ─────────────────────────────────────────────────────────────────
  "Testing": ["testing", "unit testing", "integration testing", "e2e testing", "end-to-end testing", "jest", "vitest", "cypress", "mocha", "chai", "jasmine", "playwright", "selenium", "puppeteer", "supertest", "rtl", "react testing library"],

  // ── Styling ─────────────────────────────────────────────────────────────────
  "HTML": ["html", "html5", "html/css"],
  "CSS": ["css", "css3", "sass", "scss", "less", "stylus"],
  "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css", "tailwind.css"],
  "Bootstrap": ["bootstrap", "bootstrap 4", "bootstrap 5", "bootstrap4", "bootstrap5"],
  "Material UI": ["material ui", "materialui", "mui", "material-ui"],
  "Chakra UI": ["chakra", "chakra ui", "chakraui"],
  "Ant Design": ["ant design", "antd", "ant-design"],
  "Shadcn UI": ["shadcn", "shadcn/ui", "shadcn ui"],
  "Styled Components": ["styled components", "styled-components"],
  "Responsive Design": ["responsive", "mobile-first", "responsive design", "responsive web design"],

  // ── State Management ────────────────────────────────────────────────────────
  "State Management": ["redux", "redux toolkit", "rtk", "zustand", "context api", "react context", "mobx", "recoil", "jotai", "valtio", "xstate", "pinia", "vuex"],

  // ── Auth & Security ─────────────────────────────────────────────────────────
  "Authentication": ["authentication", "authorization", "jwt", "json web token", "oauth", "oauth2", "openid connect", "oidc", "auth", "auth0", "passport", "passportjs", "keycloak", "session management"],

  // ── Build Tools & Bundlers ──────────────────────────────────────────────────
  "Webpack": ["webpack"],
  "Vite": ["vite", "vitejs"],
  "Rollup": ["rollup", "rollupjs"],
  "Parcel": ["parcel"],
  "Babel": ["babel", "babeljs"],
  "ESLint": ["eslint"],
  "Prettier": ["prettier"],
  "npm": ["npm", "node package manager"],
  "Yarn": ["yarn"],
  "pnpm": ["pnpm"],

  // ── Mobile ──────────────────────────────────────────────────────────────────
  "React Native": ["react native", "react-native", "reactnative"],
  "Flutter": ["flutter"],
  "Ionic": ["ionic"],
  "Expo": ["expo"],
  "Android": ["android", "android development", "android sdk"],
  "iOS": ["ios", "ios development", "xcode"],

  // ── AI / ML / Data ──────────────────────────────────────────────────────────
  "Machine Learning": ["machine learning", "ml", "deep learning", "dl", "ai", "artificial intelligence", "neural networks", "neural network"],
  "Data Science": ["data science", "data scientist"],
  "Data Analysis": ["data analysis", "data analytics", "data analyst"],
  "TensorFlow": ["tensorflow", "tf"],
  "PyTorch": ["pytorch", "torch"],
  "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
  "Pandas": ["pandas"],
  "NumPy": ["numpy", "num py"],
  "Matplotlib": ["matplotlib"],
  "Jupyter": ["jupyter", "jupyter notebook", "jupyter lab"],
  "OpenCV": ["opencv", "open cv"],
  "Hugging Face": ["hugging face", "huggingface", "transformers"],
  "LangChain": ["langchain", "lang chain"],
  "Power BI": ["power bi", "powerbi", "power-bi"],
  "Tableau": ["tableau"],
  "Excel": ["excel", "ms excel", "microsoft excel", "spreadsheets"],

  // ── Architecture & Practices ────────────────────────────────────────────────
  "Microservices": ["microservices", "microservice", "microservice architecture"],
  "System Design": ["system design", "system architecture", "distributed systems"],
  "Performance Optimization": ["performance optimization", "web performance", "profiling", "optimization"],
  "Agile": ["agile", "scrum", "kanban", "sprint", "jira"],
  "DevOps": ["devops", "dev ops"],
  "Communication": ["communication", "team collaboration", "presentation", "stakeholder management", "teamwork"],
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
