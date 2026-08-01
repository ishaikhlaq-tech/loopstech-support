const StatsGrid = ({ children, cols = 5 }) => {
  const gridClass = cols === 4
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full'
    : 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 w-full';
  return (
    <div className={gridClass}>
      {children}
    </div>
  );
};

export default StatsGrid;
