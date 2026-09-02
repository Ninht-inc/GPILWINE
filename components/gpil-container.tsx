import { cn } from '@/lib/utils'

interface GpilContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function GpilContainer({ children, className, size = 'lg' }: GpilContainerProps) {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1200px]',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidths[size] ?? maxWidths.lg, className)}>
      {children}
    </div>
  )
}
