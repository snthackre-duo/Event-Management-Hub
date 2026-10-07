import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Palette,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Download,
  Printer,
  ChevronRight,
  Filter,
  UserCheck,
  Search,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { CreativeStatus } from '../types';

export const CreativeStudioView: React.FC = () => {
  const {
    events,
    currentUser,
    setSelectedEvent,
    acceptLateCreative,
    declineLateCreative,
    updateCreativeStatus,
    logAssetDownload
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLateOnly, setFilterLateOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Collect all creative items across events
  const allCreatives = events.flatMap(ev =>
    ev.creatives.map(cr => ({
      ...cr,
      event: ev
    }))
  );

  // Filtered
  const filteredCreatives = allCreatives.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterLateOnly && !item.isLateRequest) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.label.toLowerCase().includes(q) ||
        item.event.title.toLowerCase().includes(q) ||
        (item.assignedDesignerName && item.assignedDesignerName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Kanban Columns
  const columns: { id: CreativeStatus; label: string; badge: string }[] = [
    { id: 'awaiting_acceptance', label: 'Awaiting Workload (Late CR-9)', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'not_started', label: 'Queued / Not Started', badge: 'bg-slate-700 text-slate-300' },
    { id: 'in_design', label: 'In Design Studio', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'in_review', label: 'In Review (Owner Sign-off)', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'changes_requested', label: 'Changes Requested', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'approved', label: 'Approved & Print Ready', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header & Workload Distribution */}
      <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              <h1 className="text-base sm:text-lg font-bold text-white">
                NUV Creative Studio & Workload Balancer
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                In-house Team (Q9)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracks 14 preset creative formats, manages up to 2 revision rounds (CR-4), logs print vendor orders (CR-7), and arbitrates late event requests (CR-9).
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filterLateOnly}
                onChange={e => setFilterLateOnly(e.target.checked)}
                className="rounded text-amber-500"
              />
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300 font-semibold">Late Requests Only (CR-9)</span>
            </label>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="all">All Pipeline Stages</option>
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search assets or event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs w-44"
            />
          </div>
        </div>

        {/* Live Designer Workload Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Ananya Sharma (Creative Lead)</div>
              <div className="text-[11px] text-slate-400">Branding, Brochures & Review Authority</div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Optimal (2 items)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Rohan Mehta (Senior Visuals)</div>
              <div className="text-[11px] text-slate-400">Posters, LED Backdrops & Motion Reels</div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              Active (3 items)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Average Turnaround (CR-8)</div>
              <div className="text-[11px] text-slate-400">Request to Final Sign-off</div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
              34.2 Hours
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {columns.map(col => {
          const colItems = filteredCreatives.filter(c => c.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-2xl bg-slate-850/90 border border-slate-800 flex flex-col max-h-[750px] shadow-lg"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider truncate pr-1">
                  {col.label}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${col.badge}`}>
                  {colItems.length}
                </span>
              </div>

              {/* Items List */}
              <div className="p-2 space-y-2 overflow-y-auto flex-1 scrollbar-none">
                {colItems.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-500">
                    No items in this stage
                  </div>
                ) : (
                  colItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 shadow-md space-y-2 transition-all hover:border-slate-600"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-white leading-tight">
                          {item.label}
                        </span>
                        {item.isLateRequest && (
                          <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300 shrink-0">
                            Late &lt;7d
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-300 truncate font-medium">
                        "{item.event.title}"
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {item.specs}
                      </div>

                      {/* Versions & Revision badges */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/60">
                        <span>Due: {item.neededByDate}</span>
                        {item.revisionCount > 0 && (
                          <span className="text-rose-400 font-semibold">
                            Rev {item.revisionCount}/2
                          </span>
                        )}
                      </div>

                      {/* Print Vendor badge if print logged */}
                      {item.printVendor && (
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Printer className="w-3 h-3" />
                          <span className="truncate">{item.printVendor} ({item.printQuantity} pcs)</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between gap-1">
                        {item.status === 'awaiting_acceptance' ? (
                          <div className="flex items-center gap-1 w-full">
                            <button
                              onClick={() => acceptLateCreative(item.event.id, item.id)}
                              className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] text-center"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => setSelectedEvent(item.event)}
                              className="flex-1 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] text-center"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedEvent(item.event)}
                            className="w-full py-1 rounded bg-slate-700/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Open in Event Hub</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
