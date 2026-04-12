const SectionIllustrations: Record<string, React.FC<{ className?: string }>> = {
  legal: ({ className }) => (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="70" y="40" width="140" height="180" rx="8" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <line x1="100" y1="80" x2="180" y2="80" stroke="#1A6478" strokeWidth="1.5" />
      <line x1="100" y1="100" x2="180" y2="100" stroke="#1A6478" strokeWidth="1.5" opacity="0.5" />
      <line x1="100" y1="120" x2="160" y2="120" stroke="#1A6478" strokeWidth="1.5" opacity="0.5" />
      <circle cx="140" cy="170" r="25" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.5" />
      <path d="M130 170 L138 178 L152 162" stroke="#1A6478" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="160" y="190" width="60" height="40" rx="6" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <path d="M175 205 L185 215 L205 200" stroke="#1A6478" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  financial: ({ className }) => (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="140" y1="60" x2="140" y2="80" stroke="#1A6478" strokeWidth="1.5" />
      <polygon points="140,60 80,100 200,100" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <line x1="90" y1="100" x2="90" y2="180" stroke="#1A6478" strokeWidth="1.5" />
      <line x1="190" y1="100" x2="190" y2="180" stroke="#1A6478" strokeWidth="1.5" />
      <rect x="75" y="180" width="30" height="10" rx="3" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.5" />
      <rect x="175" y="180" width="30" height="10" rx="3" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.5" />
      <circle cx="90" cy="160" r="12" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <circle cx="190" cy="145" r="12" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <circle cx="190" cy="165" r="12" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <rect x="60" y="200" width="160" height="8" rx="4" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
    </svg>
  ),
  governance: ({ className }) => (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="80" y="100" width="120" height="70" rx="8" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <circle cx="110" cy="80" r="15" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <circle cx="140" cy="75" r="15" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <circle cx="170" cy="80" r="15" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <line x1="95" y1="120" x2="185" y2="120" stroke="#1A6478" strokeWidth="1" opacity="0.5" />
      <line x1="95" y1="135" x2="185" y2="135" stroke="#1A6478" strokeWidth="1" opacity="0.3" />
      <line x1="95" y1="150" x2="160" y2="150" stroke="#1A6478" strokeWidth="1" opacity="0.3" />
      <rect x="100" y="190" width="80" height="30" rx="6" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.5" />
      <path d="M125 200 L135 210 L155 195" stroke="#1A6478" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  operational: ({ className }) => (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="130" r="40" stroke="#1A6478" strokeWidth="1.5" fill="none" />
      <circle cx="120" cy="130" r="15" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 120 + Math.cos(rad) * 35;
        const y1 = 130 + Math.sin(rad) * 35;
        const x2 = 120 + Math.cos(rad) * 48;
        const y2 = 130 + Math.sin(rad) * 48;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A6478" strokeWidth="1.5" />;
      })}
      <circle cx="190" cy="170" r="28" stroke="#1A6478" strokeWidth="1.5" fill="none" />
      <circle cx="190" cy="170" r="10" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 190 + Math.cos(rad) * 23;
        const y1 = 170 + Math.sin(rad) * 23;
        const x2 = 190 + Math.cos(rad) * 34;
        const y2 = 170 + Math.sin(rad) * 34;
        return <line key={`s-${angle}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A6478" strokeWidth="1.5" />;
      })}
    </svg>
  ),
  strategic: ({ className }) => (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="140" cy="140" r="60" stroke="#1A6478" strokeWidth="1.5" fill="none" />
      <circle cx="140" cy="140" r="40" stroke="#1A6478" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="140" cy="140" r="20" stroke="#1A6478" strokeWidth="1" fill="#E4F2F6" fillOpacity="0.3" />
      <polygon points="140,70 144,135 140,140 136,135" fill="#1A6478" />
      <polygon points="140,210 136,145 140,140 144,145" fill="#1A6478" opacity="0.3" />
      <line x1="75" y1="140" x2="130" y2="140" stroke="#1A6478" strokeWidth="1" opacity="0.3" />
      <line x1="150" y1="140" x2="205" y2="140" stroke="#1A6478" strokeWidth="1" opacity="0.3" />
    </svg>
  ),
  communications: ({ className }) => (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="80" width="120" height="80" rx="12" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <polygon points="80,160 60,185 100,160" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <circle cx="100" cy="115" r="4" fill="#1A6478" />
      <circle cx="120" cy="115" r="4" fill="#1A6478" />
      <circle cx="140" cy="115" r="4" fill="#1A6478" />
      <rect x="120" y="140" width="100" height="60" rx="12" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <polygon points="200,200 220,220 180,200" stroke="#1A6478" strokeWidth="1.5" fill="#E4F2F6" fillOpacity="0.3" />
      <line x1="140" y1="160" x2="200" y2="160" stroke="#1A6478" strokeWidth="1.5" opacity="0.5" />
      <line x1="140" y1="175" x2="185" y2="175" stroke="#1A6478" strokeWidth="1.5" opacity="0.3" />
    </svg>
  ),
};

export default SectionIllustrations;
