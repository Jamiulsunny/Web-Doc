import os, shutil, html as H
OUT = "/home/claude/pundra-university-recreation"
shutil.rmtree(OUT, ignore_errors=True)
def w(p, t):
    p = os.path.join(OUT, p); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(t)

# ---------- illustrated images (SVG stand-ins, one per theme) ----------
def motif(m, c):
    if m == "b": return f'<g fill="{c}"><polygon points="600,150 330,260 870,260"/><rect x="350" y="270" width="500" height="22"/>' + "".join(f'<rect x="{380+i*90}" y="300" width="40" height="190"/>' for i in range(6)) + f'<rect x="320" y="495" width="560" height="26"/></g>'
    if m == "k": return "".join(f'<rect x="{420+i*8}" y="{440-i*70}" width="{360-i*16}" height="58" rx="6" fill="{c}" opacity="{1-i*.12}"/>' for i in range(5))
    if m == "f": return f'<g fill="{c}"><rect x="560" y="150" width="80" height="150"/><polygon points="560,300 640,300 760,500 440,500"/></g><circle cx="600" cy="420" r="40" fill="#fff" opacity=".35"/>'
    if m == "p": return "".join(f'<circle cx="{360+i*120}" cy="{300+(i%2)*30}" r="42" fill="{c}"/><rect x="{320+i*120}" y="{350+(i%2)*30}" width="80" height="150" rx="36" fill="{c}"/>' for i in range(6))
    if m == "c": return f'<g fill="{c}"><polygon points="600,180 300,300 600,420 900,300"/><path d="M450,360 v100 q150,80 300,0 v-100 l-150,60z"/><rect x="880" y="300" width="10" height="150"/></g>'
    if m == "g": return f'<g fill="none" stroke="{c}" stroke-width="26"><circle cx="600" cy="320" r="110"/><circle cx="600" cy="320" r="190" stroke-dasharray="40 30"/></g><circle cx="600" cy="320" r="40" fill="{c}"/>'
