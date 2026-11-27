/* Curated, original teaching content. Legacy code examples are untested on LW 2026. */
window.WB={
phases:["I  FOUNDATION","II  COMPUTATIONAL GEOMETRY","III  MODELING TOOLS","IV  SCENE & MOTION"],
modules:[
["Architecture & LScript Runtime","Hello Modeler / Runtime report"],
["3D Space & Mesh Data","Coordinate Inspector"],
["Vector Mathematics","Distance & Angle Inspector"],
["Requester UI & Interface Designer","Native Distance Inspector"],
["Transformations & Matrices","Custom Pivot"],
["Computational Geometry","Planar2 study"],
["Procedural Geometry Generation","Circle Points / Honeycomb"],
["Modeling Commands & Macro Automation","Linear / Radial Array"],
["Mesh Topology & Data Structures","Mesh Doctor / Weld Pairs"],
["Curves, Splines & Surfaces","Smooth Spline"],
["UV, Normals & Vertex Maps","Planar UV Mapper"],
["Deformation & Spatial Algorithms","Falloff Tool"],
["Scene Graph, Camera & Rendering","Layout Utilities"],
["Animation Mathematics & Envelopes","Animation Offset"],
["Procedural Geometry & Motion Graphics","Mini Cloner (baked)"],
["Plugin Engineering & Python Migration","Port a legacy tool"]
],
sources:[
["3D Math Primer for Graphics and Game Development","https://gamemath.com/book/","Free online book · Cartesian Space, Vectors, Matrices, Geometry, Curves. อ่านตาม Chapter ที่กำหนด ไม่จำเป็นต้องอ่านทั้งเล่ม"],
["3D Math Primer — Chapter 2: Vectors","https://gamemath.com/book/vectors.html","§2.4 Points vs Vectors; §2.7–2.12 operations, distance, dot/cross product"],
["Scratchapixel","https://scratchapixel.com/","Free online lessons · Geometry, matrices, Bézier, camera, rendering"],
["LScript 2.0 Manual (D-Storm archive)","https://www.dstorm.co.jp/archives/developer/lscript/LScript2Manual.pdf","Historical PDF reference; ไม่ใช่เอกสาร LW 2026"],
["Mike Green — Modeler Commands","https://mikegreen.name/Lscript/Source/Modeler_Commands.htm","Legacy API: Command Sequence vs Mesh Data Edit, selection, geometry"],
["Mike Green — Interface Commands","https://mikegreen.name/Lscript/Source/Interface_Commands.htm","Legacy API: messages, Requester lifecycle, progress monitor, callbacks"],
["Mike Green — Control Commands","https://mikegreen.name/Lscript/Source/Control_Commands.htm","Legacy UI controls: ctlvector, ctlnumber, ctlchoice, ctldistance"],
["Neill3d / Lightwave","https://github.com/Neill3d/Lightwave","BSD-3-Clause repository; read source before adapting, preserve license notices"],
["SelPoints.ls","https://github.com/Neill3d/Lightwave/blob/master/Scripts/SelPoints.ls","Polygon-to-point selection case study"],
["Kryslin’s Scripts","https://tlhea.org/lw_scripts.html","Legacy Modeler tools and Python versions. Author reports LW2018 compatibility; not proof of LW2026. Verify license before adaptation."],
["LightWave 2026 Official Help","https://docs.lightwave3d.com/2026/index_topic.html","Official current target; access failed HTTP 502 during research. Retry and verify actual build."],
["Clinton’s LightWave Python Scripts","https://www.clintons3d.com/plugins/lightwave/index.html","Later Python migration reference; historical examples"]
],
lessons:{
"01":{subtitle:"เตรียม Development Environment และรัน LScript ตัวแรก",objectives:["แยก Modeler ออกจาก Layout","เข้าใจ script header และ entry point","เก็บหลักฐาน Runtime Compatibility"],refs:[3,4,5,10],body:`<h2>1. Host Application และ Script Type</h2><p>Modeler เป็นพื้นที่แก้ไข Geometry เช่น Point, Edge, Polygon และ Layer ส่วน Layout ใช้จัดการ Object Instance, Camera, Light, Animation และ Scene. Script ต้องเลือก Host และประเภท Plugin ให้ถูกต้อง เพราะ API ไม่ได้ใช้แทนกันได้ทุกคำสั่ง ลองถามก่อนเขียนว่าเครื่องมือต้องแก้ Mesh หรือจัดการ Scene ถ้าโจทย์คือย้าย Vertex ให้เริ่มที่ Modeler ถ้าโจทย์คือเลื่อน Keyframe ให้เริ่มที่ Layout</p><div class="note">LScript ถูกประกาศ Deprecated ในยุค LightWave 2020. เราใช้เพื่อเรียนจาก Legacy Code ไม่ถือว่าเป็น API ที่รองรับครบใน 2026</div><h2>2. Hello Modeler</h2><p>ตัวอย่าง Original Script ไม่แก้ไข Geometry ใช้ทดสอบว่า Runtime เรียก Entry Point และเปิด Message Box ได้หรือไม่</p><div class="code-wrap"><div class="code-bar"><span>hello_modeler.ls · LScript</span><a href="./examples/hello_modeler.ls" download>Download</a></div><pre><code class="language-lscript">@version 2.2
@warnings
@script modeler

main
{
    info("LightWave Workbench: Hello!");
}</code></pre></div><p><code>@script modeler</code> ระบุ Script Type; <code>main</code> เป็น Entry Point ของ Modeler Script; <code>info()</code> แสดงข้อความ. Directive ระบุเวอร์ชันของภาษา LScript ให้บันทึกหมายเลข LightWave ที่ติดตั้งแยกต่างหากใน Runtime Report</p><h2>3. Hands-on Lab</h2><ol><li>เปิด Modeler ด้วยฉากทดสอบที่ไม่สำคัญ จด LightWave version/build และ OS.</li><li>บันทึกไฟล์ .ls เป็น Plain Text; ทดลองเรียกผ่าน LScript/Run Script หรือ Add Plugin ตามเมนูที่มีอยู่ใน build ของคุณ.</li><li>จดว่าเห็น Message Box หรือ Error. หากไม่มีเมนูหรือ Runtime ให้บันทึกเป็น Unsupported/Unverified ไม่เดาว่าสคริปต์เสีย.</li><li>สำรวจ LScript Interface Designer แยกต่างหากและจดว่ามี executable หรือเมนูจริงหรือไม่.</li></ol><h2>4. Review</h2><details><summary>ทำไมเราเริ่มด้วย Script ที่ไม่สร้าง Mesh?</summary><p>เพื่อแยก Runtime และ Installation Problem ออกจาก Geometry Algorithm และลดความเสี่ยงต่อ Object ต้นฉบับ</p></details><p>อ่านเพิ่มเติม: LScript Manual และ Mike Green — Interface Commands (Messages). บันทึกผลด้วยไฟล์ <a href="./examples/runtime-checklist.txt" download>Runtime Checklist</a>.</p>`},
"02":{subtitle:"จาก Point สู่ Polygon Mesh และ Coordinate Space",objectives:["อธิบาย Point, Vector, Edge, Polygon","เข้าใจ ID และ Index ต่างกันอย่างไร","แยก Modeler selection จาก Geometry"],refs:[0,4,7,8],body:`<h2>1. Geometry คือข้อมูล</h2><p>Point เป็นตำแหน่งใน Coordinate Space (x, y, z). Polygon อ้างถึง Point IDs ตามลำดับ; ลำดับนี้เกี่ยวข้องกับ Winding และ Normal. Edge คือความสัมพันธ์ระหว่าง Point สองตัว ไม่จำเป็นต้องจัดเก็บเป็น Entity แยกในทุก API.</p><div class="table-scroll"><table><thead><tr><th>Point ID (สมมติ)</th><th>Position</th><th>Polygon</th></tr></thead><tbody><tr><td>A</td><td>(0, 0, 0)</td><td rowspan="3">Triangle: [A, B, C]</td></tr><tr><td>B</td><td>(2, 0, 0)</td></tr><tr><td>C</td><td>(0, 1, 0)</td></tr></tbody></table></div><h2>2. Selection และ Layer</h2><p>เครื่องมือควรทราบว่ากำลังทำงานกับ Point Selection หรือ Polygon Selection, Foreground Layer ใด และมี Selection ว่างหรือไม่ ตัวอย่าง <code>points[1]</code> หมายถึงสมาชิกตัวแรกในรายการ ค่าที่อ่านได้อาจเป็น ID อื่น เช่น Point ID 42 ให้ส่งค่า 42 ต่อเมื่อ API ขอ Point ID</p><h2>3. Command Sequence vs Mesh Data Edit</h2><p>Command Sequence เหมาะกับคำสั่ง Modeling ที่ host มีให้ ส่วน Mesh Data Edit เหมาะกับการอ่าน/แก้ข้อมูล Point และ Polygon ภายในช่วง Edit Transaction. ตรวจข้อกำหนดของแต่ละคำสั่งก่อนเรียก; ออกจาก Edit Mode ก่อนคำสั่งที่ไม่รองรับ.</p><h2>4. Hands-on</h2><ol><li>สร้าง Triangle หรือ Quad ใน Modeler ด้วย UI.</li><li>สลับ Point / Polygon selection และสังเกตจำนวนที่เลือก.</li><li>วาดตาราง Point → Position และ Polygon → ordered IDs จากตัวอย่างสมมติ.</li><li>อ่าน SelPoints.ls แล้วหาว่าตรงไหนเริ่ม/จบ Edit Transaction.</li></ol><details><summary>Exercise: สอง Triangle ใช้ Edge ร่วมกัน จะมี Point กี่ตัว?</summary><p>ถ้า share Point IDs ทั้งสองปลายของ Edge และอีกสองปลายไม่ซ้ำกัน จะมี 4 unique Points, 2 Polygons. ถ้าแยก IDs แม้ตำแหน่งซ้อนกัน อาจมี 6 Points.</p></details><p>Reading: 3D Math Primer Chapter 1, Chapter 10 §10.4; เปิด <a href="#cases">Code Reading</a> เพื่อดู SelPoints case.</p>`},
"03":{subtitle:"Vector, Magnitude, Dot Product, Cross Product",objectives:["คำนวณ Displacement และ Distance","อธิบาย Dot/Cross Product เชิง Geometry","สร้าง Distance Inspector"],refs:[0,1,2,6,7],body:`<h2>1. Point กับ Vector</h2><p>Point คือ Location; Vector คือ Displacement หรือ Direction ที่อาจมี Magnitude. เมื่อ A=(1,2,0) และ B=(4,6,0), B−A=(3,4,0). Length = √(3²+4²) = 5 ให้เก็บ Displacement (3, 4, 0) เมื่อโจทย์ต้องการทิศทาง และเก็บ Length 5 เมื่อโจทย์ถามระยะ</p><h2>2. Vector Lab</h2><p>ปรับ Vector X/Y/Z เพื่อดู Length และ Unit Vector. ภาพใน Viewport เป็น XY Projection เท่านั้น ส่วนผลคำนวณใช้ทั้งสามแกน.</p><div id="lab-mount"></div><h2>3. Dot Product</h2><p>dot(u,v)=ux·vx+uy·vy+uz·vz. สำหรับ Unit Vectors ผลคือ cos(θ). เมื่อ Vector ไม่เป็นศูนย์ มุม = acos(clamp(dot(u,v)/(|u||v|), −1, 1)). Clamp ช่วยป้องกัน Floating-point Roundoff.</p><h2>4. Cross Product</h2><p>cross(u,v) ให้ Vector ตั้งฉากกับทั้งคู่. สำหรับ Triangle เราใช้ Edge Vectors B−A และ C−A; Normalize เพื่อได้ Unit Normal เมื่อ Triangle ไม่ Degenerate. ตรวจ Winding และ Coordinate Convention ของ LightWave ก่อนนำไปใช้.</p><h2>5. Workshop</h2><p>เขียน Distance Calculator จากสูตรก่อน แล้วนำไปสร้าง Native Requester ใน Module 04. ทดสอบ A=B, (0,0,0) ถึง (3,4,0), และพิกัดติดลบ.</p><details><summary>Exercise: Vector (2,−3,6) มี Magnitude เท่าไร?</summary><p>√(4+9+36)=7. Unit Vector คือ (2/7, −3/7, 6/7).</p></details><p>Reading: <a href="https://gamemath.com/book/vectors.html">3D Math Primer Chapter 2</a>, §2.4 และ §2.7–2.12.</p>`},
"04":{subtitle:"Native Requester, Controls และ Input Validation",objectives:["เข้าใจ Requester Lifecycle","สร้าง Numeric / Vector Controls","แยก UI ออกจาก Geometry Calculation"],refs:[3,5,6,10],body:`<h2>1. Requester Lifecycle</h2><p>สร้าง Dialog ด้วย reqbegin(), เพิ่ม Controls, แสดงผ่าน reqpost(), อ่านค่าด้วย getvalue(), ปิด reqend(), จากนั้นจึงคำนวณ. เมื่อ Cancel ต้องไม่แก้ Geometry. Interface Designer อาจช่วย Generate ส่วน UI แต่ต้องตรวจว่าเครื่องมือยังมีใน build จริง.</p><h2>2. Native Distance Inspector</h2><p>ตัวอย่าง Original LScript ผสม Vector Math กับ Requester. ใช้ Legacy API ที่มีเอกสารรองรับ แต่ยังไม่ได้รันบน LW 2026.</p><div class="code-wrap"><div class="code-bar"><span>distance_inspector.ls · LScript</span><a href="./examples/distance_inspector.ls" download>Download</a></div><pre><code class="language-lscript">@version 2.2
@warnings
@script modeler

main
{
    reqbegin("Distance Inspector");
    a = ctlvector("Point A", &lt;0,0,0&gt;);
    b = ctlvector("Point B", &lt;3,4,0&gt;);
    if (!reqpost())
    {
        reqend();
        return;
    }
    p = getvalue(a);
    q = getvalue(b);
    reqend();

    d = q - p;
    length = sqrt(d.x*d.x + d.y*d.y + d.z*d.z);
    info("Distance: ", length);
}</code></pre></div><h2>3. Test Cases</h2><div class="table-scroll"><table><tr><th>A</th><th>B</th><th>Expected</th></tr><tr><td>(0,0,0)</td><td>(3,4,0)</td><td>5</td></tr><tr><td>(1,2,3)</td><td>(1,2,3)</td><td>0</td></tr><tr><td>(−1,0,0)</td><td>(1,0,0)</td><td>2</td></tr><tr><td colspan="2">Cancel</td><td>No result, no modification</td></tr></table></div><h2>4. Extension</h2><p>เพิ่ม Output ของ Displacement (dx,dy,dz) และแสดง Unit Vector เมื่อ Length มากกว่า Epsilon. ศึกษา ctldistance() สำหรับ input ที่เกี่ยวข้องกับหน่วยวัด และ ctlchoice() สำหรับเลือก Mode.</p><details><summary>ทบทวน · ทำไมตัวอย่างนี้อ่านค่าก่อนปิด Requester?</summary><p>Control Handles ใช้อ่าน Input ขณะที่ Requester ยังเปิดอยู่ ให้คัดลอกค่าออกมาเป็น A และ B ก่อนปิด แล้วส่งสองค่านั้นให้ส่วนคำนวณ ทำให้แยกการทดสอบ UI กับสูตรระยะทางได้</p></details>`}
}
};
