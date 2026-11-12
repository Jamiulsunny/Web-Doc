import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Scale,
  Search,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';
import '../styles/landing-page.css';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Scroll Progress and Viewport Interceptor
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsNavScrolled(window.scrollY > 40);

      // Parallax hero background scaling
      const heroBg = document.getElementById('heroBgImage');
      if (heroBg) {
        heroBg.style.transform = `scale(${1.05 + window.scrollY * 0.0003}) translateY(${window.scrollY * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll-Triggered Fade & Slide Reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.anim-target');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-viewport">
      {/* Top Reading Meter */}
      <div className="lp-scroll-meter" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <header className={`lp-nav ${isNavScrolled ? 'scrolled' : ''}`}>
        <div className="lp-nav-container">
          <Link to="/" className="lp-brand">
            <div className="lp-brand-badge">
              <PawPrint size={20} color="#0a1f16" />
            </div>
            <span>AgriFarm<span style={{ color: 'var(--lp-fresh)' }}>.js</span></span>
          </Link>

          <nav className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#challenges" className="lp-nav-link">Why AgriFarm</a>
            <a href="#showcase" className="lp-nav-link">Console</a>
            <a href="#telemetry" className="lp-nav-link">Telemetry</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/dashboard" className="lp-btn-cta">
              <span>Launch Console</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* SCENE 01: HERO */}
      <section className="lp-scene-hero" id="hero">
        <div className="lp-hero-bg">
          <img
            id="heroBgImage"
            src="https://cdn.imgpile.com/f/BNQzYsV_wm.jpg"
            alt="Cattle grazing in lush green pastures at dawn"
            className="lp-hero-bg-img"
          />
          <div className="lp-hero-overlay" />
        </div>

        <div className="lp-hero-content">
          <div className="lp-badge-reveal anim-target in-view">
            <Sparkles size={14} />
            <span>Agri Farm by Sunny Enterprise</span>
          </div>

          <h1 className="lp-hero-title anim-target delay-1 in-view">
            Manage Every Animal.<br />
            <span>Grow With Confidence.</span>
          </h1>

          <p className="lp-hero-lead anim-target delay-2 in-view">
            The unified livestock records, biometric weight tracking, and medical surveillance system
            engineered for forward-thinking agricultural enterprises.
          </p>

          <div className="lp-hero-actions anim-target delay-3 in-view">
            <Link to="/dashboard" className="lp-btn-cta" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <span>Enter Farm Dashboard</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/add-animal" className="lp-btn-ghost" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <span>Register Livestock</span>
            </Link>
          </div>
        </div>

        <div className="lp-scroll-indicator">
          <div className="lp-mouse-wheel" />
          <span>Scroll To Explore</span>
        </div>
      </section>

      {/* SCENE 02: THE CHALLENGE */}
      <section className="lp-scene-pad" id="challenges" style={{ background: 'var(--lp-surface-dark)' }}>
        <div className="lp-container">
          <div className="lp-section-header anim-target">
            <span className="lp-eyebrow">The Operational Cost of Fragmentation</span>
            <h2 className="lp-heading">Paper Records Are Costing Your Farm Daily</h2>
            <p className="lp-subtext">
              Traditional ledgers, loose spreadsheets, and fragmented clipboards create catastrophic blindspots in animal health and biomass yield.
            </p>
          </div>

          <div className="lp-problem-grid">
            <div className="lp-problem-card anim-target delay-1">
              
              <h3 className="lp-card-title">Lost Medical Context</h3>
              <p className="lp-card-desc">
                Antibiotic withdrawal times, vaccination dates, and recurring quarantine alerts fall through the cracks of manual paper logs.
              </p>
            </div>

            <div className="lp-problem-card anim-target delay-2">
             
              <h3 className="lp-card-title">Stale Weight Diagnostics</h3>
              <p className="lp-card-desc">
                Without real-time biomass calculations, underperforming livestock remain undetected until point-of-sale weighing.
              </p>
            </div>

            <div className="lp-problem-card anim-target delay-3">
             
              <h3 className="lp-card-title">Data Inconsistency</h3>
              <p className="lp-card-desc">
                Duplicate ear tags, conflicting birth records, and unverified data entries ruin regulatory veterinary audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 03: THE SOLUTION STORYTELLING */}
      <section className="lp-scene-pad" id="solution">
        <div className="lp-container">
          <div className="lp-solution-wrap">
            <div className="anim-target">
              <span className="lp-eyebrow">The New Standard</span>
              <h2 className="lp-heading">One Immutable Source of Truth for Your Entire Herd</h2>
              <p className="lp-subtext" style={{ marginBottom: 32 }}>
                Agri Farm replaces ad-hoc spreadsheets with a structured, verified digital records ledger designed for the realities of field operations.
              </p>

             <ul style={{ listStyleType: 'disc', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
  <li style={{ color: 'var(--lp-fresh)' }}>
    <h4 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4, color: 'var(--lp-cream)' }}>
      Invariant Animal Identifiers
    </h4>
    <p style={{ color: 'rgba(248, 248, 241, 0.7)', fontSize: '0.9rem' }}>
      Every animal receives a permanent system ID and unique tag number that persists even through archival states.
    </p>
  </li>

  <li style={{ color: 'var(--lp-fresh)' }}>
    <h4 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4, color: 'var(--lp-cream)' }}>
      Medical Observation Logs
    </h4>
    <p style={{ color: 'rgba(248, 248, 241, 0.7)', fontSize: '0.9rem' }}>
      Track status transitions from Healthy to Sick, Under Treatment, and Recovering with sequential event notes.
    </p>
  </li>

  <li style={{ color: 'var(--lp-fresh)' }}>
    <h4 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 4, color: 'var(--lp-cream)' }}>
      Real-Time Biomass Aggregation
    </h4>
    <p style={{ color: 'rgba(248, 248, 241, 0.7)', fontSize: '0.9rem' }}>
      Instant mathematical calculation of herd totals, average weight, and extreme weight variances across species.
    </p>
  </li>
</ul>
            </div>

            <div className="anim-target delay-2">
              <div className="lp-media-frame">
                <img
                  src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80"
                  alt="Highland cattle in mist"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 04: CORE FEATURES */}
      <section className="lp-scene-pad" id="features" style={{ background: 'var(--lp-surface-dark)' }}>
        <div className="lp-container">
          <div className="lp-section-header anim-target">
            <span className="lp-eyebrow">Engineered For Production</span>
            <h2 className="lp-heading">Six Core Pillars of Modern Farm Management</h2>
            <p className="lp-subtext">
              Comprehensive operational tools designed specifically for commercial livestock and dairy stations.
            </p>
          </div>

          <div className="lp-features-grid">
            <div className="lp-feature-card anim-target delay-1">
              <div className="lp-feature-icon">
                <PawPrint size={26} />
              </div>
              <h3 className="lp-card-title">Livestock Registry</h3>
              <p className="lp-card-desc">
                Centralized registry with validated fields for Ear Tag, Animal Type, Breed, Gender, Birth Date, and Weight.
              </p>
            </div>

            <div className="lp-feature-card anim-target delay-2">
              <div className="lp-feature-icon">
                <Activity size={26} />
              </div>
              <h3 className="lp-card-title">Health Surveillance</h3>
              <p className="lp-card-desc">
                Surveillance categorizing animals across Healthy, Under Treatment, Sick (Quarantine), and Recovering protocols.
              </p>
            </div>

            <div className="lp-feature-card anim-target delay-3">
              <div className="lp-feature-icon">
                <Search size={26} />
              </div>
              <h3 className="lp-card-title">Fast Multi-Filter Search</h3>
              <p className="lp-card-desc">
                Sub-second, case-insensitive search indexing tags, breeds, species, and clinical statuses simultaneously.
              </p>
            </div>

            <div className="lp-feature-card anim-target delay-1">
              <div className="lp-feature-icon">
                <Scale size={26} />
              </div>
              <h3 className="lp-card-title">Weight Telemetry</h3>
              <p className="lp-card-desc">
                Tracks biomass growth curves and automatically flags negative numbers, non-numeric values, or zero inputs.
              </p>
            </div>

            <div className="lp-feature-card anim-target delay-2">
              <div className="lp-feature-icon">
                <BarChart3 size={26} />
              </div>
              <h3 className="lp-card-title">Visual Herd Analytics</h3>
              <p className="lp-card-desc">
                Dynamic visual distributions generated directly from active database records using reactive SVG charts.
              </p>
            </div>

            <div className="lp-feature-card anim-target delay-3">
              <div className="lp-feature-icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="lp-card-title">Fail-Safe Soft Delete</h3>
              <p className="lp-card-desc">
                Accidental deletions are routed to the Recycle Archive where records can be safely restored with tag-collision checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 05: DASHBOARD SHOWCASE (3D PERSPECTIVE PREVIEW) */}
      <section className="lp-scene-pad" id="showcase">
        <div className="lp-container">
          <div className="lp-section-header anim-target">
            <span className="lp-eyebrow">Real-Time Operational Console</span>
            <h2 className="lp-heading">Tactile Control Over Every Acre</h2>
            <p className="lp-subtext">
              The high-density operations dashboard provides immediate visibility into your herd's telemetry.
            </p>
          </div>

          <div className="lp-showcase-wrapper anim-target delay-1">
            <div className="lp-dashboard-canvas">
              <div className="lp-window-bar">
                <span className="lp-dot red" />
                <span className="lp-dot yellow" />
                <span className="lp-dot green" />
                <span className="lp-window-title">agri-farm://station-console/telemetry-active</span>
              </div>

              <div className="lp-mock-dashboard">
                <div className="lp-mock-sidebar">
                  <div className="lp-mock-nav-item active" />
                  <div className="lp-mock-nav-item" />
                  <div className="lp-mock-nav-item" />
                  <div className="lp-mock-nav-item" />
                  <div className="lp-mock-nav-item" />
                </div>

                <div className="lp-mock-content">
                  <div className="lp-mock-stats-row">
                    <div className="lp-mock-stat-box">
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>TOTAL HEADCOUNT</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>1,480</div>
                    </div>
                    <div className="lp-mock-stat-box">
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>CLINICAL HEALTHY</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--lp-fresh)', marginTop: 4 }}>98.4%</div>
                    </div>
                    <div className="lp-mock-stat-box">
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>ATTENTION REQ.</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e9a23b', marginTop: 4 }}>24</div>
                    </div>
                    <div className="lp-mock-stat-box">
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>TOTAL BIOMASS</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>742,800 kg</div>
                    </div>
                  </div>

                  <div className="lp-mock-chart-box">
                    <div style={{ textAlign: 'center' }}>
                      <BarChart3 size={48} color="var(--lp-fresh)" style={{ opacity: 0.8, marginBottom: 12 }} />
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Interactive Recharts Analytics Active</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                        Live herd composition and quarantine distribution rendering at 60 FPS
                      </div>
                      <div style={{ marginTop: 18 }}>
                        <Link to="/dashboard" className="lp-btn-cta" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                          Open Live Console
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 06: STATS & TELEMETRY */}
      <section className="lp-scene-pad" id="telemetry" style={{ background: 'var(--lp-surface-dark)' }}>
        <div className="lp-container">
          <div className="lp-stats-ribbon anim-target">
            <div>
              <div className="lp-stat-number">100%</div>
              <div className="lp-stat-label">Offline Local Resilience</div>
            </div>
            <div>
              <div className="lp-stat-number">&lt; 15ms</div>
              <div className="lp-stat-label">Indexing Query Speed</div>
            </div>
            <div>
              <div className="lp-stat-number">0.00</div>
              <div className="lp-stat-label">Zero Cloud Downtime Risk</div>
            </div>
            <div>
              <div className="lp-stat-number">65+</div>
              <div className="lp-stat-label">Verified Test Assertions</div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 07: CALL TO ACTION */}
      <section className="lp-scene-cta">
        <div className="lp-container anim-target">
          <span className="lp-eyebrow">Ready For Modern Farm Operations?</span>
          <h2 className="lp-heading" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', marginBottom: 20 }}>
            Manage Your Farm. Grow With Confidence.
          </h2>
          <p className="lp-subtext" style={{ maxWidth: 640, margin: '0 auto 36px' }}>
            Join forward-thinking livestock operations that trust Agri Farm for dependable data recording and health monitoring.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="lp-btn-cta" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              <span>Launch Live Dashboard</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/animals" className="lp-btn-ghost" style={{ padding: '16px 32px', fontSize: '1.05rem' }}>
              <span>View Livestock Directory</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="lp-brand-badge" style={{ width: 28, height: 28 }}>
              <PawPrint size={14} color="#0a1f16" />
            </div>
            <span style={{ fontWeight: 600, color: 'var(--lp-cream)' }}>Agri Farm by Sunny Enterprise</span>
          </div>

          <div>
            Built with React, Vite &amp; Vanilla Hardware-Accelerated CSS
          </div>

          <div>
            &copy; 2026 AgriFarm. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}