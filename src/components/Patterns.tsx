export function Arabesque({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 356" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <g stroke="white" strokeWidth="0.5" fill="none">
        <circle cx="100" cy="178" r="60" />
        <circle cx="100" cy="178" r="40" />
        <circle cx="100" cy="178" r="20" />
        <path d="M100 118 L140 178 L100 238 L60 178 Z" />
        <path d="M100 98 L160 178 L100 258 L40 178 Z" />
        <path d="M100 80 Q150 130 100 178 Q50 130 100 80" />
        <path d="M100 278 Q150 228 100 178 Q50 228 100 278" />
        <circle cx="100" cy="80" r="8" />
        <circle cx="100" cy="278" r="8" />
      </g>
    </svg>
  );
}

export function Geometric({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 356" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <g stroke="white" strokeWidth="0.5" fill="none">
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            <rect x={20 + r * 30} y={20 + r * 50} width={160 - r * 60} height={316 - r * 100} rx={4} transform={`rotate(${r * 5} 100 178)`} />
          </g>
        ))}
        <path d="M100 0 L100 356 M0 178 L200 178 M30 108 L170 248 M170 108 L30 248" />
      </g>
    </svg>
  );
}

export function Minimal({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 356" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <g stroke="white" strokeWidth="0.4" fill="none" opacity="0.8">
        <line x1="40" y1="100" x2="160" y2="100" />
        <line x1="40" y1="256" x2="160" y2="256" />
        <circle cx="100" cy="178" r="3" fill="white" />
      </g>
    </svg>
  );
}

export function Calligraphic({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 356" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <g stroke="white" strokeWidth="0.6" fill="none" opacity="0.7">
        <path d="M100 50 Q120 80 100 120 Q80 160 110 200 Q130 240 100 280" />
        <path d="M60 100 Q80 140 60 180 Q40 220 70 260" />
        <path d="M140 100 Q120 140 140 180 Q160 220 130 260" />
      </g>
    </svg>
  );
}
