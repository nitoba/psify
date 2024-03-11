import { Skeleton } from '@/components/ui/skeleton'

export function PsychologistsListSkeleton() {
  return (
    <div className="container flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-5 auto-rows-[1fr]">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[14.8rem]" />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-60 h-10" />
      </div>
    </div>
  )
}
