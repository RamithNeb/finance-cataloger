import { useState } from 'react';
import TextType from '@/components/TextType';
import Navigation from '@/components/Navigation';
import FilterSection from '@/components/papers/FilterSection';
import ExpandablePaperCard from '@/components/papers/ExpandablePaperCard';
import Pagination from '@/components/papers/Pagination';
import { usePapers } from '@/hooks/usePapers';

export default function PapersPage() {
  // Filter states
  const [search, setSearch] = useState('');
  const [functionFilter, setFunctionFilter] = useState('All');
  const [techniqueFilter, setTechniqueFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [yearFrom, setYearFrom] = useState<string>('2018');
  const [yearTo, setYearTo] = useState<string>('2025');
  const [page, setPage] = useState(1);

  // Fetch papers using custom hook
  const { data, loading, error } = usePapers({
    search,
    functionFilter,
    techniqueFilter,
    industryFilter,
    stageFilter,
    yearFrom,
    yearTo,
    page,
    limit: 20,
    order: '-year',
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFunctionFilter('All');
    setTechniqueFilter('All');
    setIndustryFilter('All');
    setStageFilter('All');
    setYearFrom('2018');
    setYearTo('2025');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation with Search */}
      <Navigation searchValue={search} onSearchChange={handleSearchChange} />

      <div className="relative mx-auto max-w-7xl px-6 py-10 mt-8">
        {/* Hero Header */}
        <div className="mb-12 flex justify-center">
          <div className="inline-block px-10 py-6 rounded-2xl bg-zinc-900/70 backdrop-blur-lg border border-zinc-800/50">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-3 text-center">
              <TextType
                text={["Finance AI Use Case Catalog"]}
                typingSpeed={70}
                pauseDuration={1200}
                showCursor={true}
                cursorCharacter="|"
              />
            </h1>
            <p className="text-base text-neutral-300 text-center">
              Explore real, verifiable AI/ML use cases in financial services.
            </p>
          </div>
        </div>

        {/* Filters */}
        <FilterSection
          functionFilter={functionFilter}
          setFunctionFilter={setFunctionFilter}
          techniqueFilter={techniqueFilter}
          setTechniqueFilter={setTechniqueFilter}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
          yearFrom={yearFrom}
          setYearFrom={setYearFrom}
          yearTo={yearTo}
          setYearTo={setYearTo}
          onReset={resetFilters}
          onPageReset={() => setPage(1)}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-neon-gold"></div>
            <p className="text-zinc-400 mt-4">Loading papers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-block px-6 py-4 rounded-lg bg-red-900/20 border border-red-500/50">
              <p className="text-red-400 font-semibold">Error loading papers</p>
              <p className="text-red-300 text-sm mt-2">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && data && (
          <>
            {/* Results info */}
            {data.papers.length > 0 ? (
              <>
                <div className="mb-6 px-4 py-3 rounded-lg bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 text-sm text-zinc-300 inline-block">
                  Showing <span className="text-neon-gold font-bold">{data.papers.length}</span> of{' '}
                  <span className="text-neon-gold font-bold">{data.count}</span> results
                  <span className="mx-2 text-zinc-600">•</span>
                  Page <span className="text-neon-gold font-bold">{data.page}</span> of{' '}
                  <span className="text-neon-gold font-bold">{data.total_pages}</span>
                </div>

                {/* Papers grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {data.papers.map((paper) => (
                    <ExpandablePaperCard key={paper.id} paper={paper} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  page={data.page}
                  totalPages={data.total_pages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-400 mb-2">No papers found matching your filters.</p>
                <button
                  onClick={resetFilters}
                  className="text-neon-gold hover:text-neon-gold/80 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
