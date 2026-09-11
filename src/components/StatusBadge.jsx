import { useTranslation } from 'react-i18next'

const STYLES = {
    submitted: 'bg-ink/10 text-ink dark:bg-paper/10 dark:text-paper',
    assigned: 'bg-accent/20 text-accent-dark dark:bg-accent/25 dark:text-accent',
    in_progress: 'bg-teal/15 text-teal dark:bg-teal-light/20 dark:text-teal-light',
    resolved: 'bg-teal text-paper',
}

export default function StatusBadge({ status }) {
    const { t } = useTranslation()
    const label = t(`track.status_${status}`, status)
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STYLES[status] ?? STYLES.submitted}`}>
            {label}
        </span>
    )
}