import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabaseClient'
import StatusBadge from '../../components/StatusBadge'

export default function IndustryDashboard() {
    const { t } = useTranslation()
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            // Public-visibility read: only 'resolved' + 'in_progress' problems are visible
            // to non-assigned roles under the current RLS policies.
            const { data, error } = await supabase
                .from('problems')
                .select('*, universities(name)')
                .in('status', ['in_progress', 'resolved'])
                .order('created_at', { ascending: false })
            if (error) console.error(error)
            setProblems(data ?? [])
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div className="mx-auto max-w-3xl px-5 py-16">
            <h1 className="font-display text-3xl mb-3">{t('dashboard.industry_title')}</h1>
            <p className="text-sm text-muted mb-8 max-w-lg">{t('dashboard.industry_note')}</p>

            {loading ? (
                <p className="text-muted">{t('common.loading')}</p>
            ) : (
                <div className="space-y-4">
                    {problems.map((p) => (
                        <div key={p.id} className="border border-ink/10 dark:border-paper/10 rounded-xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-medium">{p.title}</h3>
                                <StatusBadge status={p.status} />
                            </div>
                            <p className="text-sm text-muted mt-2">{p.description}</p>
                            {p.universities?.name && (
                                <p className="text-xs text-muted mt-2">{t('track.assigned_to')}: {p.universities.name}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}