K = {  # kind: (c1, c2, motif, alt)
 "campus": ("#0f4c81", "#5aa0d8", "b", "University campus building"), "library": ("#5b3a1e", "#c99a5b", "k", "Library with stacks of books"),
 "lab": ("#0b5d4f", "#5fc4a8", "f", "Science laboratory"), "seminar": ("#3a2a6b", "#8f7bd6", "p", "Seminar audience"),
 "graduation": ("#7a1f2b", "#e07a86", "c", "Graduation ceremony"), "orientation": ("#0f4c81", "#7fc1ee", "p", "Orientation programme"),
 "culture": ("#b3541e", "#f2b46b", "p", "Cultural festival"), "culture2": ("#8a6d0f", "#f0d36b", "p", "Seasonal festival"),
 "admission": ("#0a2d4f", "#e9a820", "c", "Admission campaign"), "business": ("#1d5c2e", "#8bd19b", "k", "Business studies"),
 "cse": ("#12304f", "#4aa3e0", "g", "Computer science"), "eee": ("#5a4a05", "#f2cf3a", "g", "Electrical engineering"),
 "civil": ("#4a4a4a", "#b9b9b9", "b", "Civil engineering"), "health": ("#8a1f4a", "#f08fb4", "f", "Public health"),
 "islamic": ("#0e5a3a", "#6fd0a1", "b", "Islamic studies"), "law": ("#2f2f5e", "#9a9ae0", "k", "Law faculty"),
 "education": ("#7a4a0f", "#e7b66b", "k", "Education"), "media": ("#6b1f6b", "#d98ad9", "p", "Journalism and media"),
 "workshop": ("#0b4a5d", "#6fcde0", "p", "Workshop session"), "innovation": ("#2d1f6b", "#7f6fe0", "g", "Innovation fair"),
}
for k, (a, b, m, alt) in K.items():
    w(f"assets/images/{k}.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="{alt}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/>{motif(m,"#ffffffcc")}<text x="600" y="610" font-family="sans-serif" font-size="38" fill="#fff" text-anchor="middle" opacity=".9">{alt}</text></svg>')
def img(k, cls="", lazy=True):
    return f'<img class="{cls}" src="@R@assets/images/{k}.svg" alt="{K[k][3]} (placeholder illustration)" width="1200" height="675"{" loading=lazy" if lazy else ""}>'

# ---------- navigation ----------
NAV = [("Home", "index.html"),
 ("About Us", [("About the University", "about-the-university.html"), ("Vision & Mission", "vision-mission.html"), ("University Approval", "university-approval.html"),
   ("Messages", [("Chairman's Message", "message/chairman-bot.html"), ("Vice-Chancellor's Message", "message/vice-chancellor.html"), ("Treasurer's Message", "message/treasurer.html")]), ("Photo Gallery", "photo-gallery.html")]),
 ("Administrations", [("Chairman, BoT", "chairman-bot.html"), ("Advisor, BoT", "advisor-bot.html"), ("Offices", "offices.html"), ("Complaint Committees", "complaints.html"),
   ("Management", [("Board of Trustees", "board-of-trustees.html"), ("Syndicate", "syndicate.html"), ("Academic Council", "academic-council.html")])]),
 ("Admission", [("Undergraduate Programs", "programs/undergraduate.html"), ("Postgraduate Programs", "programs/postgraduate.html"), ("Tuition Fees", "tuition-fees.html"), ("Tuition Fee Calculator", "fee-calculator.html"),
   ("Admission Requirements", "admission-requirements.html"), ("Scholarship", "scholarship.html"), ("Facilities", "facilities.html")]),
 ("Academics", [("Faculty", [("Business Studies", "faculty/business-studies.html"), ("Science & Engineering", "faculty/science-and-engineering.html"), ("Humanities & Social Sciences", "faculty/humanities-and-social-sciences.html"), ("Law", "faculty/faculty-of-law.html")]),
   ("Departments", [(n, f"departments/{s}.html") for n, s in [("Business Administration", "business-administration"), ("Computer Science & Engineering", "computer-science-and-engineering"), ("Electrical & Electronic Engineering", "electrical-and-electronic-engineering"), ("Civil Engineering", "civil-engineering"), ("Public Health", "public-health"), ("Islamic Studies", "islamic-studies"), ("English", "english"), ("Education", "education"), ("Law", "law"), ("Journalism & Media Studies", "journalism"), ("Bangla", "bangla"), ("Development Studies", "development-studies")]]),
   ("Programs", "programs.html"), ("Academic Calendar", "academic-calendar.html"), ("OBE Curriculum", "syllabus.html"), ("Semester Result", "semester-result.html"), ("Result Verification", "result-verification.html")]),
 ("Notice", [("Notice", "notice.html"), ("Events", "events.html"), ("Seminar", "seminar.html"), ("News Letter", "news-letter.html")])]
FOOT_EXTRA = [("Faculty Members", "faculty-members.html"), ("Alumni", "alumni.html"), ("Career", "career.html"), ("Clubs", "clubs.html"), ("Contact", "contact.html"), ("IQAC", "iqac.html"), ("Why Choose Us", "why-choose-us.html")]
LABELS = {}
def walk(items):
    for l, t in items:
        if isinstance(t, list): walk(t)
        else: LABELS[t] = l
walk(NAV); LABELS.update({t: l for l, t in FOOT_EXTRA})
def has(t, cur): return any(has(x[1], cur) if isinstance(x[1], list) else x[1] == cur for x in t)
def menu(items, cur, sub=False):
    o = ""
    for l, t in items:
        if isinstance(t, list):
            o += f'<li class="has-sub{" active" if has(t,cur) else ""}"><button type="button" aria-expanded="false" aria-haspopup="true">{H.escape(l)}</button><ul class="sub">{menu(t,cur,True)}</ul></li>'
        else:
            o += f'<li{" class=active" if t==cur else ""}><a href="@R@{t}"{" aria-current=page" if t==cur else ""}>{H.escape(l)}</a></li>'
    return o

# ---------- content ----------
PROGS = [("mba", "MBA", "PG", "business"), ("emba", "EMBA", "PG", "business"), ("mba-1y", "MBA-1 Year", "PG", "business"), ("mph", "MPH", "PG", "health"),
 ("ma-is-2y", "M.A in Islamic Studies (2Y)", "PG", "islamic"), ("ma-is-1y", "M.A in Islamic Studies (1Y)", "PG", "islamic"), ("bba", "BBA", "UG", "business"),
 ("cse", "B.Sc. in CSE", "UG", "cse"), ("cse-for-diploma", "B.Sc. in CSE (For Diploma)", "UG", "cse"), ("eee", "B.Sc. in EEE", "UG", "eee"),
 ("eee-for-diploma", "B.Sc. in EEE (For Diploma)", "UG", "eee"), ("ce", "B.Sc. in Civil Engineering", "UG", "civil")]
NOTICES = ["১৮-১০-২০২৬ থেকে ২০-১০-২০২৬ তারিখ (রবিবার থেকে মঙ্গলবার) পর্যন্ত ০৩ (তিন) দিন দুর্গাপূজা উপলক্ষে পুণ্ড্র ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি’র অফিস, ক্লাস ও পরীক্ষাসমূহ বন্ধ থাকা প্রসঙ্গে।",
 "“দুর্গাপূজা” উপলক্ষে বিশ্ববিদ্যালয় ছাত্র হল বন্ধ প্রসঙ্গে..", "“দুর্গাপূজা” উপলক্ষে বিশ্ববিদ্যালয় ছাত্রী হল বন্ধ প্রসঙ্গে..",
 "গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের বিজ্ঞান ও প্রযুক্তি মন্ত্রণালয়ের জাতীয় বিজ্ঞান ও প্রযুক্তি জাদুঘর কর্তৃক আয়োজিত দিনব্যাপী ‘ভ্রাম্যমাণ বিজ্ঞান প্রদর্শনী ও টেলিস্কোপ প্রদর্শনী প্রসঙ্গে",
 "পুণ্ড্র ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজিতে “Stress Management for Teachers” বিষয়ে সেমিনার প্রসঙ্গে"]
NDATES = ["17 Oct 2026", "17 Oct 2026", "17 Oct 2026", "09 Oct 2026", "04 Oct 2026"]
EVENTS = [("October 05, 2026", "বিশ্ব শিক্ষক দিবস-২০২৬ উপলক্ষ্যে পুণ্ড্র বিশ্ববিদ্যালয়ে আলোচনা সভা অনুষ্ঠিত", "education"), ("September 14, 2026", "Pundra University of Science & Technology at Bangladesh Innovation Fair 2026", "innovation"),
 ("August 30, 2026", "পুণ্ড্র বিশ্ববিদ্যালয়ে পবিত্র ঈদে মিলাদুন্নবি (সা.) উপলক্ষ্যে আলোচনা সভা অনুষ্ঠিত..", "islamic"), ("August 29, 2026", "পুণ্ড্র ইউনিভার্সিটিতে সামার-২০২৬ সেমিস্টারের ওরিয়েন্টেশন প্রোগ্রাম অনুষ্ঠিত", "orientation"),
 ("August 24, 2026", "পুণ্ড্র ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি (পিইউবি) এর জন্য অত্যন্ত আনন্দ ও গর্বের একটি অর্জন", "graduation")]
SEMS = [("06-Oct-2026", "পুণ্ড্র বিশ্ববিদ্যালয়ে ‘শিক্ষকদের স্ট্রেস ম্যানেজমেন্ট’ বিষয়ক সেমিনার অনুষ্ঠিত"), ("16-Aug-2026", "পুণ্ড্র ইউনিভার্সিটিতে আইকিউএসি এর উদ্যোগে সেমিনার অনুষ্ঠিত"),
 ("28-Jul-2026", "পুণ্ড্র ইউনিভার্সিটিতে রক্তশূন্যতা ও থ্যালাসেমিয়া বিষয়ক সচেতনতামূলক সেমিনার অনুষ্ঠিত"), ("14-Jul-2026", "পুণ্ড্র ইউনিভার্সিটিতে ভাষার জীবনচক্র বিষয়ক সেমিনার অনুষ্ঠিত"),
 ("16-Jun-2026", "পুণ্ড্র ইউনিভার্সিটিতে “অ্যান এজ অফ এআই: এ টাইম ফর বোল্ড মাইন্ড অ্যান্ড বিগ ড্রিমস” বিষয়ক সেমিনার অনুষ্ঠিত"), ("23-May-2026", "পুণ্ড্র ইউনিভার্সিটিতে “ইউনিভার্সিটি র‍্যাঙ্কিং: হোয়াই অ্যান্ড হাউ” বিষয়ক সেমিনার অনুষ্ঠিত"),
 ("25-Apr-2026", "পুণ্ড্র ইউনিভার্সিটিতে “এআই ফর ফিউচার লিডারস: ক্যাম্পাস টু কর্পোরেট” বিষয়ক কর্মশালা অনুষ্ঠিত"), ("21-Apr-2026", "পুণ্ড্র বিশ্ববিদ্যালয়ে “ক্যারিয়ার কাউন্সিলিং” শীর্ষক সেমিনার অনুষ্ঠিত")]
SLIDES = [("admission", "Admission Going On Spring-2027"), ("graduation", "এইচএসসি পরীক্ষায় বগুড়া জেলার মেধাবী শিক্ষার্থীদের সংবর্ধনা-২০২৫"), ("culture", "মহান শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস-২০২৬ উপলক্ষ্যে প্রভাত ফেরী ও পুস্পস্তবক অর্পণ"),
 ("orientation", "ওরিয়েন্টেশন অনুষ্ঠান স্প্রিং-২০২৬"), ("workshop", "Workshop on “Preparation for Accreditation: Documentation and Evidence”"), ("seminar", "Seminar on “Opportunities for Higher Studies Abroad”"),
 ("culture2", "পহেলা বৈশাখ ১৪৩২"), ("campus", "পুণ্ড্র ইউনিভার্সিটিতে পিঠা উৎসব ও বসন্তবরণ")]
FAC = ["Highly qualified full-time faculty members", "Adjunct faculties from public universities", "English proficiency development program", "Computing skill development program",
 "Rich library collections with books and journals and on-line access to e-learning resources", "Formal consulting/tutorial sessions, and make-up classes to alleviate students' learning difficulties", "Student counselling, career guidance and placement services"]
ABOUT = "The Pundra University of Science & Technology is proud to be the first Private University in North Bengal aiming to provide high quality higher education at affordable cost at the door step of the young, matured and marginalized people. It was established under the Private University Act with the approval of the Ministry of Education."
NEED = '<p class="src-needed"><strong>Source content required.</strong> The official text for this page was not retrieved during the audit, so nothing has been invented. Paste the verified content here (edit this file&rsquo;s <code>&lt;main&gt;</code> section).</p>'
def cards(items, root_img=True):
    return '<div class="grid">' + "".join(f'<article class="card"><a href="@R@{h}">{img(k)}<h3>{H.escape(t)}</h3></a>{("<p>"+m+"</p>") if m else ""}</article>' for h, t, k, m in items) + "</div>"
def plist(f): return cards([(f"programs/{s}.html", n, k, t) for s, n, t2, k in PROGS if (f is None or t2 == f) for t in [{"UG": "Undergraduate", "PG": "Postgraduate"}[t2]]])
def rows(items): return '<ul class="rows">' + "".join(f'<li><time>{d}</time><span>{H.escape(t)}</span></li>' for d, t in items) + "</ul>"
C = {
 "about-the-university.html": f"<p>{ABOUT}</p>" + img("campus", "wide"),
 "facilities.html": "<ol class=fac>" + "".join(f"<li>{f}</li>" for f in FAC) + "</ol>" + img("library", "wide"),
 "why-choose-us.html": "<h2>Academic Programs</h2><ul><li>Wide range of programs in science, technology, engineering, and related fields.</li><li>Industry-aligned curriculum with a focus on practical skills and emerging technologies.</li></ul><h2>Research Opportunities</h2><ul><li>Strong emphasis on research and innovation.</li><li>Opportunities for undergraduate and graduate students to work in research labs.</li><li>Collaborations with national and international research institutions.</li></ul><h2>Faculty Expertise</h2><ul><li>Highly qualified professors with PhDs from reputed universities.</li><li>Many faculty members have industry experience and research publications.</li><li>Accessible mentors who support student projects and career growth.</li></ul>" + img("lab", "wide"),
 "programs.html": "<h2>Undergraduate</h2>" + plist("UG") + "<h2>Postgraduate</h2>" + plist("PG") + '<p class="src-needed">The audit captured the programs shown on the homepage; the official list may contain more. Credits and semesters need source verification.</p>',
 "programs/undergraduate.html": plist("UG"), "programs/postgraduate.html": plist("PG"),
 "notice.html": '<ul class="rows">' + "".join(f'<li><time>{d}</time><a href="@R@notice/n{i+1}.html">{H.escape(t)}</a></li>' for i, (d, t) in enumerate(zip(NDATES, NOTICES))) + "</ul>",
 "events.html": cards([("events.html", t, k, d) for d, t, k in EVENTS]), "seminar.html": rows(SEMS) + cards([("seminar.html", t, "seminar", d) for d, t in SEMS[:3]]),
 "photo-gallery.html": '<div class="grid g4">' + "".join(f'<figure>{img(k)}<figcaption>{H.escape(t)}</figcaption></figure>' for k, t in SLIDES) + "".join(f'<figure>{img(k)}<figcaption>{K[k][3]}</figcaption></figure>' for k in ["library", "lab", "cse", "eee", "civil", "business", "law", "health", "islamic", "education", "media", "innovation"]) + "</div>",
 "contact.html": '''<div class="two"><div><h2>Contact Us</h2><p>Rangpur Road, Baghopara, Gokul, Bogura</p><p><a href="tel:+8801713377037">+88 01713 377 037</a><br><a href="tel:+8801713377033">+88 01713 377 033</a></p><p><a href="mailto:info@pundrauniversity.edu.bd">info@pundrauniversity.edu.bd</a><br><a href="mailto:admission@pundrauniversity.edu.bd">admission@pundrauniversity.edu.bd</a></p></div>
<form id="contactForm" novalidate><label>Name<input name="name" required></label><label>Email<input name="email" type="email" required></label><label>Message<textarea name="msg" rows="5" required></textarea></label><button class="btn" type="submit">Send</button><p id="formNote" role="status"></p><p class="src-needed">Frontend validation only. Real delivery needs a backend or an authorized mail service.</p></form></div>''',
}
for i, (d, t) in enumerate(zip(NDATES, NOTICES)):
    C[f"notice/n{i+1}.html"] = (t, f'<p><time>{d}</time> &middot; Notice</p><p class="src-needed"><strong>Document unavailable.</strong> The notice PDF/body was not retrieved, so no file is linked. Add it to <code>assets/documents/</code> and link it here.</p><p><a href="@R@notice.html">&larr; All notices</a></p>')
for s, n, t, k in PROGS: C[f"programs/{s}.html"] = (n, img(k, "wide") + NEED)

# ---------- page shell ----------
def shell(path, title, body, home=False):
    root = "../" * path.count("/")
    ph = '<a href="tel:+8801713377033">+880 1713 377 033</a> &middot; <a href="mailto:admission@pundrauniversity.edu.bd">admission@pundrauniversity.edu.bd</a>'
    ext = " ".join(f'<a href="{u}" target="_blank" rel="noopener">{n} &#8599;</a>' for n, u in [("Students", "https://students.pundrauniversity.ac.bd/"), ("UIMS", "https://uims.pundrauniversity.ac.bd/"), ("Library", "https://library.pundrauniversity.ac.bd/"), ("Journals", "https://journal.pundrauniversity.ac.bd/")]) + f' <a href="{root}iqac.html">IQAC</a>'
    bc = "" if home else f'<nav class="crumbs" aria-label="Breadcrumb"><a href="{root}index.html">Home</a> / <span>{H.escape(title)}</span></nav><h1>{H.escape(title)}</h1>'
    foot = lambda items: "".join(f'<li><a href="@R@{t}">{l}</a></li>' for l, t in items)
    t = f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{H.escape(title)} | Pundra University of Science &amp; Technology</title><link rel="stylesheet" href="@R@css/style.css"></head><body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><span>{ph}</span><span class="ext">{ext}</span></div></div>
<header class="site"><div class="wrap bar"><a class="brand" href="@R@index.html"><span class="mark" aria-hidden="true">PUB</span><span>Pundra University<small>of Science &amp; Technology</small></span></a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav">&#9776;</button>
<nav id="nav" aria-label="Main"><ul class="menu">{menu(NAV,path)}</ul><a class="btn" href="https://uims.pundrauniversity.ac.bd/Student/student_online_admission" target="_blank" rel="noopener">Online Admission &#8599;</a></nav></div></header>
<main id="main" class="{"home" if home else "wrap page"}">{bc}{body}</main>
<footer class="site"><div class="wrap fgrid"><div><h3>About Us</h3><p>The first Private University in North Bengal.</p><p><a href="https://www.facebook.com/pundrauniversitybogura/" target="_blank" rel="noopener">Facebook &#8599;</a> &middot; <a href="https://www.youtube.com/@pundrauniversity" target="_blank" rel="noopener">YouTube &#8599;</a></p></div>
<div><h3>Quick Links</h3><ul>{foot([("Faculty","faculty.html"),("Departments","departments.html"),("Programs","programs.html"),("Semester Result","semester-result.html"),("Result Verification","result-verification.html")])}</ul></div>
<div><h3>More</h3><ul>{foot(FOOT_EXTRA+[("Photo Gallery","photo-gallery.html")])}</ul></div>
<div><h3>Useful Links (external)</h3><ul><li><a href="https://ugc.gov.bd/" target="_blank" rel="noopener">UGC &#8599;</a></li><li><a href="https://moedu.gov.bd/" target="_blank" rel="noopener">Ministry of Education &#8599;</a></li><li><a href="https://banbeis.gov.bd/" target="_blank" rel="noopener">Banbeis &#8599;</a></li></ul></div>
<div><h3>Contact Us</h3><p>+88 01713 377 037<br>+88 01713 377 033<br>info@pundrauniversity.edu.bd<br>Rangpur Road, Baghopara, Gokul, Bogura</p></div></div>
<p class="copy">&copy; 2026 Educational recreation &mdash; not the official website. Pundra University of Science &amp; Technology.</p></footer>
<button id="top" aria-label="Back to top" hidden>&uarr;</button><script src="@R@js/main.js"></script></body></html>'''
    return t.replace("@R@", root)

# ---------- home ----------
def home():
    sl = "".join(f'<figure class="slide{" on" if i==0 else ""}">{img(k,lazy=i>0)}<figcaption>{H.escape(t)}</figcaption></figure>' for i, (k, t) in enumerate(SLIDES))
    tabs = f'<div class="tabs"><div role="tablist"><button role="tab" aria-selected="true" aria-controls="p-ug" id="t-ug">Undergraduate</button><button role="tab" aria-selected="false" aria-controls="p-pg" id="t-pg" tabindex="-1">Postgraduate</button></div><div role="tabpanel" id="p-ug" aria-labelledby="t-ug">{plist("UG")}</div><div role="tabpanel" id="p-pg" aria-labelledby="t-pg" hidden>{plist("PG")}</div></div>'
    nl = "".join(f'<li><time>{d}</time><a href="@R@notice/n{i+1}.html">{H.escape(t[:110])}{"…" if len(t)>110 else ""}</a></li>' for i, (d, t) in enumerate(zip(NDATES, NOTICES)))
    ev = "".join(f'<li class="ev">{img(k)}<div><a href="@R@events.html">{H.escape(t)}</a><time>{d}</time></div></li>' for d, t, k in EVENTS[:4])
    sm = "".join(f'<article class="card">{img("seminar")}<time>{d}</time><h3><a href="@R@seminar.html">{H.escape(t)}</a></h3></article>' for d, t in SEMS[:4])
    return f'''<section class="slider" aria-roledescription="carousel" aria-label="Highlights">{sl}<button class="prev" aria-label="Previous slide">&#10094;</button><button class="next" aria-label="Next slide">&#10095;</button><div class="dots"></div></section>
<section class="wrap sec two"><div><h2>About The University</h2><p>{ABOUT}</p><a class="btn" href="@R@about-the-university.html">Read More</a></div>{img("campus")}</section>
<section class="wrap sec"><h2>All Programs</h2>{tabs}<p><a class="btn" href="@R@programs.html">View All</a></p></section>
<section class="band dark"><div class="wrap two"><div><blockquote>“Try not to become a man of success. Rather become a man of value.”<cite>― Albert Einstein</cite></blockquote><h2>Our Campus Has Best Facilities For Our Students</h2><ol class="fac">{"".join(f"<li>{f}</li>" for f in FAC)}</ol><a class="btn alt" href="@R@facilities.html">Read More</a></div>{img("library")}</div></section>
<section class="wrap sec two"><div><h2>Why Choose Us?</h2><p>Choosing Pundra University of Science and Technology (PUB) might be influenced by several unique factors: a wide range of programs, an industry-aligned curriculum, a strong emphasis on research and innovation, and highly qualified faculty.</p><a class="btn" href="@R@why-choose-us.html">Read More</a></div>{img("lab")}</section>
<section class="band accent"><div class="wrap callbar"><span>For Admission</span><a href="tel:+8801713377033">+88 01713 377 033</a></div></section>
<section class="wrap sec two"><div><h2>Notices</h2><ul class="rows">{nl}</ul><a class="btn" href="@R@notice.html">View All</a></div><div><h2>Events</h2><ul class="evs">{ev}</ul><a class="btn" href="@R@events.html">View All</a></div></section>
<section class="wrap sec"><h2>Seminar &amp; Workshops</h2><div class="grid">{sm}</div><p><a class="btn" href="@R@seminar.html">View All</a></p></section>
<section class="band dark"><div class="wrap stats"><h2>Research &amp; Publications</h2><div><b>250+</b>Journal Papers</div><div><b>100+</b>Conference Papers</div><div><b>2 Core+</b>Research Budget (BDT)</div></div></section>
<section class="wrap sec"><h2>Our Proud Alumni</h2><p><a href="@R@alumni.html">Alumni</a> &middot; <a href="@R@clubs.html">Clubs</a></p><h2>Memberships &amp; Partners</h2><p class="src-needed">Partner logos required from the university (not retrieved).</p></section>'''

w("index.html", shell("index.html", "Home", home(), True))
seen = set(["index.html"])
for t, l in list(LABELS.items()) + [("faculty.html", "Faculty"), ("departments.html", "Departments")]:
    if t in seen: continue
    seen.add(t)
    v = C.get(t)
    ttl, body = (v if isinstance(v, tuple) else (l, v if v else NEED))
    w(t, shell(t, ttl, body))
for t, v in C.items():
    if t not in seen and isinstance(v, tuple): w(t, shell(t, v[0], v[1])); seen.add(t)
w("departments.html", shell("departments.html", "Departments", NEED)); w("faculty.html", shell("faculty.html", "Faculty", NEED))
w("README.md", "# Pundra University recreation\nOpen the folder in VS Code → right-click index.html → Open with Live Server.\n- Text: edit each page's <main>, or the lists in build.py then re-run `python3 build.py`.\n- Colors/fonts: css/style.css (:root variables; approximated, not extracted from the original).\n- Photos: images in assets/images are SVG placeholders. Replace by saving a real photo with the same name (e.g. campus.jpg) and update the src, or edit the K map in build.py.\n- Navigation: NAV list in build.py.\n")
shutil.copy(__file__, OUT + "/build.py")
