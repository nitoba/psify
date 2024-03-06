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

interface Props {
  userName: string
  linkToRedirectToPlatform: string
}

export const OrderApproved = ({
  userName = 'John Doe',
  linkToRedirectToPlatform = 'https://google.com',
}: Props) => (
  <Html>
    <Head />
    <Preview>Order approved</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Heading>New Appointment Requested</Heading> */}
        <Text style={paragraph}>Hi {userName},</Text>
        <Text style={paragraph}>
          Your order was approved. Your appointment was scheduled with
          successfully!
        </Text>
        <Text style={paragraph}>
          click on the button bellow to view details
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={linkToRedirectToPlatform}>
            View Details
          </Button>
        </Section>
        <Text style={footer}>Psyfi @ {new Date().getFullYear()}</Text>
      </Container>
    </Body>
  </Html>
)
export default OrderApproved

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
