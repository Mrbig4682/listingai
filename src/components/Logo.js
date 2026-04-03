export default function Logo({ variant = 'full', size = 'md' }) {
  const sizes = {
    sm: { icon: 24, text: 'text-base', gap: 'gap-1.5' },
    md: { icon: 28, text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 36, text: 'text-2xl', gap: 'gap-2.5' },
  }
  const s = sizes[size] || sizes.md

  const Icon = () => (
    <svg width={s.icon} height={s.icon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
      {/* Stylized "L" shape */}
      <path d="M10 8V24H22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* AI sparkle dots */}
      <circle cx="22" cy="10" r="2" fill="white" opacity="0.9"/>
      <circle cx="18" cy="14" r="1.2" fill="white" opacity="0.6"/>
      <circle cx="24" cy="16" r="1" fill="white" opacity="0.4"/>
    </svg>
  )

  if (variant === 'icon') {
    return <Icon />
  }

  return (
    <div className={`flex items-center ${s.gap}`}>
      <Icon />
      <span className={`${s.text} font-bold tracking-tight`}>
        <span className="gradient-text">listing</span>
        <span className="text-gray-800">AI</span>
      </span>
    </div>
  )
}
