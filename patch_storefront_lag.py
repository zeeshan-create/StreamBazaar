import re

with open('client/src/components/Storefront.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the lag issue: remove await from fetch in handleBuy
target_handlebuy = """  const handleBuy = async () => {
    if (!popup || !popup.device) return;
    const { product, plan, device } = popup;
    
    try {
      await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product.name,
          plan: plan.label,
          device: device,
          price: plan.price
        })
      });
    } catch (err) {
      console.error('Failed to log actual checkout click:', err);
    }

    const msg = `Hi! I want to buy ${product.name} — ${plan.label} — Device: ${device} — Price: ${plan.price}`;
    window.open(`${TELEGRAM_LINK}?text=${encodeURIComponent(msg)}`, '_blank');
    setPopup(null);
  };"""

replacement_handlebuy = """  const handleBuy = () => {
    if (!popup || !popup.device) return;
    const { product, plan, device } = popup;
    
    // Fire and forget, no await to prevent lag on checkout
    fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: product.name,
        plan: plan.label,
        device: device,
        price: plan.price
      })
    }).catch(err => console.error('Failed to log actual checkout click:', err));

    const msg = `Hi! I want to buy ${product.name} — ${plan.label} — Device: ${device} — Price: ${plan.price}`;
    window.open(`${TELEGRAM_LINK}?text=${encodeURIComponent(msg)}`, '_blank');
    setPopup(null);
  };"""

code = code.replace(target_handlebuy, replacement_handlebuy)

# Improve modalVariants for popup animation
target_modal = """const modalVariants = {
  hidden:  { opacity: 0, scale: 0.82, y: 36, rotateX: 8 },
  visible: { opacity: 1, scale: 1,    y: 0,  rotateX: 0, transition: { type: 'spring', stiffness: 380, damping: 26, mass: 0.8 } },
  exit:    { opacity: 0, scale: 0.88, y: 20, transition: { duration: 0.16, ease: 'easeIn' } },
};"""

replacement_modal = """const modalVariants = {
  hidden:  { opacity: 0, scale: 0.75, y: 50, rotateX: -15, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    y: 0,  rotateX: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 450, damping: 28, mass: 0.6 } },
  exit:    { opacity: 0, scale: 0.85, y: 30, filter: 'blur(4px)', transition: { duration: 0.15, ease: 'easeIn' } },
};"""

code = code.replace(target_modal, replacement_modal)

with open('client/src/components/Storefront.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Storefront patched for lag and popup animations")
