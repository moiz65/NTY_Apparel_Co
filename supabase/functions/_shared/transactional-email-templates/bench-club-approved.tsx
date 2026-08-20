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
      <Preview>You're officially in the Natty Apparel Bench Club</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>NATTY APPAREL</Heading>
          <Heading style={h1}>Welcome to the Bench Club</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>Congratulations.</Text>
          <Text style={text}>
            Your Bench Club membership has been officially verified and approved.
          </Text>
          <Text style={text}>
            You are now an official member of the Natty Apparel Bench Club.
          </Text>
          <Text style={text}>
            As a verified member, you've unlocked access to exclusive Bench Club apparel that is reserved
            for members who have earned it.
          </Text>
          <Text style={text}>
            To access Bench Club products, simply log in using the email address associated with your
            membership.
          </Text>
          <Text style={text}>
            This club was built to celebrate natural lifters who choose the long road — the lifters who
            put in the work, stay consistent, and earn their results.
          </Text>
          <Text style={text}>Welcome to the club.</Text>
          <Text style={text}>Stay real. Stay natty.</Text>
          <Text style={signoff}>— The Natty Apparel Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: 'Your Bench Club Registration is Being Reviewed',
  displayName: 'Bench Club Approved',
  previewData: { first_name: 'Alex' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const brand = { fontSize: '14px', letterSpacing: '0.2em', color: '#000', margin: '0 0 24px', fontWeight: 800 }
const h1 = { fontSize: '22px', lineHeight: '1.3', color: '#000', margin: '0 0 20px', fontWeight: 700 }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#1a1a1a', margin: '0 0 14px' }
const signoff = { fontSize: '15px', lineHeight: '1.6', color: '#000', margin: '20px 0 0', fontWeight: 600 }
