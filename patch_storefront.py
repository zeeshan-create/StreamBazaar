import re

with open('client/src/components/Storefront.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = """const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.95 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.04 } }),
  exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
const planRowVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.28, delay: i * 0.05, ease: 'easeOut' } }),
};"""

replacement = """const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.92, rotateX: 10 },
  visible: (i) => ({ 
    opacity: 1, y: 0, scale: 1, rotateX: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 20, mass: 0.8, delay: i * 0.05 } 
  }),
  exit:    { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
};
const planRowVariants = {
  hidden:  { opacity: 0, x: -20, filter: 'blur(4px)' },
  visible: (i) => ({ 
    opacity: 1, x: 0, filter: 'blur(0px)', 
    transition: { type: 'spring', stiffness: 400, damping: 25, delay: i * 0.06 } 
  }),
};"""

code = code.replace(target, replacement)

# Add a smooth hover effect on cards
hover_target = """                  whileHover={{ y: -6, boxShadow: `0 0 0 1px ${product.color}55, 0 24px 56px -10px ${product.color}33`, transition: { duration: 0.2 } }}"""
hover_replacement = """                  whileHover={{ y: -8, scale: 1.015, boxShadow: `0 0 0 1px ${product.color}88, 0 28px 60px -12px ${product.color}44`, transition: { type: 'spring', stiffness: 400, damping: 15 } }}"""

code = code.replace(hover_target, hover_replacement)

with open('client/src/components/Storefront.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Storefront animations patched")
