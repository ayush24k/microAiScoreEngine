import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite plugin to run Vercel serverless /api/match locally during development
function vercelApiDevPlugin(): Plugin {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api/match', async (req: any, res: any) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: Buffer) => { body += chunk.toString() })
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body || '{}')
            } catch {
              req.body = {}
            }
            try {
              const module = await server.ssrLoadModule('/api/match.ts')
              const handler = module.default || module
              let statusCode = 200
              const mockRes: any = {
                setHeader: (k: string, v: string) => res.setHeader(k, v),
                status: (code: number) => {
                  statusCode = code
                  res.statusCode = code
                  return mockRes
                },
                json: (data: any) => {
                  res.setHeader('Content-Type', 'application/json')
                  res.statusCode = statusCode
                  res.end(JSON.stringify(data))
                },
                end: (data?: any) => res.end(data),
              }
              await handler(req, mockRes)
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message || String(err) }))
            }
          })
        } else {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_ prefixed) into process.env
  // so that api/match.ts can access SUPABASE_URL, OPENAI_API_KEY etc. via process.env in SSR
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
  }
})
