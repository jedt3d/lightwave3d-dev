(()=>{"use strict";
const W=window.WB,$=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const get=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let done=new Set(get("lw.done",[]).filter(x=>W.lessons[x])),theme=get("lw.theme","dark");const id=i=>String(i+1).padStart(2,"0");
function setTheme(t){theme=t==="light"?"light":"dark";document.documentElement.dataset.theme=theme;put("lw.theme",theme);document.querySelectorAll("[data-theme-choice]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.themeChoice===theme)))}
document.querySelectorAll("[data-theme-choice]").forEach(b=>b.addEventListener("click",()=>setTheme(b.dataset.themeChoice)));setTheme(theme);
const source=(i,detail=false)=>{const [n,u,d]=W.sources[i];return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(n)+'</a>'+(detail?'<small>'+esc(d)+'</small>':'')+'</li>'};
function nav(){const filter=$("search").value.trim().toLowerCase();let out="";W.phases.forEach((p,g)=>{let rows="";for(let i=g*4;i<g*4+4;i++){const n=id(i),[t,w]=W.modules[i];if(filter&&!((n+" "+t+" "+w).toLowerCase().includes(filter)))continue;rows+='<a class="module-link" href="#module-'+n+'" '+(location.hash==="#module-"+n?'aria-current="page"':'')+'><span class="index">'+n+'</span><span>'+esc(t)+'</span><span class="mark '+(W.lessons[n]?'ready':'')+'" title="'+(done.has(n)?'Completed':W.lessons[n]?'Lesson':'Outline')+'">'+(done.has(n)?"✓":W.lessons[n]?"●":"·")+'</span></a>'}if(rows)out+='<div class="phase-title" data-group="'+g+'">'+esc(p)+'</div>'+rows});$("modules").innerHTML=out||'<div class="inspector-body">ไม่พบ Module</div>';$("nav-count").textContent=done.size+" / 16";$("nav-progress").value=done.size}
$("search").addEventListener("input",nav);
const panel=(t,h)=>'<div class="panel-title">'+esc(t)+'</div><div class="inspector-body">'+h+'</div>';
function inspect(t,body,refs=[]){$("inspector").innerHTML=panel("LESSON INSPECTOR","<p><strong>"+esc(t)+"</strong></p>"+body)+panel("REFERENCES",'<ul class="source-list">'+refs.map(i=>source(i)).join("")+'</ul>')+panel("COMPATIBILITY",'<p class="warning">Legacy LScript API</p><p>LW 2026: ยังไม่ได้ทดสอบ</p>')+panel("DESIGN",'<a href="https://www.figma.com/design/aWIfnz3rPNlThRlrSPlhgM">Figma · Design System</a>');}
const crumb=t=>'<div class="breadcrumb">'+esc(t)+'</div>';
function reviewCatalog() {
  return '<section aria-labelledby="review-courses"><h2 id="review-courses">LScript Courses</h2>'
    + '<p>เริ่มจาก Modeler แล้วเลือกเรียน UI, Layout, Animation, Materials หรือ Nodes ทีละหัวข้อ</p>'
    + '<ol class="source-list">' + W.reviews.map(({ id, title, summary }) =>
      '<li><a href="#' + esc(id) + '">' + esc(title) + '</a><small>' + esc(summary) + '</small></li>').join('')
    + '</ol></section>';
}

function reviewCourse(course) {
  const index = W.reviews.indexOf(course);
  const previous = W.reviews[index - 1];
  const next = W.reviews[index + 1];
  inspect(course.title, '<p>LightWave 3D 2024.1.0</p><p>สำรวจ Source และเอกสารจากชุดติดตั้ง</p>', course.refs);
  const link = (item) => '<a class="button" href="#' + esc(item.id) + '">' + esc(item.title) + '</a>';
  return crumb('COURSE / LSCRIPT / ' + (index + 1) + ' OF ' + W.reviews.length)
    + '<h1>' + esc(course.title) + '</h1><p class="lede">' + esc(course.summary) + '</p>'
    + '<details class="review-source"><summary>เปิด Source บนเครื่อง</summary><p>เปิดโฟลเดอร์ <code>/Applications/LightWaveDigital/LightWave3D_2024.1.0</code> แล้วไปตาม Relative Path และเลขบรรทัดที่ระบุไว้ บทเรียนอ้างจากการอ่านไฟล์ในชุดติดตั้ง ส่วนผล Workshop เป็นผลคาดหมายสำหรับทดลองใน Host</p></details>'
    + '<article class="review-course">' + course.body + '</article>'
    + '<nav class="lesson-actions" aria-label="LScript courses"><a class="button" href="#course">ทุกคอร์ส</a>'
    + (previous ? link(previous) : '') + (next ? link(next) : '') + '</nav>';
}

function overview(){inspect("Course v0.1",`<p>${Object.keys(W.lessons).length} Modules · 4 Phases</p><p>${W.reviews.length} Course Reviews</p><p>LScript first → Python later</p>`,[0,2,3,4]);return crumb("COURSE / OVERVIEW")+'<h1>3D Computer Graphics</h1><p class="subtitle lede">LightWave LScript &amp; Plugin Development</p><p>เรียนรู้หลักการ 3D Mathematics และ Graphics Algorithms ผ่านการสร้างเครื่องมือจริงใน LightWave แล้วศึกษา Source Code ของปลั๊กอินที่มีอยู่ก่อนปรับปรุงและย้ายไป Python 3.</p><div class="note"><strong>Learning path:</strong> LScript Foundation → Legacy Plugin Study → Modify &amp; Extend → Python Migration<br>เริ่มด้วย Module 01–04 จากนั้นฝึก Geometry, Modeling และ Scene ตามลำดับ ทุก Module มีตัวอย่างและ Workshop</div>'+W.phases.map((p,g)=>'<section class="section"><div class="panel-title phase-title" data-group="'+g+'">'+esc(p)+'</div><div class="phase-row">'+W.modules.slice(g*4,g*4+4).map(([t],j)=>'<a href="#module-'+id(g*4+j)+'">'+id(g*4+j)+' '+esc(t)+'</a>').join("")+'</div></section>').join("")+'<div class="lesson-actions"><a class="button active" href="#module-01">เริ่ม Module 01</a><a class="button" href="#cases">เปิด Code Reading</a></div>'}
function lesson(n){let i=Number(n)-1,[title,workshop]=W.modules[i],l=W.lessons[n];inspect("MODULE "+n,"<p>"+esc(l?"Lesson":"Outline")+"</p><p>Workshop: "+esc(workshop)+"</p>"+(l?"<p><strong>Learning objectives</strong></p><ul>"+l.objectives.map(o=>"<li>"+esc(o)+"</li>").join("")+"</ul>":""),l?l.refs:[0,4]);let out=crumb("COURSE / "+W.phases[Math.floor(i/4)]+" / MODULE "+n)+"<h1>"+esc(title)+"</h1><p class='subtitle lede'>"+esc(l?l.subtitle:workshop)+"</p>";if(l){out+='<div class="tag">WORKSHOP · HOST TEST PENDING</div>'+l.body+'<h2>Reading &amp; References</h2><ul class="source-list">'+l.refs.map(x=>source(x,true)).join("")+"</ul>"}else{out+='<div class="note warning">Outline เท่านั้น — ยังไม่ได้เขียนบทเรียนและทดสอบ Workshop.</div><h2>Workshop target</h2><p>'+esc(workshop)+'</p><p>อ่านหัวข้อจาก Source Library และกลับมาศึกษาเมื่อ Lesson พร้อม.</p>'}out+='<div class="lesson-actions">'+(i>0?'<a class="button" href="#module-'+id(i-1)+'">← Previous</a>':'<a class="button" href="#course">← Course</a>')+(l?'<button id="complete" aria-pressed="'+done.has(n)+'">'+(done.has(n)?"✓ บันทึกว่าเรียนแล้ว":"บันทึกว่าเรียนแล้ว")+'</button>':"")+(i<15?'<a class="button active" href="#module-'+id(i+1)+'">Next →</a>':'<a class="button active" href="#progress">Progress →</a>')+'</div>';return out}
function lab() {
  inspect('VECTOR LAB', '<p>Displacement, Dot Product และ Cross Product</p><p>คำนวณในเบราว์เซอร์จากพิกัดที่กรอก</p>', [1, 2]);
  return crumb('GRAPHICS LAB / VECTOR') + '<h1>Vector Lab</h1>'
    + '<p>ปรับเวกเตอร์ A และ B แล้วเทียบมุมมอง 3D, XY และ XZ กับผลคำนวณ</p>'
    + '<div data-three-lab="vector"></div><p><a href="#module-03">กลับไป Vector Mathematics</a></p>';
}

let disposeLab;
function mountInteractiveLab() {
  disposeLab?.();
  disposeLab = undefined;
  const view = $('view');
  let host = view.querySelector('[data-three-lab]');
  const route = location.hash.slice(1);
  if (!host && (/^module-(0[1-9]|1[0-6])$/.test(route) || W.reviews.some((item) => item.id === route))) {
    host = document.createElement('div');
    host.dataset.threeLab = route.startsWith('module-') ? route.slice(7) : route;
    const heading = view.querySelector('h1');
    (heading.nextElementSibling ?? heading).after(host);
  }
  if (!host) return;
  import('./interactive-labs.js').then(({ mountLab }) => {
    if (host.isConnected) disposeLab = mountLab(host);
  }).catch(() => {
    if (host.isConnected) host.textContent = 'โหลด Interactive Lab ไม่สำเร็จ';
  });
}

function cases(){inspect("LEGACY SOURCE STUDY","<p>Case 01: SelPoints.ls</p><p>Read → Trace → Test → Modify</p><p>License: BSD-3-Clause repository</p>",[4,7,8,9]);return crumb("SOURCE LIBRARY / CODE READING")+"<h1>เรียนจาก Plugin ที่มีอยู่จริง</h1><p>ใช้ Source Code เป็นกรณีศึกษา ไม่ Copy Code โดยไม่เข้าใจ และตรวจ License ก่อนนำไปดัดแปลงหรือเผยแพร่.</p><h2>Case 01 — SelPoints.ls</h2><p>ผู้พัฒนา Neill3d สร้างเครื่องมือเปลี่ยน Polygon Selection ให้เป็น Point Selection. <a href='https://github.com/Neill3d/Lightwave/blob/master/Scripts/SelPoints.ls'>เปิด Source Code ต้นฉบับ</a>.</p><div class='section'><div class='panel-title'>ALGORITHM TRACE</div><div class='section-body'><ol><li>ตั้ง Selection Mode ด้วย selmode(DIRECT).</li><li>เริ่ม Mesh Data Edit ด้วย editbegin() และอ่าน Polygon Count.</li><li>วน Polygon ที่เลือก อ่านข้อมูล Point จาก polyinfo().</li><li>รวมข้อมูลไว้ใน Array และจบ Edit ด้วย editend().</li><li>ล้าง Point Selection แล้วเลือก Point IDs ที่รวบรวมไว้.</li></ol></div></div><h2>สิ่งที่ต้องตรวจจาก Source Code</h2><ul><li>polyinfo() คืนค่าอะไรบ้าง? ตรวจรูปแบบข้อมูลก่อนถือว่าทุก entry เป็น Point ID.</li><li>หาก Polygons ใช้ Point ร่วมกัน มี Duplicate หรือไม่? ส่วน loop สำหรับตรวจ Duplicate ใน Source อยู่ใน Comment.</li><li>monstep() รองรับ Cancel แต่ Script จบ Transaction และ Selection อย่างไรเมื่อ Cancel กลางทาง?</li><li>ไม่มี Selection จะเกิดอะไร? แยก empty selection จาก selection ทั้ง Mesh.</li></ul><h2>Lab: Trace ด้วยมือ</h2><p>สมมติ Polygon P1=[A,B,C], P2=[B,C,D]. ผล unique Point IDs ที่ต้องการคือ A,B,C,D. ออกแบบ Pseudocode โดยใช้ Set หรือวิธีที่ LScript รองรับ และรักษา Selection เดิมเมื่อ Cancel. นี่เป็นโจทย์ของเรา ไม่ใช่การยืนยันว่าโค้ดเดิมทำ Deduplicate สำเร็จ.</p><details><summary>แนวทางแก้โจทย์</summary><p>รวบรวม Point IDs ตาม API Contract ที่ตรวจแล้ว ตรวจ Duplicate ก่อนเพิ่ม ปิด Edit Transaction ทุก path และเปลี่ยน Selection เฉพาะเมื่อทำงานสำเร็จครบ. ทดสอบ 0, 1 และหลาย Polygons.</p></details><h2>Next case studies</h2><div class='table-scroll'><table><tr><th>Script</th><th>Concept</th><th>Status</th></tr><tr><td><a href='https://github.com/Neill3d/Lightwave/blob/master/Scripts/Angle.ls'>Angle.ls</a></td><td>Polygon angle / Normal</td><td>Planned</td></tr><tr><td><a href='https://github.com/Neill3d/Lightwave/blob/master/Scripts/Planar2.ls'>Planar2.ls</a></td><td>Plane fitting / Projection</td><td>Planned</td></tr><tr><td><a href='https://tlhea.org/lw_scripts.html'>Circle Points / Honeycomb</a></td><td>Polar coordinates / procedural patterns</td><td>Planned</td></tr></table></div><p class='muted'>Source License: Neill3d repository lists BSD-3-Clause; preserve notices when adapting. Kryslin downloads require individual license verification. Compatibility LW 2026 ยังไม่ทดสอบ.</p>"}
function references(){inspect("SOURCE LIBRARY","<p>Free-to-read resources and legacy references</p><p>Link, not redistribute.</p>",[0,3,4,10]);return crumb("SOURCE LIBRARY / INDEX")+"<h1>Reference Library</h1><p>แหล่งอ่านฟรีสำหรับ Computer Graphics และ Legacy API. การอ่านฟรีไม่เท่ากับสิทธิ์นำเนื้อหาหรือ Source Code ไปเผยแพร่ซ้ำ.</p><ul class='source-list'>"+W.sources.map((_,i)=>source(i,true)).join("")+"</ul>"}
function progress(){inspect("PROGRESS","<p>บันทึกใน Browser นี้เท่านั้น</p><p>Completion เป็น Self-report ไม่ใช่ผลการสอบหรือการทดสอบ Runtime.</p>");return crumb("COURSE / PROGRESS")+"<h1>Learning Progress</h1><p>บทเรียนที่บันทึกแล้ว "+done.size+" / "+Object.keys(W.lessons).length+" Modules</p><div class='progress-line'><progress max='16' value='"+done.size+"'></progress><span>"+done.size+" / 16</span></div><div class='checklist'>"+W.modules.map(([t],i)=>{const n=id(i);return "<label><input type='checkbox' data-done='"+n+"' "+(done.has(n)?"checked ":"")+(W.lessons[n]?"":"disabled")+" />"+n+" · <a href='#module-"+n+"'>"+esc(t)+"</a>"+(W.lessons[n]?"":" <small class='muted'>(Outline)</small>")+"</label>"}).join("")+"</div>"}
let renderedRoute=null;
function animateRoute(route){if(renderedRoute===null){renderedRoute=route;return;}if(renderedRoute===route)return;renderedRoute=route;for(const el of [$('view'),$('inspector')]){el.classList.remove('route-enter');void el.offsetWidth;el.classList.add('route-enter');}}
function render(){let route=location.hash.slice(1)||"course";if(route==="main")return;const review=W.reviews.find(course=>course.id===route);const match=route.match(/^module-(0[1-9]|1[0-6])$/);let html=review?reviewCourse(review):match?lesson(match[1]):({course:overview,lab,cases,references,progress}[route]||overview)();$("view").innerHTML=html;if(route==="course"||route==="cases")$("view").insertAdjacentHTML(route==="course"?"beforeend":"afterbegin",reviewCatalog());if(route==="module-04")$("view").insertAdjacentHTML("beforeend",'<p><a class="button" href="#review-ui">เรียนต่อ LScript UI &amp; Action Events</a></p>');W.mountRequesterLab();for(const code of $("view").querySelectorAll("pre code.language-lscript")){code.innerHTML=window.highlightLScript(code.textContent,"lscript")}animateRoute(route);$("status").textContent="READY / "+route.toUpperCase();document.querySelectorAll(".toolbar .tab").forEach(a=>{let active=a.hash==="#"+route||(review&&a.hash==="#course")||(match&&a.hash===(Number(match[1])<=12?"#module-01":"#module-13"));if(active)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});nav();mountInteractiveLab();const b=$("complete");if(b&&match)b.addEventListener("click",()=>{const n=match[1];done.has(n)?done.delete(n):done.add(n);put("lw.done",[...done]);render()});document.querySelectorAll("[data-done]").forEach(x=>x.addEventListener("change",()=>{x.checked?done.add(x.dataset.done):done.delete(x.dataset.done);put("lw.done",[...done]);render()}));document.title=(review?review.title:match?W.modules[Number(match[1])-1][0]:"LightWave Developer Workbench")+" · Workbench"}
window.addEventListener("hashchange",()=>{render();if(location.hash!=="#main")$("main").focus({preventScroll:true})});render();
requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add("motion-ready")));
})();