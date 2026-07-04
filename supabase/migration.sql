-- ==========================================================
-- Table: jobs
-- Stores open requisitions and required skills/technologies
-- ==========================================================
CREATE TABLE IF NOT EXISTS jobs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID,
  title        TEXT NOT NULL,
  requirements TEXT[],
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON jobs(tenant_id);

-- Disable Row Level Security (RLS) for seamless local development and serverless API access
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;


-- ==========================================================
-- Table: candidates
-- Stores applicant profiles, CV text, and unique SHA-256 hashes
-- ==========================================================
CREATE TABLE IF NOT EXISTS candidates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID,
  name         TEXT NOT NULL,
  email        TEXT,
  resume       TEXT,
  resume_hash  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_tenant      ON candidates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_candidates_resume_hash ON candidates(resume_hash);

-- Disable Row Level Security (RLS) for seamless local development and serverless API access
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;


-- ==========================================================
-- Table: candidate_matches
-- Caches AI evaluation results and match scores per candidate/job pair
-- ==========================================================
CREATE TABLE IF NOT EXISTS candidate_matches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID,
  candidate_id   UUID REFERENCES candidates(id) ON DELETE CASCADE,
  job_id         UUID REFERENCES jobs(id) ON DELETE CASCADE,
  match_score    INTEGER,
  matched_skills TEXT[],
  evaluation     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_lookup ON candidate_matches(candidate_id, job_id);
CREATE INDEX IF NOT EXISTS idx_matches_tenant ON candidate_matches(tenant_id);

-- Disable Row Level Security (RLS) for seamless local development and serverless API access
ALTER TABLE candidate_matches DISABLE ROW LEVEL SECURITY;


-- ==========================================================
-- Seed Data: Initial Requisitions
-- Populates default job vacancies for demonstration and testing
-- ==========================================================
INSERT INTO jobs (title, requirements, description) VALUES
(
  'React Developer',
  ARRAY['TypeScript', 'Tailwind CSS', 'PostgreSQL', 'React 18', 'State Management'],
  'Architect and develop responsive, high-performance web applications using modern React, TypeScript, and Tailwind CSS with direct PostgreSQL integration.'
),
(
  'Backend Engineer',
  ARRAY['Node.js', 'Express/NestJS', 'PostgreSQL', 'AWS Services', 'REST & GraphQL APIs'],
  'Design and scale robust backend microservices, database schemas, and cloud infrastructures on AWS to support high-concurrency client applications.'
),
(
  'Product Designer',
  ARRAY['Figma', 'UI/UX Architecture', 'Design Systems', 'User Research', 'Prototyping'],
  'Lead end-to-end user experience and visual design for enterprise SaaS products, creating comprehensive Figma design systems and interactive workflows.'
),
(
  'DevOps Engineer',
  ARRAY['Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Cloud Security'],
  'Manage containerized deployments, infrastructure as code (IaC), and automated CI/CD pipelines to ensure 99.99% system reliability and security compliance.'
);
