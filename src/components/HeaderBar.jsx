/**
 * HeaderBar for Tower Craft gameplay screen.
 * Shows: Score (left) | TOWER CRAFT title (center) | Best high score (right)
 */
export default function HeaderBar({ score = 0, highScore = 0 }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'linear-gradient(180deg, #0c4a6e 0%, #075985 100%)',
            borderBottom: '4px solid #0e7490',
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
            zIndex: 50,
        }}>
            {/* Score */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ color: '#7dd3fc', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score</div>
                <div style={{
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.8rem',
                    lineHeight: 1,
                    fontFamily: "'Fredoka One', cursive",
                }}>
                    {score}
                </div>
            </div>

            {/* Title */}
            <div style={{
                color: '#fff',
                fontWeight: 900,
                fontSize: '1rem',
                fontFamily: "'Fredoka One', cursive",
                letterSpacing: '0.04em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                opacity: 0.9,
            }}>
                🏗️ TOWER CRAFT
            </div>

            {/* High score */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ color: '#7dd3fc', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Best</div>
                <div style={{
                    color: '#fde047',
                    fontWeight: 900,
                    fontSize: '1.8rem',
                    lineHeight: 1,
                    fontFamily: "'Fredoka One', cursive",
                }}>
                    {highScore}
                </div>
            </div>
        </div>
    );
}
