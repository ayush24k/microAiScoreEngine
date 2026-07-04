import type { Job } from '../types/dashboard'

export const initialJobs: Job[] = [
  {
    id: 'job-1',
    title: 'React Developer',
    tags: ['TypeScript', 'Tailwind', 'PostgreSQL'],
    requirements: ['TypeScript', 'Tailwind CSS', 'PostgreSQL', 'React 18', 'State Management'],
    description: 'Architect and develop responsive, high-performance web applications using modern React, TypeScript, and Tailwind CSS with direct PostgreSQL integration.',
  },
  {
    id: 'job-2',
    title: 'Backend Engineer',
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
    requirements: ['Node.js', 'Express/NestJS', 'PostgreSQL', 'AWS Services', 'REST & GraphQL APIs'],
    description: 'Design and scale robust backend microservices, database schemas, and cloud infrastructures on AWS to support high-concurrency client applications.',
  },
  {
    id: 'job-3',
    title: 'Product Designer',
    tags: ['Figma', 'Design systems'],
    requirements: ['Figma', 'UI/UX Architecture', 'Design Systems', 'User Research', 'Prototyping'],
    description: 'Lead end-to-end user experience and visual design for enterprise SaaS products, creating comprehensive Figma design systems and interactive workflows.',
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    tags: ['Kubernetes', 'Terraform'],
    requirements: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Cloud Security'],
    description: 'Manage containerized deployments, infrastructure as code (IaC), and automated CI/CD pipelines to ensure 99.99% system reliability and security compliance.',
  },
]
