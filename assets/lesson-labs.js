import { add, cross, dot, drawing, flow, fmt, mix, mul, rgb, sub, turn, unit, xyz } from './lesson-drawing.js';

const number = (name, label, value, min, max, step = 1) => ({ name, label, value, min, max, step });
const select = (name, label, options) => ({ name, label, options });
const step = (field, value, title, detail, view) => ({ field, title, detail, view, change: { [field]: value } });
const practice = (field, title, detail, view) => ({ field, title, detail, view });
const metric = (label, value, tone = '') => [label, String(value), tone];

function lab(title, brief, controls, steps, draw, source, view = 'orbit') {
  return { title, brief, controls, steps, draw, source, view };
}

const sceneItem = (d, p, label, tone) => {
  d.box(p, [.52, .52, .52], tone);
  d.point(add(p, [0, .43, 0]), label, tone, 0);
};

function runtime({ host, phase }) {
  const modeler = host === 'modeler';
  const d = drawing(false);
  const labels = ['Host', 'Directive', 'Entry Point', 'ผลลัพธ์'];
  flow(d, labels, Number(phase));
  const p = [2.1, -.58, 0];
  if (modeler) {
    d.polygon([[-.56, -1, .12], [.16, -.4, .1], [-.72, .05, 0]].map((v) => add(v, p)), 'accent');
    d.point([1.8, -1.87, 0], 'Mesh', 'accent', 0);
  } else sceneItem(d, p, 'Scene Item', 'accent');
  return d.finish([
    metric('Host', modeler ? 'Modeler' : 'Layout', 'accent'),
    metric('Directive', modeler ? '@script modeler' : '@script generic'),
    metric('Entry Point', modeler ? 'main' : 'generic'),
  ], phase === '3' ? (modeler ? 'เครื่องมือระดับ Point/Polygon อยู่ใน Modeler' : 'Layout จัดการ Object, Camera, Light และ Keyframes') : 'ตามลำดับจาก Host ไปสู่ Entry Point');
}

function pointMesh({ selected, duplicate }) {
  const d = drawing();
  const points = [[-1.2, -.7, 0], [-.45, .95, 0], [.45, -.65, 0], [1.25, .68, .55]];
  if (duplicate === 'split') points.push(points[2]);
  const faces = [[1, 2, 3], [duplicate === 'split' ? 5 : 3, 2, 4]];
  faces.forEach((face, i) => d.polygon(face.map((id) => points[id - 1]), i === 0 ? rgb.a : rgb.b));
  const id = Number(selected);
  points.forEach((p, i) => {
    if (i === 4) return;
    d.point(p, duplicate === 'split' && i === 2 ? '3 / 5' : String(i + 1), i + 1 === id ? 'highlight' : 'accent', .08, `selected:${i + 1}`);
  });
  const uses = faces.flatMap((face, i) => face.includes(id) ? ['AB'[i]] : []);
  return d.finish([metric('Point ID', id, 'highlight'), metric('Position', xyz(points[id - 1])), metric('Faces', uses.join(', '))],
    duplicate === 'split' ? 'ID 3 กับ 5 อยู่พิกัดเดียวกัน แต่คนละ Face อ้างถึงแต่ละ ID' : 'Polygon อ้างถึง Point ID แม้แต่ละ Point จะมีพิกัดของตัวเอง');
}

function events({ factor, action }, review = false) {
  const d = drawing(false);
  const stages = ['Draft', 'Callback', 'Preview', 'Commit'];
  const active = { draft: 0, preview: 2, apply: 3, cancel: 0 }[action];
  flow(d, stages, active);
  const preview = action === 'preview' || action === 'apply';
  const length = action === 'apply' ? 2 * factor : 2;
  const bar = (y, value, label, tone) => {
    const x = -2.15;
    d.line([x, y, 0], [x + value * .37, y, 0], tone, false, .075);
    d.point([x + .25, y + .12, 0], label, tone, 0);
  };
  bar(-1.32, length, 'ผลที่ยืนยัน', 'accent');
  if (preview) bar(-.65, 2 * factor, 'Preview', 'highlight');
  if (action === 'cancel') d.point([1.25, -.64, 0], review ? 'Rollback' : 'Discard Draft', 'error');
  return d.finish([
    metric('Draft · 2 × Factor', fmt(2 * factor)),
    metric('Preview', preview ? fmt(2 * factor) : '—', 'highlight'),
    metric('ผลที่ยืนยัน', fmt(length), 'accent'),
  ], action === 'cancel' ? 'Cancel ทิ้ง Draft และคงผลเดิม 2' : action === 'apply' ? 'Apply คำนวณจากค่า Draft ล่าสุด' : 'ผล Preview ยังไม่ถูกบันทึก');
}

function projection({ height, lift, shape }) {
  const d = drawing();
  const a = [-1, -.7, 0], b = [1.1, -.7, 0];
  const c = shape === 'line' ? [0, -.7, 0] : [0, 1.05, lift];
  const p = [.4, -.1, height];
  const n = cross(sub(b, a), sub(c, a));
  d.polygon([a, b, c], 'muted');
  d.point(a, 'A'); d.point(b, 'B'); d.point(c, 'C'); d.point(p, 'P', 'highlight');
  if (!Math.hypot(...n)) return d.finish([metric('Normal', 'ไม่มี', 'error'), metric('Signed Distance', '—'), metric('Projection', '—')], 'สามจุดอยู่แนวเดียวกัน จึงใช้สร้างระนาบไม่ได้');
  const normal = unit(n);
  const distance = dot(sub(p, a), normal);
  const q = sub(p, mul(normal, distance));
  d.line(p, q, 'highlight', true);
  d.line(a, add(a, normal), 'muted', true);
  d.point(q, 'P′', 'success');
  return d.finish([metric('Normal', xyz(normal)), metric('Signed Distance', fmt(distance), 'highlight'), metric('P′', xyz(q), 'success')],
    'ลูกศรจาก P ไป P′ ตั้งฉากกับระนาบ คำนวณโดยลบ d × Unit Normal');
}

