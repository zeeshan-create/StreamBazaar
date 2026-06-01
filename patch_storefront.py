import os
import re

path = r'client\src\components\Storefront.jsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

target = r"""              {filtered.map((product, idx) => (
                <motion.div
                  key={product._id || product.id}
                  layout
                  id={`card-${product._id || product.id}`}
                  className="ott-card"
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ '--card-accent': product.color }}
                  whileHover={{ y: -8, scale: 1.015, boxShadow: `0 0 0 1px ${product.color}88, 0 28px 60px -12px ${product.color}44`, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                >"""

replacement = """              {filtered.map((product, idx) => {
                const isGaming = product.category && product.category.toLowerCase().includes('gam');
                if (isGaming) {
                  return (
                    <motion.div
                      key={product._id || product.id}
                      layout
                      id={`card-${product._id || product.id}`}
                      custom={idx}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ 
                        borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', 
                        background: '#0d0f17', padding: '1.25rem',
                        '--card-accent': product.color,
                        display: 'flex', flexDirection: 'column', gap: '1.25rem'
                      }}
                      whileHover={{ y: -8, scale: 1.015, boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 40px rgba(0,0,0,0.35)`, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                    >
                      {/* Game Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <img 
                            src={product.customIcon || getFavicon(product.name)} 
                            alt={product.name} 
                            style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>{product.name}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: 1.4, maxWidth: '200px' }}>
                              {product.description || "Offline game activation for PC. Full updates supported."}
                            </p>
                          </div>
                        </div>
                        <div style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.08)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', marginTop: '0.5rem' }}>
                          STEAM
                        </div>
                      </div>

                      {/* Game Plans */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {product.plans.map((plan, i) => (
                          <motion.div
                            key={i}
                            style={{ 
                              borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', 
                              background: 'rgba(255,255,255,0.03)', overflow: 'hidden',
                              display: 'flex', cursor: 'pointer'
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (product.status && product.status !== 'Available') return;
                              openPopup(product, plan);
                            }}
                          >
                            <div style={{ width: '4px', background: product.color || '#00e5a0' }} />
                            <div style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                              <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text)' }}>{plan.label}</h4>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>{plan.duration}</span>
                                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>PC Game Seat Access</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: product.color || '#00e5a0', letterSpacing: '-0.5px' }}>{plan.price}</div>
                                <button style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', background: '#2f3136', border: '1px solid #4a4d55', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                  Buy
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                return (
                <motion.div
                  key={product._id || product.id}
                  layout
                  id={`card-${product._id || product.id}`}
                  className="ott-card"
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ '--card-accent': product.color }}
                  whileHover={{ y: -8, scale: 1.015, boxShadow: `0 0 0 1px ${product.color}88, 0 28px 60px -12px ${product.color}44`, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                >"""

if target in code:
    print("Direct target match found! Applying replacement.")
    code = code.replace(target, replacement)
else:
    print("Direct target not found, trying regex...")
    # Attempt more resilient regex
    pattern = r'\{filtered\.map\(\(product, idx\) => \(\s*<motion\.div\s*key=\{product\._id \|\| product\.id\}\s*layout\s*id={`card-\$\{product\._id \|\| product\.id\}`}\s*className="ott-card"[\s\S]*?>'
    
    match = re.search(pattern, code)
    if match:
        print("Regex target match found! Applying replacement.")
        code = re.sub(pattern, replacement.replace("              {filtered.map((product, idx) => {\n                const isGaming", "{filtered.map((product, idx) => {\n                const isGaming"), code, count=1)
    else:
        print("Regex failed to find the block.")

# We also need to add a closing brace `}` before the map close: `))} ` -> `); })}`
# Let's find the closing of the map.
# Looking near line 700:
map_close_target = """                  </motion.div>
                </motion.div>
              ))}"""
map_close_replacement = """                  </motion.div>
                </motion.div>
              );})}"""

if map_close_target in code:
    code = code.replace(map_close_target, map_close_replacement)
else:
    print("Map close target not found!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Patch applied.")
