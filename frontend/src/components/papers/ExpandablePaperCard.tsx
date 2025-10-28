import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import { Paper } from '@/lib/api';

export interface ExpandablePaperCardProps {
  paper: Paper;
}

const ExpandablePaperCard: React.FC<ExpandablePaperCardProps> = ({ paper }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return 120;

    const wasVisible = content.style.visibility;
    const wasPosition = content.style.position;
    const wasHeight = content.style.height;

    content.style.visibility = 'visible';
    content.style.position = 'static';
    content.style.height = 'auto';

    const collapsedHeight = 160;
    const expandedPadding = 24;
    const fullContentHeight = content.scrollHeight;

    content.style.visibility = wasVisible;
    content.style.position = wasPosition;
    content.style.height = wasHeight;

    return collapsedHeight + fullContentHeight + expandedPadding;
  };

  const createTimeline = () => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return null;

    gsap.set(card, { height: 160 });
    gsap.set(content, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ paused: true });

    tl.to(card, {
      height: calculateHeight,
      duration: 0.4,
      ease: 'power3.out'
    });

    tl.to(content, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, '-=0.2');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [paper]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(cardRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleExpand = () => {
    const tl = tlRef.current;
    if (!tl) return;
    
    if (!isExpanded) {
      setIsExpanded(true);
      tl.play(0);
    } else {
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl border bg-zinc-900/95 backdrop-blur-md p-7 cursor-pointer transition-all duration-300 will-change-[height] ${
        isExpanded 
          ? 'overflow-visible border-neon-gold/50 shadow-[0_0_20px_rgba(246,196,83,0.15)]' 
          : 'overflow-hidden border-zinc-800/70 hover:border-neon-gold/40 hover:shadow-[0_0_15px_rgba(246,196,83,0.1)]'
      }`}
      onClick={toggleExpand}
    >
      {/* Collapsed Content - Always Visible */}
      <div className="pointer-events-none">
        {/* Title - only this gets clamped */}
        <h3 className={`text-xl font-semibold text-zinc-100 mb-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>
          {paper.title}
        </h3>
        
        {/* Meta - always visible, show 2-3 authors */}
        <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mb-3">
          <span>
            {paper.authors.split(',').slice(0, 3).join(', ')}
            {paper.authors.split(',').length > 3 && ' et al.'}
          </span>
          <span>•</span>
          <span>{paper.venue || 'arXiv'}</span>
          <span>•</span>
          <span className="text-neon-gold">{paper.year}</span>
        </div>
        
        {/* Tags - always visible with improved styling */}
        <div className="flex flex-wrap gap-2">
          {paper.function && paper.function !== 'Unknown' && (
            <span className="px-3 py-1.5 text-xs rounded-md bg-neon-gold/10 text-neon-gold border border-neon-gold/20 hover:bg-neon-gold/15 hover:shadow-[inset_0_0_8px_rgba(246,196,83,0.2)] transition-all duration-200 cursor-default">
              {paper.function}
            </span>
          )}
          {paper.technique && paper.technique !== 'Unknown' && (
            <span className="px-3 py-1.5 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/15 hover:shadow-[inset_0_0_8px_rgba(59,130,246,0.2)] transition-all duration-200 cursor-default">
              {paper.technique}
            </span>
          )}
          {paper.industry && paper.industry !== 'Unknown' && (
            <span className="px-3 py-1.5 text-xs rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/15 hover:shadow-[inset_0_0_8px_rgba(168,85,247,0.2)] transition-all duration-200 cursor-default">
              {paper.industry}
            </span>
          )}
          {paper.stage && paper.stage !== 'Unknown' && (
            <span className="px-3 py-1.5 text-xs rounded-md bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15 hover:shadow-[inset_0_0_8px_rgba(34,197,94,0.2)] transition-all duration-200 cursor-default">
              {paper.stage}
            </span>
          )}
        </div>
      </div>

      {/* Expanded Content - Hidden by default */}
      <div
        ref={contentRef}
        className={`mt-4 ${isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-t border-zinc-800/50 pt-6 space-y-5">
          {/* Summary */}
          {paper.summary && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-300 mb-2">Summary</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {paper.summary}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {paper.dataset && paper.dataset !== 'Unknown' && (
              <div>
                <span className="text-zinc-500">Dataset:</span>
                <span className="ml-2 text-zinc-300">{paper.dataset}</span>
              </div>
            )}
            {paper.model && paper.model !== 'Unknown' && (
              <div>
                <span className="text-zinc-500">Model:</span>
                <span className="ml-2 text-zinc-300">{paper.model}</span>
              </div>
            )}
            {paper.results && paper.results !== 'Unknown' && (
              <div>
                <span className="text-zinc-500">Results:</span>
                <span className="ml-2 text-zinc-300">{paper.results}</span>
              </div>
            )}
            {paper.business_impact && paper.business_impact !== 'Unknown' && (
              <div>
                <span className="text-zinc-500">Impact:</span>
                <span className="ml-2 text-zinc-300">{paper.business_impact}</span>
              </div>
            )}
          </div>

          {/* Link */}
          <a
            href={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-neon-gold hover:text-neon-gold/80 transition-colors pointer-events-auto break-words max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            View Paper
            <GoArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Expand Indicator */}
      <div className="absolute bottom-4 right-4 text-zinc-500 text-xs pointer-events-none">
        {isExpanded ? '▲' : '▼'}
      </div>
    </div>
  );
};

export default ExpandablePaperCard;

