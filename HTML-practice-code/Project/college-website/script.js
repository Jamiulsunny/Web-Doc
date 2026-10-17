/* ===== মোবাইল মেনু ===== */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

/* ===== গ্রেড ক্যালকুলেটর =====
   গ্রেডিং নিয়ম তোমার আসল কোড থেকে হুবহু নেওয়া হয়েছে */
function getGrade(m) {
  if (m >= 80) return { g: "A+", pass: true,  msg: "চমৎকার!" };
  if (m >= 70) return { g: "A",  pass: true,  msg: "খুব ভালো!" };
  if (m >= 60) return { g: "B",  pass: true,  msg: "ভালো!" };
  if (m >= 50) return { g: "C",  pass: true,  msg: "আরো effort লাগবে" };
  if (m >= 33) return { g: "D",  pass: true,  msg: "কোনোরকম pass!" };
  return { g: "F", pass: false, msg: "Fail - আবার চেষ্টা করো।" };
}

// মার্ক ঠিক আছে কিনা (খালি, লেখা, নেগেটিভ, ১০০-এর বেশি বাদ)
function parseMark(text) {
  if (text.trim() === "") return NaN;
  const m = Number(text);
  return (Number.isNaN(m) || m < 0 || m > 100) ? NaN : m;
}

const rowsEl = document.getElementById("rows");
const out = document.getElementById("out");
const btn = document.getElementById("btn");
let count = 0;

function addRow() {
  count++;
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML =
    `<div><label for="s${count}">বিষয়ের নাম</label><input id="s${count}" type="text" placeholder="যেমন: গণিত"></div>
     <div><label for="m${count}">নম্বর (০–১০০)</label><input id="m${count}" class="mark" type="number" min="0" max="100" step="any" inputmode="decimal"></div>
     <button type="button" class="rm" aria-label="এই বিষয় মুছুন">✕</button>`;
  row.querySelector(".rm").addEventListener("click", () => {
    if (rowsEl.children.length > 1) row.remove();
  });
  row.addEventListener("keydown", e => { if (e.key === "Enter") btn.click(); });
  rowsEl.appendChild(row);
}

function showResult(cls, html) {
  out.className = "result " + cls;
  out.innerHTML = html;
}

btn.addEventListener("click", () => {
  const rows = [...rowsEl.querySelectorAll(".row")];
  const data = [];
  let invalid = false;
  rows.forEach((row, i) => {
    const markInput = row.querySelector(".mark");
    const name = row.querySelector("input[type=text]").value.trim() || `বিষয় ${i + 1}`;
    const m = parseMark(markInput.value);
    markInput.classList.toggle("bad", Number.isNaN(m));
    if (Number.isNaN(m)) invalid = true; else data.push({ name, m });
  });
  if (invalid) {
    showResult("fail", "প্রতিটি ঘরে ০-১০০ এর মধ্যে সঠিক নম্বর দাও।");
    return;
  }
  // সব বিষয়ের মান ১০০ ধরে সাধারণ গড় (simple average)
  const avg = data.reduce((s, d) => s + d.m, 0) / data.length;
  const items = data.map(d => {
    const r = getGrade(d.m);
    return `<li>${d.name}: ${d.m} → ${r.g} (${r.msg})</li>`;
  }).join("");
  const anyFail = data.some(d => !getGrade(d.m).pass);
  const total = getGrade(avg);
  showResult(anyFail ? "fail" : "pass",
    `গড় নম্বর: ${avg.toFixed(2)}% — Grade: ${total.g} — ${total.msg}` +
    (anyFail ? "<br>কমপক্ষে একটি বিষয়ে ফেল আছে।" : "") + `<ul>${items}</ul>`);
});

document.getElementById("addBtn").addEventListener("click", addRow);
document.getElementById("resetBtn").addEventListener("click", () => {
  rowsEl.innerHTML = ""; count = 0; addRow();
  out.className = "result"; out.textContent = "";
});

addRow();
