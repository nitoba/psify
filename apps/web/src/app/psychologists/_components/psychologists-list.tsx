'use client'

import { faker } from '@faker-js/faker'
import { PsychologistCard } from './psychologist-card'
import { Pagination } from '../../../components/pagination'
import { PsychologistsListFilter } from './psychologist-filters'

export function PsychologistsList() {
  const psychologists = Array.from({ length: 50 }).map(() => ({
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    description: faker.lorem.sentences(),
  }))
  return (
    <div className="container flex flex-col gap-6">
      <PsychologistsListFilter />
      <div className="grid grid-cols-4 gap-5 auto-rows-[1fr]">
        {psychologists.slice(0, 12).map((psychologist, index) => (
          <PsychologistCard
            key={index}
            name={psychologist.name}
            avatar={psychologist.avatar}
            description={psychologist.description}
          />
        ))}
      </div>

      <Pagination
        pageIndex={0}
        totalCount={psychologists.length}
        perPage={10}
        onPageChange={() => {}}
      />
    </div>
  )
}
