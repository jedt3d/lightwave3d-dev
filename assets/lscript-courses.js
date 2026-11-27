(() => {
  'use strict';

  const sourceRoot = 'support/plugins/scripts/LScript/';
  const model = (file) => sourceRoot + 'model/' + file;
  const layout = (file) => sourceRoot + 'utility/generic/' + file;
  const sdk = 'sdk/lwsdk2024.1.mac/html/classes/nodes.html';

  window.WB.reviews = [
    {
      id: 'review-modeler',
      title: 'Modeler · LScript Code Reading',
      summary: 'สร้าง Primitive, อ่าน Selection และคำนวณ Bounding Box จากสคริปต์ที่มากับ Modeler',
      refs: [3, 4, 5],
      body: `
        <h2>1. สร้าง Primitive ด้วย Command Sequence</h2>
        <p><code>${model('Create_Unit_Box.ls')}:19–30</code> · เริ่มที่ <code>@script modeler</code> และ <code>main</code> แล้วตามไปยัง <code>makebox()</code> ดูว่าพิกัดสองมุมกำหนดทั้งขนาดและตำแหน่งอย่างไร</p>
        <details><summary>แบบฝึกหัด · ทำนายขนาดและตำแหน่ง</summary><p>ถ้ามุมอยู่ที่ (−0.5, −0.5, −0.5) และ (0.5, 0.5, 0.5) ให้ลบพิกัดทีละแกนเพื่อได้ขนาด 1 × 1 × 1 และเฉลี่ยสองมุมเพื่อได้ Center (0, 0, 0)</p></details>
        <h2>2. Selection Mode เปลี่ยนขอบเขตงาน</h2>
        <p><code>${model('Center_X.ls')}:26–49</code> ใช้ <code>selmode(USER)</code> ตรวจ geometry ก่อนคำนวณ Center ของ Bounding Box แล้วเลื่อนเฉพาะ X ส่วน <code>${model('Align_to_Last_Point_X.ls')}:26–58</code> ใช้ <code>DIRECT</code> อ่าน Point IDs ใน Edit Session แล้วปรับ X ให้ตรงจุดอ้างอิง โดยเก็บ Y/Z ของแต่ละจุด</p>
        <p>ลองไล่โค้ดกรณีเลือก 0, 1 และ 2 จุด ใน Align to Last Point X เงื่อนไขปฏิเสธจำนวน 0 แต่ข้อความแจ้งว่าต้องมีอย่างน้อย 2 จุด จำนวน 1 จึงผ่านเงื่อนไขและไม่เข้า Loop นี่คือความต่างระหว่างสิ่งที่ข้อความสัญญากับสิ่งที่โค้ดตรวจ</p>
        <details><summary>แบบฝึกหัด · Bounding Box Center กับการ Align</summary><p>สำหรับจุด X = −2, 1, 7 ค่า Center ของ Bounding Box คือ 2.5 หลัง Center X จะได้ −4.5, −1.5, 4.5 ถ้าเลือก 7 เป็นจุดอ้างอิงของ Align X จุดที่อยู่ในขอบเขตจะได้ X = 7 ทั้งหมด</p></details>
        <h2>3. อ่านพิกัดและตรวจ Cleanup</h2>
        <p><code>${model('Measure_Points.ls')}:38–87, 135–140</code> ตรวจว่ามีอย่างน้อยสองจุด อ่านจุดแรกและสุดท้ายจากลำดับใน <code>points</code> แล้วคำนวณระยะตรงและระยะรายแกน ถ้ามีมากกว่าสองจุด สคริปต์เปลี่ยน Selection ชั่วคราวก่อนเปิด Requester และมีคำสั่งคืน Selection หลังทาง OK</p>
        <details><summary>แบบฝึกหัด · หาเส้นทาง Cancel</summary><p>เมื่อ Cancel โค้ดออกจากฟังก์ชันก่อนถึงคำสั่งคืน Selection ให้บันทึกเป็นข้อสังเกตจาก Source แล้วใช้ Object สำเนาทดสอบแยกว่าหน้าจอจริงคืน Selection อย่างไร</p></details>
        <h2>4. Workshop · Radial Array</h2>
        <p><code>${model('radial_array.ls')}:59–91</code> อ่านค่าจาก Requester แล้วส่ง Count, Center และ Axis เข้าสู่คำสั่ง Rotate/Paste ใน Undo Group ลองคำนวณมุมสำหรับ Count 4 กับ 7 โค้ดแปลงผลหารเป็นจำนวนเต็ม จึงควรสังเกตช่องว่างช่วงปิดวงเมื่อ Count หาร 360 ไม่ลงตัว ทดลองด้วย geometry สำเนาและตรวจจำนวนชิ้นจริงใน Modeler</p><p>เริ่มฝึกจาก Box เดียวใน Foreground Layer แล้วทำซ้ำเมื่อเลือกเพียงบางส่วน จดจำนวนชิ้นก่อนทำ หลังทำ และหลัง Undo หนึ่งครั้ง เปรียบเทียบกับ <a href="#module-08">ตารางมุมและ Selection ใน Module 08</a></p>`,
    },
    {
      id: 'review-ui',
      title: 'LScript UI & Action Events',
      summary: 'ออกแบบ Requester, อ่าน Control Events, คำนวณ Preview และแยก Apply ออกจาก Cancel',
      refs: [3, 5, 6],
      body: `
        <h2>1. Requester Lifecycle</h2>
        <p><code>reqbegin()</code> เปิดช่วงสร้าง UI ฟังก์ชันอย่าง <code>ctlnumber()</code> คืน Control Handle ให้เก็บไว้ใช้กับ <code>getvalue()</code> และ <code>setvalue()</code> จากนั้น <code>reqpost()</code> รอผล OK/Cancel เก็บค่าที่ต้องใช้ก่อน <code>reqend()</code> แล้วค่อยเรียกคำสั่งที่เปลี่ยน Scene หรือ Mesh</p>
        <p>คิดถึงช่อง Factor ที่เพิ่งพิมพ์เป็น 3 ค่า 3 ยังเป็น Draft เมื่อกด Preview โปรแกรมคำนวณให้ดู แต่จะใช้ค่าล่าสุดจริงเมื่อผู้ใช้กด Apply ส่วน Cancel ทิ้งการแก้ครั้งนั้น</p><p><a href="#module-04">ทบทวน Distance Inspector ใน Module 04</a> แล้ววาดลำดับ <code>Control → Callback → Draft → Preview → OK/Cancel</code> แยกค่าใน Control ออกจากผลที่ยืนยันแล้ว</p>
        <h2>2. ผูก Action กับ Callback</h2>
        <div class="table-scroll"><table><thead><tr><th scope="col">Event</th><th scope="col">Binding หรือจุดรับผล</th><th scope="col">หน้าที่</th></tr></thead><tbody>
          <tr><td>ค่า Control เปลี่ยน</td><td><code>ctlrefresh()</code></td><td>อ่าน Input ที่จำเป็น แล้วปรับ Draft หรือ UI ที่ขึ้นกับค่าใหม่</td></tr>
          <tr><td>กดปุ่ม</td><td><code>ctlbutton()</code></td><td>เรียก Callback ของ Action เช่น Preview หรือ Reset</td></tr>
          <tr><td>เปลี่ยนขนาดหน้าต่าง</td><td><code>reqresize()</code></td><td>คำนวณตำแหน่ง Control จากความกว้างและความสูงใหม่</td></tr>
          <tr><td>OK / Cancel</td><td>ผลของ <code>reqpost()</code></td><td>OK ใช้ Input ล่าสุด ส่วน Cancel ทิ้ง Draft หรือย้อน Preview ที่แตะ Mesh</td></tr>
        </tbody></table></div>
        <h2>3. Code Reading · จาก UI ไปถึง Action</h2>
        <ul>
          <li><code>${model('Align_Points_to_Axis.ls')}:105–154, 173–201, 212 เป็นต้นไป</code> · ตาม <code>ctlchoice()</code> ไปยัง Refresh Callback แล้วเทียบกับช่วงอ่านค่าหลัง OK และช่วง <code>pointmove()</code> จดว่าช่วงไหนแตะ UI ช่วงไหนแตะ Mesh</li>
          <li><code>${model('Select_Surfaces.ls')}:83–122, 135–192, 245–294</code> · ตาม Search Event จาก <code>ctlrefresh()</code> ไปสู่ Display List และ <code>requpdate()</code> แยก Count/Name Callback ซึ่งให้ข้อมูลแก่ List Box ออกจาก Search Callback ซึ่งเปลี่ยนข้อมูล แล้วตาม Resize ไปยัง <code>ctlposition()</code></li>
          <li><code>${model('helix.ls')}:132–152, 206–253</code> · ศึกษา Preview ที่สร้าง Curve ใน Scratch Layer และเส้นทาง Cancel ที่สั่ง Undo และคืน Foreground Layer วาด State Diagram แล้วเพิ่มกรณีเปลี่ยนค่าหลายครั้งก่อน Cancel</li>
        </ul>
        <h2>4. Lab · Preview, Apply และ Cancel</h2>
        <p>แบบจำลองบนเว็บนี้คูณ Source Length ด้วย Factor เริ่มที่ 2 × 1 ลอง Preview หลังใส่ Factor 2 แล้วเปลี่ยนเป็น 3 ก่อน Apply จากนั้นเปิด Requester อีกครั้ง เปลี่ยนค่า แล้วกด Cancel ตรวจ Event Trace และผลที่ยืนยันแล้วทุกขั้น</p>
        <div id="requester-lab"></div>
        <details><summary>เฉลย · Preview กับ Apply ใช้ค่าไหน</summary><p>Preview รอบแรกได้ 4 เมื่อเปลี่ยน Factor เป็น 3 ค่า Preview เดิมหมดอายุ Apply คำนวณใหม่ได้ 6 หลัง Cancel ผลล่าสุดยังเป็น 6</p></details>
        <p><a href="./examples/requester_events.ls" download>ดาวน์โหลด Requester Events · Original LScript</a> · แบบฝึก Native สำหรับ Modeler ยังไม่ได้ทดสอบใน Host ใช้ Preview Callback แสดงผลใน Dialog และแสดงผลยืนยันเมื่อ OK โดยไม่มีคำสั่งแก้ Mesh</p>
        <h2>5. Workshop · ออกแบบ Commit และ Undo</h2>
        <p>เขียนลำดับเหตุการณ์สำหรับ Input ว่าง, Factor เป็นศูนย์, เปลี่ยนค่าซ้ำก่อน Apply และ Cancel หลัง Preview ถ้าต่อ Lab เข้ากับคำสั่ง Scale ให้ระบุขอบเขต Selection, จุด Pivot และ Undo Group ล่วงหน้า จดค่าก่อนและหลังทุกกรณีใน <a href="./examples/runtime-checklist.txt" download>Runtime Checklist</a></p>`,
    },
    {
      id: 'review-layout',
      title: 'Layout · Scene Items & Hierarchy',
      summary: 'แยก Scene Item ออกจาก Modeler Point และตามคำสั่งที่ทำงานกับ Selection ใน Layout',
      refs: [3, 10],
      body: `
        <h2>1. Generic Entry Point และ Scene State</h2>
        <p><code>${layout('Reset_Translation.ls')}:4–12</code> เริ่มจาก <code>@script generic</code> และ <code>generic</code> แล้วเลือก Move Tool ก่อนสั่ง Reset อ่านสองคำสั่งร่วมกันเพื่อหาว่าคำสั่งหลังพึ่ง Tool State ตรงไหน</p>
        <h2>2. Traverse Hierarchy</h2>
        <p><code>${layout('selectchildren.ls')}:14–34, 89–101</code> อ่าน Item ที่เลือกจาก <code>Scene()</code> แล้วให้ <code>findChildren()</code> เก็บ Root ก่อนลงไปหา Child ผ่าน <code>firstChild()</code> และ <code>nextChild()</code> การอ่านจุดนี้อธิบายได้ว่าทำไม Root อยู่ในรายการด้วย</p>
        <h2>3. จาก Item ID สู่ Selection</h2>
        <p><code>${layout('selectchildren.ls')}:36–85</code> ใช้ <code>genus</code> แยก Mesh, Bone, Light และ Camera แต่ละกลุ่มเริ่มด้วย <code>SelectItem()</code> แล้วใช้ <code>AddToSelection()</code> กับรายการถัดไป ตรวจผลของการสลับ Edit Mode ใน Scene ทดสอบก่อนสรุปว่าผู้ใช้จะเห็น Selection รวมของทุกชนิดพร้อมกัน</p>
        <details><summary>Workshop · Trace ต้นไม้ทีละรายการ</summary><p>ให้ Root มีลูก A และ B และ A มีลูก A1 ถ้า Host คืนลูกตามลำดับนี้ รายการที่ Recursive Function เก็บจะเป็น Root, A, A1, B ทดสอบเพิ่มกับ Root ที่ไม่มีลูกและ Scene ที่ไม่มี Selection</p></details><p>บันทึกผลสองคอลัมน์ ระหว่างรายการที่ Recursive Function เดินผ่าน และรายการที่ถูกเลือกใน Layout หลังสลับ Edit Mode ถ้าต่างกัน ให้ตาม <code>SelectItem()</code> และ <code>AddToSelection()</code> ตามลำดับใน Source</p><p>อ่าน <a href="#module-13">Module 13</a> เพื่อทบทวน Local/World Transform ของ Item ที่มี Parent</p>`,
    },
    {
      id: 'review-animation',
      title: 'Animation · Channels & Keyframes',
      summary: 'อ่าน Channel Object Agent, แปลงวินาทีเป็นเฟรม และออกแบบการเลื่อน Key อย่างตรวจสอบได้',
      refs: [3, 10],
      body: `
        <h2>1. จาก Scene Item ไปสู่ Channel</h2>
        <p><code>${layout('shift_keys.ls')}:28–59</code> ให้เลือก Item และ Time Offset ผ่าน Requester แล้วอ่าน <code>Scene().fps</code> Source ใช้ <code>firstChannel()</code> และ <code>nextChannel()</code> โดยถือว่าเก้าช่องแรกเป็น Position, Rotation และ Scale ให้ตรวจ Channel List ก่อนใช้สมมติฐานนี้กับ Item ชนิดอื่น</p>
        <h2>2. Key ID, Time และ Frame Grid</h2>
        <p><code>${layout('shift_keys.ls')}:13–25</code> อ่าน Key IDs และเวลาของแต่ละ Key เพิ่ม Offset แล้วลบ Remainder จากเวลาใหม่ก่อน <code>moveKey()</code> คำนวณเวลาคาดหมายบนกระดาษก่อนทดลอง โดยเฉพาะเมื่อเวลาเป็นลบหรือใกล้ขอบเฟรม</p>
        <details><summary>แบบฝึกหัด · แปลง Offset เป็นเฟรม</summary><p>ที่ 24 fps การเพิ่ม 0.5 วินาทีเท่ากับ 12 เฟรม ดังนั้น Key ที่เฟรม 10 มีเป้าหมายทางคณิตศาสตร์ที่เฟรม 22 ลอง Offset ที่ไม่ลงเฟรมและสังเกต Floating-point Roundoff จากผลจริงแยกไว้</p></details>
        <h2>3. Workshop · ตรวจ Collision ก่อนย้าย</h2>
        <p>ใช้ Scene สำเนาและทำตาราง Channel, Old Frame, Target Frame และ Existing Key ทดลอง Offset บวกและลบ แล้วตรวจว่าการย้าย Key ที่ทับเวลาเดิมส่งผลอย่างไร แบบฝึกต่อยอดคือเขียนขั้น Preview ที่รายงานคู่เฟรมและ Collision ก่อนเรียกคำสั่งแก้ Keyframe</p><p>เริ่มทดสอบ Position X เพียง Channel เดียวที่มี Key เฟรม 10 กับ 20 แล้วค่อยลองหลาย Channel ให้บันทึก FPS, Offset เป็นวินาที, เฟรมที่คาด และเฟรมที่เห็นใน Graph Editor เทียบกับ <a href="#module-14">สูตรใน Module 14</a></p>`,
    },
    {
      id: 'review-materials',
      title: 'Materials · Surface Assignment',
      summary: 'ใช้ LScript อ่านและจัดกลุ่ม Surface ที่ Polygon อ้างถึง ก่อนปรับ Material ใน Surface Editor',
      refs: [3, 4, 10],
      body: `
        <h2>1. Polygon Assignment กับ Shading</h2>
        <p>เริ่มจาก Object ที่มี Surface ชื่อ <code>Body_Paint</code> และ <code>Trim_Metal</code> จดว่า Polygon ชุดไหนอ้างถึงชื่อใด แล้วค่อยตรวจผลใน Surface Editor การเปลี่ยน Assignment เป็นคนละขั้นกับการเปลี่ยนค่า Color หรือ Roughness ของ Material</p>
        <h2>2. เลือก Polygon ผ่านชื่อ Surface</h2>
        <p><code>${model('Select_Surfaces.ls')}:39–78</code> เดินรายชื่อด้วย <code>nextsurface()</code> ให้ผู้ใช้เลือกชื่อ แล้วใช้ <code>selpolygon()</code> แบบ SET หรือ CLEAR ตามโหมด การ Trace ควรเก็บทั้ง Display List หลังกรองและ Surface Name ที่เลือกจริง</p>
        <h2>3. Reassign แบบ Batch</h2>
        <p><code>${model('Reassign_Surface.ls')}:41–88, 159–236</code> เก็บรายชื่อ Surface และข้อมูล Polygon จากนั้นประเมินกฎ Contains, Starts With, Ends With หรือ Exact ก่อนใช้ <code>changesurface()</code> เมื่อพบรายการที่ตรงกฎ</p>
        <details><summary>Workshop · ออกแบบ Dry Run สำหรับ Material Cleanup</summary><p>สมมติชื่อ <code>Body_Paint</code>, <code>Body_Decal</code>, <code>Trim_Metal</code> ให้ทำนายผลของ Starts With <code>Body_</code> และ Exact <code>Body_Paint</code> ก่อนทดลองกับสำเนา ตรวจทั้งรายการชื่อที่ตรงและจำนวน Polygon ที่ได้รับผล</p></details><p>ใช้ Object สำเนาที่มีสาม Polygon กำหนดสอง Polygon ให้ใช้ <code>Body_Paint</code> และอีกหนึ่งให้ใช้ <code>Trim_Metal</code> ก่อนเปลี่ยนชื่อให้ Dry Run รายงานหนึ่งชื่อ แต่สอง Polygon ที่ได้รับผล หลัง Apply ตรวจว่า Polygon ของ <code>Trim_Metal</code> คง Assignment เดิม</p><p>ทบทวนความต่างระหว่าง UV, Normal และ Surface Name ใน <a href="#module-11">Module 11</a></p>`,
    },
    {
      id: 'review-nodes',
      title: 'Nodes · Shading Data Flow',
      summary: 'ต่อจาก Material Assignment ไปยัง Node Graph และฝึกอ่านชนิดข้อมูลของ Port',
      refs: [10],
      body: `
        <h2>1. ตามข้อมูลจาก Polygon ไปยัง Shader</h2>
        <p>เริ่มจาก Surface สองชื่อในคอร์ส <a href="#review-materials">Materials</a> เลือก Surface หนึ่งชื่อใน Surface Editor แล้วตามเส้นจากค่าหรือ Texture ไปสู่ Input ของ Material เวลาทดลองให้เปลี่ยนครั้งละค่าเพื่อแยกผลของ Assignment ออกจากผลของ Node Graph</p>
        <h2>2. อ่าน Port และ Evaluation</h2>
        <p>ใน SDK ที่ติดตั้ง ดู <code>${sdk}</code> ส่วน Evaluate, Node Input และ Node Output เอกสารนี้อธิบาย C SDK ของ Node Plugin คอร์สนี้ใช้เพื่ออ่านแนวคิด Port Type และการประเมินค่าตาม Shading Context ส่วนงานสร้าง Node Plugin อยู่ในสาย C SDK ภายหลัง</p>
        <div class="table-scroll"><table><thead><tr><th scope="col">ข้อมูลที่ติดตาม</th><th scope="col">ตัวอย่างโจทย์</th></tr></thead><tbody>
          <tr><td>Scalar</td><td>ส่งค่าเดียวไปยัง Input ที่รับตัวเลข เช่น Roughness แล้วเทียบ 0.15 กับ 0.75</td></tr>
          <tr><td>Color</td><td>เปลี่ยนสีเดียวโดยคงค่า Roughness แล้วตรวจ Preview ใต้แสงเดิม</td></tr>
          <tr><td>Vector</td><td>ระบุ Coordinate Space ของข้อมูลก่อนต่อกับ Input ที่ใช้ทิศทางหรือพิกัด</td></tr>
        </tbody></table></div>
        <h2>3. Workshop · Diagnose กราฟหนึ่งเส้น</h2>
        <p>วาด Output ต้นทาง ชนิดข้อมูล และ Input ปลายทาง บันทึกภาพก่อนและหลังเปลี่ยน Roughness ใน Scene สำเนา ถ้า Preview ไม่เปลี่ยน ให้ตรวจ Surface ที่ Polygon อ้างถึง, การเชื่อมต่อ Port และผลของค่าที่ปลายทางตามลำดับ</p>
        <details><summary>ทบทวน · UI Event ต่างจาก Shading Evaluation อย่างไร</summary><p>Callback ของ Requester ตอบสนองต่อการกระทำผู้ใช้ ส่วน Node Evaluation ให้ค่า ณ Shading Context ที่ขอ Output เวลาเขียนคำอธิบายให้ระบุว่าใครเป็นผู้เรียกและข้อมูลไหลจากไหนไปไหน</p></details><p>ในการเทียบ Roughness ให้ล็อก Camera, Light และ Base Color แล้วเก็บภาพสองค่าในมุมเดิม หากผลดูเหมือนกัน ให้ตรวจว่ากราฟต่อเข้ากับ Material ที่ผิวใช้จริง และจดว่าเปลี่ยนค่าใดที่ Port ใดก่อนสรุปผล</p>`,
    },
  ];

  window.WB.mountRequesterLab = () => {
    const lab = document.getElementById('requester-lab');
    if (!lab) return;
    lab.innerHTML = `
      <div class="section">
        <div class="panel-title">REQUESTER EVENT LAB</div>
        <div class="section-body">
          <fieldset class="requester-controls">
            <legend>Draft</legend>
            <label>Source Length <input type="number" data-source value="2" min="0" step="any"></label>
            <label>Factor <input type="number" data-factor value="1" min="0" step="any"></label>
            <div class="requester-actions">
              <button type="button" data-preview>Preview</button>
              <button type="button" data-apply>Apply</button>
              <button type="button" data-cancel>Cancel</button>
            </div>
          </fieldset>
          <button type="button" data-open disabled>เปิด Requester อีกครั้ง</button>
          <p>Preview: <output data-draft-result>—</output> · ผลที่ยืนยันแล้ว: <output data-saved-result>—</output></p>
          <p data-status role="status"></p>
          <ol class="requester-log" aria-label="Event Trace"></ol>
        </div>
      </div>`;
    const field = (name) => lab.querySelector(`[data-${name}]`);
    const controls = lab.querySelector('fieldset');
    const log = lab.querySelector('ol');
    let saved = null;

    function trace(message) {
      field('status').textContent = message;
      const entry = document.createElement('li');
      entry.textContent = message;
      log.prepend(entry);
      if (log.children.length > 8) log.lastElementChild.remove();
    }

    function draft() {
      const source = field('source').valueAsNumber;
      const factor = field('factor').valueAsNumber;
      const result = source * factor;
      return source > 0 && factor > 0 && Number.isFinite(result) && result > 0
        ? { source, factor, result } : null;
    }

    const display = (value) => Number(value.toPrecision(8)).toString();
    controls.addEventListener('input', () => {
      field('draft-result').textContent = '—';
      trace('Input → ctlrefresh → ค่า Draft เปลี่ยน');
    });

    field('preview').onclick = () => {
      const next = draft();
      field('draft-result').textContent = next ? display(next.result) : '—';
      trace(next ? 'Preview → Callback → คำนวณจาก Draft' : 'Preview → กรอกตัวเลขมากกว่า 0 ทั้งสองช่อง');
    };

    function close(message) {
      controls.disabled = true;
      field('open').disabled = false;
      field('draft-result').textContent = '—';
      trace(message);
      field('open').focus();
    }

    field('apply').onclick = () => {
      const next = draft();
      if (!next) {
        trace('Apply → กรอกตัวเลขมากกว่า 0 ทั้งสองช่อง');
        return;
      }
      saved = next;
      field('saved-result').textContent = display(saved.result);
      close('Apply → OK → อ่าน Draft ล่าสุดและบันทึกผล');
    };

    field('cancel').onclick = () => close('Cancel → ทิ้ง Draft และคงผลเดิม');
    field('open').onclick = () => {
      controls.disabled = false;
      field('open').disabled = true;
      field('source').value = saved?.source ?? 2;
      field('factor').value = saved?.factor ?? 1;
      trace('Open → reqbegin → โหลด Input ล่าสุดที่ยืนยันแล้ว');
      field('source').focus();
    };
  };
})();
