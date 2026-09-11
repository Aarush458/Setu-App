import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
    const { t } = useTranslation()
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('citizen')
    const [universities, setUniversities] = useState([])
    const [universityId, setUniversityId] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadUniversities() {
            const { data, error } = await supabase.from('universities').select('id, name').order('name')
            if (error) {
                console.error('Failed to load universities:', error)
                return
            }
            setUniversities(data ?? [])
            if (data?.length) setUniversityId(data[0].id)
        }
        loadUniversities()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (role === 'university' && !universityId) {
            setError(t('auth.select_university'))
            return
        }

        setLoading(true)
        const { error } = await signUp({
            email,
            password,
            fullName,
            role,
            universityId: role === 'university' ? universityId : null,
        })
        setLoading(false)
        if (error) {
            setError(t('auth.error_generic'))
            return
        }
        navigate('/track')
    }

    return (
        <div className="mx-auto max-w-sm px-5 py-16">
            <h1 className="font-display text-3xl mb-8">{t('auth.signup_title')}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('auth.full_name')}</label>
                    <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    />
                </div>
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
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('auth.role')}</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    >
                        <option value="citizen">{t('auth.role_citizen')}</option>
                        <option value="university">{t('auth.role_university')}</option>
                    </select>
                </div>

                {role === 'university' && (
                    <div>
                        <label className="block text-sm font-medium mb-1.5">{t('auth.select_university_label')}</label>
                        {universities.length === 0 ? (
                            <p className="text-sm text-muted">{t('auth.no_universities')}</p>
                        ) : (
                            <select
                                value={universityId}
                                onChange={(e) => setUniversityId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                            >
                                {universities.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-teal text-paper dark:bg-accent dark:text-ink font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                    {t('auth.submit_signup')}
                </button>
            </form>
            <p className="mt-6 text-sm text-muted">
                {t('auth.have_account')}{' '}
                <Link to="/login" className="text-teal dark:text-accent font-medium">
                    {t('nav.login')}
                </Link>
            </p>
        </div>
    )
}