import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const SuperviseInsightPage: React.FC = () => {
  const { risks } = useApp();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in">
      <div className="bg-gradient-to-r from-pub-navy to-pub-teal text-white p-6 lg:p-8 rounded-3xl shadow-xl">
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20">
          Rule-Based Analytics Engine
        </span>
        <h1 className="text-2xl font-black mt-2">SuperVise Insight™ — Deadline & Academic Risk Detection</h1>
        <p className="text-xs text-pub-cyanSurface mt-1 max-w-2xl leading-relaxed">
          Transparent algorithmic risk detection tracking milestone delays, overdue revisions, and stalled submissions across Pundra University research projects.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-pub-navy">Active Identified Academic Risks ({risks.length})</h3>
        {risks.map(risk => (
          <div key={risk.id} className="bg-white border border-pub-border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  risk.level === 'High' ? 'bg-pub-error/15 text-pub-error' : 'bg-pub-warning/15 text-pub-warning'
                }`}>
                  {risk.level} Risk Flag
                </span>
                <span className="text-xs text-pub-muted">{risk.projectTitle}</span>
              </div>
              <h4 className="text-sm font-bold text-pub-navy">{risk.reason}</h4>
              <p className="text-xs text-pub-teal font-medium">Recommended Action: {risk.recommendation}</p>
            </div>
            <Link to={`/workspace/${risk.projectId}`} className="btn text-xs py-2 whitespace-nowrap self-start md:self-auto flex items-center gap-1.5">
              Inspect in Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
