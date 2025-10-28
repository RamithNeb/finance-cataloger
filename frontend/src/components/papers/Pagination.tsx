import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 hover:border-neon-gold/40 transition-colors"
      >
        Previous
      </button>
      
      <span className="text-zinc-400">
        Page <span className="text-neon-gold font-semibold">{page}</span> of{' '}
        <span className="text-neon-gold font-semibold">{totalPages}</span>
      </span>
      
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 hover:border-neon-gold/40 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

