interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Lumina R Logo Mark - Shield with hexagon representing risk protection */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lumina-500 to-lumina-700 flex items-center justify-center shadow-lg shadow-lumina-500/30">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hexagonal shield shape */}
            <path
              d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z"
              fill="white"
              fillOpacity="0.9"
            />
            {/* Inner hexagon */}
            <path
              d="M12 5L7 8V13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13V8L12 5Z"
              fill="url(#logoGradient)"
            />
            {/* Center dot - representing focus/core */}
            <circle cx="12" cy="11" r="2" fill="white" />
            <defs>
              <linearGradient
                id="logoGradient"
                x1="7"
                y1="5"
                x2="17"
                y2="18"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-lumina-500/20 blur-xl -z-10" />
      </div>

      {/* Wordmark */}
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">
            Lumina <span className="text-lumina-600">R</span>
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Risk Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
