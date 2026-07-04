import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import './App.css'

interface Todo {
  id: string | number
  name: string
  created_at?: string
  completed?: boolean
  [key: string]: any
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodoName, setNewTodoName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getTodos() {
    try {
      setLoading(true)
      setError(null)
      const { data: todos, error: supabaseError } = await supabase
        .from('todos')
        .select()
        .order('id', { ascending: true })

      if (supabaseError) {
        setError(supabaseError.message)
      } else if (todos) {
        setTodos(todos)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTodos()
  }, [])

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!newTodoName.trim()) return

    try {
      setIsSubmitting(true)
      const { error: insertError } = await supabase
        .from('todos')
        .insert([{ name: newTodoName.trim() }])

      if (insertError) {
        setError(insertError.message)
      } else {
        setNewTodoName('')
        await getTodos()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add todo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-16 px-4 selection:bg-emerald-500 selection:text-black font-sans">
      {/* Background Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-emerald-600/20 to-indigo-600/20 blur-[120px] pointer-events-none rounded-full -z-10" />

      <main className="w-full max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase Live Connected
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Supabase Data Feed
          </h1>
          <p className="text-slate-400 text-base max-w-md">
            Querying and managing your <code className="text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-800">todos</code> table in real time.
          </p>
        </header>

        {/* Interactive Add Todo Form */}
        <form onSubmit={handleAddTodo} className="flex items-center gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-xl focus-within:border-emerald-500/50 transition-all">
          <input
            type="text"
            value={newTodoName}
            onChange={(e) => setNewTodoName(e.target.value)}
            placeholder="Add a new task to your table..."
            className="flex-1 bg-transparent px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none text-sm font-medium"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newTodoName.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <span>Add Todo</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Error Notice */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-300 text-sm backdrop-blur-md">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Supabase Query Notice</p>
              <p className="text-rose-300/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Todos Card Container */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-200">Database Records</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-medium">
                {todos.length}
              </span>
            </div>
            <button
              onClick={getTodos}
              disabled={loading}
              title="Refresh Todos"
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-sm font-medium animate-pulse">Querying table 'todos'...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <p className="text-slate-300 font-medium">No todos found in Supabase</p>
                <p className="text-slate-500 text-sm mt-1">Use the form above to insert a new row or add one via your Supabase dashboard.</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors text-base">
                      {todo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800/80">
                      ID: {todo.id}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
