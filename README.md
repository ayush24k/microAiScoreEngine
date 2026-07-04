# Multi-Tenant Security

## Current Project Implementation (Demo)

For this assessment, I simulated a multi-tenant system by treating each recruiter (`ayush`, `zaki`, and `ricky`) as a separate tenant.

When a recruiter is selected in the UI, every database query is filtered using the selected `tenant_id`.

```ts
const { data } = await supabase
  .from("jobs")
  .select("*")
  .eq("tenant_id", selectedTenant);
```

Whenever a new candidate is evaluated, the backend also stores the same `tenant_id` along with the candidate profile and AI evaluation.

This ensures that every job, candidate, and evaluation belongs to a specific tenant.

For this demo, Row Level Security (RLS) is enabled with simple demo policies so I can easily switch between tenants from the UI while still demonstrating tenant isolation.

---

# Tenancy Explained (Simple Analogy)

Imagine three recruitment agencies are using the same application.

```text
Agency A
Agency B
Agency C
```

Instead of giving each agency its own database, they all share **one PostgreSQL database**.

```text
Shared PostgreSQL Database

----------------------------------

Jobs
Candidates
Evaluations

----------------------------------
```

To keep everyone's data separate, every record has a `tenant_id`.

```text
id | candidate | tenant_id

1  | John      | Agency A
2  | Alex      | Agency B
3  | Sarah     | Agency C
```

When Agency A logs in, they should only see records where:

```sql
tenant_id = 'Agency A'
```

Even though all agencies use the same database, they can only access their own data.

With PostgreSQL Row Level Security (RLS), this rule is enforced by the database itself. So even if someone tries to query another agency's data, PostgreSQL blocks the request and only returns rows belonging to their own tenant.

This approach allows multiple organizations to safely share the same database while keeping their data completely isolated.

#  Production Approach

For a real SaaS application, I would never trust a `tenant_id` coming from the frontend.

Instead, recruiters would authenticate using **Supabase Auth** (Email/Password, OAuth, SSO, etc.) and receive a secure JWT.

The backend would determine which organization the user belongs to based on that authenticated session.

A production database would look something like this:

```text
organizations

organization_members

jobs

candidates

evaluations
```

Every table would contain an `organization_id` (tenant).

Instead of trusting client input, PostgreSQL Row Level Security would automatically verify that the authenticated user belongs to that organization before returning any data.

Example RLS policy:

```sql
CREATE POLICY "Organization Access"
ON jobs
FOR SELECT
USING (
  tenant_id IN (
    SELECT organization_id
    FROM organization_members
    WHERE user_id = auth.uid()
  )
);
```

This means that even if someone manually changes the `tenant_id` in a request, PostgreSQL will still deny access because authorization is enforced at the database level.