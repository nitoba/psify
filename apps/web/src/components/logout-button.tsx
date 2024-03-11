'use client'

import { DropdownMenuItem, DropdownMenuShortcut } from './ui/dropdown-menu'

type Props = {
  handleClick: () => void
}

export function LogoutButton({ handleClick }: Props) {
  return (
    <DropdownMenuItem onClick={() => handleClick()}>
      Sair
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
