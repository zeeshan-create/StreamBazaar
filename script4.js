const fs = require('fs');
const file = 'client/src/App.css';
let content = fs.readFileSync(file, 'utf8');

const newStyles = `
/* Device Availability Animations */
.device-btn.available {
  transition: all 0.3s ease;
}

.device-btn.available:hover {
  /* "thoda black side under side animation" */
  box-shadow: inset 0 -6px 12px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.device-btn.out-of-stock {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(100%);
  position: relative;
  transition: all 0.3s ease;
}

.device-btn.out-of-stock:hover {
  /* "Bahar ki side per animation jab cross mouse Ho" */
  box-shadow: 0 0 15px rgba(255, 50, 50, 0.5), 0 0 5px rgba(255, 50, 50, 0.3);
  border-color: rgba(255, 50, 50, 0.4);
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px) rotate(-1deg); }
  50% { transform: translateX(4px) rotate(1deg); }
  75% { transform: translateX(-4px) rotate(-1deg); }
  100% { transform: translateX(0); }
}

.oos-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 0.55rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 2;
}
`;

if (!content.includes('.device-btn.available')) {
  content += newStyles;
  fs.writeFileSync(file, content);
  console.log('App.css updated.');
} else {
  console.log('App.css already contains styles.');
}
