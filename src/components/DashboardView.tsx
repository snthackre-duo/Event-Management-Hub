import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Layers,
  Palette,
  CheckSquare,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  CheckCircle2,
  ShieldAlert,
  Download,
  Copy,
  ChevronRight,
  Zap,
  Globe,
  UserCheck,
  FileCheck,
  Edit3,
  Trash2,
  Tag
} from 'lucide-react';
import { EventItem, SchoolKey } from '../types';
import { getSchoolConfig, SCHOOL_CONFIGS } from '../data/mockData';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    events,
    setSelectedEvent,
    setIsCreateModalOpen,
    setActiveTab,
    setIsClashModalOpen,
    setActiveClashPair,
    deleteEvent,
    setIsEditModalOpen,
    setEventToEdit
  } = useApp();

  const [schoolFilter, setSchoolFilter] = useState<string>('all');

  const now = new Date();

  // Metrics
  const activeEvents = events.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const myEvents = events.filter(e => e.ownerId === currentUser.id);
  const myActiveEvents = myEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  
  const clashesActive = events.reduce((sum, e) => sum + (e.clashes?.filter(c => !c.resolved).length || 0), 0) / 2;
  const myClashesActive = myEvents.reduce((sum, e) => sum + (e.clashes?.filter(c => !c.resolved).length || 0), 0);
  
  const lateRequests = events.reduce((sum, e) => sum + e.creatives.filter(c => c.status === 'awaiting_acceptance').length, 0);

  // Creative items pending my review / sign-off (if faculty)
  const myCreativesAwaitingSignOff = myEvents.flatMap(e =>
    e.creatives.filter(c => c.status === 'in_review' || c.status === 'changes_requested')
  );

  // Guests pending owner photo/bio sign-off
  const myGuestsPendingSignOff = myEvents.flatMap(e =>
    e.guests.filter(g => !g.ownerApprovedPhotoAndBio)
  );

  // 5-day risk alert events
  const riskEvents = events.filter(ev => {
    if (ev.status === 'completed' || ev.status === 'cancelled') return false;
    const diff = Math.ceil((new Date(ev.startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 5 && ev.creatives.some(c => c.status !== 'approved' && c.status !== 'delivered');
  });

  const isFaculty = currentUser.role === 'faculty';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 via-slate-800 to-indigo-950/40 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentUser.role.toUpperCase()} WORKSPACE
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentUser.department}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              {isFaculty
                ? 'Your faculty event dashboard provides a direct overview of all events scheduled by you, creative sign-off requests, and logistics checklists. To view events organized across all university schools, browse the central University Calendar.'
                : 'Navrachana University Event Pulse centralizes direct faculty scheduling, eliminates double-bookings on campus auditoriums, automates creative team workload, and synchronizes 5 logistics sub-teams.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Schedule Event (EV-3 Direct)</span>
            </button>

            {isFaculty && (
              <button
                onClick={() => setActiveTab('calendar')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>All University Events Calendar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid (Customized for Faculty vs Admin/General) */}
      {isFaculty ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>My Scheduled Events</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {myEvents.length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>{myActiveEvents.length} active in preparation</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Creatives Awaiting My Sign-off</span>
              <FileCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className={`text-2xl font-black mt-2 ${myCreativesAwaitingSignOff.length > 0 ? 'text-indigo-400' : 'text-slate-200'}`}>
              {myCreativesAwaitingSignOff.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {myCreativesAwaitingSignOff.length > 0 ? 'Action required in Event Hub' : 'All proofs approved'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Clashes on My Events</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className={`text-2xl font-black mt-2 ${myClashesActive > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {myClashesActive}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {myClashesActive > 0 ? 'Discussion needed with Admin' : 'Zero venue clashes'}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('calendar')}
            className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-indigo-500/50 shadow-md cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>All University Events</span>
              <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-cyan-400 mt-2">
              {events.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Central calendar</span>
              <span className="text-indigo-400 font-semibold group-hover:underline">View All →</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Upcoming Events</span>
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {activeEvents.length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>Live on campus calendar</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Venue Clashes (CA-3)</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className={`text-2xl font-black mt-2 ${clashesActive > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {Math.ceil(clashesActive)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {clashesActive > 0 ? 'Flagged for resolution' : 'Zero clashes'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Late Requests (CR-9)</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2">
              {lateRequests}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Awaiting workload acceptance
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>5-Day Risk Alerts (Q22)</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 mt-2">
              {riskEvents.length}
            </div>
            <div className="text-[11px] text-rose-300 mt-1">
              Unapproved creatives &lt; 5d
            </div>
          </div>
        </div>
      )}

      {/* FACULTY SPECIFIC VIEW: SHOWS "MY EVENTS" PROMINENTLY */}
      {isFaculty ? (
        <div className="space-y-6">
          {/* Faculty's Own Events Roster */}
          <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>My Scheduled Events ({myEvents.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Events you created and own. Manage guest speakers, sign off on creatives proofs, and track logistics progress.
                </p>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Schedule New Event</span>
              </button>
            </div>

            {myEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-dashed border-slate-700">
                You currently have no events scheduled under your faculty profile. Click "Schedule Event" above to create directly.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myEvents.map(ev => {
                  const hasClash = ev.clashes.some(c => !c.resolved);
                  const approvedCreatives = ev.creatives.filter(c => c.status === 'approved' || c.status === 'delivered').length;
                  const totalCreatives = ev.creatives.length;
                  const completedTasks = ev.logisticsTasks.filter(t => t.status === 'completed').length;
                  const totalTasks = ev.logisticsTasks.length;
                  const schoolCfg = getSchoolConfig(ev.school);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`p-5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border transition-all cursor-pointer space-y-3 group shadow-md flex flex-col justify-between border-l-4 ${schoolCfg.borderClass}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${schoolCfg.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${schoolCfg.dotClass}`} />
                              <span>{schoolCfg.name}</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700/80 text-slate-300">
                              {ev.type}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {ev.status.replace('_', ' ')}
                            </span>
                            {ev.isLate && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                Late (&lt; 7d)
                              </span>
                            )}
                            {hasClash && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Clash Active</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEventToEdit(ev);
                                setIsEditModalOpen(true);
                              }}
                              title="Edit Event Parameters"
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Permanently delete event "${ev.title}"?`)) {
                                  deleteEvent(ev.id);
                                }
                              }}
                              title="Delete Event"
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition-colors border border-slate-700/80 hover:border-rose-500/40 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-white mt-2 group-hover:text-emerald-300 transition-colors leading-snug">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {ev.objective}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-700/60 space-y-2 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Date & Venue:</span>
                          <span className="font-semibold text-white">{ev.startDate} • {ev.venueName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Creatives Approved:</span>
                          <span className={approvedCreatives === totalCreatives && totalCreatives > 0 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                            {approvedCreatives} of {totalCreatives}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Logistics Checklist:</span>
                          <span>{completedTasks} of {totalTasks} Tasks Done</span>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-emerald-400 font-semibold">
                          <span className="text-[11px]">Open Event Hub & Sign-offs</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Prompt to View All University Events in Calendar View */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-850 to-slate-850 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Looking for events across all university departments?
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                  The central <strong>University Calendar</strong> is open to all faculty members, students, and staff to view the complete schedule across engineering, business, cultural fests, and guest lectures.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('calendar')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-md shadow-indigo-600/20"
            >
              <span>Explore Central University Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* NON-FACULTY DASHBOARD (Admin, Creative Lead, Logistics, Leadership) */
        <div className="space-y-6">
          {/* Creative Team Workload Widget if creative or admin */}
          {(currentUser.role === 'creative' || currentUser.role === 'admin') && (
            <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Creative Team Live Workload & Late Requests Queue (CR-9)
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('creatives')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>View Full Creative Studio</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Team Capacity Load */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Designer Capacity Meter
                  </span>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-200 mb-1">
                        <span>Rohan Mehta (Visuals)</span>
                        <span className="text-indigo-400">3 active items (60%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full bg-indigo-500 w-3/5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-200 mb-1">
                        <span>Ananya Sharma (Lead)</span>
                        <span className="text-emerald-400">2 active items (40%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-2/5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Late Requests Awaiting Acceptance */}
                <div className="md:col-span-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Late Items Awaiting Lead Decision ({lateRequests})</span>
                  </span>

                  {lateRequests === 0 ? (
                    <div className="text-xs text-slate-400 py-3">
                      No pending late items. All current event creatives are on standard lead-times.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {events.flatMap(ev =>
                        ev.creatives
                          .filter(c => c.status === 'awaiting_acceptance')
                          .map(cr => (
                            <div
                              key={cr.id}
                              className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between text-xs gap-3"
                            >
                              <div>
                                <span className="font-semibold text-white">{cr.label}</span>
                                <span className="text-slate-400 ml-2">for "{ev.title}"</span>
                                <div className="text-[11px] text-amber-400 mt-0.5">
                                  Needed by: {cr.neededByDate} • Lead-time: &lt; 7 days
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedEvent(ev)}
                                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold shrink-0"
                              >
                                Decide
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* University Central Event Schedule for Admin/Staff */}
          <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  University Central Event Schedule
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Open Interactive Calendar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* School Colour Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 pb-1">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>School:</span>
              </span>
              <button
                onClick={() => setSchoolFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  schoolFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Schools
              </button>
              {(Object.keys(SCHOOL_CONFIGS) as SchoolKey[]).map(sKey => {
                const cfg = SCHOOL_CONFIGS[sKey];
                const isSelected = schoolFilter === sKey;
                return (
                  <button
                    key={sKey}
                    onClick={() => setSchoolFilter(schoolFilter === sKey ? 'all' : sKey)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? `${cfg.badgeClass} ring-2 ring-white/50 shadow-md`
                        : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} opacity-85 hover:opacity-100`
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                    <span>{cfg.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events
                .filter(ev => schoolFilter === 'all' || ev.school === schoolFilter)
                .map(ev => {
                  const hasClash = ev.clashes.some(c => !c.resolved);
                  const approvedCreatives = ev.creatives.filter(c => c.status === 'approved' || c.status === 'delivered').length;
                  const totalCreatives = ev.creatives.length;
                  const schoolCfg = getSchoolConfig(ev.school);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`p-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 border transition-all cursor-pointer space-y-3 group hover:border-indigo-500/50 flex flex-col justify-between border-l-4 ${schoolCfg.borderClass}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${schoolCfg.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${schoolCfg.dotClass}`} />
                              <span>{schoolCfg.name}</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-700/80 text-slate-300">
                              {ev.type}
                            </span>
                            {hasClash && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Clash</span>
                              </span>
                            )}
                            {ev.isLate && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                Late
                              </span>
                            )}
                          </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventToEdit(ev);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Event Parameters"
                            className="p-1 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/80 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Permanently delete event "${ev.title}"?`)) {
                                deleteEvent(ev.id);
                              }
                            }}
                            title="Delete Event"
                            className="p-1 rounded-lg bg-slate-900/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition-colors border border-slate-700/80 hover:border-rose-500/40 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {ev.objective}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Date:</span>
                        <span className="font-semibold text-white">{ev.startDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Venue:</span>
                        <span className="truncate max-w-[160px] text-right">{ev.venueName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Creatives Approved:</span>
                        <span className={approvedCreatives === totalCreatives && totalCreatives > 0 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                          {approvedCreatives} / {totalCreatives}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
