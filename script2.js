const fs = require('fs');
const file = 'client/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update sorting
const sortLogic = `
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (a.category === 'Gaming' && b.category !== 'Gaming') return 1;
    if (a.category !== 'Gaming' && b.category === 'Gaming') return -1;
    return 0;
  });

  let gamingHeaderShownGrid = false;
  let streamingHeaderShownGrid = false;
  let gamingHeaderShownList = false;
  let streamingHeaderShownList = false;
`;

if (!content.includes('const sortedServices =')) {
  content = content.replace(
    /const filteredServices = services\.filter\(s => \{[\s\S]*?\}\);/,
    `$&${sortLogic}`
  );
}

// Replace `{filteredServices.map(s => (` with `{sortedServices.map(s => (` in the two places
// But wait, to insert headers, we need to return a Fragment.

// We will find the grid map:
/*
                          {filteredServices.map(s => (
                            <div key={s._id} className="admin-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '1.5rem' }}>
*/

content = content.replace(
  /\{filteredServices\.map\(s => \(\s*<div key=\{s\._id\} className="admin-card"/,
  `{sortedServices.map(s => {
                              const isGaming = s.category === 'Gaming';
                              const showStreamingHeader = !isGaming && !streamingHeaderShownGrid;
                              const showGamingHeader = isGaming && !gamingHeaderShownGrid;
                              if (showStreamingHeader) streamingHeaderShownGrid = true;
                              if (showGamingHeader) gamingHeaderShownGrid = true;

                              return (
                                <React.Fragment key={s._id}>
                                  {showStreamingHeader && <h3 style={{ gridColumn: '1 / -1', fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--color-primary)' }}>Streaming & Apps</h3>}
                                  {showGamingHeader && <h3 style={{ gridColumn: '1 / -1', fontSize: '1.2rem', fontWeight: 700, margin: '1.5rem 0 0.5rem 0', color: '#22c55e' }}>Gaming & Consoles</h3>}
                                  <div className="admin-card"`
);

// We will find the list map:
/*
                              {filteredServices.map(s => (
                                <tr key={s._id} style={{ borderBottom: '1px solid var(--color-border)', transition: '0.2s' }}>
*/

content = content.replace(
  /\{filteredServices\.map\(s => \(\s*<tr key=\{s\._id\} style=\{\{ borderBottom: '1px solid var\(--color-border\)', transition: '0\.2s' \}\}>/,
  `{sortedServices.map(s => {
                                  const isGaming = s.category === 'Gaming';
                                  const showStreamingHeader = !isGaming && !streamingHeaderShownList;
                                  const showGamingHeader = isGaming && !gamingHeaderShownList;
                                  if (showStreamingHeader) streamingHeaderShownList = true;
                                  if (showGamingHeader) gamingHeaderShownList = true;

                                  return (
                                    <React.Fragment key={s._id}>
                                      {showStreamingHeader && <tr><td colSpan="5"><h3 style={{ fontSize: '1.1rem', fontWeight: 700, padding: '1rem 1.5rem 0.5rem', color: 'var(--color-primary)' }}>Streaming & Apps</h3></td></tr>}
                                      {showGamingHeader && <tr><td colSpan="5"><h3 style={{ fontSize: '1.1rem', fontWeight: 700, padding: '1.5rem 1.5rem 0.5rem', color: '#22c55e' }}>Gaming & Consoles</h3></td></tr>}
                                      <tr style={{ borderBottom: '1px solid var(--color-border)', transition: '0.2s' }}>`
);

// We also need to close the React.Fragment for both map blocks.
// The end of the grid card block is `</div>\n                              )}` (Wait, it's `</div>\n                          ))} ` actually.
// Let's just use regex.

content = content.replace(
  /<\/div>\s*\)\)\}\s*<\/div>\s*\)\s*:\s*\(\s*\/\* List view table \*\//,
  `</div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                      ) : (
                        /* List view table */`
);

content = content.replace(
  /<\/tr>\s*\)\)\}\s*<\/tbody>/,
  `</tr>
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>`
);

fs.writeFileSync(file, content);
console.log('Done replacement 2.');
