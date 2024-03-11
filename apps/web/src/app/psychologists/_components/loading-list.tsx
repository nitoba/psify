import { Skeleton } from '@/components/ui/skeleton'

export function PsychologistsListSkeleton() {
  return (
    <div className="container flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-60 h-10" />
          <Skeleton className="w-60 h-10" />
        </div>
        <Skeleton className="w-44 h-10" />
      </div>
      <div className="grid grid-cols-4 gap-5 auto-rows-[1fr]">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full h-[14.8rem] flex flex-col items-center justify-center"
          >
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="mt-2 w-[80%] h-3" />
            <Skeleton className="mt-2 w-1/2 h-3" />
            <Skeleton className="mt-2 w-1/4 h-3" />
          </Skeleton>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-60 h-10" />
      </div>
    </div>
  )
}
