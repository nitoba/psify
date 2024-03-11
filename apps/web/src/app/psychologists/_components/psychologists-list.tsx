'use client'

import { PsychologistCard } from '../../../components/cards/psychologist-card'
import { Pagination } from '../../../components/pagination'
import { PsychologistsListFilter } from './psychologist-filters'

export function PsychologistsList() {
  return (
    <div className="container flex flex-col gap-6">
      <PsychologistsListFilter />
      <div className="grid grid-cols-4 gap-5 auto-rows-[1fr]">
        {Array.from({ length: 12 }).map((_, index) => (
          <PsychologistCard key={index} />
        ))}
      </div>

      <Pagination
        pageIndex={0}
        totalCount={40}
        perPage={10}
        onPageChange={() => {}}
      />
    </div>
  )
}
