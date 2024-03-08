import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-50">
      {children}
    </div>
  )
}
