import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function SubmitProblem() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [file, setFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            let mediaUrls = []

            if (file) {
                const filePath = `${user.id}/${Date.now()}-${file.name}`
                const { error: uploadError } = await supabase.storage
                    .from('problem-media')
                    .upload(filePath, file)
                if (uploadError) throw uploadError

                const { data: publicUrlData } = supabase.storage
                    .from('problem-media')
                    .getPublicUrl(filePath)
                mediaUrls = [publicUrlData.publicUrl]
            }

            const { error: insertError } = await supabase.from('problems').insert({
                submitted_by: user.id,
                title,
                description,
                location,
                media_urls: mediaUrls,
            })
            if (insertError) throw insertError

            navigate('/track')
        } catch (err) {
            console.error(err)
            setError(t('auth.error_generic'))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-xl px-5 py-16">
            <h1 className="font-display text-3xl mb-8">{t('submit.title')}</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('submit.field_title')}</label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('submit.field_title_placeholder')}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('submit.field_description')}</label>
                    <textarea
                        required
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('submit.field_description_placeholder')}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('submit.field_location')}</label>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={t('submit.field_location_placeholder')}
                        className="w-full px-4 py-2.5 rounded-lg border border-ink/20 dark:border-paper/20 bg-transparent focus:border-teal dark:focus:border-accent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('submit.field_media')}</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-lg bg-teal text-paper dark:bg-accent dark:text-ink font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                    {submitting ? t('submit.submitting') : t('submit.submit_button')}
                </button>
            </form>
        </div>
    )
}