import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'

export default function CitizenDashboard() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('problems')
                .select('*, universities(name)')
                .eq('submitted_by', user.id)
                .order('created_at', { ascending: false })
            if (error) console.error(error)
            setProblems(data ?? [])
            setLoading(false)
        }
        if (user) load()
    }, [user])

    return (
        <div className="mx-auto max-w-3xl px-5 py-16">
            <h1 className="font-display text-3xl mb-8">{t('track.title')}</h1>

            {loading ? (
                <p className="text-muted">{t('common.loading')}</p>
            ) : problems.length === 0 ? (
                <p className="text-muted">{t('track.empty')}</p>
            ) : (
                <div className="space-y-4">
                    {problems.map((p) => (
                        <div key={p.id} className="border border-ink/10 dark:border-paper/10 rounded-xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-medium">{p.title}</h3>
                                <StatusBadge status={p.status} />
                            </div>
                            <p className="text-sm text-muted mt-2">{p.description}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-muted">
                                {p.category && (
                                    <span>{t('track.category')}: {p.category}</span>
                                )}
                                {p.universities?.name && (
                                    <span>{t('track.assigned_to')}: {p.universities.name}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}