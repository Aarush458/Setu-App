import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'

const STATUS_OPTIONS = ['assigned', 'in_progress', 'resolved']

export default function UniversityDashboard() {
    const { t } = useTranslation()
    const { user, profile } = useAuth()
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState({})

    async function load() {
        const { data, error } = await supabase
            .from('problems')
            .select('*')
            .eq('assigned_university_id', profile.university_id)
            .order('created_at', { ascending: false })
        if (error) console.error(error)
        setProblems(data ?? [])
        setLoading(false)
    }

    useEffect(() => {
        if (profile?.university_id) load()
        else setLoading(false)
    }, [profile])

    async function updateStatus(problemId, status) {
        const { error } = await supabase.from('problems').update({ status }).eq('id', problemId)
        if (error) return console.error(error)
        load()
    }

    async function saveNote(problemId) {
        const note = notes[problemId]
        if (!note?.trim()) return
        const { error } = await supabase.from('updates').insert({
            problem_id: problemId,
            author_id: user.id,
            note,
        })
        if (error) return console.error(error)
        setNotes((n) => ({ ...n, [problemId]: '' }))
    }

    return (
        <div className="mx-auto max-w-3xl px-5 py-16">
            <h1 className="font-display text-3xl mb-8">{t('dashboard.university_title')}</h1>

            {loading ? (
                <p className="text-muted">{t('common.loading')}</p>
            ) : problems.length === 0 ? (
                <p className="text-muted">{t('dashboard.university_empty')}</p>
            ) : (
                <div className="space-y-5">
                    {problems.map((p) => (
                        <div key={p.id} className="border border-ink/10 dark:border-paper/10 rounded-xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-medium">{p.title}</h3>
                                <StatusBadge status={p.status} />
                            </div>
                            <p className="text-sm text-muted mt-2">{p.description}</p>
                            {p.location && <p className="text-xs text-muted mt-1">📍 {p.location}</p>}

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <label className="text-xs text-muted">{t('dashboard.update_status')}</label>
                                <select
                                    value={p.status}
                                    onChange={(e) => updateStatus(p.id, e.target.value)}
                                    className="text-sm px-3 py-1.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent"
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{t(`track.status_${s}`)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-3 flex gap-2">
                                <input
                                    value={notes[p.id] ?? ''}
                                    onChange={(e) => setNotes((n) => ({ ...n, [p.id]: e.target.value }))}
                                    placeholder={t('dashboard.note_placeholder')}
                                    className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent"
                                />
                                <button
                                    onClick={() => saveNote(p.id)}
                                    className="text-sm px-4 py-1.5 rounded-lg bg-teal text-paper dark:bg-accent dark:text-ink"
                                >
                                    {t('dashboard.save')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}