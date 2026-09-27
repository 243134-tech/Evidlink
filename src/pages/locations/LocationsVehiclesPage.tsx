import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, Camera, AlertTriangle, ArrowRight, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface VehicleSighting {
  id: string;
  timestamp: string;
  plate: string;
  model: string;
  location: string;
  cameraId: string;
  driver: string;
  driverId: string;
  isConvoy: boolean;
}

const SAMPLE_SIGHTINGS: VehicleSighting[] = [
  { id: 'ANPR-991', timestamp: '2026-01-14 23:42', plate: 'DL-04-TC-8812', model: 'Mahindra Scorpio (Black)', location: 'NH44 Kundli Toll Plaza (Lane 3)', cameraId: 'CAM-NH44-03', driver: 'Rahul Sharma (P003)', driverId: 'P003', isConvoy: true },
  { id: 'ANPR-992', timestamp: '2026-01-14 23:46', plate: 'HR-55-AB-1104', model: 'Tata Container LPT-1613', location: 'NH44 Kundli Toll Plaza (Lane 2)', cameraId: 'CAM-NH44-02', driver: 'Tariq Mansoor (P004)', driverId: 'P004', isConvoy: true },
  { id: 'ANPR-993', timestamp: '2026-01-15 01:15', plate: 'DL-04-TC-8812', model: 'Mahindra Scorpio (Black)', location: 'Murthal NH44 Toll Plaza (Lane 4)', cameraId: 'CAM-NH44-12', driver: 'Rahul Sharma (P003)', driverId: 'P003', isConvoy: true },
  { id: 'ANPR-994', timestamp: '2026-01-15 01:18', plate: 'HR-55-AB-1104', model: 'Tata Container LPT-1613', location: 'Murthal NH44 Toll Plaza (Lane 3)', cameraId: 'CAM-NH44-11', driver: 'Tariq Mansoor (P004)', driverId: 'P004', isConvoy: true },
  { id: 'ANPR-995', timestamp: '2026-01-13 19:10', plate: 'DL-01-AB-9001', model: 'Toyota Fortuner (White)', location: 'Aerocity Hospitality District Gate 1', cameraId: 'CAM-AERO-01', driver: 'Vikram S. (P002)', driverId: 'P002', isConvoy: false }
];

export const LocationsVehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterConvoyOnly, setFilterConvoyOnly] = useState(false);

  const filteredSightings = SAMPLE_SIGHTINGS.filter(s => !filterConvoyOnly || s.isConvoy);

  return (
    <div className="space-y-6 font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">
            <MapPin className="h-4 w-4" />
            Highway ANPR Optical Feeds & FASTag Transponders
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-100 font-sans mt-1">
            Locations & Vehicle Tracking
          </h1>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Real-time highway toll passages, warehouse freight checkpoints, and convoy correlation algorithms.
          </p>
        </div>

        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 shadow-xs shrink-0"
        >
          <span>Correlated Analytical Leads</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* DETECTED CONVOY ALERT BANNER */}
      <div className="rounded border border-amber-900/80 bg-amber-950/20 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold text-amber-300 uppercase text-xs">
              Algorithmic Convoy Correlation: Scorpio (Lead) + Container (Cargo) within 4 Minutes
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Kundli NH44 (23:42 & 23:46) + Murthal NH44 (01:15 & 01:18)</span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Optical ANPR cameras captured <strong className="text-cyan-300 font-mono">Mahindra Scorpio (DL-04-TC-8812 / Rahul Sharma)</strong> transiting Kundli NH44 at 23:42. Exactly 4 minutes later at 23:46, heavy commercial <strong className="text-cyan-300 font-mono">Tata Container (HR-55-AB-1104 / Tariq Mansoor)</strong> cleared the adjacent lane. The same 3-4 minute interval was replicated at Murthal Toll 45 km north, confirming tactical convoy escort behavior.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setFilterConvoyOnly(prev => !prev)}
            className="rounded bg-amber-900/60 border border-amber-700/80 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-800"
          >
            {filterConvoyOnly ? 'Show All Sightings' : 'Isolate Convoy Sightings Only'}
          </button>
        </div>
      </div>

      {/* Tactical Canvas Map Visualization */}
      <div className="rounded border border-slate-800 bg-[#0a1224] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase text-slate-200">
            Tactical Expressway Transit Corridor (NH44 Northbound Route)
          </span>
          <span className="text-emerald-400 text-[10px]">Highway Waypoint Map Active</span>
        </div>

        {/* Stylized SVG Map */}
        <div className="relative h-64 w-full rounded border border-slate-850 bg-[#070d1a] overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Grid */}
            <defs>
              <pattern id="tactical-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tactical-grid)" />

            {/* Highway Route Line */}
            <path
              d="M 50 180 C 200 170, 350 120, 500 90 S 750 40, 750 40"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeDasharray="6 3"
            />

            {/* Waypoint 1: Aerocity Delhi */}
            <circle cx="80" cy="180" r="7" fill="#a855f7" />
            <text x="80" y="202" fill="#c084fc" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Aerocity Meridian Lounge
            </text>

            {/* Waypoint 2: Kundli Toll Plaza */}
            <circle cx="320" cy="130" r="9" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
            <text x="320" y="115" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              Kundli NH44 Toll (23:42)
            </text>

            {/* Waypoint 3: Murthal Toll */}
            <circle cx="560" cy="80" r="9" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
            <text x="560" y="65" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              Murthal NH44 Toll (01:15)
            </text>

            {/* Waypoint 4: Ambala Depot Destination */}
            <circle cx="730" cy="45" r="7" fill="#10b981" />
            <text x="730" y="32" fill="#6ee7b7" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Ambala Transit Depot
            </text>
          </svg>
        </div>
      </div>

      {/* Sighting Records Table */}
      <div className="rounded border border-slate-800 bg-[#091122] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0d162d] text-[10px] uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Capture ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Vehicle Plate</th>
              <th className="py-3 px-4">Vehicle Make / Model</th>
              <th className="py-3 px-4">Waypoint Location</th>
              <th className="py-3 px-4">Associated Driver</th>
              <th className="py-3 px-4 text-right">Convoy Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredSightings.map(s => (
              <tr
                key={s.id}
                className={`hover:bg-[#0e1933] ${s.isConvoy ? 'bg-amber-950/15' : ''}`}
              >
                <td className="py-3 px-4 font-bold text-cyan-400">{s.id}</td>
                <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{s.timestamp}</td>
                <td className="py-3 px-4 font-bold text-slate-100">{s.plate}</td>
                <td className="py-3 px-4 text-slate-300">{s.model}</td>
                <td className="py-3 px-4 text-slate-300 text-[11px]">{s.location}</td>
                <td className="py-3 px-4 text-cyan-300 font-semibold">{s.driver}</td>
                <td className="py-3 px-4 text-right">
                  {s.isConvoy ? (
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-bold">
                      CONVOY ESCORT
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">ISOLATED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
