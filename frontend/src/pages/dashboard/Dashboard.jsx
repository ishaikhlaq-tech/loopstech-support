import { useState } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import DashboardHeader from '@components/dashboard/DashboardHeader';
import PanelTabs from '@components/dashboard/PanelTabs';
import StatsGrid from '@components/dashboard/StatsGrid';
import StatCard from '@components/dashboard/StatCard';
import WeeklyQueueCard from '@components/dashboard/WeeklyQueueCard';
import SLAComplianceCard from '@components/dashboard/SLAComplianceCard';
import ActiveAssignedQueue from '@components/dashboard/ActiveAssignedQueue';
import DeptStatsGrid from '@components/dashboard/dept/DeptStatsGrid';
import DeptVelocityCard from '@components/dashboard/dept/DeptVelocityCard';
import CategoryDistribution from '@components/dashboard/dept/CategoryDistribution';
import TeamResourceAllocation from '@components/dashboard/dept/TeamResourceAllocation';
import { useDashboard } from '@hooks/useDashboard';

const MY_PANEL_HEADER = {
  title: 'Console Overview',
  subtitle: 'Queue status, response velocity and SLA compliance.',
};
const DEPT_PANEL_HEADER = {
  title: 'Department Command',
  subtitle: 'Resource allocation, team velocity, and SLA oversight.',
};

const Dashboard = () => {
  const { 
    metrics, 
    recentQueue, 
    priorityBreakdown, 
    statusBreakdown, 
    weeklyChartData, 
    weeklyCreated, 
    weeklyResolved, 
    categoryDistribution,
    avgVelocity,
    slaStats,
    teamAllocation,
    loading 
  } = useDashboard();
  const [activePanel, setActivePanel] = useState('my');

  const header = activePanel === 'my' ? MY_PANEL_HEADER : DEPT_PANEL_HEADER;

  return (
    <DashboardLayout>
      <div className="w-full px-7 py-7 max-w-[1440px] mx-auto">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <DashboardHeader title={header.title} subtitle={header.subtitle} />
          <div className="flex items-center gap-3">
            {activePanel === 'dept' && (
              <button className="flex items-center gap-1.5 px-4 h-[36px] text-[13px] font-bold text-[#475569] bg-white border border-[#E2E8F0] rounded-[6px] hover:bg-slate-50 transition-colors shadow-sm">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Export CSV
              </button>
            )}
            <PanelTabs activePanel={activePanel} setActivePanel={setActivePanel} />
          </div>
        </div>

        {activePanel === 'my' ? (
          // ── My Panel Content ──
          loading ? (
            <div className="flex justify-center items-center h-64 text-slate-500">Loading dashboard data...</div>
          ) : (
            <>
              <StatsGrid>
                <StatCard title="TOTAL TICKETS"  value={metrics.total}        borderColor="bg-[#0F9D58]" />
                <StatCard title="OPEN"           value={metrics.open}         borderColor="bg-[#3B82F6]" />
                <StatCard title="IN PROGRESS"    value={metrics.inProgress}   borderColor="bg-[#F2994A]" />
                <StatCard title="HIGH PRIORITY"  value={metrics.urgent} borderColor="bg-[#E11D48]" />
                <StatCard title="RESOLVED"       value={metrics.resolved}     borderColor="bg-[#CBD5E1]" />
              </StatsGrid>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2">
                  <WeeklyQueueCard data={weeklyChartData} created={weeklyCreated} resolved={weeklyResolved} />
                </div>
                <div className="lg:col-span-1">
                  <SLAComplianceCard stats={slaStats} />
                </div>
              </div>

              <ActiveAssignedQueue queue={recentQueue} />
            </>
          )
        ) : (
          // ── Dept Panel Content ──
          <>
            <DeptStatsGrid metrics={metrics} avgVelocity={avgVelocity} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <div className="lg:col-span-2">
                <DeptVelocityCard data={weeklyChartData} created={weeklyCreated} resolved={weeklyResolved} />
              </div>
              <div className="lg:col-span-1">
                <CategoryDistribution breakdown={categoryDistribution} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <TeamResourceAllocation team={teamAllocation} />
              </div>
              <div className="lg:col-span-1">
                {/* Real-time map placeholder if needed */}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
