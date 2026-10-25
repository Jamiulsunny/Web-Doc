(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const burger=$(".burger"),nav=$("#nav");
burger.addEventListener("click",()=>{const o=nav.classList.toggle("open");burger.setAttribute("aria-expanded",o)});
const closeAll=e=>$$(".has-sub.open").forEach(l=>{if(!e||!l.contains(e))l.classList.remove("open"),$("button",l).setAttribute("aria-expanded","false")});
$$(".has-sub>button").forEach(b=>{const li=b.parentElement;
 b.addEventListener("click",()=>{const o=!li.classList.contains("open");$$(":scope>.sub>.has-sub.open",li.parentElement).forEach(x=>x!==li&&x.classList.remove("open"));li.classList.toggle("open",o);b.setAttribute("aria-expanded",o)});
 li.addEventListener("mouseenter",()=>matchMedia("(min-width:1025px)").matches&&b.setAttribute("aria-expanded","true"));
 li.addEventListener("mouseleave",()=>matchMedia("(min-width:1025px)").matches&&b.setAttribute("aria-expanded","false"));
 li.addEventListener("keydown",e=>{if(e.key==="Escape"){li.classList.remove("open");b.setAttribute("aria-expanded","false");b.focus()}})});
document.addEventListener("click",e=>closeAll(e.target));
// slider
const sl=$(".slider");if(sl){const s=$$(".slide",sl),d=$(".dots",sl);let i=0,t;
 s.forEach((_,k)=>{const b=document.createElement("button");b.setAttribute("aria-label","Slide "+(k+1));b.onclick=()=>go(k);d.append(b)});
 const go=k=>{i=(k+s.length)%s.length;s.forEach((x,n)=>x.classList.toggle("on",n===i));$$("button",d).forEach((b,n)=>b.toggleAttribute("aria-current",n===i)&&b.setAttribute("aria-current",n===i))};
 $(".prev",sl).onclick=()=>go(i-1);$(".next",sl).onclick=()=>go(i+1);go(0);
 if(!matchMedia("(prefers-reduced-motion:reduce)").matches){t=setInterval(()=>go(i+1),5000);sl.addEventListener("mouseenter",()=>clearInterval(t))}}
// tabs
$$(".tabs").forEach(tb=>{const tabs=$$("[role=tab]",tb);tabs.forEach(t=>t.addEventListener("click",()=>tabs.forEach(x=>{const on=x===t;x.setAttribute("aria-selected",on);x.tabIndex=on?0:-1;$("#"+x.getAttribute("aria-controls")).hidden=!on})))});
// form
const f=$("#contactForm");if(f)f.addEventListener("submit",e=>{e.preventDefault();let ok=true;$$("[required]",f).forEach(x=>{const bad=!x.value.trim()||(x.type==="email"&&!/^\S+@\S+\.\S+$/.test(x.value));x.classList.toggle("err",bad);if(bad)ok=false});
 $("#formNote").textContent=ok?"Form is valid, but this demo has no backend, so nothing was sent.":"Please fill in all fields correctly."});
// back to top
const top=$("#top");addEventListener("scroll",()=>top.hidden=scrollY<400);top.onclick=()=>scrollTo({top:0});})();
