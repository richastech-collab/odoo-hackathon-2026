import React from 'react';

const bonusItems = [
  { label: '📉 Charts & Visual Analytics', color: '#9b7ee6' },
  { label: '📄 PDF Export', color: '#6b9bdf' },
  { label: '⏰ License Expiry Reminders', color: '#f07a7a' },
  { label: '📁 Document Management', color: '#5ec49a' },
  { label: '🔍 Search & Filters', color: '#f5c46b' },
  { label: '🌙 Dark Mode', color: '#9b7ee6' },
];

const BonusStrip = () => (
  <div className="bonus-strip">
    <div className="bonus-strip-inner">
      <span className="bonus-label">Also Included:</span>
      <div className="bonus-chips">
        {bonusItems.map((item, i) => (
          <span
            key={i}
            className="bonus-chip"
            id={`bonus-chip-${i}`}
            style={{
              background: `linear-gradient(135deg, ${item.color}18 0%, ${item.color}0d 100%)`,
              borderColor: `${item.color}40`,
              color: item.color,
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default BonusStrip;
