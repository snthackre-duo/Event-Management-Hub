import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Layers,
  Palette,
  CheckSquare,
  Download,
  FolderUp,
  BarChart3,
  Bell,
  Plus,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  Building2,
  ExternalLink,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { UserRole } from '../types';
import { getSchoolConfig } from '../data/mockData';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    users,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeTab,
    setActiveTab,
    setIsCreateModalOpen,
    events,
    setIsClashModalOpen,
    setActiveClashPair
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  
  // Active clashes count
  const activeClashesCount = events.reduce((acc, ev) => {
    return acc + (ev.clashes?.filter(c => !c.resolved).length || 0);
  }, 0) / 2; // Divided by 2 since both events store reciprocal clash

  // Late requests count
  const lateRequestsCount = events.reduce((acc, ev) => {
    return acc + ev.creatives.filter(c => c.status === 'awaiting_acceptance').length;
  }, 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'calendar', label: 'University Calendar', icon: Calendar, badge: activeClashesCount > 0 ? `${Math.ceil(activeClashesCount)} Clash` : null, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'creatives', label: 'Creative Studio', icon: Palette, badge: lateRequestsCount > 0 ? `${lateRequestsCount} Late` : null, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'tasks', label: 'Logistics Tasks', icon: CheckSquare },
    { id: 'downloads', label: 'Finals & Downloads', icon: Download },
    { id: 'my_uploads', label: 'My Uploads', icon: FolderUp },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    ...(currentUser.role === 'admin'
      ? [{ id: 'settings', label: 'Admin Settings', icon: Settings, badge: 'System', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' }]
      : [])
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'faculty':
        return { label: 'Faculty & Event Owner', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'admin':
        return { label: 'Admin Team', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'creative':
        return { label: 'Creative Studio', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'logistics':
        return { label: 'Logistics Team', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      case 'leadership':
        return { label: 'Executive Leadership', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
  };

  const roleBadge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Bar with NUV Branding, Role Switcher and Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & University Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <span className="font-extrabold text-white text-lg tracking-wider">NUV</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">EventPulse</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  AY 2026–27
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Navrachana University Event Management</p>
            </div>
          </div>

          {/* Right actions: New Event, Role Selector, Notification Bell */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Action: New Event (EV-1: Direct Creation) */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Event</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-700/60"
                title="Notifications & Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3.5 border-b border-slate-700/80 flex items-center justify-between bg-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm text-white">Real-Time Alerts</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        {unreadNotifs.length} new
                      </span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-slate-400 hover:text-indigo-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-700/50 ${
                            !notif.read ? 'bg-indigo-950/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-200">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.type === 'clash' && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-400">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Click to review venue clash resolution</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role & Persona Switcher (CRITICAL for testing all 5 stakeholder views) */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-md object-cover ring-1 ring-white/10"
                />
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {currentUser.department.split('&')[0]}
                  </div>
                </div>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-700/80 bg-slate-850">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                      Switch Active Persona
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Explore app as different stakeholders
                    </p>
                  </div>
                  <div className="p-1 max-h-72 overflow-y-auto divide-y divide-slate-700/30">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                          currentUser.id === u.id ? 'bg-indigo-600/20 text-white' : 'hover:bg-slate-700/60 text-slate-300'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-md object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-100 flex items-center justify-between gap-1">
                            <span className="truncate">{u.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {u.school && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getSchoolConfig(u.school).badgeClass}`}>
                                  {u.school}
                                </span>
                              )}
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                                {u.role}
                              </span>
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {u.department} {u.subTeam ? `(${u.subTeam.replace('_', ' ')})` : ''}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700/80 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
