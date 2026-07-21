import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Typography, Paper, Button, Divider, Link as MuiLink } from '@mui/material';
import { ArrowBack, Psychology } from '@mui/icons-material';
import { fx, tokens } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';

// Static privacy policy page. No auth, no API calls — it renders identically in
// the web build and the Capacitor static export, and gives the Play Store /
// App Store listings a stable public URL (e.g. https://<host>/privacy).
//
// Content is kept in sync with bgita/PRIVACY_POLICY.md — edit both together.
// Legal entity, address, hosting region, and minimum age (16) are filled in;
// revisit the age/entity details if the target audience or jurisdiction changes.

const LAST_UPDATED = '16 July 2026';
const CONTACT_EMAIL = 'chigurupati04@gmail.com';

// Each section: a heading and an array of blocks. A block is either a paragraph
// (string) or a bullet list ({ list: [...] }). Kept as data so spacing/typography
// stays consistent across the whole (long) document.
const SECTIONS = [
  {
    id: 'controller',
    title: '1. Who we are (Data Controller)',
    blocks: [
      'The data controller responsible for your information is Ray Jones. You can reach us at the contact details in Section 13.',
    ],
  },
  {
    id: 'collect',
    title: '2. Information we collect',
    blocks: [
      'We collect only what the App needs to function. We do not sell your personal information.',
      'Information you provide:',
      {
        list: [
          'Account details — username, name, email address, and password (passwords are never stored in plain text).',
          'Journal / diary entries — mood ratings, activities, emotions, and written reflections.',
          'Mental-health screening responses — standardized questionnaire answers and scores (e.g. PHQ-9, GAD-7).',
          'Lesson & exercise responses — answers you enter in CBT lessons and practice exercises.',
          'Chat messages — the messages you send to the in-app AI guide.',
          'Coping-tool usage — which SOS / grounding tools you open.',
        ],
      },
      'Sensitive (special category) data: several of these items — mood, written reflections, questionnaire scores, and chat messages — reveal information about your mental health. We process this sensitive data only to provide the App’s features to you, and where required by law we rely on your explicit consent, which you give by choosing to enter this information. You can withdraw consent at any time by deleting your account.',
      'Safety / crisis detection: to keep users safe, the App runs an automated screen on chat messages for language indicating self-harm or harm to others. When it triggers, the App shows crisis-support resources and records a "safety event" containing a short excerpt of the message (up to 280 characters), your email/session identifier, a category, and a timestamp. If your account is linked to a clinician/administrator, that safety event and your check-in data may be visible to them so they can follow up. This detection is a best-effort backstop, not a clinical monitoring service.',
      'Microphone / voice input: if you use the voice dictation feature, the App requests permission to use your device’s microphone. Speech-to-text is performed by your device’s operating system (Android or iOS); the resulting text is then handled the same as text you type. We only access the microphone while you are actively dictating.',
      'Information collected automatically: technical/usage telemetry (session identifiers, request timing, AI token counts) and standard server logs (e.g. IP address and request metadata) used to operate, secure, and improve the service. We do not use third-party advertising or cross-app tracking SDKs.',
    ],
  },
  {
    id: 'ai',
    title: '3. How your chat messages are processed by AI',
    blocks: [
      'When you chat with the in-app guide, the content of your message is sent to Google Cloud Vertex AI (Google’s Gemini models) to generate a response. This processing happens on Google’s cloud infrastructure under Google’s terms as our service provider. We do not use your conversations to train our own models, and we do not sell them. We store operational telemetry about each request (identifiers, timing, token counts) but do not retain full chat transcripts as a conversation history on our servers.',
    ],
  },
  {
    id: 'use',
    title: '4. How we use your information',
    blocks: [
      'We use your information to:',
      {
        list: [
          'Create, secure, and manage your account and sessions.',
          'Provide the App’s features — chat guidance, journaling, lessons, questionnaires, progress tracking, and coping tools.',
          'Generate personalized reflections and feedback.',
          'Detect potential crisis situations and surface support resources.',
          'Where you are connected to a clinician/administrator, make relevant check-in and safety information available to them.',
          'Maintain security, prevent abuse, debug, and improve the App.',
          'Comply with legal obligations.',
        ],
      },
      'Where GDPR/UK GDPR applies, we rely on these legal bases: performance of a contract, explicit consent (for sensitive mental-health data and microphone access), legitimate interests (security, abuse prevention, improvement), and legal obligations.',
    ],
  },
  {
    id: 'share',
    title: '5. How we share information',
    blocks: [
      'We share information only as described here:',
      {
        list: [
          'Service providers (sub-processors): Google Cloud Platform for application hosting (Cloud Run) and database (Cloud SQL) in the us-central1 (United States) region; Google Cloud Vertex AI (Gemini) to generate AI chat responses and text embeddings; and your device OS speech recognition (Google / Apple) for on-device voice-to-text.',
          'Clinicians / administrators connected to your account, as described in Section 2.',
          'Legal / safety: when required by law, to enforce our terms, or to protect the vital interests, rights, or safety of you or others.',
          'Business transfer: if we are involved in a merger, acquisition, or asset sale, your information may be transferred, subject to this policy.',
        ],
      },
      'We do not sell your personal information and do not share it with advertisers.',
    ],
  },
  {
    id: 'transfers',
    title: '6. International data transfers',
    blocks: [
      'Our servers and service providers may process your information in the United States and other countries. If you are located elsewhere (for example, the EEA or UK), your information may be transferred to countries whose data-protection laws differ from yours. Where required, such transfers are protected by appropriate safeguards such as the European Commission’s Standard Contractual Clauses.',
    ],
  },
  {
    id: 'retention',
    title: '7. Data retention',
    blocks: [
      'We keep your personal information for as long as your account is active and as needed to provide the App. When you delete your account, we delete or de-identify your personal data within a reasonable period, except where we must retain certain records to comply with legal obligations, resolve disputes, or enforce our agreements. Aggregated or de-identified data that can no longer identify you may be retained.',
    ],
  },
  {
    id: 'security',
    title: '8. Security',
    blocks: [
      'We take reasonable technical and organizational measures to protect your information, including:',
      {
        list: [
          'Passwords stored only as salted bcrypt hashes (never in plain text).',
          'Authenticated sessions using signed tokens.',
          'Encrypted connections (HTTPS/TLS) between the App and our servers.',
          'A managed cloud database with restricted, credential-based access.',
        ],
      },
      'No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'rights',
    title: '9. Your rights and choices',
    blocks: [
      'Depending on where you live, you may have the right to access, correct, or delete your personal information; to object to or restrict certain processing; to withdraw consent for sensitive-data processing or microphone access; to port your data; and to lodge a complaint with your local data-protection authority.',
      `To exercise any of these rights, contact us at ${CONTACT_EMAIL}. You can revoke microphone permission at any time in your device settings. We will respond within the timeframe required by applicable law.`,
    ],
  },
  {
    id: 'children',
    title: '10. Children’s privacy',
    blocks: [
      'The App is not intended for children under 16, and we do not knowingly collect personal information from them. If you believe a child has provided us with personal information, contact us and we will delete it.',
    ],
  },
  {
    id: 'third-party',
    title: '11. Third-party services',
    blocks: [
      'The App relies on the third-party providers listed in Section 5. Their handling of data is governed by their own privacy policies, including the Google Privacy Policy (policies.google.com/privacy) and, for iOS voice input, Apple’s Privacy Policy (apple.com/legal/privacy).',
    ],
  },
  {
    id: 'changes',
    title: '12. Changes to this policy',
    blocks: [
      'We may update this policy from time to time. We will change the "Last updated" date above and, for material changes, provide a more prominent notice within the App. Your continued use after an update means you accept the revised policy.',
    ],
  },
  {
    id: 'contact',
    title: '13. Contact us',
    blocks: [
      `Questions, requests, or complaints — Email: ${CONTACT_EMAIL}. Entity: Ray Jones. Address: 1234 Main Street, New York, New York.`,
    ],
  },
];

function Block({ block }) {
  if (typeof block === 'string') {
    return (
      <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 1.5 }}>
        {block}
      </Typography>
    );
  }
  return (
    <Box component="ul" sx={{ pl: 3, mb: 1.5, mt: 0 }}>
      {block.list.map((item, i) => (
        <Typography
          key={i}
          component="li"
          sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 0.75 }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
}

export default function Privacy() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy · Pl.AIto</title>
        <meta name="description" content="How Pl.AIto collects, uses, and protects your information." />
      </Head>
      <ThemeToggle floating />
      <Box sx={{ minHeight: '100vh', background: fx.pageBackground, py: { xs: 4, md: 8 }, px: 2 }}>
        <Box sx={{ maxWidth: 820, mx: 'auto' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
            sx={{ color: 'text.secondary', mb: 3, textTransform: 'none' }}
          >
            Back
          </Button>

          <Paper elevation={0} sx={{ ...fx.glassCard, p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Psychology sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Privacy Policy
              </Typography>
            </Box>
            <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>
              Pl.AIto — Last updated: {LAST_UPDATED}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>
              This Privacy Policy explains how we collect, use, store, and protect your
              information when you use the Pl.AIto mobile application and related services
              (the &ldquo;App&rdquo;).
            </Typography>

            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 0,
                background: tokens.surfaceMuted,
                border: `1px solid ${tokens.border}`,
              }}
            >
              <Typography sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.7 }}>
                Pl.AIto is a self-help and educational wellbeing tool. It is not a medical
                device and does not provide medical advice, diagnosis, or treatment, and is
                not a substitute for care from a qualified health professional. If you are in
                crisis or think you may have a medical emergency, contact your local emergency
                services immediately.
              </Typography>
            </Box>

            {SECTIONS.map((section) => (
              <Box key={section.id} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}
                >
                  {section.title}
                </Typography>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />
            <Typography sx={{ color: tokens.textFaint, fontSize: 13 }}>
              Questions about this policy? Contact us at{' '}
              <MuiLink href={`mailto:${CONTACT_EMAIL}`} sx={{ color: 'primary.main' }}>
                {CONTACT_EMAIL}
              </MuiLink>
              .
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
