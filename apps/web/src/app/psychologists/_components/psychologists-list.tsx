'use client'

import { PsychologistCard } from './psychologist-card'
import { Pagination } from '../../../components/pagination'
import { PsychologistsListFilter } from './psychologist-filters'
import { api } from '@/lib/api'
import { PsychologistsListSkeleton } from './loading-list'

export function PsychologistsList() {
  const { data, isLoading } = api.psychologists.fetchPsychologists.useQuery([
    'psychologists',
  ])

  console.log(data)

  if (!data || isLoading) {
    return <PsychologistsListSkeleton />
  }

  const {
    body: { psychologists, total },
  } = data

  return (
    <div className="container flex flex-col gap-6">
      <PsychologistsListFilter />
      <div className="grid grid-cols-4 gap-5 auto-rows-[1fr]">
        {psychologists.map((psychologist, index) => (
          <PsychologistCard key={index} psychologist={psychologist} />
        ))}
      </div>

      <Pagination
        pageIndex={0}
        totalCount={total}
        perPage={10}
        onPageChange={() => {}}
      />
    </div>
  )
}
