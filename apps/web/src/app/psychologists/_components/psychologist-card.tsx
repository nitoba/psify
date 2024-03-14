/* eslint-disable jsx-a11y/alt-text */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card'
import { PsychologistsDetailCard } from './psychologist-detail-card'
import { DialogTrigger } from '@/components/ui/dialog'
import { ResponseShapes } from '@/lib/api'

type Props = {
  psychologist: ResponseShapes['psychologists']['fetchPsychologists']['body']['psychologists'][0]
}

export function PsychologistCard({
  psychologist: { name, avatarUrl, bio },
}: Props) {
  return (
    <PsychologistsDetailCard>
      <DialogTrigger>
        <Card className="cursor-pointer ring-1 ring-transparent hover:ring-gray-300 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col items-center gap-3">
              <Avatar className="size-16 rounded-full">
                <AvatarImage src={avatarUrl ?? ''} />
                <AvatarFallback>
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{name}</CardTitle>
              <CardDescription className="line-clamp-4">{bio}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>
    </PsychologistsDetailCard>
  )
}
