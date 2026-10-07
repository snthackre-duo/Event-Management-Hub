import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Building2,
  Coffee,
  Truck,
  HeartHandshake,
  Shield,
  Wifi,
  Volume2,
  Filter,
  Check,
  Clock,
  AlertCircle,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Search,
  ExternalLink
} from 'lucide-react';
import { LogisticsSubTeam, LogisticsTask } from '../types';
import { getSchoolConfig } from '../data/mockData';

export const TaskTrackerView: React.FC = () => {
  const {
    events,
    currentUser,
    updateTaskStatus,
    setSelectedEvent,
    addTaskToEvent,
    deleteTask,
    updateTask
  } = useApp();

  const [activeSubTeam, setActiveSubTeam] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Task Modal State
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskEventId, setNewTaskEventId] = useState<string>(events[0]?.id || '');
  const [newTaskSubTeam, setNewTaskSubTeam] = useState<LogisticsSubTeam>('it_infra');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser.name);
  const [newTaskDueDate, setNewTaskDueDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Edit Task Modal State
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    eventId: string;
    task: LogisticsTask;
  } | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskSubTeam, setEditTaskSubTeam] = useState<LogisticsSubTeam>('venue_housekeeping');
  const [editTaskAssignee, setEditTaskAssignee] = useState('');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editTaskStatus, setEditTaskStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  // 7 Sub-teams configuration including IT Infra and Audio/Visual
  const subTeamsConfig: { id: LogisticsSubTeam; label: string; icon: any; color: string }[] = [
    { id: 'venue_housekeeping', label: 'Venue & Housekeeping', icon: Building2, color: 'text-indigo-400' },
    { id: 'catering', label: 'Catering & Dining', icon: Coffee, color: 'text-amber-400' },
    { id: 'transport', label: 'Transport & Fleet', icon: Truck, color: 'text-sky-400' },
    { id: 'guest_hospitality', label: 'Guest Hospitality & VIP', icon: HeartHandshake, color: 'text-pink-400' },
    { id: 'security', label: 'Security & Parking', icon: Shield, color: 'text-emerald-400' },
    { id: 'it_infra', label: 'IT Infra & Network', icon: Wifi, color: 'text-cyan-400' },
    { id: 'audio_visual', label: 'Audio / Visual (AV)', icon: Volume2, color: 'text-purple-400' }
  ];

  // Helper for subteam label
  const getSubTeamLabel = (subTeam: LogisticsSubTeam) => {
    const found = subTeamsConfig.find(s => s.id === subTeam);
    return found ? found.label : subTeam.replace('_', ' ');
  };

  // Collect all tasks across events
  const allTasks = events.flatMap(ev =>
    ev.logisticsTasks.map(task => ({
      ...task,
      event: ev
    }))
  );

  // Filtered tasks
  const filteredTasks = allTasks.filter(item => {
    if (activeSubTeam !== 'all' && item.subTeam !== activeSubTeam) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (selectedEventId !== 'all' && item.event.id !== selectedEventId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.assignedToName.toLowerCase().includes(q) ||
        item.event.title.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const completedCount = filteredTasks.filter(t => t.status === 'completed').length;
  const inProgressCount = filteredTasks.filter(t => t.status === 'in_progress').length;
  const pendingCount = filteredTasks.filter(t => t.status === 'pending').length;

  const handleOpenAddTask = (evId?: string) => {
    if (evId) {
      setNewTaskEventId(evId);
    } else if (selectedEventId !== 'all') {
      setNewTaskEventId(selectedEventId);
    } else if (events.length > 0) {
      setNewTaskEventId(events[0].id);
    }
    setNewTaskTitle('');
    setNewTaskAssignee(currentUser.name);
    setNewTaskDueDate(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
    setNewTaskPriority('medium');
    setIsAddTaskModalOpen(true);
  };

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskEventId) return;

    addTaskToEvent(newTaskEventId, {
      title: newTaskTitle.trim(),
      subTeam: newTaskSubTeam,
      assignedToName: newTaskAssignee.trim() || currentUser.name,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      status: 'pending'
    });

    setIsAddTaskModalOpen(false);
    setNewTaskTitle('');
  };

  const handleOpenEditTask = (eventId: string, task: LogisticsTask) => {
    setEditingTask({ eventId, task });
    setEditTaskTitle(task.title);
    setEditTaskSubTeam(task.subTeam);
    setEditTaskAssignee(task.assignedToName);
    setEditTaskDueDate(task.dueDate);
    setEditTaskPriority(task.priority);
    setEditTaskStatus(task.status);
    setIsEditTaskModalOpen(true);
  };

  const handleSaveEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) return;

    updateTask(editingTask.eventId, editingTask.task.id, {
      title: editTaskTitle.trim(),
      subTeam: editTaskSubTeam,
      assignedToName: editTaskAssignee.trim(),
      dueDate: editTaskDueDate,
      priority: editTaskPriority,
      status: editTaskStatus
    });

    setIsEditTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (eventId: string, taskId: string, taskTitle: string) => {
    if (confirm(`Are you sure you want to delete task "${taskTitle}"?`)) {
      deleteTask(eventId, taskId);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-team Tabs */}
      <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <h1 className="text-base sm:text-lg font-bold text-white">
                Collaborative Logistics Task Tracker
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                7 Sub-Teams (LG-2)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Central operational tracker for Venue setup, Catering & Dining, Transport fleet, VIP Guest hospitality, Campus perimeter security, <strong>IT Infra & Network</strong>, and <strong>Audio / Visual (AV)</strong> engineering.
            </p>
          </div>

          {/* Action Button: Add Task */}
          <button
            onClick={() => handleOpenAddTask()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Logistics Task</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Event:</span>
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs max-w-[200px]"
            >
              <option value="all">All Events ({events.length})</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, assignees, or event names..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sub-team Horizontal Selectors (All 7 Subteams) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveSubTeam('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTeam === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Sub-teams ({allTasks.length})
          </button>

          {subTeamsConfig.map(team => {
            const Icon = team.icon;
            const count = allTasks.filter(t => t.subTeam === team.id).length;
            const isActive = activeSubTeam === team.id;

            return (
              <button
                key={team.id}
                onClick={() => setActiveSubTeam(team.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${team.color}`} />
                <span>{team.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Pending Setup</span>
          <span className="text-lg font-bold text-amber-400">{pendingCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between shadow-sm">
          <span className="text-xs text-slate-400 font-medium">In Progress</span>
          <span className="text-lg font-bold text-indigo-400">{inProgressCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Completed</span>
          <span className="text-lg font-bold text-emerald-400">{completedCount}</span>
        </div>
      </div>

      {/* Tasks Table / Card Roster */}
      <div className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>Logistics Action Items</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono text-[10px]">
              {filteredTasks.length}
            </span>
          </h2>

          {selectedEventId !== 'all' && (
            <button
              onClick={() => handleOpenAddTask(selectedEventId)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add task to this event</span>
            </button>
          )}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 space-y-2">
            <p>No logistics tasks match current filters.</p>
            <button
              onClick={() => handleOpenAddTask()}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 mt-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Task</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map(item => {
              const isDone = item.status === 'completed';
              const teamInfo = subTeamsConfig.find(s => s.id === item.subTeam);
              const TeamIcon = teamInfo ? teamInfo.icon : CheckSquare;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                    isDone
                      ? 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                      : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() =>
                        updateTaskStatus(
                          item.event.id,
                          item.id,
                          isDone ? 'pending' : 'completed'
                        )
                      }
                      title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 transition-colors cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-slate-400 bg-slate-900'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 flex items-center gap-1 border border-slate-600/50">
                          <TeamIcon className={`w-3 h-3 ${teamInfo?.color || 'text-indigo-300'}`} />
                          <span>{getSubTeamLabel(item.subTeam)}</span>
                        </span>

                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          item.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {item.priority}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                        {(() => {
                          const schoolCfg = getSchoolConfig(item.event.school);
                          return (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${schoolCfg.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${schoolCfg.dotClass}`} />
                              <span>{schoolCfg.name}</span>
                            </span>
                          );
                        })()}
                        <span className="text-indigo-300 font-medium truncate max-w-xs">
                          Event: {item.event.title}
                        </span>
                        <span>Assignee: <strong>{item.assignedToName}</strong></span>
                        <span>Target: <strong>{item.dueDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Status Dropdown, Edit, Delete, View Event Hub */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <select
                      value={item.status}
                      onChange={e => updateTaskStatus(item.event.id, item.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-300 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Edit Task Button */}
                    <button
                      onClick={() => handleOpenEditTask(item.event.id, item)}
                      title="Edit Task Details"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Task Button */}
                    <button
                      onClick={() => handleDeleteTask(item.event.id, item.id, item.title)}
                      title="Delete Task"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* View Event Hub */}
                    <button
                      onClick={() => setSelectedEvent(item.event)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold ml-1 cursor-pointer"
                    >
                      Event Hub →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add New Logistics Task */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Logistics Task to Event</span>
              </h3>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Event *
                </label>
                <select
                  required
                  value={newTaskEventId}
                  onChange={e => setNewTaskEventId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.startDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Logistics Sub-team Category *
                </label>
                <select
                  value={newTaskSubTeam}
                  onChange={e => setNewTaskSubTeam(e.target.value as LogisticsSubTeam)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium"
                >
                  {subTeamsConfig.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Task Title & Scope *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage LAN drop and high-density guest Wi-Fi SSID setup"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Assignee Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={e => setNewTaskDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Logistics Task */}
      {isEditTaskModalOpen && editingTask && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" />
                <span>Edit Logistics Task</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditTaskModalOpen(false);
                  setEditingTask(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTaskTitle}
                  onChange={e => setEditTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Logistics Sub-team Category
                  </label>
                  <select
                    value={editTaskSubTeam}
                    onChange={e => setEditTaskSubTeam(e.target.value as LogisticsSubTeam)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    {subTeamsConfig.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Current Status
                  </label>
                  <select
                    value={editTaskStatus}
                    onChange={e => setEditTaskStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Assigned Person
                  </label>
                  <input
                    type="text"
                    required
                    value={editTaskAssignee}
                    onChange={e => setEditTaskAssignee(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editTaskDueDate}
                    onChange={e => setEditTaskDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Priority
                </label>
                <select
                  value={editTaskPriority}
                  onChange={e => setEditTaskPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteTask(editingTask.eventId, editingTask.task.id, editingTask.task.title);
                    setIsEditTaskModalOpen(false);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditTaskModalOpen(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Task</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
