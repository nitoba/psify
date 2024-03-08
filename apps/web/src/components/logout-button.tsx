'use client'

import { DropdownMenuItem, DropdownMenuShortcut } from './ui/dropdown-menu'

type Props = {
  handleClick: () => void
}

export function LogoutButton({ handleClick }: Props) {
  return (
    <DropdownMenuItem onClick={() => handleClick()}>
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
