/* Original lessons. Numeric results are worked examples; host steps are workshops. */
Object.assign(window.WB.lessons, {
  '05': {
    subtitle: 'ย้าย หมุน และย่อขยายรอบ Custom Pivot',
    objectives: ['แยก Translation, Rotation และ Scale', 'คำนวณผลรอบ Pivot', 'ตรวจลำดับของ Transform'],
    refs: [0, 2, 4],
    body: `
      <h2>เริ่มจากจุดเดียว</h2>
      <p>เมื่อหมุนชิ้นงานรอบบานพับ ตัวบานพับต้องอยู่ที่เดิม ให้ P เป็นจุดบนชิ้นงานและ C เป็น Pivot คำนวณเวกเตอร์ P − C ก่อนหมุน แล้วบวก C คืน สูตรคือ <code>P′ = C + R(P − C)</code> โดย R คือ Rotation ที่กระทำกับเวกเตอร์รอบ Origin</p>
      <p>ตัวอย่างบนระนาบ XY ให้ C = (2, 1), P = (3, 1) และหมุนทวนเข็มนาฬิกา 90° จะได้ P − C = (1, 0) หมุนแล้วเป็น (0, 1) บวก C ได้ P′ = (2, 2)</p>
      <h2>ลำดับของ Transform</h2>
      <p>เริ่มที่ (1, 0) ถ้าหมุน 90° รอบ Origin ก่อนแล้วเลื่อน X อีก 2 จะได้ (2, 1) ถ้าเลื่อนก่อนแล้วหมุนจะได้ (0, 3) ให้เขียนลำดับเป็นคำพูดก่อนจัด Matrix เพื่อหลีกเลี่ยงความสับสนเรื่อง Row/Column convention</p>
      <h2>Interactive Lab · Custom Pivot</h2>
      <div data-three-lab="pivot"></div>
      <h2>Workshop · Custom Pivot</h2>
      <p>สร้างจุดทดสอบหนึ่งจุดกับจุดอ้างอิง Pivot ทำตาราง Before, Pivot, Transform และ Expected แยก calculation ออกจากคำสั่ง Modeler ตรวจกรณีมุม 0°, 90° และจุดที่อยู่บน Pivot เอง แล้วเทียบแกนและทิศหมุนกับ Host</p>
      <details><summary>เฉลย · Scale รอบ Pivot</summary><p>ถ้า C = (2, 1), P = (3, 1) และ Scale X × 2 ค่า Offset จาก C เพิ่มจาก 1 เป็น 2 ผลคือ (4, 1) จุดที่ตรง Pivot จะอยู่ที่เดิม</p></details>
      <p>อ่านต่อ <a href="#review-modeler">Modeler · Bounding Box และ Selection</a></p>`,
  },
  '06': {
    subtitle: 'หา Plane จากสามจุดและ Project จุดลงบนระนาบ',
    objectives: ['สร้าง Normal ด้วย Cross Product', 'คำนวณ Signed Distance', 'ตรวจ Degenerate Geometry ก่อนหาร'],
    refs: [0, 1, 2, 4],
    body: `
      <h2>ระนาบบอกด้วยจุดหนึ่งจุดและทิศตั้งฉาก</h2>
      <p>ใช้สามจุด A, B, C สร้าง Edge Vectors B − A และ C − A แล้วทำ Cross Product ถ้าเวกเตอร์ผลลัพธ์ยาวพอ ให้ Normalize เป็น Unit Normal <code>n</code> เมื่อเปลี่ยนลำดับ A, B, C ทิศของ Normal อาจกลับด้าน แต่ Plane เดิมยังอยู่ที่เดิม</p>
      <h2>วัดก่อนเลื่อน</h2>
      <p>สำหรับจุด P คำนวณ Signed Distance <code>d = dot(P − A, n)</code> จากนั้นใช้ <code>P′ = P − d n</code> เพื่อ Project ลง Plane ตัวอย่าง Plane Z = 2 และ n = (0, 0, 1) จุด (4, −1, 5) ให้ d = 3 และ P′ = (4, −1, 2)</p>
      <h2>Workshop · Planar2 และ Plane Projection</h2>
      <p>อ่าน <a href="https://github.com/Neill3d/Lightwave/blob/master/Scripts/Planar2.ls" target="_blank" rel="noopener">Planar2.ls</a> ที่บรรทัด 28–34 สคริปต์ใช้ Center ของ Bounding Box และผสม Polygon Normals ทีละตัว ที่บรรทัด 42–46 จึงคำนวณ Offset และย้าย Point สังเกตว่าไม่มีการ Normalize หลังผสม Normal ถ้า Normal ที่ใช้ยาวไม่เท่ากับ 1 การคูณ Offset ด้วย Normal ตรง ๆ อาจเลื่อนจุดไม่ถึง Plane ให้ลองเทียบด้วยตัวเลขเล็ก ๆ</p>
      <details><summary>เฉลย · จุดอยู่ด้านล่างและสามจุดอยู่บนเส้นเดียวกัน</summary><p>จุด Z = 0 ให้ d = −2 จึงเลื่อนขึ้นถึง Z = 2 ส่วนจุดที่ใช้สร้าง Plane อยู่บนเส้นเดียวกันจะให้ Cross Product เป็นศูนย์ ให้หยุดและแจ้งผู้ใช้ก่อน Normalize</p></details>`,
  },
  '07': {
    subtitle: 'กำหนดตำแหน่งซ้ำด้วยวงกลมและระยะเยื้องแถว',
    objectives: ['แจกแจงจุดบนวงกลมด้วยมุม', 'คุมจำนวนจุดและรอยต่อ', 'สร้างแถวเหลื่อมสำหรับ Honeycomb'],
    refs: [0, 2, 4, 9],
    body: `
      <h2>จากจำนวนชิ้นเป็นตำแหน่ง</h2>
      <p>กำหนด Center (cx, cy), Radius r และจำนวน N ใช้ Index <code>i = 0…N−1</code> และมุม <code>θ = 2πi/N</code> ตำแหน่งคือ <code>(cx + r cos θ, cy + r sin θ)</code> ฟังก์ชันตรีโกณมิติในสูตรรับมุมเป็น Radians</p>
      <p>วงกลม Radius 2 ที่ Origin และ N = 4 ให้ (2, 0), (0, 2), (−2, 0), (0, −2) ถ้าเพิ่ม i = 4 จะได้จุดเริ่มต้นซ้ำ จึงให้หยุดก่อน Index N</p>
      <h2>แถวเหลื่อมและขนาด</h2>
      <p>สำหรับ Center ของ Hex Grid แบบระยะเพื่อนบ้าน <code>s</code> วางคอลัมน์ห่างกัน s เลื่อนคอลัมน์ของแถวคี่ไป s/2 และให้แถวห่างกัน <code>√3 s/2</code> ค่านี้มาจากความสูงของสามเหลี่ยมด้านเท่า ลองวาดสามจุดแรกบนกระดาษก่อนสร้าง Polygon จริง</p>
      <h2>Workshop · Circle Points และ Honeycomb</h2>
      <p>เปรียบเทียบสูตรของเรากับแนวคิดใน <a href="#references">Source Library</a> แล้วออกแบบฟังก์ชันคืนรายการพิกัดก่อนเรียก Modeler ทดสอบ N = 1, 4 และ 7, Radius = 0 และจำนวนมากที่ควรจำกัดไว้</p>
      <details><summary>เฉลย · แถวที่สองเมื่อ s = 2</summary><p>แถวแรกมี X = 0, 2, 4 ที่ Y = 0 แถวถัดไปมี X = 1, 3, 5 ที่ Y = √3 ระยะจาก (0, 0) ถึง (1, √3) จึงยังเท่ากับ 2</p></details>`,
  },
  '08': {
    subtitle: 'ใช้ Linear/Radial Array เพื่อเรียน Command Sequence และ Undo',
    objectives: ['ระบุ Selection และ Clipboard ที่คำสั่งอาศัย', 'ออกแบบลำดับคำสั่งที่ตรวจสอบได้', 'ทำนายตำแหน่งและมุมของแต่ละสำเนา'],
    refs: [0, 3, 4],
    body: `
      <h2>มองคำสั่งเป็นการเปลี่ยน State</h2>
      <p>ก่อนเรียก Copy, Rotate หรือ Paste ให้จดว่าขณะนั้น Modeler เลือกอะไร อยู่ Layer ไหน และ Clipboard ถือ Geometry ชุดใด ถ้า Workshop เปลี่ยน Selection กลางทาง ให้บันทึกผลแต่ละคำสั่งเพื่อแยกปัญหาของสูตรออกจากปัญหาของ Host State</p>
      <h2>คำนวณจากต้นฉบับ</h2>
      <p>Linear Array ที่เริ่ม X = 1 และมี Step = 2 ให้ X = 1, 3, 5 เมื่อกำหนดจำนวนรวมสามชิ้น สำหรับ Radial Array เจ็ดชิ้น มุมที่ i คือ <code>i × 360/7</code> การคำนวณจาก i ช่วยให้ตรวจตำแหน่งเทียบกับต้นฉบับได้ตรง ๆ</p>
      <h2>Workshop · Trace Radial Array</h2>
      <p>เปิดกรณี <a href="#review-modeler">radial_array.ls ใน Modeler</a> แล้วทำตาราง Iteration, Angle, Active Selection และ Geometry Count สังเกตจุดที่ Source แปลงมุมเป็นจำนวนเต็ม และตรวจว่าการ Undo หนึ่งครั้งคืนผลของทั้งกลุ่มอย่างไรใน Host จริง</p>
      <details><summary>เฉลย · มุมที่สะสมด้วยจำนวนเต็ม</summary><p>ถ้าใช้ Increment 51° ทุกครั้ง เจ็ดครั้งรวมเป็น 357° ส่วนค่า Ideal รวมเป็น 360° ผลของช่องว่างต่อ Mesh จริงขึ้นกับ Geometry และ Selection ที่คำสั่งใช้ ให้ตรวจจาก Scene ทดสอบ</p></details>`,
  },
  '09': {
    subtitle: 'ตรวจ Mesh Topology ก่อนออกแบบ Weld',
    objectives: ['แยก Point ID ออกจากตำแหน่ง', 'นับการใช้ Edge ร่วมกัน', 'รายงาน Weld Candidates ก่อนแตะ Mesh'],
    refs: [0, 4, 7, 8],
    body: `
      <h2>อ่าน Polygon เป็นรายการ Point IDs</h2>
      <p>ให้ Face A = [1, 2, 3] และ Face B = [3, 2, 4] ทั้งสอง Face ใช้ Edge 2–3 ร่วมกัน แม้เดินผ่านคนละทิศ ถ้าตรวจการใช้ Edge ให้เก็บคู่ ID แบบเรียงน้อยไปมาก และเก็บทิศแยกไว้เมื่อจะตรวจ Winding</p>
      <h2>จากตำแหน่งใกล้กันไปสู่ Candidate</h2>
      <p>Point 7 และ Point 8 อาจอยู่ตำแหน่งเดียวกันแต่คนละ ID กำหนด Tolerance ในหน่วย Scene และเปรียบเทียบระยะกำลังสองกับ Tolerance² การตัดสินใจ Weld ต้องทราบว่ากระทบ Face ใดบ้าง เช่น Face อาจเหลือจุดต่างกันไม่ถึงสามจุดหลังรวม</p>
      <h2>Interactive Lab · ตรวจ Mesh</h2>
      <div data-three-lab="mesh"></div>
      <h2>Workshop · Mesh Doctor แบบอ่านอย่างเดียว</h2>
      <p>สำหรับ Mesh เล็ก ให้ทำตาราง Point ID, Position และ Faces ที่อ้างถึง แล้วรายงาน Edge ที่มี Face ใช้หนึ่งหน้า สองหน้า และมากกว่าสองหน้า สร้างรายชื่อ Candidate ก่อนเขียนคำสั่ง Weld และตรวจว่า Candidate ซ้อนกันแบบ A↔B↔C จะรวมแบบกลุ่มหรือแบบคู่</p>
      <details><summary>เฉลย · Edge ใช้ร่วมกับ Weld ที่ขอบ</summary><p>ในตัวอย่าง A/B มี Edge ร่วมหนึ่งเส้นและ Boundary Edges สี่เส้น ถ้า Weld ID 1 เข้ากับ 2 ใน Face A จะเหลือจุดต่างกันเพียงสองจุด ให้รายงาน Face ที่เสื่อมสภาพก่อนอนุญาต Apply</p></details>`,
  },
  '10': {
    subtitle: 'อ่าน Control Points แล้วสร้างตัวอย่าง Curve ทีละจุด',
    objectives: ['แยก Control Point จากจุดตัวอย่างบน Curve', 'คำนวณ Bézier ด้วย Linear Interpolation', 'ตรวจ Endpoint และ Sampling'],
    refs: [0, 2, 4],
    body: `
      <h2>เริ่มจาก Linear Interpolation</h2>
      <p><code>lerp(A, B, t) = A + t(B − A)</code> เมื่อ t = 0 ได้ A และ t = 1 ได้ B ใช้หลักเดียวกันกับแต่ละพิกัดเพื่อเลื่อนจุดใน 3D</p>
      <h2>Quadratic Bézier</h2>
      <p>ใช้ P0, P1, P2 หา Q0 ระหว่าง P0/P1 และ Q1 ระหว่าง P1/P2 แล้วทำ Lerp จาก Q0 ไป Q1 ด้วย t เดิม ถ้า P0 = (0, 0), P1 = (2, 2), P2 = (4, 0) ที่ t = 0.5 จะได้ Q0 = (1, 1), Q1 = (3, 1) และผล (2, 1)</p>
      <h2>Workshop · Smooth Spline</h2>
      <p>คำนวณที่ t = 0, 0.25, 0.5, 0.75, 1 แล้ววาดเส้นต่อจุด เปรียบเทียบกับ <a href="#review-ui">กรณี helix.ls</a> ซึ่งสร้าง Point IDs แล้วส่งให้ <code>addcurve()</code> แยกจุดควบคุมที่ Host ใช้จากจุดที่เราสุ่มบน Bézier และตรวจพฤติกรรม Curve ของแต่ละวิธีใน Host</p>
      <details><summary>เฉลย · Endpoint และระยะระหว่างตัวอย่าง</summary><p>จุดแรกและสุดท้ายตรง P0/P2 ส่วน P1 ควบคุมรูปร่างและไม่ใช่จุดที่ Curve ต้องผ่าน ตัวอย่างที่ t ห่างเท่ากันอาจห่างทางกายภาพไม่เท่ากัน จึงต้องวัดระยะก่อนนำไปวางชิ้นงานตาม Curve</p></details>`,
  },
  '11': {
    subtitle: 'แยกตำแหน่ง 3D, Normal, UV และ Surface Assignment',
    objectives: ['คำนวณ Planar UV จาก Bounding Box', 'ตรวจทิศ Normal จาก Winding', 'เข้าใจ UV Seam และขอบเขตของ Vertex Map'],
    refs: [0, 2, 4, 10],
    body: `
      <h2>ข้อมูลสี่อย่างที่ตอบคนละคำถาม</h2>
      <p>Position บอกว่าจุดอยู่ที่ไหน Normal บอกทิศตั้งฉาก UV บอกตำแหน่งอ่าน Texture และ Surface Name บอกว่า Polygon ใช้ Material กลุ่มไหน จุด 3D เดียวอาจมี UV ต่างกันที่แต่ละมุมของ Face ตามรอยต่อของ Texture</p>
      <h2>ตัวอย่าง Planar Mapping บน XY</h2>
      <p>คำนวณ <code>u = (x − minX)/(maxX − minX)</code> และ <code>v = (y − minY)/(maxY − minY)</code> ถ้าขอบเขตคือ X = 2…6 และ Y = 1…3 จุด (3, 2) ได้ UV (0.25, 0.5) เมื่อสลับระนาบ Projection ให้เปลี่ยน Axis ที่อ่านทั้งสองตัวอย่างสอดคล้องกัน</p>
      <h2>Workshop · Planar UV Mapper</h2>
      <p>สร้าง Quad ที่มีขนาด X และ Y ต่างกัน ทำนาย UV ของสี่มุม ใช้ Checker Texture ตรวจการกลับแกนและการยืด แล้วเพิ่ม Face ที่แชร์ Point แต่ต้องใช้ UV คนละชุดตรง Seam ต่อไปอ่าน <a href="#review-materials">Surface Assignment</a> และ <a href="#review-nodes">Shading Data Flow</a></p>
      <details><summary>เฉลย · ระนาบหารด้วยศูนย์และ Normal กลับด้าน</summary><p>ถ้า minX = maxX โจทย์นี้ไม่มีช่วงสำหรับ Normalize U ให้เลือก Projection ที่เหมาะสมหรือรายงานค่าไม่ถูกกำหนด เมื่อสลับสองจุดใน Polygon ทิศ Cross Product กลับด้าน ให้ตรวจ Winding ก่อนคาดเดาว่า Texture เป็นสาเหตุ</p></details>`,
  },
  '12': {
    subtitle: 'ใช้ Distance Falloff เพื่อควบคุมขนาดการเคลื่อนที่',
    objectives: ['แปลงระยะทางเป็น Weight', 'เปรียบเทียบ Linear และ Smooth Falloff', 'คำนวณจาก Snapshot ก่อนแก้จุด'],
    refs: [0, 1, 4],
    body: `
      <h2>โซนผลกระทบ</h2>
      <p>เลือก Center และ Radius R ที่มากกว่าศูนย์ สำหรับระยะทาง d ใช้ <code>t = clamp(d/R, 0, 1)</code> จากนั้น Linear Weight คือ <code>w = 1 − t</code> ย้ายจุดด้วย <code>P′ = P + w × Offset</code></p>
      <p>ถ้า R = 4 และ Offset X = 8 จุดที่ระยะ 0, 1, 4 และ 5 จะขยับ X เท่ากับ 8, 6, 0 และ 0 ตามลำดับ หากต้องการขอบที่ค่อย ๆ เปลี่ยน ใช้ <code>w = 1 − (3t² − 2t³)</code> แล้วเทียบตัวเลขที่ระยะ 1</p>
      <h2>Workshop · Falloff Tool</h2>
      <p>จับ Snapshot ของ Point IDs และตำแหน่งที่เลือกก่อน จากนั้นคำนวณ Weight ทุกจุดแล้วจึง Apply ผลพร้อมกัน บันทึก Expected และ Actual สำหรับจุดที่ Center, ภายใน, ที่ขอบ และนอก Radius ลองสลับลำดับการประมวลผลเพื่อตรวจว่าผลยังเท่าเดิม</p>
      <details><summary>เฉลย · Smooth ที่ระยะ 1</summary><p>t = 0.25 ให้ Smooth Weight 0.84375 และ Offset X = 6.75 เทียบกับ Linear = 6 ถ้า Radius เป็นศูนย์ ให้แจ้ง Input ไม่ถูกต้องก่อนคำนวณ</p></details>`,
  },
  '13': {
    subtitle: 'อ่าน Scene Hierarchy และแยก Camera Transform ออกจาก Mesh',
    objectives: ['ติดตาม Local/World Transform ผ่าน Parent', 'แยก Scene Item จาก Modeler Layer', 'ออกแบบ Scene Report แบบอ่านอย่างเดียว'],
    refs: [0, 2, 3, 10],
    body: `
      <h2>จาก Modeler ไป Layout</h2>
      <p>Modeler จัดการจุดกับ Polygon ของ Mesh ส่วน Layout จัดการ Scene Items เช่น Object, Camera, Light และ Bone Object สองตัวอาจอ้างถึงข้อมูล Mesh เดียวกันแต่มี Transform คนละชุด</p>
      <h2>Local กับ World</h2>
      <p>เมื่อ Parent อยู่ X = 10 และ Child อยู่ X = 2 ใน Local Space ค่า World X เป็น 12 ในกรณีมีเพียง Translation ถ้า Parent หมุนหรือ Scale ให้นำ Transform ของ Parent ไปใช้กับ Local Position ทั้งเวกเตอร์ Camera มอง Scene จาก Transform ของตัวเอง จึงเปลี่ยนภาพได้โดย Geometry อยู่ที่เดิม</p>
      <h2>Workshop · Scene Report</h2>
      <p>ตั้ง Scene ทดสอบที่มี Parent, Child, Camera และ Light ทำรายงาน Item Name, Item Type, Parent และ Transform Space จากนั้นอ่าน <a href="#review-layout">Layout · Scene Items &amp; Hierarchy</a> เพื่อไล่ Entry Point และลำดับการอ่าน Child</p>
      <details><summary>เฉลย · Parent หมุน 90° รอบ Z</summary><p>ถ้า Parent ที่ (10, 0) หมุนทวนเข็ม 90° ใน XY และ Child อยู่ Local (2, 0) จะได้ World (10, 2) ในระบบแกนและทิศหมุนที่กำหนดในโจทย์ ตรวจทิศจริงแยกใน Host</p></details>`,
  },
  '14': {
    subtitle: 'แปลงเฟรมเป็นเวลา อ่าน Envelope และวางแผน Key Offset',
    objectives: ['แยก Channel, Envelope และ Key', 'แปลงเฟรมกับวินาทีตาม FPS ของ Scene', 'วางแผน Key Collision ก่อน Apply'],
    refs: [0, 3, 10],
    body: `
      <h2>Channel เก็บหนึ่งสมบัติตามเวลา</h2>
      <p>ตัวอย่างหนึ่ง Object มี Position X เป็น Channel ซึ่งมี Keys บันทึกเวลาและค่า ส่วน Interpolation กำหนดค่าระหว่าง Keys ถ้า Position X ที่เฟรม 0 = 0 และเฟรม 20 = 10 แบบ Linear ค่าเฟรม 5 คือ 2.5</p>
      <h2>เฟรมและวินาที</h2>
      <p><code>seconds = frame / fps</code> เมื่อ Scene ตั้ง 30 fps การเลื่อน 15 เฟรมเท่ากับ 0.5 วินาที ถ้า Scene ตั้ง 24 fps ค่าเวลาเดิมเลื่อนไป 12 เฟรม ให้ระบุใน UI ว่าผู้ใช้กำลังกรอกเฟรมหรือวินาที</p>
      <h2>Workshop · จาก Offset ไปสู่แผนย้าย</h2>
      <p>เริ่มจาก Keys ที่เฟรม 10, 20 และ 30 แล้วเลือกย้าย 10 ไป 20 จดว่า Target ชน Key ที่มีอยู่ก่อนจะเรียกคำสั่ง เขียนนโยบายให้ชัดว่าจะหยุดหรือให้ผู้ใช้เลือก แล้วเปรียบเทียบกับ Source ใน <a href="#review-animation">Animation · Channels &amp; Keyframes</a></p>
      <details><summary>เฉลย · เลื่อนทั้ง Channel กับเลื่อนบาง Key</summary><p>ถ้าย้ายทุก Key +10 เป้าหมายคือ 20, 30, 40 โดยตำแหน่งเดิม 20 และ 30 เป็นส่วนของแผนเดียวกัน การย้ายทีละ Key อาจชนสถานะระหว่างทาง จึงต้องตรวจว่าคำสั่ง Host รองรับวิธี Batch หรือลำดับย้ายแบบใด</p></details>`,
  },
  '15': {
    subtitle: 'ออกแบบ Mini Cloner ที่ทำนายผลและสร้าง Key แบบ Baked ได้',
    objectives: ['สร้าง Transform จาก Index', 'วาง Timing Offset ต่อ Clone', 'ประมาณจำนวน Key ก่อนสร้าง Scene'],
    refs: [0, 2, 3, 10],
    body: `
      <h2>เริ่มจาก Clone Plan</h2>
      <p>เก็บหนึ่งแถวต่อ Clone ได้แก่ ID, Position, Rotation และ Start Frame ถ้าชิ้นแรกเริ่ม X = 0 กับ Frame 10 และ Step คือ 2 หน่วยและ 3 เฟรม ชิ้น Index 0–2 จะเป็น (X, Frame) = (0, 10), (2, 13), (4, 16)</p>
      <h2>สร้าง Key เมื่อแผนถูกต้องแล้ว</h2>
      <p>การ Bake คือบันทึกผลเป็น Keys ที่เวลาที่กำหนด แทนการคำนวณ Pattern ใหม่ทุกครั้งที่เล่น Scene เลือกช่วงและ Sample Step ก่อนนับจำนวน ถ้ารวมเฟรม 0–60 ทุก 5 เฟรม จะมี 13 Samples ต่อ Channel</p>
      <h2>Workshop · Mini Cloner</h2>
      <p>ร่าง Preview Table สำหรับสาม Clones กำหนด Seed เมื่อเพิ่ม Variation เพื่อให้ทำซ้ำได้ และกำหนดชื่อที่จะไม่ชนเดิม ก่อนเขียน Host Adapter ให้ทดสอบ Count = 1, Step = 0 และ Scene ที่มีชื่อ Clone จากรอบก่อน</p>
      <details><summary>เฉลย · งบประมาณ Key</summary><p>ถ้าสร้าง 3 Clones × 3 Channels × 13 Samples ผลคือ 117 Keys ให้แสดงจำนวนนี้ใน Preview และทดสอบว่า Cancel ไม่สร้าง Item หรือ Key เพิ่ม</p></details>
      <p>ทบทวน <a href="#module-08">Array</a> และ <a href="#module-14">Key Offset</a> ก่อนเขียนส่วนที่แตะ Scene</p>`,
  },
  '16': {
    subtitle: 'ย้าย Algorithm ก่อน แล้วตรวจ Python API บน Host เป้าหมาย',
    objectives: ['แยก Geometry Logic จาก Host Adapter', 'รักษา Selection และ Cleanup Contract', 'วางแผน Port ที่วัดผลได้'],
    refs: [3, 4, 10, 11],
    body: `
      <h2>เริ่มจากพฤติกรรมที่สังเกตได้</h2>
      <p>เลือก Distance Inspector แล้วเขียน Contract ก่อนย้ายภาษา เช่น รับสองพิกัด 3D คืนระยะ Euclidean และ Cancel ไม่เปลี่ยน Mesh ส่วนตัวอย่าง (0, 0, 0) ถึง (3, 4, 0) ต้องได้ 5 ไม่ว่าภาษาใด</p>
      <h2>แยกสามส่วนที่จะย้าย</h2>
      <ol><li>Core Algorithm รับค่าเลขและทำให้เทสต์ได้โดยไม่เปิด Host</li><li>Requester อ่าน Input และแสดงผล ตรวจว่าการ Cancel ออกจากเส้นทาง Apply</li><li>Host Adapter อ่าน Selection และเรียกคำสั่งที่ยืนยันจาก SDK ของ Host เวอร์ชันนั้น</li></ol>
      <h2>Workshop · Port ทีละชั้น</h2>
      <p>เริ่มจากฟังก์ชันระยะทางใน Python 3 แล้วรันเคส A = B, พิกัดติดลบ และแกน Z แยกกัน หลังจากนั้นเปิด Python SDK ที่ติดตั้ง ตรวจ Import, Entry Point, Selection API และวิธีลงทะเบียน Plugin ทีละข้อ แล้วค่อยเปรียบเทียบ Native UI กับ <a href="#review-ui">Requester แบบ LScript</a></p>
      <details><summary>เฉลย · เกณฑ์เปรียบเทียบ</summary><p>ทั้งสองรุ่นต้องให้ระยะเท่ากันเมื่อ Input ตรงกันและ Cancel ต้องไม่เปลี่ยน Scene รายงานแยกระหว่างเทสต์คณิตศาสตร์ที่ผ่านกับ Adapter ที่ยังรันทดสอบใน Host ไม่ได้</p></details>`,
  },
});
