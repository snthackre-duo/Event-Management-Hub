import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  FileArchive,
  Link2,
  Clock,
  CheckCircle2,
  Share2,
  FileText,
  Eye,
  History,
  Copy,
  Plus,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const DownloadsCenterView: React.FC = () => {
  const {
    events,
    currentUser,
    downloadLogs,
    logAssetDownload,
    mediaLinks,
    createMediaShareLink,
    revokeMediaShareLink
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approved_assets' | 'media_links' | 'download_audit'>('approved_assets');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  
  // Media share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetEventId, setShareTargetEventId] = useState<string>(events[0]?.id || '');
  const [shareRecipientLabel, setShareRecipientLabel] = useState('Vadodara Press Club & Media Correspondents');
  const [shareExpiryHours, setShareExpiryHours] = useState(48);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // DL-1: Approved finals only, grouped by event
  const eventsWithApprovedCreatives = events.map(ev => {
    const finals = ev.creatives.filter(c => c.status === 'approved' || c.status === 'delivered');
    return {
      ...ev,
      approvedCreatives: finals
    };
  }).filter(ev => ev.approvedCreatives.length > 0);

  const filteredEvents = selectedEventId === 'all'
    ? eventsWithApprovedCreatives
    : eventsWithApprovedCreatives.filter(e => e.id === selectedEventId);

  // DL-4: One-click ZIP download simulation
  const handleDownloadFullPack = (event: typeof eventsWithApprovedCreatives[0]) => {
    logAssetDownload(event.id, `${event.title.replace(/\s+/g, '_')}_FULL_APPROVED_PACK.zip`, 'ZIP');
    alert(`📥 Downloading Full Creative Asset ZIP Pack for "${event.title}" (${event.approvedCreatives.length} approved production files). Download logged to audit registry.`);
  };

  const handleDownloadSingleFile = (eventId: string, fileName: string, format: string) => {
    logAssetDownload(eventId, fileName, format);
  };

  const handleCreateShareLink = (e: React.FormEvent) => {
    e.preventDefault();
    createMediaShareLink(shareTargetEventId, shareRecipientLabel, shareExpiryHours);
    setIsShareModalOpen(false);
  };

  const copyToClipboard = (token: string) => {
    navigator.clipboard?.writeText(`https://nuv.ac.in/media-download?token=${token}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-navigation */}
      <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              <h1 className="text-base sm:text-lg font-bold text-white">
                Final Creatives & Media Distribution Hub
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                DL-1 Approved Finals Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Provides direct access to print-ready PDFs, high-res posters, LED backdrops, one-click event ZIP packs (DL-4), and expiring share links for external press & media (DL-6).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Generate Expiring Media Link (DL-6)</span>
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-3 text-xs">
          <button
            onClick={() => setActiveTab('approved_assets')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'approved_assets'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Approved Final Assets & ZIP Packs (DL-1, DL-4)
          </button>
          <button
            onClick={() => setActiveTab('media_links')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'media_links'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Expiring Media Share Links ({mediaLinks.filter(l => !l.isRevoked).length})
          </button>
          <button
            onClick={() => setActiveTab('download_audit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'download_audit'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Download Audit Trail Log (DL-5)
          </button>
        </div>
      </div>

      {/* TAB 1: APPROVED ASSETS BY EVENT */}
      {activeTab === 'approved_assets' && (
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-850 rounded-2xl border border-slate-800">
              No events currently have approved final creative materials. Once the event owner signs off on designs, print-ready files will appear here.
            </div>
          ) : (
            filteredEvents.map(event => (
              <div
                key={event.id}
                className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 shadow-lg"
              >
                {/* Event header with 1-click ZIP button (DL-4) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        {event.type}
                      </span>
                      <span className="text-xs text-slate-400">• {event.startDate} • {event.venueName}</span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-0.5">
                      {event.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleDownloadFullPack(event)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02] shrink-0"
                  >
                    <FileArchive className="w-4 h-4 text-emerald-200" />
                    <span>One-Click Full Event Pack (ZIP)</span>
                  </button>
                </div>

                {/* Approved Creatives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {event.approvedCreatives.map(cr => {
                    const finalVersion = cr.versions.find(v => v.isFinal) || cr.versions[0] || {
                      fileName: `${event.title.replace(/\s+/g, '_')}_${cr.typeKey}_FINAL.pdf`,
                      fileType: 'application/pdf',
                      fileSize: '8.4 MB',
                      uploadedAt: new Date().toISOString()
                    };

                    return (
                      <div
                        key={cr.id}
                        className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white truncate pr-1">
                              {cr.label}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                              APPROVED
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                            {finalVersion.fileName}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {finalVersion.fileSize} • Owner Sign-off Granted
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                          <span className="text-[10px] font-mono text-slate-400">
                            Print: {cr.printQuantity || cr.quantity} pcs
                          </span>

                          <button
                            onClick={() => handleDownloadSingleFile(event.id, finalVersion.fileName, 'PDF')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download Final</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: EXPIRING MEDIA SHARE LINKS (DL-6) */}
      {activeTab === 'media_links' && (
        <div className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                Expiring Media & Press Distribution Links (DL-6)
              </h2>
              <p className="text-xs text-slate-400">
                Secure public links for journalists, press bureaus, and digital media partners. No account login required; links expire automatically.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mediaLinks.map(link => {
              const isExpired = new Date(link.expiresAt).getTime() < Date.now();

              return (
                <div
                  key={link.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    link.isRevoked || isExpired
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {link.recipientLabel}
                      </span>
                      {link.isRevoked ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                          REVOKED
                        </span>
                      ) : isExpired ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          EXPIRED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300">
                      Event: <strong>{link.eventTitle}</strong> ({link.accessibleFilesCount} approved files)
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-3">
                      <span>Created by: {link.createdBy}</span>
                      <span>Expires: {new Date(link.expiresAt).toLocaleString()}</span>
                      <span>Downloads: {link.downloadsCount} times</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!link.isRevoked && !isExpired && (
                      <button
                        onClick={() => copyToClipboard(link.token)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedToken === link.token ? 'Copied URL!' : 'Copy Media Link'}</span>
                      </button>
                    )}

                    {!link.isRevoked && (
                      <button
                        onClick={() => revokeMediaShareLink(link.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DOWNLOAD AUDIT TRAIL LOG (DL-5) */}
      {activeTab === 'download_audit' && (
        <div className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">
              Permanent Download Audit Log (DL-5)
            </h2>
            <p className="text-xs text-slate-400">
              Records who downloaded which creative material, timestamp, and format.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">User</th>
                  <th>Role</th>
                  <th>File Name</th>
                  <th>Event</th>
                  <th>Format</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {downloadLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans font-semibold text-white">{log.userName}</td>
                    <td>{log.userRole}</td>
                    <td className="text-indigo-400">{log.fileName}</td>
                    <td className="font-sans text-slate-300">{log.eventTitle}</td>
                    <td><span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{log.format}</span></td>
                    <td className="text-slate-400">{new Date(log.downloadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Media Share Link Generator Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleCreateShareLink} className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Create Expiring Media Share Link (DL-6)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Generates a secure tokenized URL with automatic expiration.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Target Event *</label>
                <select
                  value={shareTargetEventId}
                  onChange={e => setShareTargetEventId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Recipient Label / Publication *</label>
                <input
                  type="text"
                  required
                  value={shareRecipientLabel}
                  onChange={e => setShareRecipientLabel(e.target.value)}
                  placeholder="e.g. Gujarat Samachar / Sandesh Press Correspondent"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Expiration Period</label>
                <select
                  value={shareExpiryHours}
                  onChange={e => setShareExpiryHours(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                >
                  <option value={24}>24 Hours</option>
                  <option value={48}>48 Hours (Standard)</option>
                  <option value={168}>7 Days (1 Week)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
              >
                Generate Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
