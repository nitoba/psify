import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

export const NewAppointmentRequested = () => (
  <Html>
    <Head />
    <Preview>
      Appointment Approved! Hi @username, You appointment was approved, now you
      able to proceed to payment. Go to the platform to make it
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Heading>New Appointment Requested</Heading> */}
        <Text style={paragraph}>Hi @username,</Text>
        <Text style={paragraph}>
          You appointment was approved, now you able to proceed to payment
        </Text>
        <Text style={paragraph}>
          click on the button bellow go to the platform to proceed with payment
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="@linkToRedirect">
            Go to platform
          </Button>
        </Section>
        <Text style={footer}>Psyfi @ {new Date().getFullYear()}</Text>
      </Container>
    </Body>
  </Html>
)
export default NewAppointmentRequested

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const btnContainer = {
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