function pattern({ mode, count, spacing, stagger }) {
  const d = drawing();
  const positions = Array.from({ length: count }, (_, i) => {
    if (mode === 'circle') return turn([spacing, 0, 0], i * 360 / count);
    const row = Math.floor(i / 4), col = i % 4;
    return [(col + stagger * (row % 2)) * spacing, row * Math.sqrt(3) / 2 * spacing, 0];
  });
  positions.forEach((p, i) => {
    d.point(p, String(i), i === count - 1 ? 'highlight' : 'accent');
    if (mode === 'circle' && i > 0) d.line(positions[i - 1], p, 'muted');
  });
  if (mode === 'circle' && count > 2) d.line(positions.at(-1), positions[0], 'muted');
  return d.finish([metric('จำนวนจุด', count), metric(mode === 'circle' ? 'มุมต่อชิ้น' : 'ระยะเยื้องแถวคี่', fmt(mode === 'circle' ? 360 / count : spacing * stagger), 'accent'),
    metric('ตำแหน่ง Index สุดท้าย', xyz(positions.at(-1)), 'highlight')], mode === 'circle' ? 'Index เริ่มที่ 0 และจบก่อน N จึงไม่สร้างจุดแรกซ้ำ' : 'แถวคี่เลื่อนตาม Row Offset คอลัมน์ในแถวเดิมยังห่างเท่าเดิม');
}

function arrayBuild({ mode, count, increment, phase, angleMode }) {
  const d = drawing();
  const angle = angleMode === 'integer' ? Math.trunc(360 / count) : 360 / count;
  const copies = phase === 'paste' ? count : 1;
  const positions = Array.from({ length: copies }, (_, i) => mode === 'linear' ? [i * increment, 0, 0] : turn([increment, 0, 0], angle * i));
  positions.forEach((p, i) => sceneItem(d, p, String(i), i === copies - 1 ? 'highlight' : 'accent'));
  if (phase === 'rotate' && mode === 'radial') d.line(positions[0], turn(positions[0], angle), 'highlight', true);
  const gap = mode === 'radial' ? ` มุมที่เหลือจนปิดวงครบคือ ${fmt(360 - angle * count)}°` : '';
  return d.finish([metric('คำสั่ง', { copy: 'copy()', rotate: 'rotate()/move()', paste: 'paste()' }[phase]), metric('จำนวนที่เห็นในฉาก', copies, 'accent'),
    metric(mode === 'linear' ? 'Step X' : 'มุมต่อชิ้น', fmt(mode === 'linear' ? increment : angle), 'highlight')], 'Lab แสดงแผนวางสำเนา ถ้ากำลังอยู่ก่อน Paste ยังมีชิ้นต้นฉบับหนึ่งชิ้น' + gap);
}

function curve({ t, height, samples }) {
  const d = drawing();
  const a = [-2, -.7, 0], b = [0, height, .55], c = [2, -.7, 0];
  const sample = (u) => mix(mix(a, b, u), mix(b, c, u), u);
  for (let i = 1; i <= 40; i++) d.line(sample((i - 1) / 40), sample(i / 40), 'accent', false, .013);
  for (let i = 0; i <= samples; i++) d.point(sample(i / samples), '', 'muted', .046);
  const q = mix(a, b, t), r = mix(b, c, t), p = sample(t);
  d.line(a, b); d.line(b, c); d.line(q, r, 'highlight');
  d.point(a, 'P0'); d.point(b, 'P1'); d.point(c, 'P2'); d.point(q, 'Q0', 'muted'); d.point(r, 'Q1', 'muted'); d.point(p, 'B(t)', 'highlight');
  return d.finish([metric('t', fmt(t)), metric('B(t)', xyz(p), 'highlight'), metric('จำนวนระยะระหว่าง Samples', samples)], 'ใช้ t เดียวกันสองรอบ จาก Control Points ไป Q0/Q1 แล้วไป B(t)');
}

function uv({ axis, seam, winding }) {
  const d = drawing();
  const p = [[-2.8, -.8, -.4], [-1.15, -.8, -.4], [-1.15, .83, .65], [-2.8, .83, .65]];
  d.polygon(p, 'accent');
  const center = mix(p[0], p[2], .5);
  const normal = unit(mul(cross(sub(p[1], p[0]), sub(p[2], p[0])), winding === 'reverse' ? -1 : 1));
  d.line(center, add(center, normal), 'highlight', true);
  d.point(add(center, normal), 'Normal', 'highlight', 0);
  const yScale = axis === 'xy' ? 1 : (p[2][2] - p[0][2]) / (p[2][1] - p[0][1]);
  const cell = .42;
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const u = 1 + (seam === 'on' && x >= 2 ? .24 : 0) + x * cell, v = -.91 + y * cell * yScale;
    d.polygon([[u, v, 0], [u + cell, v, 0], [u + cell, v + cell * yScale, 0], [u, v + cell * yScale, 0]], (x + y) % 2 ? 'accent' : 'muted', .5, false);
  }
  d.point([1.84, 1.05, 0], 'UV', 'accent', 0);
  return d.finish([metric('Projection', axis.toUpperCase()), metric('Normal', xyz(normal), 'highlight'), metric('UV Seam', seam === 'on' ? 'แยก UV สองฝั่ง' : 'ต่อกัน')], 'ด้านขวาแสดงรูปร่าง Projection ก่อน Normalize ส่วน Winding กำหนดทิศ Normal ของ Mesh');
}

