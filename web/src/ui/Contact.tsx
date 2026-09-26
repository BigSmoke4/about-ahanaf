import { motion } from 'framer-motion'
import { SOCIAL_ICONS } from './SocialIcons'

const EASE = [0.22, 1, 0.36, 1]

const CONTACT_ICONS = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/ahanaf-mokammel-omi-b15764268/',
    icon: 'linkedin' as const,
  },
  {
    id: 'github',
    href: 'https://github.com/BigSmoke4',
    icon: 'github' as const,
  },
  {
    id: 'email',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=ahanafmo@gmail.com',
    icon: 'email' as const,
  },
] as const

const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

export default function Contact({ lang }: { lang: 'en' | 'zh' }) {
  const title = lang === 'en' ? 'Contact' : 'Contact'
  
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
                {CONTACT_ICONS.map((icon) => {
                  const Icon = SOCIAL_ICONS[icon.icon as keyof typeof SOCIAL_ICONS]
                  return (
                    <a
                      key={icon.id}
                      className="tl-icon-link"
                      href={icon.href}
                      target="_blank"
                      rel="noopener noreferrer"
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
