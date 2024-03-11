import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function PsychologistsListFilter() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="Nome" className="h-8 w-auto" />
      <Input placeholder="Especialidades" className="h-8 w-[320px]" />

      <Button type="submit" variant="secondary">
        <Search className="mr-2 size-4" />
        Filtrar resultados
      </Button>
    </form>
  )
}
