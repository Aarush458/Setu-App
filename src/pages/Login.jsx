import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { t } = useTranslation()
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const { error } = await signIn({ email, password })
        setLoading(false)
        if (error) {
            setError(t('auth.error_generic'))
            return
        }
        navigate('/track')
    }

    return (
        <div className="mx-auto max-w-sm px-5 py-16">
            <h1 className="font-display text-3xl mb-8">{t('auth.login_title')}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('auth.email')}</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('auth.password')}</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-teal text-paper dark:bg-accent dark:text-ink font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                    {t('auth.submit_login')}
                </button>
            </form>
            <p className="mt-6 text-sm text-muted">
                {t('auth.no_account')}{' '}
                <Link to="/signup" className="text-teal dark:text-accent font-medium">
                    {t('nav.signup')}
                </Link>
            </p>
        </div>
    )
}