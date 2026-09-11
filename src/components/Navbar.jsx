import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const { session, profile, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const dashboardPath =
        profile?.role === 'university'
            ? '/dashboard/university'
            : profile?.role === 'industry'
                ? '/dashboard/industry'
                : '/track'

    async function handleLogout() {
        await signOut()
        setOpen(false)
        navigate('/')
    }

    const links = session
        ? [
            { to: '/submit', label: t('nav.submit') },
            { to: dashboardPath, label: t('nav.dashboard') },
        ]
        : []

    return (
        <header className="sticky top-0 z-40 border-b border-ink/10 dark:border-paper/10 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur">
            <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
                <Link to="/" className="font-display text-2xl tracking-tight" onClick={() => setOpen(false)}>
                    Setu
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-sm font-medium text-ink/80 dark:text-paper/80 hover:text-teal dark:hover:text-accent transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <LanguageSwitcher />
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2 rounded-full hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    {session ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium px-4 py-2 rounded-full border border-ink/20 dark:border-paper/20 hover:border-teal dark:hover:border-accent transition-colors"
                        >
                            {t('nav.logout')}
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm font-medium px-4 py-2 rounded-full bg-teal text-paper dark:bg-accent dark:text-ink hover:opacity-90 transition-opacity"
                        >
                            {t('nav.login')}
                        </Link>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-ink/10 dark:border-paper/10 px-5 py-4 flex flex-col gap-4 bg-paper dark:bg-paper-dark">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className="text-base font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-ink/10 dark:border-paper/10">
                        <LanguageSwitcher />
                        <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                    {session ? (
                        <button
                            onClick={handleLogout}
                            className="text-base font-medium text-left"
                        >
                            {t('nav.logout')}
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setOpen(false)} className="text-base font-medium text-teal dark:text-accent">
                            {t('nav.login')}
                        </Link>
                    )}
                </div>
            )}
        </header>
    )
}