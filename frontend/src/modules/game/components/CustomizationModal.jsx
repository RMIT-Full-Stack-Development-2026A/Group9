

/* idk where to put this so i put it here for now */


import React, { useState } from 'react';
import '../components/CustomizationModal.css';

const STYLES = ['Classic', 'Dark', 'Neon'];
const MARKERS = ['X/O', 'Ghost', 'Fire', 'Bolt', 'Diamond', 'Heart'];

export default function CustomizationModal({ onStart, currentSettings }) {
    const [settings, setSettings] = useState(currentSettings);

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <h2 className="modal-title">Game Settings</h2>
                
                {/*board size selection as per requirements*/}
                <section className="setting-section">
                    <h4>Board Size</h4>
                    <div className="toggle-group">
                        {[10, 15].map(s => (
                            <button 
                                key={s}
                                className={`size-btn ${settings.size === s ? 'active' : ''}`}
                                onClick={() => setSettings({...settings, size: s})}
                            >
                                {s}x{s}
                            </button>
                        ))}
                    </div>
                </section>

                {/*style selection as per requirement*/}
                <section className="setting-section">
                    <h4>Board Style</h4>
                    <div className="style-grid">
                        {STYLES.map(style => (
                            <div 
                                key={style}
                                className={`style-card ${settings.style === style.toLowerCase() ? 'selected' : ''}`}
                                onClick={() => setSettings({...settings, style: style.toLowerCase()})}
                            >
                                <div className={`preview-box ${style.toLowerCase()}`} />
                                <span>{style}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/*marker selection as per requirement*/}
                <section className="setting-section">
                    <h4>Your Marker</h4>
                    <div className="marker-picker">
                        {MARKERS.map((m, index) => (
                            <button 
                                key={m}
                                className={`marker-btn ${settings.markerIndex === index ? 'selected' : ''}`}
                                onClick={() => setSettings({...settings, markerIndex: index})}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </section>

                <button className="confirm-start-btn" onClick={() => onStart(settings)}>
                    Confirm & Start Match
                </button>
            </div>
        </div>
    );
}