function falloff({ radius, strength, curve, center, selected }) {
  const d = drawing();
  const samples = [-2, -1, 0, 1, 2];
  const weight = (x) => {
    const t = Math.min(Math.abs(x - center) / radius, 1);
    return curve === 'smooth' ? 1 - (3 * t * t - 2 * t * t * t) : 1 - t;
  };
  const sampleX = Number(selected);
  const moved = samples.map((x) => [x, weight(x) * strength, 0]);
  samples.forEach((x, i) => {
    d.line([x, 0, 0], moved[i], 'muted');
    d.point([x, 0, 0], '', 'muted', .05);
    d.point(moved[i], x === sampleX ? `Point X=${x}` : '', x === sampleX ? 'highlight' : 'accent', .08, `selected:${x}`);
    if (i > 0) d.line(moved[i - 1], moved[i], 'accent', false, .016);
  });
  d.line([center - radius, -.3, 0], [center + radius, -.3, 0], 'success');
  d.point([center, -.3, 0], 'Center', 'success');
  return d.finish([metric('Radius', radius), metric(`Weight ที่ X=${sampleX}`, fmt(weight(sampleX)), 'highlight'), metric(`ระยะเลื่อนที่ X=${sampleX}`, fmt(weight(sampleX) * strength), 'accent')], 'จุดที่อยู่ไกลเกิน Radius มี Weight 0 เปรียบเทียบเส้นก่อนและหลังจากตำแหน่งเดียวกัน');
}

function sceneGraph({ parent, angle, visibility }) {
  const d = drawing();
  const p = [parent, 0, 0], child = add(p, turn([2, 0, 0], angle)), camera = [0, 0, 4];
  sceneItem(d, p, 'Parent', 'muted'); sceneItem(d, child, 'Child', 'highlight');
  d.line(p, child, 'accent', true);
  if (visibility === 'camera') {
    const screen = [[-2.2, -1.4, 0], [2.2, -1.4, 0], [2.2, 1.4, 0], [-2.2, 1.4, 0]];
    d.polygon(screen, 'accent', .08);
    screen.forEach((corner) => d.line(camera, corner, 'muted'));
    d.point(camera, 'Camera', 'accent');
  }
  const inside = Math.abs(child[0]) <= 2.2 && Math.abs(child[1]) <= 1.4;
  return d.finish([metric('Child Local', '(2, 0, 0)'), metric('Child World', xyz(child), 'highlight'), metric('จุด Child ในกรอบกล้อง', inside ? 'อยู่ในกรอบ' : 'นอกกรอบ')], 'World Position ของ Child คำนวณหลังนำ Transform ของ Parent ไปใช้');
}

function keys({ offset, fps, frame }, review = false) {
  const d = drawing(false);
  const fixed = 20;
  const delta = review ? Math.floor(offset * fps + 1e-7) : offset;
  const moved = 10 + delta;
  const px = (f) => (f - 15) * .15;
  d.line([px(0), 0, 0], [px(Math.max(38, 10 + delta)), 0, 0], 'muted');
  d.point([px(10), 0, 0], 'เดิม 10', 'muted');
  d.point([px(fixed), 0, 0], 'Key 20', 'accent');
  d.point([px(moved), .66, 0], 'ใหม่ ' + moved, moved === fixed ? 'error' : 'highlight');
  d.line([px(10), .04, 0], [px(moved), .6, 0], 'highlight', true);
  d.line([px(frame), -.25, 0], [px(frame), -1.1, 0], 'success');
  d.point([px(frame), -1.1, 0], 'Playhead ' + frame, 'success');
  const t = Math.max(0, Math.min(1, (frame - 10) / 10));
  sceneItem(d, [px(frame), -1.75, .2], 'Position X ' + fmt(10 * t), 'success');
  return d.finish([metric('Key ใหม่', moved, 'highlight'), metric('Collision', moved === fixed ? 'ชนที่เฟรม 20' : 'ไม่มี', moved === fixed ? 'error' : ''),
    metric('Playhead · วินาที', fmt(frame / fps))],
  review ? 'คำนวณตัวอย่าง Offset บวกบนกริด FPS ใน shift_keys.ls ตรวจผลจริงอีกครั้งสำหรับ Floating-point และเวลาติดลบ' : 'สาธิตย้ายเฉพาะ Key แรก อีก Key อยู่เฟรม 20 จึงใช้เป็นตัวทดสอบ Collision');
}

function cloner({ count, spacing, delay, sample }) {
  const d = drawing();
  for (let i = 0; i < count; i++) {
    const x = i * spacing;
    sceneItem(d, [x, 0, i % 2 * .33], 'F' + (10 + delay * i), i === count - 1 ? 'highlight' : 'accent');
  }
  const samples = Math.floor(60 / sample) + 1;
  const span = Math.max(2, (count - 1) * spacing);
  d.line([0, -.72, 0], [span, -.72, 0], 'muted');
  for (let frame = 0; frame <= 60; frame += sample) {
    const x = span * frame / 60;
    d.line([x, -.84, 0], [x, -.6, 0], 'success', false, .013);
  }
  d.point([0, -1.2, 0], 'F0', 'muted', 0);
  d.point([span, -1.2, 0], 'F60', 'muted', 0);
  return d.finish([metric('เฟรมเริ่มของ Clone สุดท้าย', 10 + delay * (count - 1), 'highlight'),
    metric('Samples ต่อ Channel', samples), metric('Keys รวม · 3 Channels', count * 3 * samples, 'accent')],
  'จัดวางจาก Index แล้วคำนวณจำนวน Keys ก่อน Bake ใช้ช่วงเฟรม 0–60');
}

function parity({ caseId, action }) {
  const d = drawing();
  const a = [0, 0, 0], b = { standard: [3, 4, 0], same: [0, 0, 0], depth: [0, 0, 3] }[caseId];
  for (const [i, label] of ['LScript', 'Python 3'].entries()) {
    const origin = [i * 7 - 3.5, 0, 0];
    d.point(add(a, origin), label, 'muted');
    d.point(add(b, origin), 'B', 'accent');
    if (action === 'run') d.line(add(a, origin), add(b, origin), 'accent', true);
    else d.point(add(origin, [0, -1, 0]), 'Cancel', 'highlight', 0);
  }
  const result = action === 'run' ? fmt(Math.hypot(...b)) : 'Cancel';
  return d.finish([metric('LScript · Expected', result, 'accent'), metric('Python · Expected', result, 'accent'), metric('Scene Writes', 0)],
    'ผลทั้งสองฝั่งเป็นเกณฑ์ที่ใช้เปรียบเทียบตอน Port สูตร Browser ใช้คำนวณ Expected Result สำหรับ Host');
}

