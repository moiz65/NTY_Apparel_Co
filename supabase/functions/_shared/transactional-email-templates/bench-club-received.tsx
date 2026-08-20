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
      <Preview>We've received your Bench Club registration</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>NATTY APPAREL</Heading>
          <Heading style={h1}>Bench Club Registration Received</Heading>
          <Text style={text}>Hey {name}, thank you for submitting your Bench Club registration.</Text>
          <Text style={text}>
            We've received your submission and are currently reviewing it for verification.
          </Text>
          <Text style={text}>
            If approved, you'll receive a second email confirming your membership and providing
            instructions on how to access your exclusive Bench Club benefits and apparel.
          </Text>
          <Text style={text}>
            Please note that verification times may vary depending on submission volume.
          </Text>
          <Text style={text}>
            We appreciate your patience and look forward to reviewing your lift.
          </Text>
          <Text style={text}>Stay real. Stay strong. Stay natty.</Text>
          <Text style={signoff}>— Sam Gerace</Text>
          <Text style={signoffSub}>Founder, Natty Apparel</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: 'Bench Club Registration Received',
  displayName: 'Bench Club — Registration Received',
  previewData: { first_name: 'Alex' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontSize: '14px', letterSpacing: '0.2em', color: '#000', margin: '0 0 24px', fontWeight: 800 }
const h1 = { fontSize: '22px', lineHeight: '1.3', color: '#000', margin: '0 0 20px', fontWeight: 700 }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#1a1a1a', margin: '0 0 12px' }
const signoff = { fontSize: '15px', lineHeight: '1.6', color: '#000', margin: '20px 0 0', fontWeight: 600 }
const signoffSub = { fontSize: '14px', lineHeight: '1.5', color: '#555', margin: '2px 0 0' }
