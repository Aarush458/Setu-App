import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { session, profile, loading } = useAuth()
    const { t } = useTranslation()

    if (loading) {
        return <div className="text-center py-24 text-muted">{t('common.loading')}</div>
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        const fallback =
            profile.role === 'university' ? '/dashboard/university'
                : profile.role === 'industry' ? '/dashboard/industry'
                    : '/track'
        return <Navigate to={fallback} replace />
    }

    return children
}