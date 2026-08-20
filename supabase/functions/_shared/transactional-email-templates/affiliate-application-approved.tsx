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
  code?: string
  link?: string
  commission_percent?: number | string
  discount_percent?: number | string
}

const Email = ({ first_name, code, link, commission_percent, discount_percent }: Props) => {
  const name = first_name?.trim() || 'there'
  const commission = commission_percent ?? 15
  const discount = discount_percent ?? 10
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're In — Welcome to the Natty Apparel Affiliate Program</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>NATTY APPAREL</Heading>
          <Heading style={h1}>You're In — Welcome to the Affiliate Program</Heading>
          <Text style={text}>Hey {name},</Text>
          <Text style={text}>
            Great news — your affiliate application has been approved.
          </Text>
          <Text style={text}>
            You're now an official Natty Apparel affiliate. Here's what you need to know:
          </Text>
          <Text style={highlight}>
            Your personal referral code: <strong>{code || 'YOURCODE'}</strong>
          </Text>
          {link && (
            <Text style={highlight}>
              Your affiliate link: <a href={link} style={linkStyle}>{link}</a>
            </Text>
          )}
          <Text style={text}>
            Your dashboard gives you everything you need to start earning:
          </Text>
          <Text style={bullet}>• Access your personal affiliate link and discount code</Text>
          <Text style={bullet}>• Track clicks, sales, and commissions in real time</Text>
          <Text style={bullet}>• Monitor your performance and climb the commission tiers</Text>
          <Text style={bullet}>• Help grow the natural fitness movement</Text>
          <Text style={text}>
            Commission starts at {commission}% with the potential to earn up to 30% as your volume grows.
            Your code gives customers {discount}% off.
          </Text>
          <Text style={text}>
            We're excited to have you on the team.
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
  subject: "You're In — Welcome to the Natty Apparel Affiliate Program",
  displayName: 'Affiliate Application Approved',
  previewData: { first_name: 'Alex', code: 'ALEX10', link: 'https://ntygear.com/?ref=ALEX10', commission_percent: 15, discount_percent: 10 },
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
const highlight = { fontSize: '15px', lineHeight: '1.6', color: '#1a1a1a', margin: '0 0 14px', padding: '12px 16px', backgroundColor: '#f5f5f5', borderRadius: '6px' }
const linkStyle = { color: '#000', textDecoration: 'underline' }
const signoff = { fontSize: '15px', lineHeight: '1.6', color: '#000', margin: '16px 0 0', fontWeight: 600 }
