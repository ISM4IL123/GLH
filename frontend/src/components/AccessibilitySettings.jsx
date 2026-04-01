import React, { useState, useEffect } from 'react';

export default function AccessibilitySettings() {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [invertColors, setInvertColors] = useState(false);

  useEffect(() => {
    // Load saved preferences
    setHighContrast(localStorage.getItem('highContrast') === 'true');
    setReducedMotion(localStorage.getItem('reducedMotion') === 'true');
    setLargeText(localStorage.getItem('largeText') === 'true');
    setInvertColors(localStorage.getItem('invertColors') === 'true');

    // Apply immediately
    applySettings();
  }, []);

  const applySettings = () => {
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('reduced-motion', reducedMotion);
    document.body.style.fontSize = largeText ? '1.2rem' : '';
    document.body.classList.toggle('invert-colors', invertColors);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('reducedMotion', reducedMotion);
    localStorage.setItem('largeText', largeText);
    localStorage.setItem('invertColors', invertColors);
  };

  const handleSettingChange = (setter, value) => {
    setter(value);
    applySettings();
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      background: 'rgba(0,0,0,0.9)',
      color: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Accessibility Settings</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => handleSettingChange(setHighContrast, e.target.checked)}
            id="high-contrast"
          />
          High Contrast Mode
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => handleSettingChange(setReducedMotion, e.target.checked)}
            id="reduced-motion"
          />
          Reduce Motion
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={largeText}
            onChange={(e) => handleSettingChange(setLargeText, e.target.checked)}
            id="large-text"
          />
          Large Text
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={invertColors}
            onChange={(e) => handleSettingChange(setInvertColors, e.target.checked)}
            id="invert-colors"
          />
          Invert Colors
        </label>
      </div>

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '1rem', opacity: 0.8 }}>
        Keyboard: Tab to navigate, Enter/Space to activate. Screen reader friendly. Use Account or back navigation to leave.
      </div>
    </div>
  );
}

