import React, { useCallback, useEffect, useState } from 'react';

export default function AccessibilitySettings() {
  const [lightMode, setLightMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const applySettings = useCallback(
    (opts) => {
      const lm = opts?.lightMode ?? lightMode;
      const rm = opts?.reducedMotion ?? reducedMotion;
      const lt = opts?.largeText ?? largeText;

      document.body.classList.remove('light-mode', 'reduced-motion', 'large-text');
      document.body.classList.toggle('light-mode', lm);
      document.body.classList.toggle('reduced-motion', rm);
      document.body.classList.toggle('large-text', lt);

      localStorage.setItem('lightMode', JSON.stringify(lm));
      localStorage.setItem('reducedMotion', JSON.stringify(rm));
      localStorage.setItem('largeText', JSON.stringify(lt));
    },
    [lightMode, reducedMotion, largeText]
  );

  // Single useEffect: Load from localStorage and apply
  useEffect(() => {
    try {
      const getSetting = (key) => !!JSON.parse(localStorage.getItem(key) || 'false');
      
      const lm = getSetting('lightMode');
      const rm = getSetting('reducedMotion');
      const lt = getSetting('largeText');
      
      console.log('Loading accessibility settings:', { lightMode: lm, reducedMotion: rm, largeText: lt });
      
      setLightMode(lm);
      setReducedMotion(rm);
      setLargeText(lt);
      setIsLoaded(true);
      
      // Apply immediately after setting state
      applySettings({ lightMode: lm, reducedMotion: rm, largeText: lt });
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
      setIsLoaded(true);
    }
  }, [applySettings]);

  // Apply settings when state changes (after load)
  useEffect(() => {
    if (isLoaded) {
      applySettings();
    }
  }, [lightMode, reducedMotion, largeText, isLoaded, applySettings]);

  const handleSettingChange = (setter, value) => {
    setter(value);
    // applySettings() now automatic via useEffect
  };

  return (
<div className="accessibility-settings" style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
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
            checked={lightMode}
            onChange={(e) => handleSettingChange(setLightMode, e.target.checked)}
            id="light-mode"
          />
          Light Mode
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
      </div>

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '1rem', opacity: 0.8 }}>
        Keyboard: Tab to navigate, Enter/Space to activate. Screen reader friendly. Use Account or back navigation to leave.
      </div>

      <button 
        onClick={() => {
          setLightMode(false);
          setReducedMotion(false);
          setLargeText(false);
          ['lightMode', 'reducedMotion', 'largeText'].forEach(key => localStorage.removeItem(key));
          document.body.classList.remove('light-mode', 'reduced-motion', 'large-text');
          console.log('Accessibility settings reset');
        }}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Reset All Settings
      </button>
    </div>
  );
}

