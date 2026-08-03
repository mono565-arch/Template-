import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <main className={`flex-1 py-8 sm:py-12 lg:py-16 ${className}`}>
      {children}
    </main>
  )
}

export default PageWrapper
