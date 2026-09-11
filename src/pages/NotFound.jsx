import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
    const { t } = useTranslation()

    return (
        <div className="mx-auto max-w-md px-5 py-24 text-center">
            <p className="font-display text-7xl text-accent mb-4">404</p>
            <h1 className="font-display text-2xl mb-3">{t('not_found.title')}</h1>
            <p className="text-muted mb-8 leading-relaxed">{t('not_found.body')}</p>
            <Link
                to="/"
                className="inline-block px-6 py-2.5 rounded-full bg-teal text-paper dark:bg-accent dark:text-ink font-medium hover:opacity-90 transition-opacity"
            >
                {t('common.back_home')}
            </Link>
        </div>
    )
}