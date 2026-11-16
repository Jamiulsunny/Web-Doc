import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Globe2,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/agri-hero.jpg";
import teamImage from "@/assets/agri-team.jpg";
import inspectionImage from "@/assets/agri-inspection.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGRI-HR | Seasonal Agricultural Recruitment" },
      {
        name: "description",
        content:
          "Experienced seasonal agricultural recruitment for farms and fresh produce businesses across the UK and Europe.",
      },
      { property: "og:title", content: "AGRI-HR | Seasonal Agricultural Recruitment" },
      {
        property: "og:description",
        content:
          "We enable farms to harvest and pack with carefully sourced seasonal workers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "HOW WE RECRUIT", href: "#recruitment" },
  { label: "WHERE WE RECRUIT", href: "#locations" },
  { label: "CONTACT US", href: "#contact" },
  { label: "USEFUL LINKS", href: "#useful-links" },
  { label: "EMPLOYER ENQUIRY", href: "mailto:info@agri-hr.com" },
];

const assurances = [
  {
    eyebrow: "LICENSE",
    title: "SWS operator",
    body: "Appointed Seasonal Worker Scheme operator for horticulture.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "PUBLIC",
    title: "ALP accredited",
    body: "Proud Council Member of the Association of Labour Providers.",
    icon: BadgeCheck,
  },
  {
    eyebrow: "LICENSE",
    title: "GLAA licensed",
    body: "Recruitment practices aligned with GLAA requirements.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "EXPERIENCE",
    title: "Recruiting since 2004",
    body: "Agricultural recruitment expertise shaped over two decades.",
    icon: Clock3,
  },
];

const locations = [
  {
    number: "01",
    title: "Great Britain",
    description:
      "The need for agricultural workers continues to outstrip supply. We help farms find seasonal workers and experienced tractor drivers, spray operators and crop husbandry staff.",
    country: "United Kingdom",
    flag: "🇬🇧",
  },
  {
    number: "02",
    title: "Kazakhstan",
    description:
      "With a strong agricultural workforce and rural communities, Kazakhstan is an important source of motivated candidates for seasonal work.",
    country: "Kazakhstan",
    flag: "🇰🇿",
  },
  {
    number: "03",
    title: "Bulgaria",
    description:
      "Bulgarian nationals have a long history in seasonal agricultural work, and many farms welcome experienced returnees and new candidates.",
    country: "Bulgaria",
    flag: "🇧🇬",
  },
  {
    number: "04",
    title: "Kyrgyzstan",
    description:
      "Agriculture is a leading sector, with rural communities and young people seeking rewarding seasonal opportunities abroad.",
    country: "Kyrgyzstan",
    flag: "🇰🇬",
  },
];

const recruitmentSteps = [
  {
    number: "01",
    title: "We meet every candidate",
    body: "Our recruiters take time to understand each applicant, their work ethic, communication and expectations.",
  },
  {
    number: "02",
    title: "Expectations stay aligned",
    body: "Candidates see a realistic picture of the work, the employer's expectations and the accommodation.",
  },
  {
    number: "03",
    title: "We look for the right fit",
    body: "We assess how candidates handle teamwork and everyday challenges before recommending them for work.",
  },
  {
    number: "04",
    title: "Teamwork matters",
    body: "A collaborative spirit and good communication help workers settle in and contribute to the whole team.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Get in touch",
    body: "Discuss your farm's needs and how AGRI-HR can help with harvest and packing.",
  },
  {
    number: "02",
    title: "Supply agreement",
    body: "We put a signed agreement in place before any workers are supplied.",
  },
  {
    number: "03",
    title: "Desktop audit",
    body: "We review working arrangements and living conditions for seasonal workers.",
  },
  {
    number: "04",
    title: "Meet and farm audit",
    body: "We meet in person and arrange the required independent farm audit.",
  },
];

