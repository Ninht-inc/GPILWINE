import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  className?: string
  light?: boolean
  align?: 'center' | 'left'
}

export function SectionHeading({ eyebrow, title, className, light = false, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={cn(
      'mb-10 md:mb-14',
      align === 'center' ? 'text-center' : 'text-left',
      className
    )}>
      {eyebrow && (
        <p className={cn(
          'font-sans text-xs md:text-sm tracking-[0.2em] uppercase mb-3',
          light ? 'text-[#C6A15B]' : 'text-[#C6A15B]'
        )}>
          {eyebrow}
        </p>
      )}
      <h2 className={cn(
        'font-display text-3xl md:text-4xl lg:text-[42px] leading-tight',
        light ? 'text-[#F4EBDD]' : 'text-[#222222]'
      )}>
        {title}
      </h2>

    </div>
  )
}
