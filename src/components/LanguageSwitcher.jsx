import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
    { code: 'en', label: 'EN' },
    { code: 'hinglish', label: 'Hinglish' },
    { code: 'hi', label: 'हिं' },
]

export default function LanguageSwitcher({ className = '' }) {
    const { i18n } = useTranslation()

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <Globe size={16} className="text-muted mr-1" aria-hidden="true" />
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-sm transition-colors ${i18n.resolvedLanguage === lang.code
                            ? 'bg-teal text-paper dark:bg-accent dark:text-ink'
                            : 'text-muted hover:text-ink dark:hover:text-paper'
                        }`}
                    aria-pressed={i18n.resolvedLanguage === lang.code}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    )
}