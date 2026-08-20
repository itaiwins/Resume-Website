'use client';

import { useEffect, useState } from 'react';
import { IDENTITY, PROJECTS, TIMELINE, CAPABILITIES } from './content';

export type Theme = {
  bg: string;
  fg: string;
  muted: string;
  line: string;
  accent: string;
  accentFg: string;
};

/**
 * The escape hatch.
 *
 * A recruiter gives a portfolio well under a minute. A scroll-driven 3D
 * presentation is a bad way to answer "what has he actually shipped" in
 * that window, so every concept keeps a plain, dense, copy-pasteable
 * version one press of F (or one click) away. The spectacle sells; this
 * closes.
 */
export function FactSheet({
  theme,
  open,
  onClose,
}: {
  theme: Theme;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: theme.bg,
        color: theme.fg,
        overflowY: 'auto',
        fontFamily: 'var(--lab-sans)',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 32px 120px' }}>
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: 0,
            float: 'right',
            fontFamily: 'var(--lab-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            padding: '10px 16px',
            border: `1px solid ${theme.line}`,
            background: theme.bg,
            color: theme.muted,
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          CLOSE · ESC
        </button>

        <header style={{ marginBottom: 56 }}>
          <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 8 }}>
            {IDENTITY.name}
          </h1>
          <p style={{ fontSize: 18, color: theme.muted, marginBottom: 20 }}>
            {IDENTITY.role} — {IDENTITY.focus}
          </p>
          <div
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              fontFamily: 'var(--lab-mono)',
              fontSize: 12,
            }}
          >
            <a href={`mailto:${IDENTITY.email}`} style={{ color: theme.accent }}>
              {IDENTITY.email}
            </a>
            <a href={IDENTITY.github} style={{ color: theme.accent }}>
              github.com/itaiwins
            </a>
            <a href={IDENTITY.linkedin} style={{ color: theme.accent }}>
              linkedin.com/in/itai-rotem23
            </a>
            <span style={{ color: theme.muted }}>{IDENTITY.location}</span>
          </div>
        </header>

        <Section title="Selected work" theme={theme}>
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              style={{
                paddingBottom: 28,
                marginBottom: 28,
                borderBottom: `1px solid ${theme.line}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600 }}>{p.name}</h3>
                <span
                  style={{
                    fontFamily: 'var(--lab-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: p.status === 'private' ? theme.muted : theme.accent,
                  }}
                >
                  {p.status}
                </span>
                <span style={{ fontFamily: 'var(--lab-mono)', fontSize: 11, color: theme.muted }}>
                  {p.year}
                </span>
              </div>
              <p style={{ color: theme.muted, lineHeight: 1.65, marginBottom: 12, fontSize: 15 }}>
                {p.blurb}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  flexWrap: 'wrap',
                  fontFamily: 'var(--lab-mono)',
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                <span>
                  <strong style={{ color: theme.fg }}>{p.metric.value}</strong>{' '}
                  <span style={{ color: theme.muted }}>{p.metric.label}</span>
                </span>
                {p.support.map((s) => (
                  <span key={s.label}>
                    <strong style={{ color: theme.fg }}>{s.value}</strong>{' '}
                    <span style={{ color: theme.muted }}>{s.label}</span>
                  </span>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--lab-mono)', fontSize: 11, color: theme.muted }}>
                {p.stack.join(' · ')}
              </div>
              {(p.href || p.repo) && (
                <div style={{ marginTop: 10, display: 'flex', gap: 16 }}>
                  {p.href && (
                    <a
                      href={p.href}
                      style={{ color: theme.accent, fontFamily: 'var(--lab-mono)', fontSize: 12 }}
                    >
                      visit ↗
                    </a>
                  )}
                  {p.repo && (
                    <a
                      href={p.repo}
                      style={{ color: theme.accent, fontFamily: 'var(--lab-mono)', fontSize: 12 }}
                    >
                      source ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </Section>

        <Section title="Experience" theme={theme}>
          {TIMELINE.map((c) => (
            <div key={c.version} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--lab-mono)', fontSize: 11, color: theme.muted }}>
                  {c.period}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{c.title}</h3>
                <span style={{ color: theme.muted, fontSize: 14 }}>{c.org}</span>
              </div>
              <p style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>{c.summary}</p>
            </div>
          ))}
        </Section>

        <Section title="Capabilities" theme={theme}>
          {CAPABILITIES.map((g) => (
            <div key={g.group} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: 'var(--lab-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: theme.muted,
                  marginBottom: 6,
                }}
              >
                {g.group}
              </div>
              <div style={{ fontSize: 15 }}>{g.items.join(' · ')}</div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  theme,
  children,
}: {
  title: string;
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 56 }}>
      <h2
        style={{
          fontFamily: 'var(--lab-mono)',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: theme.muted,
          paddingBottom: 12,
          marginBottom: 28,
          borderBottom: `1px solid ${theme.line}`,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Persistent affordance so the fact sheet is always discoverable. */
export function FactSheetTrigger({ theme, onOpen }: { theme: Theme; onOpen: () => void }) {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey) onOpen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpen]);

  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 100,
        fontFamily: 'var(--lab-mono)',
        fontSize: 11,
        letterSpacing: '0.1em',
        padding: '12px 18px',
        borderRadius: 2,
        cursor: 'pointer',
        border: `1px solid ${hover ? theme.accent : theme.line}`,
        background: hover ? theme.accent : 'transparent',
        color: hover ? theme.accentFg : theme.muted,
        transition: 'all 160ms ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      SKIP TO FACTS · F
    </button>
  );
}
