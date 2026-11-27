export const primaryDemos = {
  mesh: {
    brief: 'เลือกขอบ 2–3 แล้วเพิ่ม Face C เพื่อดูว่าจำนวนหน้าที่ใช้ขอบเดียวกันเปลี่ยนอย่างไร จากนั้นลอง Seam เพื่อแยกพิกัดออกจาก Point ID',
    view: 'orbit',
    steps: [
      { field: 'scenario', title: 'เพิ่ม Face C ที่ขอบ 2–3', detail: 'ขอบจากสีน้ำเงินจะเปลี่ยนเป็นแดง เพราะมี Face A, B และ C ใช้ขอบเดียวกัน', change: { scenario: 'third' } },
      { field: 'scenario', title: 'เปลี่ยนเป็น Seam', detail: 'ดูตำแหน่ง 3/6 ในกล้องและ Weld Candidates ใต้ภาพ Point ID ต่างกันแม้พิกัดเท่ากัน', change: { scenario: 'seam' } },
      { field: 'tolerance', title: 'ลองเพิ่ม Weld Tolerance', detail: 'กด ลองเอง แล้วตั้ง Tolerance เป็น 0.15 คู่ 2–7 จะเพิ่มเข้ามาในรายงาน' },
    ],
  },
  vector: {
    brief: 'ปรับ B.Z และดูระยะ B − A จากนั้นเปลี่ยนเป็น Cross Product เพื่อดูทิศของเวกเตอร์ตั้งฉาก',
    view: 'orbit',
    steps: [
      { field: 'bZ', title: 'เปลี่ยน B.Z เป็น 2', detail: 'ดู B เคลื่อนไปตามแกน Z และ Magnitude เปลี่ยนจาก 5 เป็น 5.385', change: { bZ: 2 } },
      { field: 'vector-mode', title: 'เลือก Cross Product', detail: 'ดู a และ b เริ่มที่ Origin และลูกศร a × b ตั้งฉากกับทั้งสอง', change: { 'vector-mode': 'cross' } },
      { field: 'vector-mode', title: 'ลองดู Projection จาก Dot Product', detail: 'กด ลองเอง แล้วเลือก Dot Product สังเกตลูกศร Projection และเส้นจากปลาย b ลงมาหา a' },
    ],
  },
  pivot: {
    brief: 'ใช้จุดเริ่มต้นและค่าชุดเดิม ตั้ง Translate X เป็น 2 แล้วเปลี่ยนเฉพาะลำดับ Transform ดูว่าจุด P′ ไปอยู่ตรงไหนในแต่ละลำดับ จากนั้นลองตั้ง Translate X เป็น 0',
    view: 'orbit',
    steps: [
      { field: 'shift', title: 'ใส่ 2 ในช่อง Translate X', detail: 'ดูจุดสีเน้น P′ ในภาพ หลังปรับค่าจะไปที่ (4, 2, 0)', change: { shift: 2 } },
      { field: 'order', title: 'สลับลำดับ Transform', detail: 'เลือก Translate → Scale/Rotate ตัวเลขอื่นคงเดิม แต่ P′ จะไปที่ (2, 4, 0)', change: { order: 'move-first' } },
      { field: 'shift', title: 'ลองให้ Translate X กลับเป็น 0', detail: 'กด ลองเอง แล้วใส่ 0 เทียบผล P′ สองลำดับ ทั้งสองตำแหน่งจะตรงกันเมื่อไม่มีการเลื่อน' },
    ],
  },
};
