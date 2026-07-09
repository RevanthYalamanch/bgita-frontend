// lib/sosTools.js
// Metadata for the "Reset" / SOS toolkit — always-available, in-the-moment
// coping tools for SUB-CRISIS distress (anxiety spikes, urges, panic,
// rumination). This is deliberately separate from the crisis path in the
// backend (safety.py routes genuine self-harm signals to 988); the toolkit's
// modal footer links to 988 so the two connect.
//
// Kept as plain data so ToolkitMenu renders from one source and adding a tool
// is a one-object change. The interactive UIs live in components/sos/*.
// `icon` is a string key mapped to a MUI icon in ToolkitMenu (keeps this file
// dependency-free). Everything here works fully offline — no network needed in
// the moment it matters.
export const SOS_TOOLS = [
  {
    id: 'breathing',
    title: 'Guided Breathing',
    subtitle: 'Slow your body down',
    bestFor: 'Racing heart · anxiety · panic',
    duration: '2–3 min',
    icon: 'Air',
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    subtitle: 'Come back to the present',
    bestFor: 'Spiralling thoughts · feeling unreal',
    duration: '3–4 min',
    icon: 'Visibility',
  },
  {
    id: 'urge',
    title: 'Urge Surfing',
    subtitle: 'Ride it out — it will pass',
    bestFor: 'Cravings · strong urges',
    duration: '5 min',
    icon: 'Waves',
  },
  {
    id: 'tipp',
    title: 'TIPP Reset',
    subtitle: 'Fast relief when overwhelmed',
    bestFor: 'Overwhelm · very high distress',
    duration: 'Read now',
    icon: 'AcUnit',
  },
];
