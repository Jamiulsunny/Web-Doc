import React, { useState } from 'react';
import { 
  X, UploadCloud, CheckCircle2, AlertTriangle, Star, 
  Calendar, Clock, MapPin, Sparkles, FileText, ChevronRight 
} from 'lucide-react';
import { Milestone, SubmissionVersion } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone;
  onSubmit: (file: { name: string; size: string }, note: string) => void;
}

export const UploadArtifactModal: React.FC<UploadModalProps> = ({
  isOpen, onClose, milestone, onSubmit
}) => {
  const [fileName, setFileName] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(
        { name: fileName, size: `${(Math.random() * 4 + 2).toFixed(1)} MB` },
        note || 'Uploaded for progressive milestone review.'
      );
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const handleSimulatedDrop = () => {
    setFileName(`PUB_Milestone_${milestone.order}_Final_Artifact.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pub-navy/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pub-border relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-pub-muted hover:text-pub-navy hover:bg-pub-bg rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pub-cyanSurface text-pub-teal border border-pub-cyan/30">
            Version {milestone.versions.length + 1}.0 Submission
          </span>
          <h3 className="text-lg font-extrabold text-pub-navy mt-1">{milestone.title}</h3>
          <p className="text-xs text-pub-muted mt-0.5">{milestone.submissionRequirements}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop Simulation */}
          <div 
            onClick={handleSimulatedDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              fileName 
                ? 'border-pub-success bg-pub-success/5' 
                : 'border-pub-border hover:border-pub-cyan hover:bg-pub-cyanSurface/30'
            }`}
          >
            <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${fileName ? 'text-pub-success' : 'text-pub-cyan'}`} />
            {fileName ? (
              <div>
                <p className="text-xs font-bold text-pub-navy">{fileName}</p>
                <p className="text-[11px] text-pub-success font-semibold">File ready for upload &middot; Validated</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-pub-navy">Click to select academic document (PDF/ZIP/DOCX)</p>
                <p className="text-[11px] text-pub-muted mt-1">Maximum allowed size: 25 MB &middot; Multi-version preserved</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-pub-navy mb-1.5">Submission Note for Supervisor</label>
            <textarea 
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Highlight recent updates, methodologies used, or questions for your reviewer..."
              className="w-full text-xs p-3 bg-pub-bg border border-pub-border rounded-xl focus:outline-none focus:border-pub-cyan focus:bg-white transition-all text-pub-text"
            />
          </div>

          <div className="bg-pub-cyanSurface/50 p-3 rounded-xl border border-pub-cyan/30 text-[11px] text-pub-teal">
            <strong>Preservation Notice:</strong> Your previous versions will not be overwritten. All previous iterations remain archived for audit and examination defense records.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-pub-muted hover:bg-pub-bg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!fileName || isSubmitting}
              className="btn flex items-center gap-2"
            >
              {isSubmitting ? 'Uploading...' : 'Confirm Artifact Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneTitle: string;
  version: SubmissionVersion;
  onReviewSubmit: (
    decision: 'Approved' | 'Revision Required',
    comments: string,
    rubricScores: { methodology: number; implementation: number; documentation: number; presentation: number }
  ) => void;
}

export const RubricReviewModal: React.FC<ReviewModalProps> = ({
  isOpen, onClose, milestoneTitle, version, onReviewSubmit
}) => {
  const [decision, setDecision] = useState<'Approved' | 'Revision Required'>('Approved');
  const [methodology, setMethodology] = useState<number>(8.5);
  const [implementation, setImplementation] = useState<number>(9.0);
  const [documentation, setDocumentation] = useState<number>(8.5);
  const [presentation, setPresentation] = useState<number>(9.0);
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const averageScore = ((methodology + implementation + documentation + presentation) / 4).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;

    onReviewSubmit(
      decision,
      comments,
      { methodology, implementation, documentation, presentation }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pub-navy/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-pub-border relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-pub-muted hover:text-pub-navy hover:bg-pub-bg rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-pub-teal text-white">
            Supervisor Evaluation Rubric
          </span>
          <h3 className="text-lg font-extrabold text-pub-navy mt-1">Review: {milestoneTitle}</h3>
          <p className="text-xs text-pub-muted">Evaluating submission artifact: <strong>{version.fileName}</strong> (v{version.versionNumber}.0)</p>
        </div>

        {/* Student Note Context */}
        {version.studentNote && (
          <div className="bg-pub-bg p-3 rounded-xl border border-pub-border mb-4 text-xs">
            <span className="font-bold text-pub-navy block mb-0.5">Student Note:</span>
            <p className="text-pub-muted italic">"{version.studentNote}"</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Decision Selector */}
          <div>
            <label className="block text-xs font-bold text-pub-navy mb-2">Formal Verdict</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  decision === 'Approved'
                    ? 'bg-pub-success/10 border-pub-success text-pub-success shadow-sm'
                    : 'border-pub-border text-pub-muted hover:border-pub-navy'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Milestone
              </button>
              <button
                type="button"
                onClick={() => setDecision('Revision Required')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  decision === 'Revision Required'
                    ? 'bg-pub-warning/10 border-pub-warning text-pub-warning shadow-sm'
                    : 'border-pub-border text-pub-muted hover:border-pub-navy'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Request Revision
              </button>
            </div>
          </div>

          {/* Rubrics Sliders */}
          <div className="bg-pub-bg/80 border border-pub-border p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pub-navy flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-pub-accent" /> Academic Rubric Assessment
              </span>
              <span className="text-xs font-black text-pub-teal bg-pub-cyanSurface px-2.5 py-0.5 rounded-full border border-pub-cyan/30">
                Score: {averageScore} / 10
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-pub-navy mb-1">
                <span>Methodology & Technical Rigor</span>
                <span>{methodology.toFixed(1)} / 10</span>
              </div>
              <input 
                type="range" min="1" max="10" step="0.5" 
                value={methodology} 
                onChange={(e) => setMethodology(parseFloat(e.target.value))}
                className="w-full accent-pub-teal"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-pub-navy mb-1">
                <span>Implementation & Code Quality</span>
                <span>{implementation.toFixed(1)} / 10</span>
              </div>
              <input 
                type="range" min="1" max="10" step="0.5" 
                value={implementation} 
                onChange={(e) => setImplementation(parseFloat(e.target.value))}
                className="w-full accent-pub-teal"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-pub-navy mb-1">
                <span>Documentation & IEEE Compliance</span>
                <span>{documentation.toFixed(1)} / 10</span>
              </div>
              <input 
                type="range" min="1" max="10" step="0.5" 
                value={documentation} 
                onChange={(e) => setDocumentation(parseFloat(e.target.value))}
                className="w-full accent-pub-teal"
              />
            </div>
          </div>

          {/* Structured Feedback Comments */}
          <div>
            <label className="block text-xs font-bold text-pub-navy mb-1.5">Supervisor Detailed Feedback & Action Items</label>
            <textarea 
              rows={4}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback, identify missing elements, and articulate exact steps needed for subsequent approval..."
              className="w-full text-xs p-3 bg-pub-bg border border-pub-border rounded-xl focus:outline-none focus:border-pub-cyan focus:bg-white transition-all text-pub-text"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-pub-muted hover:bg-pub-bg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn flex items-center gap-2"
            >
              Submit Official Review &amp; Notify Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
