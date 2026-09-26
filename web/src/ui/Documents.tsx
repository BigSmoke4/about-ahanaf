import { motion } from 'framer-motion'
import { SOCIAL_ICONS } from './SocialIcons'

const EASE = [0.22, 1, 0.36, 1]

const DOCUMENT_ICONS = [
  {
    id: 'cv',
    href: `${import.meta.env.BASE_URL}documents/resume.pdf`,
    icon: 'document',
  },
  {
    id: 'certificates',
    href: `${import.meta.env.BASE_URL}documents/certificates.pdf`,
    icon: 'certificate',
  },
  {
    id: 'research',
    href: `${import.meta.env.BASE_URL}documents/thesis.pdf`,
    icon: 'research',
  },
] as const

const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

export default function Documents({ lang }: { lang: 'en' | 'zh' }) {
  const title = lang === 'en' ? 'Documents' : 'Documents'
  
  return (
    <section className="resume" lang={lang}>
      <motion.h2
        className="resume-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="timeline"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      >
        <motion.div className="tl-entry" variants={itemV}>
          <motion.span className="tl-dot" variants={itemV} aria-hidden="true" />
          <div className="tl-body">
            <motion.div className="tl-head" variants={itemV}>
              <div className="tl-icons-row">
                {DOCUMENT_ICONS.map((icon) => {
                  const Icon = SOCIAL_ICONS[icon.icon as keyof typeof SOCIAL_ICONS]
                  return (
                    <a
                      key={icon.id}
                      className="tl-icon-link"
                      href={icon.href}
                      download
                      title={icon.id}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
