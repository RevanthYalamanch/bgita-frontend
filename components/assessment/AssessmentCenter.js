// components/assessment/AssessmentCenter.js
//
// The "Check-Up" tab: periodic standardized wellbeing screenings (PHQ-9 mood,
// GAD-7 anxiety). Users take a short questionnaire; the backend recomputes the
// score + severity and stores it so both the user and the clinician can see the
// symptom trend over time. Deliberately separate from the daily diary (which is
// a free-form mood log) and from the crisis path — though a non-zero self-harm
// item on PHQ-9 surfaces crisis resources here too.
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, ButtonBase, Chip, Alert, Link,
  LinearProgress, CircularProgress, Divider,
} from '@mui/material';
import { ArrowBack, CheckCircle, Refresh } from '@mui/icons-material';
import { fx, tokens } from '../../lib/theme';
import { apiFetch } from '../../lib/api';
import { ASSESSMENTS, RESPONSE_OPTIONS, bandFor } from '../../data/assessments';

const TONE_COLOR = { success: 'success', warning: 'warning', error: 'error' };

// The two screenings, in the order shown on the overview.
const CARDS = [ASSESSMENTS.phq9, ASSESSMENTS.gad7];

function formatWhen(ts) {
  try {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function AssessmentCenter({ sessionId }) {
  const [view, setView] = useState('overview'); // 'overview' | 'quiz' | 'result'
  const [activeId, setActiveId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoadingHistory(false); return; }
    try {
      const res = await apiFetch('/api/assessment', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data.assessments)) setHistory(data.assessments);
    } catch {
      /* non-fatal — the overview just shows no prior results */
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  // The most recent stored result per screening, for the overview cards.
  const latestFor = (id) => history.find((h) => h.assessment_type === id) || null;

  const startQuiz = (id) => {
    setActiveId(id);
    setAnswers(new Array(ASSESSMENTS[id].questions.length).fill(null));
    setResult(null);
    setError('');
    setView('quiz');
  };

  const backToOverview = () => {
    setView('overview');
    setActiveId(null);
    setError('');
  };

  const setAnswer = (qIndex, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = value;
      return next;
    });
  };

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);

  const submit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await apiFetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          assessment_type: activeId,
          answers,
          session_id: sessionId || 'check-up',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.detail || data?.message || 'Could not save your responses. Please try again.');
        return;
      }
      setResult(data);
      setView('result');
      loadHistory(); // refresh the trend with the new entry
    } catch {
      setError('Could not reach the server. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Overview ─────────────────────────────────────────────────────────── */
  if (view === 'overview') {
    return (
      <Box>
        <Typography variant="h6" fontWeight={800}>Wellbeing Check-Up</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          A quick, private check on how you&apos;ve been feeling over the last two weeks. Take one every
          couple of weeks to see how things change.
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {CARDS.map((a) => {
            const latest = latestFor(a.id);
            const band = latest ? bandFor(a.id, latest.score) : null;
            return (
              <Paper key={a.id} sx={{ ...fx.glassCard, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={800}>{a.title}</Typography>
                <Typography variant="caption" color="text.secondary">{a.subtitle}</Typography>

                <Box sx={{ mt: 1.5, mb: 2, minHeight: 46 }}>
                  {loadingHistory ? (
                    <Typography variant="body2" color="text.secondary">Loading…</Typography>
                  ) : latest ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h5" fontWeight={800}>
                        {latest.score}
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' '}/ {latest.max_score ?? a.maxScore}
                        </Typography>
                      </Typography>
                      {band && <Chip size="small" color={TONE_COLOR[band.tone]} label={band.label} />}
                      <Typography variant="caption" color="text.secondary" sx={{ width: '100%' }}>
                        Last taken {formatWhen(latest.timestamp)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Not taken yet.</Typography>
                  )}
                </Box>

                <Button
                  variant={latest ? 'outlined' : 'contained'}
                  onClick={() => startQuiz(a.id)}
                  sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                >
                  {latest ? 'Take again' : 'Start'}
                </Button>
              </Paper>
            );
          })}
        </Box>

        {history.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={800}>Recent results</Typography>
              <Button size="small" startIcon={<Refresh />} onClick={loadHistory} sx={{ ml: 'auto' }}>
                Refresh
              </Button>
            </Box>
            <Paper sx={{ ...fx.glassCard, p: 0, overflow: 'hidden' }}>
              {history.slice(0, 12).map((h, i) => {
                const meta = ASSESSMENTS[h.assessment_type];
                const band = bandFor(h.assessment_type, h.score);
                return (
                  <Box key={i}>
                    {i > 0 && <Divider />}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ minWidth: 96 }}>
                        {meta ? meta.title : h.assessment_type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {h.score} / {h.max_score ?? meta?.maxScore ?? '—'}
                      </Typography>
                      {band && <Chip size="small" color={TONE_COLOR[band.tone]} label={h.severity || band.label} />}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        {formatWhen(h.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2.5 }}>
          These questionnaires are a self-check, not a diagnosis. If you&apos;re in crisis, call or text 988
          (US) or your local emergency services.
        </Typography>
      </Box>
    );
  }

  /* ── Result ───────────────────────────────────────────────────────────── */
  if (view === 'result' && result) {
    const meta = ASSESSMENTS[result.assessment_type];
    const band = bandFor(result.assessment_type, result.score);
    const pct = Math.round((result.score / (result.max_score || 1)) * 100);
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={backToOverview} sx={{ mb: 1, color: 'text.secondary' }}>
          Back to Check-Up
        </Button>
        <Paper sx={{ ...fx.glassCard, p: 3, textAlign: 'center' }}>
          <CheckCircle sx={{ color: 'primary.main', fontSize: 34, mb: 1 }} />
          <Typography variant="h6" fontWeight={800}>{meta?.title} complete</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
            {result.score}
            <Typography component="span" variant="h6" color="text.secondary"> / {result.max_score}</Typography>
          </Typography>
          {band && (
            <Chip
              color={TONE_COLOR[band.tone]}
              label={result.severity || band.label}
              sx={{ mt: 1, fontWeight: 700 }}
            />
          )}
          <LinearProgress
            variant="determinate"
            value={pct}
            color={band ? TONE_COLOR[band.tone] : 'primary'}
            sx={{ mt: 2.5, height: 8, borderRadius: 4, maxWidth: 320, mx: 'auto' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 460, mx: 'auto' }}>
            This is a snapshot of the last two weeks — not a diagnosis. Retaking it over time shows how
            things are trending. You can share these results with a clinician.
          </Typography>
        </Paper>

        {result.alert && (
          <Alert severity="error" sx={{ mt: 2 }}>
            You mentioned thoughts of self-harm. You&apos;re not alone and help is available right now — in
            the US, call or text <Link href="tel:988" sx={{ fontWeight: 700 }}>988</Link> (Suicide &amp;
            Crisis Lifeline), or call 911 if you&apos;re in immediate danger. Outside the US, find a helpline
            at <Link href="https://findahelpline.com" target="_blank" rel="noopener">findahelpline.com</Link>.
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5, justifyContent: 'center' }}>
          <Button variant="contained" onClick={backToOverview}>Done</Button>
        </Box>
      </Box>
    );
  }

  /* ── Quiz ─────────────────────────────────────────────────────────────── */
  const meta = ASSESSMENTS[activeId];
  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = meta ? Math.round((answeredCount / meta.questions.length) * 100) : 0;
  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={backToOverview} sx={{ mb: 1, color: 'text.secondary' }}>
        Back to Check-Up
      </Button>
      <Typography variant="h6" fontWeight={800}>{meta.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{meta.intro}</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, mb: 2.5 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {meta.questions.map((q, qi) => (
          <Paper key={qi} sx={{ ...fx.glassCard, p: 2 }}>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>
              <Box component="span" sx={{ color: 'text.secondary', mr: 0.75 }}>{qi + 1}.</Box>{q}
            </Typography>
            <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' } }}>
              {RESPONSE_OPTIONS.map((opt) => {
                const selected = answers[qi] === opt.value;
                return (
                  <ButtonBase
                    key={opt.value}
                    onClick={() => setAnswer(qi, opt.value)}
                    sx={{
                      px: 1, py: 1.25, borderRadius: '10px', textAlign: 'center',
                      border: '1px solid',
                      borderColor: selected ? 'primary.main' : tokens.border,
                      bgcolor: selected ? 'primary.main' : 'transparent',
                      color: selected ? '#FFFFFF' : 'text.primary',
                      fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2,
                      transition: 'all .12s ease',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    {opt.label}
                  </ButtonBase>
                );
              })}
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={submit}
          disabled={!allAnswered || submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {submitting ? 'Saving…' : 'See my result'}
        </Button>
        {!allAnswered && (
          <Typography variant="caption" color="text.secondary">
            Answer all {meta.questions.length} questions to continue.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
