import StatCard from '@components/dashboard/StatCard';
import StatsGrid from '@components/dashboard/StatsGrid';

const DeptStatsGrid = ({ metrics = { total: 0, open: 0, inProgress: 0, resolved: 0 }, avgVelocity = '0h 0m' }) => {
  return (
    <StatsGrid cols={4}>
      <StatCard title="TOTAL PIPELINE" value={metrics.total}  borderColor="bg-[#0F766E]" />
      <StatCard title="ACTIVE INBOXES" value={metrics.open + metrics.inProgress}  borderColor="bg-[#3B82F6]" />
      <StatCard title="RESOLVED"       value={metrics.resolved}  borderColor="bg-[#22C55E]" />
      <StatCard title="AVG VELOCITY"   value={avgVelocity} borderColor="bg-[#CBD5E1]" />
    </StatsGrid>
  );
};

export default DeptStatsGrid;
