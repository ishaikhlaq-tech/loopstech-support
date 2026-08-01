// this file builds all the data for the main dashboard page
import express from 'express';
import supabaseAdmin, { supabaseDB } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// main summary endpoint - returns everything the dashboard needs in one call
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const isCustomer = req.user.role === 'customer';
    const userId = req.user.id;

    // build the base query - if it's a customer, only show their own tickets
    const buildQuery = () => {
      let q = supabaseDB.from('tickets').select('id, title, status, priority, created_at, category, department, assigned_to, resolved_at, sla_deadline');
      if (isCustomer) q = q.eq('created_by', userId);
      return q;
    };

    // grab all the tickets we need to work with
    const { data: allTickets, error: allError } = await buildQuery();
    if (allError) throw allError;

    // count tickets by their current status
    const total      = allTickets.length;
    const open       = allTickets.filter(t => t.status === 'open').length;
    const inProgress = allTickets.filter(t => t.status === 'in_progress').length;
    const closed     = allTickets.filter(t => t.status === 'closed').length;
    const resolved   = allTickets.filter(t => t.status === 'resolved').length;
    const urgent     = allTickets.filter(
      t => t.priority === 'urgent' || t.priority === 'high'
    ).length;

    // show the 5 most recent tickets for the activity queue
    const recentQueue = [...allTickets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(t => ({
        id:         t.id,
        title:      t.title,
        priority:   t.priority,
        status:     t.status,
        created_at: t.created_at,
      }));

    // break down tickets by priority and category for the charts
    const priorityBreakdown = {
      urgent: allTickets.filter(t => t.priority === 'urgent').length,
      high:   allTickets.filter(t => t.priority === 'high').length,
      medium: allTickets.filter(t => t.priority === 'medium').length,
      low:    allTickets.filter(t => t.priority === 'low').length,
    };

    const categoryDistribution = allTickets.reduce((acc, t) => {
      const cat = t.category || 'unassigned';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // build the last 7 days chart data - how many created vs resolved each day
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weeklyChartData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayLabel = DAY_NAMES[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      const created = allTickets.filter(t => t.created_at?.startsWith(dateStr)).length;
      const r = allTickets.filter(
        t => (t.status === 'resolved' || t.status === 'closed') && (t.resolved_at?.startsWith(dateStr) || t.created_at?.startsWith(dateStr))
      ).length;
      return { name: dayLabel, created, resolved: r };
    });

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    const weeklyCreated  = allTickets.filter(t => new Date(t.created_at) >= weekStart).length;
    const weeklyResolved = allTickets.filter(
      t => (t.status === 'resolved' || t.status === 'closed') && new Date(t.created_at) >= weekStart
    ).length;

    const statusBreakdown = { open, inProgress, closed, resolved };

    // calculate SLA breaches and how fast tickets are being resolved on average
    const slaStats = { total: 0, breaches: 0 };
    let totalVelocityMs = 0;
    let resolvedCountForVelocity = 0;

    allTickets.forEach(t => {
      // check if this ticket missed its SLA deadline
      if (t.sla_deadline) {
        slaStats.total += 1;
        const resolutionTime = t.resolved_at ? new Date(t.resolved_at) : new Date();
        const deadline = new Date(t.sla_deadline);
        if (resolutionTime > deadline) {
          slaStats.breaches += 1;
        }
      }

      // track how long it took to resolve so we can average it later
      if ((t.status === 'resolved' || t.status === 'closed') && t.resolved_at && t.created_at) {
        resolvedCountForVelocity += 1;
        totalVelocityMs += (new Date(t.resolved_at) - new Date(t.created_at));
      }
    });

    let avgVelocity = "0h 0m";
    if (resolvedCountForVelocity > 0) {
      const avgMs = totalVelocityMs / resolvedCountForVelocity;
      const hours = Math.floor(avgMs / (1000 * 60 * 60));
      const mins = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
      avgVelocity = `${hours}h ${mins}m`;
    }

    // show which agents have how many tickets assigned to them
    let teamAllocation = [];
    if (!isCustomer) {
      const { data: agents } = await supabaseDB
        .from('profiles')
        .select('id, email')
        .in('role', ['agent', 'admin']);
        
      if (agents) {
        teamAllocation = agents.map(agent => {
          const agentTickets = allTickets.filter(t => t.assigned_to === agent.id);
          const a_assigned = agentTickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
          const a_resolved = agentTickets.filter(t => t.status === 'closed' || t.status === 'resolved').length;
          
          let a_slaBreaches = 0;
          let a_totalMs = 0;
          let a_resolvedCount = 0;

          agentTickets.forEach(t => {
            if (t.sla_deadline) {
              const resTime = t.resolved_at ? new Date(t.resolved_at) : new Date();
              if (resTime > new Date(t.sla_deadline)) a_slaBreaches++;
            }
            if (t.resolved_at && (t.status === 'resolved' || t.status === 'closed')) {
              a_resolvedCount++;
              a_totalMs += (new Date(t.resolved_at) - new Date(t.created_at));
            }
          });

          let a_avgDuration = "N/A";
          if (a_resolvedCount > 0) {
            const ms = a_totalMs / a_resolvedCount;
            const h = Math.floor(ms / (1000 * 60 * 60));
            const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
            a_avgDuration = `${h}h ${m}m`;
          }

          return {
            id: agent.id,
           name: agent.email?.split('@')[0],
            email: agent.email,
            assigned: a_assigned,
            resolved: a_resolved,
            avgDuration: a_avgDuration,
            slaBreaches: a_slaBreaches
          };
        });
      }
    }

    // send everything back as one clean response
    res.json({
      metrics: { total, open, inProgress, closed, resolved, urgent },
      recentQueue,
      priorityBreakdown,
      statusBreakdown,
      weeklyChartData,
      weeklyCreated,
      weeklyResolved,
      userRole: req.user.role,
      categoryDistribution,
      avgVelocity,
      slaStats,
      teamAllocation
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