function modeler({ selection, tool }) {
  const d = drawing();
  const center = selection === 'subset' ? [-1, .25, 0] : [.25, .25, 0];
  d.box([.25, .25, 0], [4.5, 1, 1], 'muted');
  if (selection === 'subset') d.box(center, [2, 1, 1], 'accent');
  d.point(center, 'Center', 'highlight');
  if (tool === 'center') d.line(center, [0, center[1], 0], 'highlight', true);
  if (tool === 'measure') {
    const delta = selection === 'subset' ? 1 : 2.25;
    const a = add(center, [-delta, -.5, 0]), b = add(center, [delta, .5, 0]);
    d.point(a, 'แรก'); d.point(b, 'สุดท้าย'); d.line(a, b, 'success', true);
  }
  if (tool === 'box') d.box([0, 0, 1.4], [1, 1, 1], 'success');
  return d.finish([metric('ขอบเขต', selection === 'subset' ? 'Selection' : 'ทั้ง Mesh'),
    metric('Center X', fmt(center[0]), 'highlight'), metric('ผลจากเครื่องมือ', tool === 'center' ? 'ย้าย X ' + fmt(-center[0]) : tool === 'box' ? 'กล่อง 1 × 1 × 1' : 'วัดจากจุดปลายสองจุด')],
  'ไล่ช่วงอ่าน Geometry จาก Source ก่อนดูคำสั่งที่จะวัด สร้าง หรือย้ายข้อมูล');
}

const tree = {
  Root: { point: [0, 1.4, 0], children: ['A', 'B'] },
  A: { point: [-1.1, 0, .25], children: ['A1'] },
  A1: { point: [-1.1, -1.28, .5], children: [] },
  B: { point: [1.1, -.12, -.3], children: [] },
};
function hierarchy({ root, visit }) {
  const d = drawing(false);
  const sequence = [];
  function visitChildren(name) {
    sequence.push(name);
    tree[name].children.forEach(visitChildren);
  }
  visitChildren(root);
  const index = Math.min(visit, sequence.length - 1);
  for (const name of sequence) {
    const node = tree[name];
    node.children.forEach((child) => d.line(node.point, tree[child].point, 'muted'));
    const tone = name === sequence[index] ? 'highlight' : sequence.indexOf(name) < index ? 'accent' : 'muted';
    sceneItem(d, node.point, name, tone);
  }
  const focus = sequence.flatMap((name) => [add(tree[name].point, [-.45, -.35, 0]), add(tree[name].point, [.45, .57, .05])]);
  return d.finish([metric('Root', root), metric('กำลังอ่าน', sequence[index], 'highlight'), metric('ลำดับที่อ่านแล้ว', sequence.slice(0, index + 1).join(' → '))],
    'Traversal เก็บ Root ก่อน แล้วเดินลูกแต่ละกิ่งให้จบก่อนกลับมาที่ลูกตัวถัดไป', focus);
}

function material({ rule, phase, sample }) {
  const d = drawing(false);
  const names = ['Body_Paint', 'Body_Paint', 'Body_Decal', 'Trim_Metal'];
  const query = sample === 'paint' ? 'Body_Paint' : 'Body_';
  const matches = (name) => rule === 'exact' ? name === query : rule === 'starts' ? name.startsWith(query) : name.includes(query);
  names.forEach((name, i) => {
    const x = i % 2 * 2 - 1, y = i < 2 ? .65 : -.63;
    const shown = phase === 'apply' && matches(name) ? 'Body_Final' : name;
    d.tile([x, y, 0], shown, matches(name) ? (phase === 'apply' ? 'success' : 'highlight') : 'muted', [1.53, .91]);
  });
  const found = names.filter(matches);
  return d.finish([metric('กฎที่ใช้', rule), metric('ชื่อ Surface ที่ตรง', new Set(found).size),
    metric('Polygon ที่ตรง', found.length, 'highlight')], phase === 'apply' ? 'Apply เปลี่ยน Assignment ของ Polygon ที่ตรงกฎเป็น Body_Final' : 'Dry Run แสดงทั้งจำนวนชื่อและจำนวน Polygon ที่กำลังจะได้รับผล');
}

function nodes({ port, roughness, connected }) {
  const d = drawing(false);
  const colors = { scalar: 'highlight', color: 'accent', vector: 'success' };
  const labels = { scalar: 'Roughness', color: 'Base Color', vector: 'Direction' };
  const rows = ['scalar', 'color', 'vector'];
  rows.forEach((key, i) => {
    const y = .78 - i * .66;
    d.tile([-2.25, y, 0], key[0].toUpperCase() + key.slice(1), key === port ? colors[key] : 'muted', [1.08, .45]);
    d.tile([-.65, y, 0], labels[key], key === port ? colors[key] : 'muted', [1.12, .45]);
    if (key !== port || connected === 'on') d.line([-1.68, y, 0], [-1.25, y, 0], key === port ? colors[key] : 'muted', true);
  });
  const effective = port === 'scalar' && connected === 'on' ? roughness : .5;
  const color = port === 'color' && connected === 'on' ? '#e9a561' : '#92aaca';
  d.surface([1.35, .1, .05], .86, effective, color);
  d.point([1.35, -.89, 0], 'Material Preview', 'accent', 0);
  return d.finish([metric('Port', labels[port], colors[port]), metric('Connection', connected === 'on' ? 'เชื่อมอยู่' : 'ถอดสายแล้ว'),
    metric('Roughness ที่ Preview ใช้', fmt(effective))], 'Material Preview ใช้ค่าที่เชื่อมอยู่ ส่วนค่า Default ของ Roughness ใน Lab คือ 0.5');
}

const eventsOptions = [['draft', 'Draft'], ['preview', 'Preview'], ['apply', 'Apply'], ['cancel', 'Cancel']];
const factor = () => number('factor', 'Factor', 2, .5, 4, .5);
const action = () => select('action', 'Action', eventsOptions);
const offsetFps = () => number('fps', 'FPS', 24, 15, 60);

