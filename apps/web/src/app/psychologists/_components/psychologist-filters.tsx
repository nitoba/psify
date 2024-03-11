import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function PsychologistsListFilter() {
  return (
    <form className="flex-col items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Input placeholder="Nome" className="h-8 w-auto" />
          <Input placeholder="Especialidades" className="h-8 w-auto" />
        </div>
        <Button type="submit" variant="outline">
          <Search className="mr-2 size-4" />
          Filtrar resultados
        </Button>
      </div>
    </form>
  )
}
