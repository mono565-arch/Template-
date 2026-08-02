import { FiStar } from 'react-icons/fi'

interface ReviewCardProps {
  name: string
  review: string
  rating: number
  avatar: string
  role?: string
}

const ReviewCard = ({ name, review, rating, avatar, role }: ReviewCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-primary fill-primary' : 'text-neutral-300'}`}
          />
        ))}
      </div>
      <p className="text-neutral-600 text-sm leading-relaxed mb-6">&ldquo;{review}&rdquo;</p>
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
          loading="lazy"
        />
        <div>
          <h4 className="font-heading font-semibold text-sm text-neutral-900">{name}</h4>
          {role && <p className="text-neutral-500 text-xs">{role}</p>}
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
