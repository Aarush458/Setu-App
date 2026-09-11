import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    async function loadProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        if (error) {
            console.error('Failed to load profile:', error)
            setProfile(null)
        } else {
            setProfile(data)
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session)
            if (session?.user) await loadProfile(session.user.id)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session)
            if (session?.user) {
                await loadProfile(session.user.id)
            } else {
                setProfile(null)
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    async function signUp({ email, password, fullName, role, universityId }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, role, university_id: universityId ?? null } },
        })
        return { data, error }
    }

    async function signIn({ email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
    }

    async function signOut() {
        await supabase.auth.signOut()
    }

    const value = {
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}