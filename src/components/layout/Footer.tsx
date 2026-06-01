import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerSections = [
  {
    title: 'Explore',
    links: [
      { href: '/projects', label: 'Projects' },
      { href: '/challenges', label: 'Challenges' },
      { href: '/events', label: 'Events' },
      { href: '/makers', label: 'Makers' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/badges', label: 'Badges' },
      { href: '/store', label: 'Store' },
      { href: '/events', label: 'Events' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Contact' },
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-brand-peach/20 bg-brand-brown text-brand-cream relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-lg font-bold text-brand-cream">Param <span className="text-brand-orange">Makerspace</span></span>
            </Link>
            <p className="text-sm text-brand-peach/70 leading-relaxed">
              Where ideas become reality. A community of builders, thinkers, and creators.
            </p>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-3 text-brand-peach">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-cream/60 hover:text-brand-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-brand-cream/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-cream/50">
          <p>© {new Date().getFullYear()} Param Makerspace. All rights reserved.</p>
          <p>Built with 🔥 for makers</p>
        </div>
      </div>
    </footer>
  )
}
