-- ==========================================================
-- Table: jobs
-- Stores open requisitions and required skills/technologies
-- ==========================================================
CREATE TABLE IF NOT EXISTS jobs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    TEXT,
  title        TEXT NOT NULL,
  requirements TEXT[],
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON jobs(tenant_id);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for multi-tenant access (ayush, zaki, ricky)
CREATE POLICY "Tenant read jobs" ON jobs 
FOR SELECT USING (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);

CREATE POLICY "Tenant insert jobs" ON jobs 
FOR INSERT WITH CHECK (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);

CREATE POLICY "Tenant update jobs" ON jobs 
FOR UPDATE USING (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);


-- ==========================================================
-- Table: candidates
-- Stores applicant profiles, CV text, and unique SHA-256 hashes
-- ==========================================================
CREATE TABLE IF NOT EXISTS candidates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    TEXT,
  name         TEXT NOT NULL,
  email        TEXT,
  resume       TEXT,
  resume_hash  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_tenant      ON candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_candidates_resume_hash ON candidates(resume_hash);

-- Enable Row Level Security (RLS)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for multi-tenant access
CREATE POLICY "Tenant read candidates" ON candidates 
FOR SELECT USING (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);

CREATE POLICY "Tenant insert candidates" ON candidates 
FOR INSERT WITH CHECK (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);


-- ==========================================================
-- Table: candidate_matches
-- Caches AI evaluation results and match scores per candidate/job pair
-- ==========================================================
CREATE TABLE IF NOT EXISTS candidate_matches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      TEXT,
  candidate_id   UUID REFERENCES candidates(id) ON DELETE CASCADE,
  job_id         UUID REFERENCES jobs(id) ON DELETE CASCADE,
  match_score    INTEGER,
  matched_skills TEXT[],
  evaluation     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_lookup ON candidate_matches(candidate_id, job_id);
CREATE INDEX IF NOT EXISTS idx_matches_tenant ON candidate_matches(tenant_id);

-- Enable Row Level Security (RLS)
ALTER TABLE candidate_matches ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for multi-tenant access
CREATE POLICY "Tenant read matches" ON candidate_matches 
FOR SELECT USING (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);

CREATE POLICY "Tenant insert matches" ON candidate_matches 
FOR INSERT WITH CHECK (
  tenant_id IN ('ayush', 'zaki', 'ricky') OR tenant_id IS NULL
);


-- ==========================================================
-- Seed Data: Initial Requisitions assigned to Tenants
-- Populates default job vacancies for demonstration and testing
-- ==========================================================
INSERT INTO jobs (title, requirements, description, tenant_id) VALUES
-- Jobs for AYUSH
(
  'React Developer',
  ARRAY['TypeScript', 'Tailwind CSS', 'PostgreSQL', 'React 18', 'State Management'],
  'Architect and develop responsive, high-performance web applications using modern React, TypeScript, and Tailwind CSS with direct PostgreSQL integration.',
  'ayush'
),
(
  'DevOps Engineer',
  ARRAY['Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Cloud Security'],
  'Manage containerized deployments, infrastructure as code (IaC), and automated CI/CD pipelines to ensure 99.99% system reliability and security compliance.',
  'ayush'
),
(
  'Full Stack AI Engineer',
  ARRAY['TypeScript', 'Next.js', 'Python', 'OpenAI API', 'LangChain', 'PostgreSQL'],
  'Build cutting-edge agentic workflows and full-stack generative AI applications combining rich Next.js user interfaces with robust LLM orchestration pipelines.',
  'ayush'
),
(
  'Mobile App Developer',
  ARRAY['React Native', 'iOS', 'Android', 'TypeScript', 'Mobile UI/UX', 'Redux Toolkit'],
  'Lead the development of cross-platform mobile applications with fluid 60fps animations, native API integrations, and offline-first data caching.',
  'ayush'
),

-- Jobs for ZAKI
(
  'Backend Engineer',
  ARRAY['Node.js', 'Express/NestJS', 'PostgreSQL', 'AWS Services', 'REST & GraphQL APIs'],
  'Design and scale robust backend microservices, database schemas, and cloud infrastructures on AWS to support high-concurrency client applications.',
  'zaki'
),
(
  'Cloud Solutions Architect',
  ARRAY['AWS', 'GCP', 'Microservices Architecture', 'Kubernetes', 'Serverless', 'Terraform'],
  'Design multi-region cloud infrastructures, evaluate cost-latency trade-offs, and establish enterprise disaster recovery paradigms for SaaS platforms.',
  'zaki'
),
(
  'Senior Data Engineer',
  ARRAY['Python', 'PySpark', 'Snowflake', 'SQL', 'ETL Pipelines', 'Apache Airflow'],
  'Architect scalable data warehousing pipelines, optimize complex SQL queries, and process petabyte-scale telemetry streams for real-time analytics.',
  'zaki'
),
(
  'Cybersecurity Specialist',
  ARRAY['Network Security', 'Penetration Testing', 'SIEM', 'Cloud Security', 'SOC 2 Compliance'],
  'Conduct proactive vulnerability assessments, harden cloud infrastructures against intrusion, and manage enterprise security compliance frameworks.',
  'zaki'
),

-- Jobs for RICKY
(
  'Product Designer',
  ARRAY['Figma', 'UI/UX Architecture', 'Design Systems', 'User Research', 'Prototyping'],
  'Lead end-to-end user experience and visual design for enterprise SaaS products, creating comprehensive Figma design systems and interactive workflows.',
  'ricky'
),
(
  'AI Research Scientist',
  ARRAY['PyTorch', 'Machine Learning', 'NLP', 'Deep Learning', 'Transformer Models', 'Python'],
  'Research and fine-tune frontier transformer models, design novel alignment algorithms, and advance the state-of-the-art in autonomous AI systems.',
  'ricky'
),
(
  'Senior UI Engineer',
  ARRAY['Vue.js', 'Nuxt', 'CSS Animations', 'WebGL', 'Tailwind CSS', 'TypeScript'],
  'Craft visually breathtaking web interfaces with fluid micro-animations, custom shaders, and meticulous attention to typography and layout.',
  'ricky'
),
(
  'Product Manager (AI/ML)',
  ARRAY['Product Strategy', 'Agile/Scrum', 'Data Analytics', 'AI Roadmap', 'User Interviews'],
  'Drive product vision and go-to-market strategy for AI-powered recruiting tools, bridging customer needs with cutting-edge engineering capabilities.',
  'ricky'
);
