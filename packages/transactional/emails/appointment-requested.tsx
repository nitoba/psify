import { Body, Head, Html, Tailwind } from '@react-email/components'

export const AppointmentRequested = () => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans"></Body>
      </Tailwind>
    </Html>
  )
}

export default AppointmentRequested
