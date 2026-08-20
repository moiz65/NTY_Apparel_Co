/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  first_name?: string
}

const Email = ({ first_name }: Props) => {
  const name = first_name?.trim() || 'there'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>We've received your Natty Apparel affiliate application</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>NATTY APPAREL</Heading>
          <Heading style={h1}>We've received your affiliate application</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>
            Thanks for applying to become a Natty Apparel affiliate. We're excited that you're interested in helping us build a community centered around hard work, authenticity, and natural fitness.
          </Text>
          <Text style={text}>
            Your application has been received and is currently under review. We personally review every application to make sure our affiliates align with the values and mission of the brand. You can expect to hear back from us within 24 hours.
          </Text>
          <Text style={text}>
            If approved, you'll receive access to your affiliate dashboard where you'll be able to:
          </Text>
          <Text style={bullet}>• Access your personal affiliate link and discount code</Text>
          <Text style={bullet}>• Track clicks, sales, and commissions</Text>
          <Text style={bullet}>• Monitor your performance in real time</Text>
          <Text style={bullet}>• Help grow the natural fitness movement</Text>
          <Text style={text}>
            We appreciate your interest in representing Natty Apparel.
          </Text>
          <Text style={text}>Stay real. Stay natty.</Text>
          <Text style={signoff}>— The Natty Apparel Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: "We've Received Your Affiliate Application",
  displayName: 'Affiliate Application Received',
  previewData: { first_name: 'Alex' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontSize: '14px', letterSpacing: '0.2em', color: '#000', margin: '0 0 24px', fontWeight: 800 }
const h1 = { fontSize: '22px', lineHeight: '1.3', color: '#000', margin: '0 0 20px', fontWeight: 700 }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#1a1a1a', margin: '0 0 10px' }
const bullet = { fontSize: '15px', lineHeight: '1.7', color: '#1a1a1a', margin: '0 0 4px' }
const signoff = { fontSize: '15px', lineHeight: '1.6', color: '#000', margin: '16px 0 0', fontWeight: 600 }
