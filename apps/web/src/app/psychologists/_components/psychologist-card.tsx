/* eslint-disable jsx-a11y/alt-text */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card'

type Props = {
  name: string
  avatar: string
  description: string
}

export function PsychologistCard({ avatar, description, name }: Props) {
  return (
    <Card className="cursor-pointer ring-1 ring-transparent hover:ring-gray-300 transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col items-center gap-3">
          <img src={avatar} className="size-16 rounded-full" />
          <CardTitle>{name}</CardTitle>
          <CardDescription className="line-clamp-4">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