export const lessonLabs = {
  '01': lab('Modeler กับ Layout', 'เลือก Host แล้วตามป้ายจาก Directive ไปถึง Entry Point เพื่อดูว่าสคริปต์เริ่มรันที่ไหน', [
    select('host', 'Host', [['modeler', 'Modeler'], ['layout', 'Layout']]),
    select('phase', 'ขั้นที่จะแสดง', [['0', 'Host'], ['1', 'Directive'], ['2', 'Entry Point'], ['3', 'ผลลัพธ์']]),
  ], [
    step('host', 'layout', 'เลือก Layout', 'อ่าน @script generic และ Entry Point generic สำหรับตัวอย่างใน Layout'),
    step('phase', '3', 'ไล่ไปถึงผลลัพธ์', 'เลือก “ผลลัพธ์” แล้วดู Scene Item ซึ่งเป็นสิ่งที่ตัวอย่างจัดการ'),
    practice('host', 'เทียบกับ Modeler', 'กด ลองเอง แล้วสลับกลับ Modeler ดูว่า Directive และ Entry Point เปลี่ยนเป็นอะไร'),
  ], runtime, 'Modeler: @script modeler → main\nLayout Generic: @script generic → generic', 'xy'),

  '02': lab('Mesh Inspector', 'เลือก Point 3 แล้วดูว่า Face ไหนใช้จุดนี้ จากนั้นแยก ID ที่พิกัดเดิมแล้วเทียบอีกครั้ง', [
    select('selected', 'Point ID', [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']]),
    select('duplicate', 'การใช้ Point ID', [['shared', 'ใช้ ID 3 ร่วมกัน'], ['split', 'แยก ID 3 กับ 5']]),
  ], [
    step('selected', '3', 'เลือก Point 3', 'อ่าน Faces ใต้ภาพ ทั้ง A และ B อ้างถึง ID 3'),
    step('duplicate', 'split', 'แยก Point ID โดยคงพิกัด', 'ป้าย 3 / 5 อยู่ตำแหน่งเดียวกัน แต่ Point 3 เหลือเพียง Face A'),
    practice('selected', 'หา Point ที่ยังใช้ร่วมกัน', 'กด ลองเอง เลือก Point 2 แล้วดูว่าทั้งสอง Face ยังใช้ ID เดียวกันหรือไม่'),
  ], pointMesh, 'อ่าน Point IDs ของ Polygon จาก polyinfo() ตาม API Contract\nfacesUsingPoint = faces.filter(face => face.contains(pointID))'),

  '04': lab('Requester Event Flow', 'ทดลอง Preview แล้ว Apply เพื่อดูว่าตัวเลขขยับจาก Draft ไปเป็นผลที่ยืนยันตอนไหน', [
    factor(), action(),
  ], [
    step('action', 'preview', 'เลือก Preview', 'Callback คำนวณ Draft 2 × 2 = 4 แต่ผลที่ยืนยันยังเป็น 2'),
    step('action', 'apply', 'เลือก Apply', 'ผลที่ยืนยันเปลี่ยนเป็น 4 เมื่อเราเลือก Apply'),
    practice('action', 'ลอง Cancel', 'ในแบบจำลองนี้แต่ละ Action เริ่มจากผลเดิม 2 กด ลองเอง และเลือก Cancel เพื่อดูว่าค่า Preview หายไปตรงไหน'),
  ], events, 'reqbegin() → สร้าง Control → reqpost()\nCallback ใช้ Draft สำหรับ Preview\nเมื่อ OK: getvalue() → reqend() → Commit', 'xy'),

  '06': lab('Point-to-Plane Projection', 'เลื่อนจุด P ขึ้นจากระนาบ แล้วดูเส้นตั้งฉากระหว่าง P กับจุดฉาย P′', [
    number('height', 'P.Z', .7, -3, 3, .1), number('lift', 'C.Z', 0, -2, 2, .1),
    select('shape', 'รูปของจุด A, B, C', [['triangle', 'สร้างสามเหลี่ยม'], ['line', 'อยู่บนแนวเดียวกัน']]),
  ], [
    step('height', '2', 'ยก P ไปที่ Z = 2', 'เมื่อระนาบยังอยู่ที่ Z = 0 ระยะตั้งฉากจะเท่ากับ 2'),
    step('lift', '1.4', 'เอียงระนาบโดยยก C', 'จุดฉาย P′ ขยับตามระนาบ แม้พิกัด P ยังเท่าเดิม'),
    practice('shape', 'ลองระนาบที่สร้างไม่ได้', 'กด ลองเอง แล้วเลือกให้ A, B, C อยู่แนวเดียวกัน ตรวจว่าเหตุใดผลจึงเป็นขีด'),
  ], projection, 'n = normalize(cross(B − A, C − A))\nd = dot(P − A, n)\nP′ = P − d n'),

  '07': lab('Circle Points & Honeycomb', 'เพิ่มจำนวนจุดบนวงกลม แล้วเปลี่ยนเป็น Honeycomb เพื่อดูว่ากฎจัดตำแหน่งต่างกันอย่างไร', [
    select('mode', 'Pattern', [['circle', 'Circle'], ['hex', 'Honeycomb']]),
    number('count', 'Count', 4, 1, 20), number('spacing', 'Radius / Spacing', 1.2, .4, 3, .1),
    number('stagger', 'Row Offset (× Spacing)', .5, 0, 1, .1),
  ], [
    step('count', '8', 'เพิ่ม Count เป็น 8', 'วงกลมมีมุมต่อจุด 45° และ Index สุดท้ายคือ 7'),
    step('mode', 'hex', 'สลับเป็น Honeycomb', 'สังเกตแถวที่สองเลื่อนไปครึ่งหนึ่งของ Spacing'),
    practice('spacing', 'เปลี่ยนขนาด Pattern', 'กด ลองเอง แล้วเพิ่ม Spacing ดูว่าตำแหน่งขยายแต่จำนวนจุดคงเดิม'),
  ], pattern, 'วงกลม: θ = 2πi/N, P = (r cos θ, r sin θ)\nแถวเหลื่อม: X = (col + rowOffset × (row mod 2)) × s', 'xy'),

  '08': lab('Linear/Radial Array Stepper', 'ไล่คำสั่งจากต้นฉบับถึง Paste แล้วเทียบตำแหน่งของ Array แบบเส้นตรงและแบบวงกลม', [
    select('mode', 'Array', [['linear', 'Linear'], ['radial', 'Radial']]),
    select('phase', 'คำสั่ง', [['copy', 'copy()'], ['rotate', 'rotate() / move()'], ['paste', 'paste()']]),
    number('count', 'Count รวมต้นฉบับ', 4, 1, 12), number('increment', 'Step / Radius', 1.3, .6, 3, .1),
    select('angleMode', 'มุม Radial', [['exact', 'ใช้ทศนิยม'], ['integer', 'ตัดเป็นจำนวนเต็ม']]),
  ], [
    step('phase', 'paste', 'เลือก paste()', 'ดูจำนวนชิ้นเพิ่มจาก 1 เป็น 4 ตำแหน่งของ Linear Array ตาม Step X'),
    step('mode', 'radial', 'เปลี่ยนเป็น Radial', 'ชิ้นงานกระจายรอบศูนย์กลางทีละ 90°'),
    practice('count', 'ลองจำนวนที่หาร 360 ไม่ลงตัว', 'กด ลองเอง ตั้ง Count เป็น 7 แล้วสลับมุม Radial เป็นจำนวนเต็มเพื่อเทียบช่องว่างกับ radial_array.ls'),
  ], arrayBuild, 'Linear: X[i] = X0 + i × step\nRadial: angle[i] = i × (360 / count)\nอ่าน copy(), rotate(), paste() ใน radial_array.ls'),

  '10': lab('Bézier Construction', 'เลื่อน t แล้วติดตามจาก P0/P1/P2 ไป Q0/Q1 และจุดบน Curve ทีละขั้น', [
    number('t', 't', 0, 0, 1, .01), number('height', 'ความสูงของ P1', 1.3, -2, 3, .1), number('samples', 'Sample Intervals', 8, 2, 18),
  ], [
    step('t', '.5', 'เลื่อน t ไปครึ่งทาง', 'เส้นสีเน้นเชื่อม Q0 กับ Q1 จุด B(t) อยู่ครึ่งทางบนเส้นนั้น'),
    step('height', '2.5', 'ยก Control Point P1', 'สังเกตรูปร่างของ Curve และค่า B(t) เปลี่ยน แต่ P0/P2 ยังอยู่ที่เดิม'),
    practice('t', 'ตรวจปลาย Curve', 'กด ลองเอง แล้วเลื่อน t ไป 1 จุด B(t) ควรตรงกับ P2'),
  ], curve, 'Q0 = lerp(P0, P1, t)\nQ1 = lerp(P1, P2, t)\nB(t) = lerp(Q0, Q1, t)'),

  '11': lab('Mesh ↔ UV Workspace', 'เทียบ Mesh กับ UV Plane แล้วลองเปิด Seam และกลับ Normal แยกกัน', [
    select('axis', 'Projection', [['xy', 'XY'], ['xz', 'XZ']]),
    select('seam', 'UV Seam', [['off', 'ต่อเนื่อง'], ['on', 'แยกที่รอยต่อ']]),
    select('winding', 'Winding', [['forward', 'ตามลำดับ'], ['reverse', 'กลับลำดับ']]),
  ], [
    step('seam', 'on', 'เปิด UV Seam', 'ช่อง Checker สองฝั่งแยกบน UV Plane แต่ Mesh ทางซ้ายยังเป็นตำแหน่งเดิม'),
    step('winding', 'reverse', 'กลับ Winding', 'Normal Arrow พลิกทิศในฉาก ค่า UV แยกจากการพลิก Normal'),
    practice('axis', 'ลอง Projection XZ', 'กด ลองเอง แล้วสลับ Projection เทียบรูปร่างของ UV Plane'),
  ], uv, 'n = normalize(cross(P1 − P0, P2 − P0))\nu = (x − minX)/(maxX − minX)\nv ใช้แกน y หรือ z ตาม Projection'),

  '12': lab('Falloff Field', 'ขยาย Radius และเทียบ Linear กับ Smooth ที่จุด X = 1', [
    number('radius', 'Radius', 2, .5, 5, .5), number('strength', 'Strength', 2, 0, 5, .25),
    number('center', 'Center X', 0, -3, 3, .25), select('curve', 'Falloff', [['linear', 'Linear'], ['smooth', 'Smooth']]),
    select('selected', 'Point ที่ตรวจ (X)', [1, 0, -1, -2, 2].map((x) => [String(x), String(x)])),
  ], [
    step('radius', '4', 'ขยาย Radius เป็น 4', 'Point X=1 ได้ Weight 0.75 จึงขยับ 1.5 เมื่อ Strength = 2'),
    step('curve', 'smooth', 'เปลี่ยนเป็น Smooth', 'เมื่อระยะเท่าเดิม Weight เปลี่ยนเป็น 0.844 โดยประมาณ'),
    practice('center', 'ย้าย Center', 'กด ลองเอง แล้วเลื่อน Center ไปที่ X = 1 ค่า Weight ของจุดนั้นควรเป็น 1'),
  ], falloff, 't = clamp(distance / radius, 0, 1)\nlinear = 1 − t\nsmooth = 1 − (3t² − 2t³)\nP′ = P + weight × Offset', 'xy'),

  '13': lab('Parent–Child & Camera Frustum', 'หมุน Parent แล้วดูตำแหน่ง Child จากนั้นเปิดกรอบ Camera เพื่อดูจุดที่อยู่ในภาพ', [
    number('parent', 'Parent X', 0, -5, 5, .25), number('angle', 'Parent Rotation Z', 0, -180, 180, 1),
    select('visibility', 'สิ่งที่แสดง', [['scene', 'Scene Hierarchy'], ['camera', 'แนวกรอบ Camera']]),
  ], [
    step('angle', '90', 'หมุน Parent รอบ Z 90°', 'Child Local ยังเป็น (2, 0, 0) แต่ Child World เปลี่ยนเป็น (0, 2, 0)'),
    step('visibility', 'camera', 'เปิดกรอบ Camera', 'Child อยู่สูงกว่าขอบกรอบ ของจริงจะตรวจด้วยมุมกล้องของ Scene'),
    practice('parent', 'ย้าย Parent', 'กด ลองเอง ปรับ Parent X แล้วดู Child World เปลี่ยนตาม'),
  ], sceneGraph, 'worldChild = parentPosition + rotateZ(childLocal, parentRotation)'),

  '14': lab('Channel Timeline', 'เลื่อน Key ที่เฟรม 10 แล้วทดสอบว่า Target ชน Key ที่เฟรม 20 หรือไม่', [
    number('offset', 'Offset (frames)', 0, -10, 18), offsetFps(), number('frame', 'Playhead', 10, 0, 35),
  ], [
    step('offset', '10', 'ตั้ง Offset 10 เฟรม', 'Key แรกเลื่อนจาก 10 ไป 20 พอดี จึงชน Key เดิม'),
    step('frame', '15', 'เลื่อน Playhead ไปที่เฟรม 15', 'อ่านเวลาตาม FPS และค่า Interpolation จาก Key เดิมที่อยู่ระหว่าง 10–20'),
    practice('offset', 'ลองหลบ Collision', 'กด ลองเอง แล้วเปลี่ยน Offset เป็น 5 ตรวจผลในช่อง Collision'),
  ], keys, 'targetFrame = oldFrame + offsetFrames\nseconds = frame / fps\ncollision = stationaryKeys.includes(targetFrame)', 'xy'),

  '15': lab('Mini Cloner & Bake Preview', 'เพิ่ม Clone แล้วเปลี่ยน Sample Step เพื่อดูว่าต้องสร้าง Keys เท่าไร', [
    number('count', 'Clone Count', 3, 1, 12), number('spacing', 'Distance Step', 1.3, .6, 3, .1),
    number('delay', 'Frame Offset ต่อ Clone', 3, 0, 10), number('sample', 'Sample Step', 5, 1, 12),
  ], [
    step('count', '6', 'เพิ่ม Clone Count เป็น 6', 'กล้องเลื่อนไปจัดเฟรมลำดับใหม่ทั้งหมด ดูเฟรมเริ่มของตัวสุดท้าย'),
    step('sample', '2', 'ลด Sample Step เป็น 2', 'จำนวน Samples เพิ่มจาก 13 เป็น 31 ต่อ Channel และจำนวน Clones คงเดิม'),
    practice('delay', 'เปลี่ยนเวลาของแต่ละ Clone', 'กด ลองเอง ลอง Frame Offset ต่อ Clone = 0 ป้ายเวลาเริ่มจะตรงกัน'),
  ], cloner, 'clone[i].frame = 10 + i × delay\nsamples = floor(60 / sampleStep) + 1\nkeys = cloneCount × channels × samples'),

  '16': lab('LScript / Python Parity', 'ลอง Test Case เดียวกันทั้งสองฝั่ง แล้วตรวจว่า Cancel เก็บ Scene ไว้เหมือนเดิม', [
    select('caseId', 'Test Case', [['standard', 'ระยะ 3–4–5'], ['same', 'A ตรงกับ B'], ['depth', 'ต่างเฉพาะแกน Z']]),
    select('action', 'Action', [['run', 'คำนวณ Expected Result'], ['cancel', 'Cancel']]),
  ], [
    step('caseId', 'depth', 'เลือกจุดที่ต่างเฉพาะ Z', 'ทั้งสองฝั่งต้องคาดหวังระยะ 3 เพื่อป้องกันการพอร์ตสูตรที่ลืมแกน Z'),
    step('action', 'cancel', 'เลือก Cancel', 'ผลทั้งสองฝั่งเป็น Cancel และ Scene Writes เป็น 0'),
    practice('caseId', 'ลองจุดซ้อนตำแหน่ง', 'กด ลองเอง เลือก A ตรงกับ B แล้วสลับ Action กลับเป็นคำนวณ ควรได้ 0 ทั้งคู่'),
  ], parity, 'Core: distance = length(B − A)\nRequester: Cancel → exit\nHost Adapter: ตรวจ API และผลจริงใน Modeler แยกจาก Expected Result'),

  'review-modeler': lab('Selection & Bounding Box', 'เปลี่ยนจากทั้ง Mesh เป็น Selection แล้วตามจุด Center ที่ Center X จะใช้', [
    select('selection', 'ขอบเขต', [['all', 'ทั้ง Mesh'], ['subset', 'Selection']]),
    select('tool', 'เครื่องมือ', [['center', 'Center X'], ['measure', 'Measure Points'], ['box', 'Create Unit Box']]),
  ], [
    step('selection', 'subset', 'เลือกขอบเขต Selection', 'Center X เปลี่ยนจาก 0.25 เป็น −1 เพราะขอบเขตที่อ่านเปลี่ยน'),
    step('tool', 'measure', 'สลับเป็น Measure Points', 'ดูจุดแรกและจุดสุดท้ายของ Selection ที่ใช้วัดระยะ'),
    practice('tool', 'ลอง Create Unit Box', 'กด ลองเอง แล้วเลือก Create Unit Box ดูกล่องอ้างอิงขนาด 1 × 1 × 1'),
  ], modeler, 'Center_X.ls · selmode(USER) → boundingbox() → move()\nMeasure_Points.ls · อ่านจุดแรกและจุดสุดท้าย\nCreate_Unit_Box.ls · makebox()'),

  'review-ui': lab('Preview / Apply / Cancel', 'ดู Preview ก่อน แล้วเปลี่ยน Factor เพื่อดูว่า Callback ใช้ Draft ล่าสุดอย่างไร', [
    factor(), action(),
  ], [
    step('action', 'preview', 'เปิด Preview', 'Draft 2 × 2 แสดง Preview = 4 ผลที่ยืนยันอยู่ที่ 2'),
    step('factor', '3', 'เปลี่ยน Factor ขณะ Preview', 'Callback คำนวณใหม่เป็น 6 แต่ผลที่ยืนยันยังเป็น 2'),
    practice('action', 'เทียบ Apply กับ Cancel', 'กด ลองเอง เลือก Apply เพื่อดูผล 6 แล้วเลือก Cancel เพื่อดูเส้นทาง Rollback ของสถานการณ์ตัวอย่าง'),
  ], (input) => events(input, true), 'ctlrefresh() → Callback → Preview\nreqpost() ตัดสินเส้นทาง Apply หรือ Cancel\nPreview ที่แก้ Mesh ต้องออกแบบการคืน State', 'xy'),

  'review-layout': lab('Hierarchy Trace', 'เลือก Root แล้วเลื่อนลำดับที่กำลังอ่าน เพื่อดูการเดินกิ่งของ selectchildren.ls', [
    select('root', 'Root Item', [['Root', 'Root'], ['A', 'A'], ['B', 'B']]),
    number('visit', 'Traversal Index', 0, 0, 3),
  ], [
    step('visit', '2', 'ไปที่ Index 2', 'Root → A → A1 แสดงว่ากิ่ง A ถูกอ่านจนถึง A1 ก่อนมาที่ B'),
    step('root', 'A', 'เปลี่ยน Root เป็น A', 'กล้องจัดเฟรมเฉพาะกิ่งของ A และลำดับมีเพียง A → A1'),
    practice('root', 'ลอง Root ที่ไม่มีลูก', 'กด ลองเอง แล้วเลือก B ลำดับควรมี B เพียงตัวเดียว'),
  ], hierarchy, 'selectchildren.ls · findChildren(rootObj)\nเก็บ Root → firstChild() → เรียกซ้ำ → nextChild()', 'xy'),

  'review-animation': lab('Shift Keys · Before/After', 'เปลี่ยน Offset เป็นวินาที แล้วเปลี่ยน FPS เพื่อดูว่าเวลาเดียวกันตกที่เฟรมไหน', [
    number('offset', 'Offset (seconds)', 0, 0, 1.2, .01), offsetFps(), number('frame', 'Playhead', 10, 0, 35),
  ], [
    step('offset', '.5', 'เพิ่ม Offset 0.5 วินาที', 'ที่ 24 FPS เพิ่ม 12 เฟรม Key จาก 10 ไป 22'),
    step('fps', '20', 'เปลี่ยน Scene เป็น 20 FPS', 'เวลาเดิมเท่ากับ 10 เฟรม จึงชน Key ที่ 20'),
    practice('offset', 'ลองเวลาไม่ตรงกริด', 'กด ลองเอง ใส่ 0.53 วินาที แล้วเทียบตำแหน่งหลัง Snap กับผลก่อน Snap'),
  ], (input) => keys(input, true), 'shift_keys.ls · getKeyTime() → เพิ่ม Offset → Snap ด้วยช่วง 1/fps → moveKey()', 'xy'),

  'review-materials': lab('Surface Assignment Dry Run', 'เทียบจำนวนชื่อที่ตรงกับจำนวน Polygon แล้วจำลอง Apply หลังตรวจผล', [
    select('rule', 'Match Rule', [['contains', 'Contains'], ['starts', 'Starts With'], ['exact', 'Exact']]),
    select('sample', 'ข้อความค้นหา', [['prefix', 'Body_'], ['paint', 'Body_Paint']]),
    select('phase', 'Action', [['preview', 'Dry Run'], ['apply', 'Apply']]),
  ], [
    step('sample', 'paint', 'ค้นหา Body_Paint', 'มีชื่อ Surface ตรงหนึ่งชื่อ แต่ Polygon ที่อ้างถึงชื่อนั้นมีสองตัว'),
    step('phase', 'apply', 'เลือก Apply หลังเห็นผล', 'สอง Polygon ที่ตรงเปลี่ยนเป็น Body_Final ส่วน Body_Decal และ Trim_Metal คงชื่อเดิม'),
    practice('rule', 'ลอง Match แบบ Exact', 'กด ลองเองเปลี่ยน Match Rule เป็น Exact และลองค้น Body_ เพื่อดูกรณีไม่มีชื่อที่ตรง'),
  ], material, 'Reassign_Surface.ls · เลือกกฎค้นหาชื่อ → selpolygon() → changesurface() เมื่อมีรายการที่ตรง', 'xy'),

  'review-nodes': lab('Shading Data Flow', 'ปรับ Roughness ขณะต่อ Scalar อยู่ แล้วถอดสายเพื่อตรวจว่าค่า Default ทำงานเมื่อไร', [
    select('port', 'Port ที่ดู', [['scalar', 'Scalar'], ['color', 'Color'], ['vector', 'Vector']]),
    number('roughness', 'Roughness', .18, .05, 1, .01),
    select('connected', 'Connection', [['on', 'เชื่อมอยู่'], ['off', 'ถอดสาย']]),
  ], [
    step('roughness', '.75', 'เพิ่ม Roughness เป็น 0.75', 'ดู Highlight บน Material Preview กระจายกว้างขึ้นเมื่อใช้ Roughness สูง'),
    step('connected', 'off', 'ถอดสาย Scalar', 'Material กลับใช้ค่า Default 0.5 และเส้นไปยัง Roughness หายไป'),
    practice('port', 'ลองเลือก Color หรือ Vector', 'กด ลองเอง แล้วดูชื่อ Input ที่เข้าคู่กับแต่ละชนิด ลองต่อ Color กลับเพื่อเปลี่ยน Base Color'),
  ], nodes, 'LightWave SDK · Node Input / Node Output / evaluate()\nLab ใช้ Three.js Material Preview เพื่อแสดงผลของค่าที่เชื่อม', 'xy'),
};
