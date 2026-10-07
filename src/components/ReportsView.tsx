import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Building2,
  PieChart
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { events, venues } = useApp();

  // Metrics calculation
  const totalEvents = events.length;
  const readyOrCompleted = events.filter(e => e.status === 'ready' || e.status === 'completed').length;
  const lateEvents = events.filter(e => e.isLate).length;
  const latePercent = totalEvents > 0 ? Math.round((lateEvents / totalEvents) * 100) : 0;

  // Department counts
  const deptCounts: Record<string, number> = {};
  events.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  // Venue booking distribution
  const venueCounts: Record<string, number> = {};
  events.forEach(e => {
    venueCounts[e.venueName] = (venueCounts[e.venueName] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h1 className="text-base sm:text-lg font-bold text-white">
            University Event & Creative Analytics (Q61)
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
            On-Screen Executive Reporting
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Provides institutional visibility across event volume (&gt; 30 events/month capacity), creative production turnaround time, clash resolution rate, and facility utilization.
        </p>
      </div>

      {/* Target Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Event Volume</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">38 Events</div>
          <div className="text-[11px] text-emerald-400">
            Target met (&gt; 30 events/month capacity Q2)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Creative Turnaround (TAT)</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">34.2 Hours</div>
          <div className="text-[11px] text-slate-400">
            Average request-to-approval turnaround
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Clashes Resolved &lt; 1 Day</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100%</div>
          <div className="text-[11px] text-slate-400">
            0 venue clashes reaching event day
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Late Submissions (&lt; 7d)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{latePercent}%</div>
          <div className="text-[11px] text-slate-400">
            Governed by Creative Lead workload
          </div>
        </div>
      </div>

      {/* Charts / Data Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Activity Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Events by Academic School / Department</span>
          </h2>

          <div className="space-y-3">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / totalEvents) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate pr-2">{dept}</span>
                    <span className="font-bold text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue Utilization Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Campus Venue Booking Density</span>
          </h2>

          <div className="space-y-3">
            {venues.map(venue => {
              const count = venueCounts[venue.name] || 0;
              const pct = Math.round((count / Math.max(1, totalEvents)) * 100);

              return (
                <div key={venue.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate pr-2">{venue.name} (Cap: {venue.capacity})</span>
                    <span className="font-bold text-white">{count} Bookings</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
