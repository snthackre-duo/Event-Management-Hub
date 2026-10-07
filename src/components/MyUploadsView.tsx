import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderUp,
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  HardDrive,
  Clock,
  Layers
} from 'lucide-react';
import { UploadRecord } from '../types';

export const MyUploadsView: React.FC = () => {
  const {
    currentUser,
    uploads,
    removeUploadRecord,
    logAssetDownload
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllUsers, setShowAllUsers] = useState<boolean>(currentUser.role === 'admin');

  // Filter uploads: own uploads by default, or all if admin chooses
  const userUploads = uploads.filter(u => {
    if (!showAllUsers && u.userId !== currentUser.id) return false;
    if (categoryFilter !== 'all' && u.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        u.fileName.toLowerCase().includes(q) ||
        u.eventTitle.toLowerCase().includes(q) ||
        u.userName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Total size calculations
  const totalSizeBytes = userUploads.reduce((sum, u) => sum + (u.fileSizeRaw || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);

  const handleDownload = (upload: UploadRecord) => {
    logAssetDownload(upload.eventId, upload.fileName, upload.fileType.includes('pdf') ? 'PDF' : 'IMAGE');
    alert(`📥 Downloading "${upload.fileName}". Download recorded to system audit logs.`);
  };

  const handleReplaceVersion = (upload: UploadRecord) => {
    const newName = prompt(`Enter replacement file name for "${upload.fileName}" (Will create version v${upload.version + 1}):`, upload.fileName);
    if (newName) {
      alert(`✅ Uploaded replacement version for "${upload.fileName}". Previous version remains stored in archival repository (UP-4).`);
    }
  };

  const handleDelete = (upload: UploadRecord) => {
    // UP-5: Uploaders can remove own upload only until marked final; admin can remove any
    if (upload.isFinal && currentUser.role !== 'admin') {
      alert('🔒 Final approved assets cannot be deleted by uploaders (UP-5 rule). Only University Admin may authorize removal for audit compliance.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${upload.fileName}"? This action will be recorded in the event activity audit log.`)) {
      removeUploadRecord(upload.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Storage Statistics */}
      <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FolderUp className="w-5 h-5 text-indigo-400" />
              <h1 className="text-base sm:text-lg font-bold text-white">
                My Uploads & Permanent Storage Repository
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                UP-2 Personal Drive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Every upload is permanently stored against uploader, event, file type and timestamp (UP-1). Older versions are preserved and never auto-deleted (UP-7).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Total Files Stored</div>
              <div className="text-base font-bold text-white">{userUploads.length} assets</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Storage Utilized</div>
              <div className="text-base font-bold text-indigo-400 font-mono">{totalSizeMB} MB</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-t border-slate-800 pt-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            >
              <option value="all">All File Categories</option>
              <option value="guest_photo">Guest Photographs (GP-1)</option>
              <option value="creative_final">Approved Creative Finals</option>
              <option value="creative_draft">Creative Drafts & Proofs</option>
            </select>

            {currentUser.role === 'admin' && (
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllUsers}
                  onChange={e => setShowAllUsers(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="text-slate-300 font-semibold">Admin View: All University Uploads</span>
              </label>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search file name, event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-2.5 py-1.5 pl-7 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
          </div>
        </div>
      </div>

      {/* Uploads List */}
      <div className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Stored Upload Records ({userUploads.length})
        </h2>

        {userUploads.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl">
            No files found matching your search.
          </div>
        ) : (
          <div className="space-y-2.5">
            {userUploads.map(upload => (
              <div
                key={upload.id}
                className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-indigo-400 shrink-0">
                    {upload.category === 'guest_photo' ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">
                        {upload.fileName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                        v{upload.version}
                      </span>
                      {upload.isFinal && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Final Production</span>
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        {upload.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="text-slate-300 font-medium">Event: {upload.eventTitle}</span>
                      <span>Size: {upload.fileSize}</span>
                      <span>Uploader: {upload.userName}</span>
                      <span>Uploaded: {new Date(upload.uploadedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleDownload(upload)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-indigo-400 hover:text-white transition-colors"
                    title="Download file (DL-5 logged)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleReplaceVersion(upload)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Replace with new version (UP-2)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(upload)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors"
                    title={upload.isFinal ? 'Protected Final Asset' : 'Remove upload'}
                  >
                    {upload.isFinal && currentUser.role !== 'admin' ? (
                      <Lock className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
