import { Dialog, DialogContent } from '@/components/ui/dialog'
import { PropsWithChildren } from 'react'

export function PsychologistsDetailCard({ children }: PropsWithChildren) {
  return (
    <Dialog>
      {children}
      <DialogContent>Teste</DialogContent>
    </Dialog>
  )
}
