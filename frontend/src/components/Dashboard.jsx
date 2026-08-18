import React, { useState, useEffect } from 'react';
import {
  Eye,
  ShieldAlert,
  FileText,
  Activity,
  Layers,
  Calendar,
  MapPin,
  UserCheck,
  AlertTriangle,
  Trash2
} from "lucide-react";

export default function Dashboard({ user, token, setView }) {
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load registered reports from localStorage to maintain persistence in the frontend
  useEffect(() => {
    const list = localStorage.getItem(`guardian_reports_${user?.email || 'guest'}`);
    if (list) {
      setUserReports(JSON.parse(list));
    }
  }, [user]);

  const stats = [
    { name: 'Active Registry Profiles', value: userReports.length, icon: FileText, change: 'Updated real-time' },
    { name: 'Global Cluster Indexing', value: '4,892', icon: Layers, change: '+12 today' },
    { name: 'Biometric Search Success', value: '88.4%', icon: UserCheck, change: 'Avg. match confidence' }
  ];
const handleDeleteReport = async (personId) => {

  const confirmed = window.confirm(
    'Are you sure you want to permanently delete this missing person report?'
  );

  if (!confirmed) {
    return;
  }

  setLoading(true);

  try {

    const response = await fetch(
      `/api/missing-persons/${personId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || 'Failed to delete report'
      );
    }

    // Remove from localStorage
    const storageKey = `guardian_reports_${user?.email || 'guest'}`;

    const currentList = JSON.parse(
      localStorage.getItem(storageKey) || '[]'
    );

    const updatedList = currentList.filter(
      report => report._id !== personId
    );

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedList)
    );

    // Update UI immediately
    setUserReports(updatedList);

  } catch (error) {

    console.error(
      'Delete report error:',
      error
    );

    alert(
      error.message || 'Unable to delete report'
    );

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
      {/* Welcome Banner */}
      <div className="bg-zinc-950 border border-zinc-800 rounded p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-600"></div>
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Guardian Administrative Console</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Logged in as <span className="text-white font-semibold">{user.name}</span> ({user.email}). Manage active face embeddings and monitor citizen scanners.
          </p>
        </div>
        <button
          onClick={() => setView('register-person')}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white border border-red-500 text-xs font-bold uppercase tracking-wider rounded transition-all focus:outline-none"
        >
          Lodged New Identity Report
        </button>
      </div>

      {/* Statistics dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-zinc-955 border border-zinc-800 rounded p-6 bg-zinc-950/40 relative">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{item.name}</p>
                  <h3 className="text-3xl font-black text-white mt-2 font-sans">{item.value}</h3>
                  <p className="text-[10px] text-zinc-400 mt-1">{item.change}</p>
                </div>
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-red-500">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reports Table/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: User's reported missing persons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-500" />
              Active System Registry Nodes ({userReports.length})
            </h3>

            {userReports.length === 0 ? (
              <div className="border border-dashed border-zinc-800 text-center py-12 px-6 rounded">
                <AlertTriangle size={24} className="text-zinc-650 mx-auto mb-3" />
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Registry Index Empty</h4>
                <p className="text-[10px] text-zinc-500 max-w-xs mx-auto mt-2 leading-relaxed">
                  No missing person records have been registered under this account credentials. Create a node to enable scanning match.
                </p>
                <button
                  onClick={() => setView('register-person')}
                  className="mt-4 px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-850 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Create First Node
                </button>
              </div>
            ) : (
             <div className="overflow-x-auto">
  <table className="w-full text-left text-xs border-collapse">

    <thead>
      <tr className="border-b border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
        <th className="py-3 px-4">Subject</th>
        <th className="py-3 px-4">Details</th>
        <th className="py-3 px-4">Last Seen</th>
        <th className="py-3 px-4">Tracking Node Status</th>
        <th className="py-3 px-4 text-right">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-zinc-900">
      {userReports.map((report, idx) => (
        <tr
          key={report._id || idx}
          className="hover:bg-zinc-900/30 transition-colors"
        >

          {/* Subject */}
          <td className="py-4 px-4">
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded border border-zinc-805 overflow-hidden bg-zinc-950 shrink-0">
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt={report.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-[10px] text-zinc-400 uppercase">
                    IMG
                  </div>
                )}
              </div>

              <div>
                <div className="font-bold text-white uppercase">
                  {report.name}
                </div>

                <div className="text-[9px] text-zinc-500">
                  Node ID: {report._id || `LOC-${idx}`}
                </div>
              </div>

            </div>
          </td>

          {/* Details */}
          <td className="py-4 px-4">
            <div>
              Age: {report.age} • {report.gender}
            </div>

            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {report.missing_date}
            </div>
          </td>

          {/* Last Seen */}
          <td className="py-4 px-4">
            <div className="flex items-center gap-1 text-[11px]">
              <MapPin size={12} className="text-zinc-500" />
              {report.last_seen_location}
            </div>
          </td>

          {/* Status */}
          <td className="py-4 px-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono leading-none border uppercase font-semibold ${
                report.status === 'missing'
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  report.status === 'missing'
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-emerald-500'
                }`}
              ></span>

              {report.status}
            </span>
          </td>

          {/* DELETE */}
          <td className="py-4 px-4 text-right">
            <button
              onClick={() => handleDeleteReport(report._id)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-red-400 border border-red-900 rounded hover:bg-red-950/40 transition disabled:opacity-50"
            >
              <Trash2 size={14} />

              {loading ? "Deleting..." : "Delete"}
            </button>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Monitoring pipeline logger */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
              <Activity size={16} className="text-red-500" />
              Biometric Pipeline Activity
            </h3>
            <div className="space-y-4">
              <div className="border-l-2 border-red-650 pl-4 py-1">
                <span className="text-[9px] text-zinc-400 uppercase font-mono font-bold block mb-0.5">13:21:40 • PIPELINE CORRELATION</span>
                <span className="text-[11px] text-white font-medium block">Scanner telemetry matched profile Node ID: LOC-001 at 88.5% confidence.</span>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4 py-1">
                <span className="text-[9px] text-zinc-400 uppercase font-mono font-bold block mb-0.5">12:09:12 • VECTOR COMPRESSION</span>
                <span className="text-[11px] text-zinc-400 block">Qdrant clusters clustered, loaded 4 active points into operational memory.</span>
              </div>
              <div className="border-l-2 border-zinc-700 pl-4 py-1">
                <span className="text-[9px] text-zinc-400 uppercase font-mono font-bold block mb-0.5">10:44:01 • SECURITY HANDSHAKE</span>
                <span className="text-[11px] text-zinc-400 block">Bearer Token authentication validated; encryption protocols established.</span>
              </div>
              <div className="border-l-2 border-zinc-800 pl-4 py-1">
                <span className="text-[9px] text-zinc-505 uppercase font-mono font-bold block mb-0.5">09:00:00 • CLOUD SYNCRONIZATION</span>
                <span className="text-[11px] text-zinc-500 block">Biometric database ping OK; 0 packet losses reported during check.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
