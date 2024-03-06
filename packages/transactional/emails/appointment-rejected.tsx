import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

export const AppointmentRejected = () => (
  <Html>
    <Head />
    <Preview>
      Appointment Rejected! Hi @username, Unfortunately your appointment
      requested was rejected, you can try again!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Heading>New Appointment Requested</Heading> */}
        <Text style={paragraph}>Hi @username,</Text>
        <Text style={paragraph}>
          Unfortunately your appointment requested was rejected, you can try
          again!
        </Text>
        <Text style={footer}>Psyfi @ {new Date().getFullYear()}</Text>
      </Container>
    </Body>
  </Html>
)
export default AppointmentRejected

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
