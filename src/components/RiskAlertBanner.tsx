import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { EventItem } from '../types';

export const RiskAlertBanner: React.FC = () => {
  const {
    events,
    currentUser,
    setSelectedEvent,
    setIsClashModalOpen,
    setActiveClashPair,
    setActiveTab
  } = useApp();

  const now = new Date();

  // 1. Risk Alert (Q22): Event within 5 days with any unapproved creative
  const riskEvents = events.filter(ev => {
    if (ev.status === 'completed' || ev.status === 'cancelled') return false;
    const evDate = new Date(ev.startDate);
    const diffDays = Math.ceil((evDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Event is within 5 days (0 to 5 days away)
    if (diffDays >= 0 && diffDays <= 5) {
      // Has creatives that are not approved or delivered
      const hasUnapprovedCreatives = ev.creatives.some(
        c => c.status !== 'approved' && c.status !== 'delivered'
      );
      return hasUnapprovedCreatives;
    }
    return false;
  });

  // 2. Unresolved Clashes (CA-3)
  const eventsWithUnresolvedClashes: { event1: EventItem; event2: EventItem; message: string }[] = [];
  const processedPairs = new Set<string>();

  events.forEach(ev => {
    ev.clashes?.forEach(clash => {
      if (!clash.resolved) {
        const other = events.find(e => e.id === clash.clashingEventId);
        if (other) {
          const pairKey = [ev.id, other.id].sort().join(':::');
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);
            eventsWithUnresolvedClashes.push({
              event1: ev,
              event2: other,
              message: clash.message
            });
          }
        }
      }
    });
  });

  // 3. Late requests awaiting creative team acceptance (CR-9)
  const lateRequestsWaiting = events.reduce((acc, ev) => {
    const pending = ev.creatives.filter(c => c.status === 'awaiting_acceptance');
    if (pending.length > 0) {
      acc.push({ event: ev, count: pending.length });
    }
    return acc;
  }, [] as { event: EventItem; count: number }[]);

  if (riskEvents.length === 0 && eventsWithUnresolvedClashes.length === 0 && lateRequestsWaiting.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-3">
      {/* 5-Day Risk Alert Banner (Q22) */}
      {riskEvents.map(ev => {
        const evDate = new Date(ev.startDate);
        const daysLeft = Math.max(0, Math.ceil((evDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const unapprovedCount = ev.creatives.filter(c => c.status !== 'approved' && c.status !== 'delivered').length;

        return (
          <div
            key={ev.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900 border border-rose-500/40 shadow-lg text-rose-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    High Risk: {daysLeft} Days to Event
                  </span>
                  <span className="text-sm font-bold text-white">
                    {ev.title}
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  Scheduled for {ev.startDate} at {ev.venueName}. {unapprovedCount} creative material{unapprovedCount > 1 ? 's are' : ' is'} not yet approved! Immediate review required.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedEvent(ev)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-rose-900/30"
              >
                <span>Review Creatives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}

      {/* Unresolved Venue Clashes Banner (CA-3) */}
      {eventsWithUnresolvedClashes.map(({ event1, event2, message }, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-amber-900/30 to-slate-900 border border-amber-500/40 shadow-lg text-amber-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Venue Clash Flagged
                </span>
                <span className="text-xs font-medium text-amber-200">
                  {event1.venueName} • {event1.startDate}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 font-medium">
                "{event1.title}" ({event1.startTime} - {event1.endTime}) overlaps with "{event2.title}" ({event2.startTime} - {event2.endTime}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveClashPair({ event1, event2 });
                setIsClashModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Resolve Clash</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}

      {/* Late Creatives Awaiting Workload Decision (CR-9) */}
      {lateRequestsWaiting.length > 0 && (currentUser.role === 'creative' || currentUser.role === 'admin') && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/80 via-purple-950/50 to-slate-900 border border-indigo-500/40 shadow-lg text-indigo-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Late Requests Queue (CR-9)
                </span>
                <span className="text-xs font-semibold text-white">
                  {lateRequestsWaiting.reduce((sum, item) => sum + item.count, 0)} item(s) awaiting acceptance
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                Last-minute events submitted within 7 days. Creative team decides to accept or decline based on live team workload.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('creatives')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
          >
            <span>Review Workload Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
