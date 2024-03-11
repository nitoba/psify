/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable camelcase */
import { faker, fakerPT_BR } from '@faker-js/faker'
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card'

export function PsychologistCard() {
  return (
    <Card className="cursor-pointer ring-1 ring-transparent hover:ring-gray-300 transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col items-center gap-3">
          <img src={faker.image.avatar()} className="size-16 rounded-full" />
          <CardTitle>{faker.person.fullName()}</CardTitle>
          <CardDescription className="line-clamp-4">
            {fakerPT_BR.lorem.sentences()}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
