import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  pillTextColor?: string;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  searchValue,
  onSearchChange,
  placeholder = 'Search papers...',
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  pillTextColor,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchPillRef = useRef<HTMLDivElement | null>(null);

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleSearchFocus = () => {
    const pill = searchPillRef.current;
    if (!pill) return;
    gsap.to(pill, {
      scale: 1.02,
      duration: 0.3,
      ease,
      boxShadow: `0 0 20px ${baseColor}40`
    });
  };

  const handleSearchBlur = () => {
    const pill = searchPillRef.current;
    if (!pill) return;
    gsap.to(pill, {
      scale: 1,
      duration: 0.3,
      ease,
      boxShadow: '0 0 0px transparent'
    });
  };

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--logo']: '36px',
  } as React.CSSProperties;

  return (
    <div className={`w-full ${className}`}>
      <nav
        className="w-full flex items-center justify-between box-border"
        aria-label="Primary"
        style={cssVars}
      >
        <div
          onMouseEnter={handleLogoEnter}
          className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'var(--base, #000)'
          }}
        >
          <img 
            src={logo} 
            alt={logoAlt} 
            ref={logoImgRef} 
            className="w-full h-full object-cover block" 
          />
        </div>

        <div
          ref={searchPillRef}
          className="flex-1 mx-4 relative rounded-full overflow-hidden transition-all"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)'
          }}
        >
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder={placeholder}
            className="w-full h-full px-6 bg-transparent border-none outline-none font-medium text-[16px] uppercase tracking-[0.2px]"
            style={{
              background: 'var(--pill-bg, #fff)',
              color: 'var(--pill-text, #fff)'
            }}
          />
        </div>
      </nav>
    </div>
  );
};

export default PillNav;

