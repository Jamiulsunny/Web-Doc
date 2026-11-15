import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FolderGit2, CheckCircle2, Clock, AlertTriangle, FileText, 
  Upload, Star, ExternalLink, ShieldCheck, ChevronRight, Download, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Milestone, SubmissionVersion } from '../types';
import { UploadArtifactModal, RubricReviewModal } from '../components/ReviewAndUploadModals';

export const WorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, currentUser, submitMilestoneArtifact, reviewMilestoneSubmission, toggleTaskCompletion } = useApp();

  const project = projects.find(p => p.id === projectId) || projects[0];

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>(project.milestones[3] || project.milestones[0]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeVersionForReview, setActiveVersionForReview] = useState<SubmissionVersion | null>(null);

  const handleUploadSubmit = (file: { name: string; size: string }, note: string) => {
    submitMilestoneArtifact(project.id, selectedMilestone.id, file, note);
  };

  const handleReviewTrigger = (v: SubmissionVersion) => {
    setActiveVersionForReview(v);
    setIsReviewOpen(true);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-pub-muted font-medium">
        <Link to="/dashboard" className="hover:text-pub-navy">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Academic Project Workspace</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-pub-navy font-bold truncate max-w-xs">{project.title}</span>
      </div>

      {/* Project Overview Hero Header */}
      <div className="bg-white border border-pub-border rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-pub-border">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-pub-cyanSurface text-pub-teal border border-pub-cyan/30">
                {project.domain}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-pub-bg text-pub-muted border border-pub-border">
                {project.batch}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-pub-success/10 text-pub-success border border-pub-success/20">
                {project.status}
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-pub-navy tracking-tight leading-snug">
              {project.title}
            </h1>
            <p className="text-xs text-pub-muted leading-relaxed">
              {project.abstract}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-row lg:flex-col gap-4 lg:text-right shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase text-pub-muted tracking-wider block">Thesis Completion</span>
              <p className="text-3xl font-black text-pub-navy">{project.progress}%</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-pub-muted tracking-wider block">Target Defense Date</span>
              <p className="text-xs font-extrabold text-pub-teal">{project.targetDefenseDate}</p>
            </div>
          </div>
        </div>

        {/* Team Members & Links */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-pub-muted text-[11px] block">Student Researchers:</span>
              <div className="flex items-center gap-2 mt-1">
                {project.students.map(st => (
                  <span key={st.id} className="font-bold text-pub-navy bg-pub-bg px-2.5 py-1 rounded-lg border border-pub-border">
                    {st.name} ({st.studentId})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-pub-muted text-[11px] block">Lead Supervisor:</span>
              <span className="font-bold text-pub-teal bg-pub-cyanSurface/50 px-2.5 py-1 rounded-lg border border-pub-cyan/30 mt-1 inline-block">
                {project.supervisor.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.repositoryUrl && (
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-pub-teal font-bold px-3 py-1.5 rounded-lg border border-pub-border hover:bg-pub-bg">
                <FolderGit2 className="w-3.5 h-3.5" /> Git Repository
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Milestones Pipeline Navigation (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-pub-border rounded-3xl p-5 shadow-sm space-y-3">
          <h3 className="font-extrabold text-sm text-pub-navy px-1">Prescribed Milestones (8 Steps)</h3>
          <div className="space-y-2">
            {project.milestones.map((m, i) => {
              const isSelected = selectedMilestone.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMilestone(m)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-pub-teal text-white shadow-md shadow-pub-teal/20 border-pub-teal'
                      : 'bg-white hover:bg-pub-bg border-pub-border text-pub-text'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-pub-cyan' : 'text-pub-muted'}`}>
                      Milestone {m.order}
                    </span>
                    <h4 className="text-xs font-bold mt-0.5 leading-snug">{m.title}</h4>
                    <span className={`text-[10px] mt-1 block ${isSelected ? 'text-white/80' : 'text-pub-muted'}`}>
                      Due: {m.dueDate}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-1 shrink-0 ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : m.status === 'Approved' 
                      ? 'bg-pub-success/15 text-pub-success' 
                      : m.status === 'Revision Required'
                      ? 'bg-pub-warning/15 text-pub-warning'
                      : 'bg-pub-bg text-pub-muted'
                  }`}>
                    {m.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Milestone Workspace & Multi-Version History (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-pub-border rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
            {/* Milestone Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pub-border">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-pub-cyanSurface text-pub-teal border border-pub-cyan/30">
                  Active Milestone Workspace
                </span>
                <h2 className="text-lg font-black text-pub-navy mt-1">{selectedMilestone.title}</h2>
                <p className="text-xs text-pub-muted mt-0.5">{selectedMilestone.description}</p>
              </div>

              {/* Action Buttons based on User Role */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="btn flex items-center gap-2 text-xs py-2"
                >
                  <Upload className="w-4 h-4" />
                  Submit New Version
                </button>
              </div>
            </div>

            {/* Submission Requirements & Due Date Banner */}
            <div className="p-4 bg-pub-bg/80 border border-pub-border rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-pub-muted font-bold block mb-0.5">Required Artifact Format:</span>
                <span className="font-semibold text-pub-navy">{selectedMilestone.submissionRequirements}</span>
              </div>
              <div>
                <span className="text-pub-muted font-bold block mb-0.5">Milestone Due Date:</span>
                <span className="font-black text-pub-warning">{selectedMilestone.dueDate}</span>
              </div>
            </div>

            {/* Version-Aware Submission History (No Overwriting) */}
            <div>
              <h4 className="font-extrabold text-sm text-pub-navy mb-3 flex items-center justify-between">
                <span>Submission Version Archive ({selectedMilestone.versions.length} Iterations)</span>
                <span className="text-[11px] font-semibold text-pub-muted">Immutable Version Audit Trail</span>
              </h4>

              {selectedMilestone.versions.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-pub-border rounded-2xl text-center">
                  <FileText className="w-8 h-8 text-pub-muted mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-pub-navy">No artifacts uploaded yet for this milestone.</p>
                  <p className="text-[11px] text-pub-muted mt-1">Submit proposal or report draft to start supervisor review.</p>
                  <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="btn mt-4 text-xs py-2"
                  >
                    Upload Milestone Artifact
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedMilestone.versions.map((v) => (
                    <div 
                      key={v.id} 
                      className="border border-pub-border rounded-2xl p-5 hover:border-pub-cyan/60 transition-all bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pub-border/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pub-cyanSurface text-pub-teal flex items-center justify-center font-extrabold text-xs">
                            v{v.versionNumber}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-pub-navy">{v.fileName}</span>
                            <span className="text-[10px] text-pub-muted block">
                              {v.fileSize} &middot; Submitted on {new Date(v.submittedAt).toLocaleDateString()} at {new Date(v.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} by {v.submittedBy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => alert(`Downloading artifact: ${v.fileName}`)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-pub-border text-pub-navy hover:bg-pub-bg font-semibold flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>

                          {/* Supervisor can review any version */}
                          {currentUser.role === 'supervisor' && (
                            <button
                              onClick={() => handleReviewTrigger(v)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-pub-teal text-white hover:bg-pub-navy font-semibold flex items-center gap-1.5 shadow-sm"
                            >
                              <Star className="w-3.5 h-3.5 text-pub-cyan" /> 
                              {v.feedback ? 'Update Rubric Score' : 'Evaluate Rubric'}
                            </button>
                          )}
                        </div>
                      </div>

                      {v.studentNote && (
                        <p className="text-xs text-pub-text italic mt-3 bg-pub-bg/50 p-2.5 rounded-xl border border-pub-border/50">
                          <strong className="not-italic text-pub-muted mr-1">Student Note:</strong> {v.studentNote}
                        </p>
                      )}

                      {/* Official Supervisor Feedback Box */}
                      {v.feedback ? (
                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-pub-cyanSurface/40 to-white border border-pub-cyan/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-pub-navy flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-pub-teal" /> Supervisor Evaluation: {v.feedback.reviewerName}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              v.feedback.decision === 'Approved' 
                                ? 'bg-pub-success/15 text-pub-success border border-pub-success/30' 
                                : 'bg-pub-warning/15 text-pub-warning border border-pub-warning/30'
                            }`}>
                              {v.feedback.decision}
                            </span>
                          </div>

                          <p className="text-xs text-pub-navy leading-relaxed">
                            "{v.feedback.comments}"
                          </p>

                          {v.feedback.rubricScores && (
                            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
                              <div className="bg-white p-1.5 rounded-lg border border-pub-border">
                                <span className="text-pub-muted block">Methodology</span>
                                <strong className="text-pub-navy font-bold">{v.feedback.rubricScores.methodology}/10</strong>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-pub-border">
                                <span className="text-pub-muted block">Implementation</span>
                                <strong className="text-pub-navy font-bold">{v.feedback.rubricScores.implementation}/10</strong>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-pub-border">
                                <span className="text-pub-muted block">Documentation</span>
                                <strong className="text-pub-navy font-bold">{v.feedback.rubricScores.documentation}/10</strong>
                              </div>
                              <div className="bg-white p-1.5 rounded-lg border border-pub-border">
                                <span className="text-pub-muted block">Presentation</span>
                                <strong className="text-pub-navy font-bold">{v.feedback.rubricScores.presentation}/10</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-pub-warning font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Awaiting supervisor rubric assessment and verdict.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Checklist & Tasks */}
            <div className="pt-4 border-t border-pub-border">
              <h4 className="font-extrabold text-sm text-pub-navy mb-3">Milestone Subtasks &amp; Action Checklist</h4>
              <div className="space-y-2">
                {project.tasks.map(t => (
                  <label key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-pub-bg hover:bg-pub-cyanSurface/20 transition-colors cursor-pointer text-xs font-semibold">
                    <input 
                      type="checkbox" 
                      checked={t.completed} 
                      onChange={() => toggleTaskCompletion(project.id, t.id)}
                      className="rounded accent-pub-teal w-4 h-4"
                    />
                    <span className={t.completed ? 'line-through text-pub-muted' : 'text-pub-navy'}>
                      {t.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadArtifactModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        milestone={selectedMilestone}
        onSubmit={handleUploadSubmit}
      />

      {activeVersionForReview && (
        <RubricReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          milestoneTitle={selectedMilestone.title}
          version={activeVersionForReview}
          onReviewSubmit={(decision, comments, rubricScores) => {
            reviewMilestoneSubmission(project.id, selectedMilestone.id, activeVersionForReview.id, decision, comments, rubricScores);
          }}
        />
      )}
    </div>
  );
};
