// Standardized wellbeing screenings shown in the "Check-Up" tab.
//
// These are the published PHQ-9 (depression) and GAD-7 (anxiety) instruments.
// Each item is answered on the same 0–3 frequency scale; the backend recomputes
// the total + severity band from the raw answers (never trusts a client score).
// We keep the questions/labels here so the component stays presentational.

// The shared 0–3 response scale ("Over the last 2 weeks, how often…").
export const RESPONSE_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

export const ASSESSMENTS = {
  phq9: {
    id: 'phq9',
    title: 'Mood Check',
    subtitle: 'Depression screening (PHQ-9)',
    intro: 'Over the last 2 weeks, how often have you been bothered by any of the following?',
    maxScore: 27,
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading or watching television',
      'Moving or speaking so slowly that other people could have noticed — or being so fidgety or restless that you have been moving around a lot more than usual',
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    ],
    // Severity bands (cutoffs, upper bound inclusive) for the result readout.
    bands: [
      { max: 4, label: 'Minimal', tone: 'success' },
      { max: 9, label: 'Mild', tone: 'success' },
      { max: 14, label: 'Moderate', tone: 'warning' },
      { max: 19, label: 'Moderately severe', tone: 'error' },
      { max: 27, label: 'Severe', tone: 'error' },
    ],
  },
  gad7: {
    id: 'gad7',
    title: 'Anxiety Check',
    subtitle: 'Anxiety screening (GAD-7)',
    intro: 'Over the last 2 weeks, how often have you been bothered by the following?',
    maxScore: 21,
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      "Being so restless that it's hard to sit still",
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
    bands: [
      { max: 4, label: 'Minimal', tone: 'success' },
      { max: 9, label: 'Mild', tone: 'success' },
      { max: 14, label: 'Moderate', tone: 'warning' },
      { max: 21, label: 'Severe', tone: 'error' },
    ],
  },
};

// Map a score to its band tone (for the result chip color). Falls back to the
// last band so an out-of-range score still renders.
export function bandFor(assessmentId, score) {
  const a = ASSESSMENTS[assessmentId];
  if (!a) return null;
  return a.bands.find((b) => score <= b.max) || a.bands[a.bands.length - 1];
}