const reasons = [
  {
    title: "Carefully sourced labour",
    body: "A considered recruitment process designed to support a positive result for farms and workers.",
  },
  {
    title: "Workers for farms of all sizes",
    body: "We understand the investment and hard work behind every crop, whether you need one worker or a full team.",
  },
  {
    title: "We understand your needs",
    body: "Our combined operational and recruitment experience spans soft fruit and wider agriculture.",
  },
  {
    title: "International reach",
    body: "Experienced recruitment teams help us work across borders and connect employers with candidates.",
  },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="agri-page">
      <div className="language-strip">
        <div className="agri-container language-inner" aria-label="Available languages">
          <a href="#top" aria-label="English">🇬🇧</a>
          <a href="#top" aria-label="Kazakh">🇰🇿</a>
          <a href="#top" aria-label="Bulgarian">🇧🇬</a>
          <a href="#top" aria-label="Kyrgyz">🇰🇬</a>
        </div>
      </div>

      <header id="top" className="site-header">
        <div className="agri-container contact-bar">
          <a className="brand-mark" href="#top" aria-label="AGRI-HR home">
            <span className="brand-symbol"><Wheat size={28} strokeWidth={1.8} /></span>
            <span className="brand-copy">
              <strong>AGRI-HR</strong>
              <small>LET’S GO TO WORK®</small>
            </span>
          </a>
          <div className="contact-fact">
            <Clock3 aria-hidden="true" />
            <span><small>OPEN HOURS</small><strong>Mon–Fri 08:30 – 17:00</strong></span>
          </div>
          <a className="contact-fact" href="tel:+447484855296">
            <Phone aria-hidden="true" />
            <span><small>PHONE US</small><strong>+44 7484 855296 (UK)</strong></span>
          </a>
          <a className="contact-fact" href="mailto:info@agri-hr.com">
            <Mail aria-hidden="true" />
            <span><small>EMAIL</small><strong>info@agri-hr.com</strong></span>
          </a>
          <div className="social-links" aria-label="Social links">
            <a href="https://www.facebook.com/" aria-label="Facebook"><span>f</span></a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn"><Linkedin size={17} /></a>
          </div>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <nav className={`main-navigation${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <div className="agri-container nav-inner">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="hero-title">
        <img className="hero-image" src={heroImage} alt="Seasonal workers picking strawberries on a UK farm" width={1600} height={1050} />
        <div className="hero-shade" />
        <div className="hero-content agri-container">
          <p className="hero-kicker">ALL YEAR ROUND</p>
          <h1 id="hero-title">WE ENABLE YOU TO<br className="desktop-break" /> HARVEST AND PACK</h1>
          <p className="hero-description">Receive motivated people for agricultural work in the UK and Europe to harvest your crop and pack your produce efficiently.</p>
        </div>
        <a className="hero-scroll" href="#welcome" aria-label="Scroll to welcome">↓</a>
      </section>

      <section id="welcome" className="welcome-section section-space">
        <div className="agri-container welcome-grid">
          <div className="welcome-copy">
            <p className="section-eyebrow">GREAT PEOPLE CREATE THE DIFFERENCE</p>
            <h2>Welcome to <span>AGRI-HR.</span></h2>
            <p className="welcome-lead">We are a UK-based company specialising in recruitment for the agricultural sector in the United Kingdom and Europe.</p>
            <p>We screen, interview and prepare candidates for seasonal agricultural work, helping farms bring in the people they need to harvest and pack their produce.</p>
            <a className="text-link" href="#recruitment">Discover how we recruit <ArrowRight size={18} /></a>
          </div>
          <div className="assurance-grid">
            {assurances.map(({ eyebrow, title, body, icon: Icon }) => (
              <article className="assurance-item" key={title}>
                <Icon className="assurance-icon" aria-hidden="true" />
                <p>{eyebrow}</p>
                <h3>{title}</h3>
                <span>{body}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="worker-band">
        <div className="agri-container worker-grid">
          <div className="worker-copy">
            <p className="section-eyebrow">GREAT PEOPLE CREATE THE DIFFERENCE</p>
            <h2>British, EU and non-EU workers</h2>
            <p>Our recruitment teams work across Kazakhstan, Kyrgyzstan and Bulgaria to find candidates for seasonal agricultural work. We also select candidates for UK and European employers and recruit skilled staff, including tractor drivers, mechanics, spray operators and agronomy staff.</p>
            <a className="button-link" href="mailto:info@agri-hr.com">CONTACT US <ArrowRight size={16} /></a>
          </div>
          <div className="worker-photo-wrap">
            <img src={teamImage} alt="Agricultural workers and farm supervisor together in the field" width={1200} height={800} loading="lazy" />
            <div className="photo-caption"><UsersRound /><span>People who help your harvest succeed</span></div>
          </div>
        </div>
      </section>

      <section id="locations" className="locations-section section-space">
        <div className="agri-container">
          <div className="section-heading">
            <p className="section-eyebrow">A CONNECTED RECRUITMENT NETWORK</p>
            <h2>Where we operate</h2>
            <p>Local recruitment knowledge, connecting motivated people with farms across the UK and Europe.</p>
          </div>
          <div className="location-grid">
            {locations.map((place) => (
              <article key={place.number} className="location-item">
                <div className="location-number">{place.number}</div>
                <div className="location-title"><h3>{place.title}</h3><span>{place.flag}</span></div>
                <p>{place.description}</p>
                <div className="location-tag"><MapPin size={15} /> {place.country}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="returnee-section">
        <div className="returnee-photo"><img src={inspectionImage} alt="A worker carefully checking strawberries in a greenhouse" width={1200} height={800} loading="lazy" /></div>
        <div className="returnee-copy">
          <p className="section-eyebrow">READY TO RETURN</p>
          <h2>Return workers from around the world</h2>
          <p>Returning workers already know the job and working practices. Our dedicated returnee team conducts online interviews, checks previous work history and keeps farms informed at every stage of the application.</p>
          <p>We can also validate candidates recommended by farms and workers connected with returning team members.</p>
          <a className="button-link" href="mailto:info@agri-hr.com">TALK TO OUR TEAM <ArrowRight size={16} /></a>
        </div>
      </section>

      <section id="recruitment" className="recruitment-section section-space">
        <div className="agri-container recruitment-layout">
          <div className="section-heading recruitment-heading">
            <p className="section-eyebrow">PEOPLE FIRST</p>
            <h2>How we identify good people for work</h2>
            <p>Thoughtful conversations and clear expectations help candidates and employers start on the right foot.</p>
          </div>
          <div className="recruitment-list">
            {recruitmentSteps.map((step) => (
              <article className="recruitment-step" key={step.number}>
                <span>{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section section-space">
        <div className="agri-container">
          <div className="section-heading process-heading">
            <p className="section-eyebrow">CUSTOMER’S PROCESS</p>
            <h2>Step by step</h2>
            <p>We make the process straightforward, clear and effective.</p>
          </div>
          <div className="process-grid">
            {processSteps.map((step) => (
              <article className="process-step" key={step.number}>
                <span className="process-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
          <div className="process-note">
            <p>We work hard for farming and fresh produce customers and applicants alike, helping crops to be grown, harvested and packed efficiently.</p>
            <a className="button-link" href="mailto:info@agri-hr.com">CONTACT US <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="reasons-section section-space">
        <div className="agri-container">
          <div className="section-heading">
            <p className="section-eyebrow">AGRI-HR</p>
            <h2>Good reasons to work with us</h2>
          </div>
          <div className="reasons-grid">
            {reasons.map((reason, index) => (
              <article className="reason-item" key={reason.title}>
                <span>0{index + 1}</span><h3>{reason.title}</h3><p>{reason.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-banner" id="contact">
        <div className="agri-container contact-banner-inner">
          <div><p className="section-eyebrow">LET’S TALK ABOUT YOUR SEASON</p><h2>Let’s get your next harvest moving.</h2></div>
          <a className="button-link button-link-light" href="mailto:info@agri-hr.com">CONTACT AGRI-HR <ArrowRight size={16} /></a>
        </div>
      </section>

      <footer className="site-footer" id="useful-links">
        <div className="agri-container footer-grid">
          <div className="footer-brand">
            <a className="brand-mark" href="#top"><span className="brand-symbol"><Wheat size={28} /></span><span className="brand-copy"><strong>AGRI-HR</strong><small>LET’S GO TO WORK®</small></span></a>
            <p>Experienced agricultural recruitment connecting farms with motivated seasonal workers.</p>
          </div>
          <div className="footer-contact"><h3>Contact in the UK</h3><p>2 Wyevale Business Park<br />Kings Acre, Hereford, HR4 7BS</p><a href="mailto:info@agri-hr.com">info@agri-hr.com</a><a href="tel:+447484855296">+44 7484 855296</a></div>
          <div className="footer-links"><h3>Useful links</h3><a href="https://www.gla.gov.uk/">GLAA</a><a href="https://labourproviders.org.uk/">Association of Labour Providers</a><a href="https://www.gov.uk/government/publications/seasonal-workers-pilot-request-for-information/seasonal-workers-pilot-request-for-information">Seasonal Worker Scheme</a></div>
          <div className="footer-details"><h3>AGRI-HR</h3><p>Registered in England and Wales<br />Company No. 11600044</p><a href="mailto:info@agri-hr.com">Send us an enquiry <ArrowRight size={15} /></a></div>
        </div>
        <div className="agri-container footer-bottom"><span>© {new Date().getFullYear()} AGRI-HR. All rights reserved.</span><span><Globe2 size={15} /> United Kingdom · Europe</span></div>
      </footer>
    </main>
  );
}