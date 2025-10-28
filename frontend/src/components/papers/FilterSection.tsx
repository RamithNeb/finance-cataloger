import React from 'react';

interface FilterSectionProps {
  functionFilter: string;
  setFunctionFilter: (value: string) => void;
  techniqueFilter: string;
  setTechniqueFilter: (value: string) => void;
  industryFilter: string;
  setIndustryFilter: (value: string) => void;
  stageFilter: string;
  setStageFilter: (value: string) => void;
  yearFrom: string;
  setYearFrom: (value: string) => void;
  yearTo: string;
  setYearTo: (value: string) => void;
  onReset: () => void;
  onPageReset: () => void;
}

const FUNCTIONS = ["All", "AML", "Fraud", "Credit Risk", "Underwriting", "Trading", "Portfolio Optimization", "KYC", "Compliance", "Churn", "Personalization"];
const TECHNIQUES = ["All", "Transformer", "Graph", "Gradient Boosting", "Random Forest", "LSTM", "CNN", "XGBoost", "Logistic Regression", "Other"];
const INDUSTRIES = ["All", "Banking", "Insurance", "Fintech", "Asset Management", "Payments"];
const STAGES = ["All", "Research", "Pilot", "Production"];

const FilterSection: React.FC<FilterSectionProps> = ({
  functionFilter,
  setFunctionFilter,
  techniqueFilter,
  setTechniqueFilter,
  industryFilter,
  setIndustryFilter,
  stageFilter,
  setStageFilter,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  onReset,
  onPageReset,
}) => {
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    onPageReset();
  };

  return (
    <div className="mb-6 p-6 rounded-lg bg-zinc-900/95 backdrop-blur-md border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-neon-gold hover:text-neon-gold/80 transition-colors"
        >
          Reset All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Function Filter */}
        <div>
          <label htmlFor="function" className="block text-xs font-medium text-zinc-400 mb-1">
            Function
          </label>
          <select
            id="function"
            value={functionFilter}
            onChange={(e) => handleFilterChange(setFunctionFilter)(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
          >
            {FUNCTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Technique Filter */}
        <div>
          <label htmlFor="technique" className="block text-xs font-medium text-zinc-400 mb-1">
            Technique
          </label>
          <select
            id="technique"
            value={techniqueFilter}
            onChange={(e) => handleFilterChange(setTechniqueFilter)(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
          >
            {TECHNIQUES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label htmlFor="industry" className="block text-xs font-medium text-zinc-400 mb-1">
            Industry
          </label>
          <select
            id="industry"
            value={industryFilter}
            onChange={(e) => handleFilterChange(setIndustryFilter)(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
          >
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        {/* Stage Filter */}
        <div>
          <label htmlFor="stage" className="block text-xs font-medium text-zinc-400 mb-1">
            Stage
          </label>
          <select
            id="stage"
            value={stageFilter}
            onChange={(e) => handleFilterChange(setStageFilter)(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
          >
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Year From Filter */}
        <div>
          <label htmlFor="yearFrom" className="block text-xs font-medium text-zinc-400 mb-1">
            Year From
          </label>
          <input
            type="number"
            id="yearFrom"
            value={yearFrom}
            onChange={(e) => handleFilterChange(setYearFrom)(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
            min="2018"
            max="2030"
          />
        </div>

        {/* Year To Filter */}
        <div>
          <label htmlFor="yearTo" className="block text-xs font-medium text-zinc-400 mb-1">
            Year To
          </label>
          <input
            type="number"
            id="yearTo"
            value={yearTo}
            onChange={(e) => handleFilterChange(setYearTo)(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-gold/50"
            min="2018"
            max="2030"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;

