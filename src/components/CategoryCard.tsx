import type { ReactNode } from 'react'

interface CategoryCardProps {
  icon: ReactNode
  title: string
  onClick?: () => void
}

const CategoryCard = ({ icon, title, onClick }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 p-5 sm:p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
        <span className="text-3xl sm:text-4xl">{icon}</span>
      </div>
      <span className="font-heading font-semibold text-sm sm:text-base text-neutral-800 group-hover:text-primary-700 transition-colors">
        {title}
      </span>
    </button>
  )
}

export default CategoryCard
