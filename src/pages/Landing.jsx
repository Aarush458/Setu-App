import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Landing() {
    const { t } = useTranslation()

    const steps = [
        { title: t('landing.step1_title'), body: t('landing.step1_body') },
        { title: t('landing.step2_title'), body: t('landing.step2_body') },
        { title: t('landing.step3_title'), body: t('landing.step3_body') },
        { title: t('landing.step4_title'), body: t('landing.step4_body') },
    ]

    return (
        <div>
            <section className="mx-auto max-w-5xl px-5 pt-16 pb-20 md:pt-24 md:pb-28">
                <div className="max-w-2xl">
                    <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink dark:text-paper">
                        {t('landing.title')}
                    </h1>
                    <p className="mt-5 text-lg text-muted max-w-xl leading-relaxed">
                        {t('landing.subtitle')}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            to="/submit"
                            className="px-6 py-3 rounded-full bg-teal text-paper dark:bg-accent dark:text-ink font-medium hover:opacity-90 transition-opacity"
                        >
                            {t('landing.cta_primary')}
                        </Link>
                        <a href="#how-it-works" className="text-sm font-medium text-ink/70 dark:text-paper/70 hover:text-teal dark:hover:text-accent underline underline-offset-4">
                            {t('landing.cta_secondary')}
                        </a>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="border-t border-ink/10 dark:border-paper/10">
                <div className="mx-auto max-w-5xl px-5 py-16">
                    <h2 className="font-display text-2xl mb-10">{t('landing.how_it_works')}</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="border-l-2 border-accent pl-4">
                                <span className="text-sm text-muted">{i + 1}</span>
                                <h3 className="font-medium mt-1 mb-1.5">{step.title}</h3>
                                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}