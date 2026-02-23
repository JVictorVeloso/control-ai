import { Sparkles } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({
  size = 'md',
  showText = true,
  className = '',
}: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg blur-sm opacity-75"></div>
        <div className="relative bg-linear-to-br from-blue-600 to-purple-600 rounded-lg p-1.5 shadow-lg">
          <Sparkles className={`${sizes[size]} text-white`} />
        </div>
      </div>
      {showText && (
        <span
          className={`${textSizes[size]} font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
        >
          Control AI
        </span>
      )}
    </div>
  )
}
