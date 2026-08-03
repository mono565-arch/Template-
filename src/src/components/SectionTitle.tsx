import type { ReactNode } from 'react'

interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  children?: ReactNode
}

const SectionTitle = ({ title, subtitle, centered = true, light = false, children }: SectionTitleProps) => {
  return (
    <div className={`space-y-3 mb-10 lg:mb-14 ${centered ? 'text-center' : ''}`}>
      {children}
      <h2 className={`font-heading font-bold text-2xl sm:text-3xl lg:text-4xl ${light ? 'text-white' : 'text-neutral-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl mx-auto text-base sm:text-lg ${light ? 'text-white/80' : 'text-neutral-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
