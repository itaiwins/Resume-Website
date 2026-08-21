import Link from 'next/link';

const CONCEPTS = [
  {
    slug: 'a',
    letter: 'A',
    name: 'Drafting Table',
    world: 'Bone-white architectural void',
    idea: 'Each project is a technical drawing sheet hanging in space — ruled border, title block, status stamp. The camera dollies down a hall of sheets and stops square-on at each one.',
    bet: 'Every 3D portfolio is dark and glowing. A light, drawn, precise world is instantly differentiating, and a drawing sheet is already an information design solved for reading dense specs fast.',
    palette: ['#E9E5DC', '#F7F5EF', '#15171B', '#D8402A'],
    type: 'Inter + JetBrains Mono',
  },
  {
    slug: 'b',
    letter: 'B',
    name: 'Monolith',
    world: 'Near-black canyon of building-sized slabs',
    idea: 'Each project faces a monolith, its name set enormous in a serif. The camera flies the corridor at eye level and turns to face each wall, so the work towers over you.',
    bet: 'Scale is the cheapest way to make something feel important, and nobody sets type this big on a portfolio. Loud where A is quiet — same facts, opposite register.',
    palette: ['#08090C', '#1C2129', '#F3F1EC', '#CBFF48'],
    type: 'Instrument Serif + Inter',
  },
  {
    slug: 'c',
    letter: 'C',
    name: 'Helix',
    world: 'Warm graphite, work spiralling around a lit spine',
    idea: 'Projects sit on a rising helix around a central axis. Scrolling orbits you upward around it, and one beat pulls back so the whole structure reads at once.',
    bet: 'A and B both fly down a straight line — the default move in scroll-driven 3D. Orbiting reads as a turntable, and the pull-back gives an overview no linear layout can.',
    palette: ['#25221E', '#F1EBE1', '#1B1815', '#E2542A'],
    type: 'Inter + JetBrains Mono',
  },
];

export default function LabIndex() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#101012',
        color: '#EDEDEA',
        fontFamily: 'var(--lab-sans), system-ui, sans-serif',
        padding: '80px 32px 120px',
      }}
      className="lab-index"
    >
      <style>{`
        @media (max-width: 720px) {
          .lab-index { padding: 44px 18px 80px !important; }
          .lab-index .card { padding: 22px 18px !important; }
          /* Stack the row: the OPEN affordance runs off a phone otherwise. */
          .lab-index .row { flex-direction: column; gap: 14px !important; }
          .lab-index .open { align-self: flex-start; }
          .lab-index h1 { font-size: 38px !important; }
          .lab-index h2 { font-size: 24px !important; }
          .lab-index .lede { font-size: 16px !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div
          style={{
            fontFamily: 'var(--lab-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.3em',
            color: '#7C7C86',
          }}
        >
          PORTFOLIO REBUILD — CONCEPT LAB
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', margin: '20px 0 16px' }}>
          Three directions
        </h1>
        <p className="lede" style={{ fontSize: 18, color: '#9A9AA4', maxWidth: 720, lineHeight: 1.6, margin: 0 }}>
          All three are real scroll-driven 3D, all three put the content in the scene as
          geometry rather than fading to a flat overlay, and all three carry the same
          eight projects. Scroll each one end to end, then pick — the winner becomes the
          site.
        </p>
        <p
          style={{
            fontFamily: 'var(--lab-mono), monospace',
            fontSize: 12,
            color: '#7C7C86',
            marginTop: 18,
          }}
        >
          Press F in any concept for the plain fact sheet.
        </p>

        <div style={{ display: 'grid', gap: 20, marginTop: 56 }}>
          {CONCEPTS.map((c) => (
            <Link
              key={c.slug}
              href={`/lab/${c.slug}`}
              className="card"
              style={{
                display: 'block',
                border: '1px solid #26262C',
                background: '#161619',
                padding: 32,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div className="row" style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                <div
                  style={{
                    fontFamily: 'var(--lab-mono), monospace',
                    fontSize: 13,
                    color: '#7C7C86',
                    paddingTop: 6,
                  }}
                >
                  {c.letter}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', margin: 0 }}>
                    {c.name}
                  </h2>
                  <div
                    style={{
                      fontFamily: 'var(--lab-mono), monospace',
                      fontSize: 11.5,
                      letterSpacing: '0.1em',
                      color: '#7C7C86',
                      margin: '8px 0 18px',
                    }}
                  >
                    {c.world.toUpperCase()}
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.62, color: '#B6B6BE', margin: '0 0 12px', maxWidth: 760 }}>
                    {c.idea}
                  </p>
                  <p style={{ fontSize: 15, lineHeight: 1.62, color: '#8A8A94', margin: 0, maxWidth: 760 }}>
                    <strong style={{ color: '#B6B6BE', fontWeight: 600 }}>The bet: </strong>
                    {c.bet}
                  </p>
                  <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 22 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {c.palette.map((p) => (
                        <span
                          key={p}
                          style={{
                            width: 26,
                            height: 26,
                            background: p,
                            border: '1px solid rgba(255,255,255,0.12)',
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--lab-mono), monospace',
                        fontSize: 11,
                        color: '#7C7C86',
                      }}
                    >
                      {c.type}
                    </span>
                  </div>
                </div>
                <div
                  className="open"
                  style={{
                    fontFamily: 'var(--lab-mono), monospace',
                    fontSize: 12,
                    letterSpacing: '0.14em',
                    color: '#EDEDEA',
                    border: '1px solid #3A3A44',
                    padding: '12px 20px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  OPEN ↗
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p
          style={{
            fontFamily: 'var(--lab-mono), monospace',
            fontSize: 11.5,
            color: '#63636C',
            marginTop: 48,
            lineHeight: 1.8,
          }}
        >
          The live site is untouched — these live at /lab/* and share one content file
          (src/lab/content.ts) and one camera rig (src/lab/rig.tsx), so switching
          direction never means retyping the resume.
        </p>
      </div>
    </div>
  );
}
