import { meshStudy, pivotStudy, vectorStudy } from './interactive-math.js';
import { demoPanel, demoTools, mountDemo } from './lab-demo.js';
import { lessonLabs } from './lesson-labs.js';
import { primaryDemos } from './primary-lab-demos.js';

const labs = {
  mesh: {
    title: 'Mesh Doctor',
    prompt: 'เลือกขอบ 2–3 แล้วเพิ่ม Face C ดูว่าขอบเดียวกันเปลี่ยนจาก Shared เป็น Non-manifold อย่างไร',
    guide: 'ลากภาพเพื่อหมุนกล้อง คลิก Point หรือ Edge ในภาพ หรือใช้เมนูเลือกด้านล่าง',
    input: `
      <label class="three-select">Mesh ตัวอย่าง<select data-field="scenario">
        <option value="base">สองหน้าใช้ขอบร่วมกัน</option>
        <option value="third">เพิ่ม Face C ที่ขอบ 2–3</option>
        <option value="seam">Seam · ตำแหน่งซ้ำ แต่ Point ID ต่าง</option>
      </select></label>
      <label class="three-select">ตรวจ Point หรือ Edge<select data-field="selection"></select></label>
      <div data-sliders="mesh"></div>`,
    source: `<p>ใน LScript ให้ใช้ Point IDs จาก <code>polyinfo()</code> ตาม API Contract ของ Host จากนั้นสร้างคู่ ID แบบเรียงเพื่อให้ A→B และ B→A อ้างถึงขอบเดียวกัน</p>
      <pre><code>edgeKey = sort([pointA, pointB]).join("-")
facesUsingEdge[edgeKey].push(faceID)
candidate = distance(pointA, pointB) ≤ tolerance</code></pre>
      <p>คำอธิบายในกล่องผลลัพธ์อ่านจากแผนที่เดียวกับเส้นใน Viewport ส่วน Candidate เป็นรายงานสำหรับตัดสินใจก่อน Weld</p>`,
  },
  vector: {
    title: 'Vector Workbench',
    prompt: 'เริ่มที่ A = (1, 0, 0) และ B = (4, 4, 0) แล้วเปลี่ยน B.z ดูว่าระยะเพิ่มแม้ภาพ XY จะเหมือนเดิม',
    guide: 'ลากภาพเพื่อหมุนกล้อง สลับ XY หรือ XZ เพื่อแยกสิ่งที่ฉายลงระนาบออกจากค่าจริงสามมิติ',
    input: `
      <label class="three-select">การคำนวณ<select data-field="vector-mode">
        <option value="displacement">Displacement · B − A</option>
        <option value="dot">Dot Product · Projection</option>
        <option value="cross">Cross Product · Normal</option>
      </select></label>
      <div class="three-coordinate-group">
        <fieldset><legend>A</legend><div data-sliders="a"></div></fieldset>
        <fieldset><legend>B</legend><div data-sliders="b"></div></fieldset>
      </div>
      <button type="button" data-perpendicular>ลองเวกเตอร์ตั้งฉาก</button>`,
    source: `<p>เปรียบเทียบ Displacement กับ <a href="./examples/distance_inspector.ls" download>Distance Inspector</a> ใน Module 04 ซึ่งคำนวณความยาวจากผลต่างทั้งสามแกน</p>
      <pre><code class="language-lscript">d = b - a;
length = sqrt(d.x*d.x + d.y*d.y + d.z*d.z);</code></pre>
      <p>Dot Product ใช้บอกทิศสัมพันธ์และความยาวของ Projection ส่วน Cross Product ใช้ลำดับ a × b จึงกลับทิศเมื่อสลับ a กับ b</p>`,
  },
  pivot: {
    title: 'Custom Pivot',
    prompt: 'หมุน P รอบ C 90° แล้วเปลี่ยน Translate X เป็น 2 สลับลำดับทั้งสองเพื่อดูว่าตำแหน่งปลายทางต่างกันอย่างไร',
    guide: 'ชิ้นงานเดิมเป็นสีเทา ผลที่เลือกระบายด้วยสี Accent และจุดอีกลำดับแสดงเป็นสีเขียว',
    input: `
      <div class="three-coordinate-group">
        <label class="three-select">จุดเริ่มต้น<select data-field="point">
          <option value="hinge">P (3, 1, 0)</option>
          <option value="unit">P (1, 0, 0)</option>
        </select></label>
        <label class="three-select">แกนหมุน<select data-field="axis">
          <option value="z">Z</option><option value="x">X</option><option value="y">Y</option>
        </select></label>
      </div>
      <label class="three-select">ลำดับ Transform<select data-field="order">
        <option value="pivot-first">Scale/Rotate → Translate</option>
        <option value="move-first">Translate → Scale/Rotate</option>
      </select></label>
      <div data-sliders="pivot"></div>`,
    source: `<p>ใช้ Pivot เดียวกันในทั้งสองลำดับ ดึง Pivot ออกจาก P เพื่อคำนวณรอบ Origin แล้วบวกกลับ</p>
      <pre><code>aroundPivot(p) = C + R(scale × (p − C))
pivotFirst(p)  = aroundPivot(p) + T
moveFirst(p)   = aroundPivot(p + T)</code></pre>
      <p>ทดสอบด้วยพิกัดจากบทเรียนก่อน แล้วค่อยเทียบแกนและทิศหมุนเมื่อทดลองใน Modeler</p>`,
  },
};

const fixed = (value, digits = 3) => {
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
};
const coordinates = (values) => `(${values.map((value) => fixed(value)).join(', ')})`;
const axes = ['X', 'Y', 'Z'];

function range(label, min, max, value, step = .1) {
  return { label, min, max, value, step };
}

function sliderGroup(container, definitions, onInput, signal) {
  const fields = {};
  for (const [name, definition] of Object.entries(definitions)) {
    const { label, min, max, value, step } = definition;
    const row = document.createElement('div');
    row.className = 'three-slider';
    const heading = document.createElement('span');
    heading.textContent = label;
    const slider = document.createElement('input');
    slider.type = 'range';
    const numeric = document.createElement('input');
    numeric.type = 'number';
    for (const input of [slider, numeric]) {
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;
    }
    slider.setAttribute('aria-label', `${label} Slider`);
    numeric.setAttribute('aria-label', `${label} ค่า`);
    row.append(heading, slider, numeric);
    container.append(row);

    function update(next) {
      slider.value = Math.min(max, Math.max(min, next));
      numeric.value = slider.value;
    }

    slider.addEventListener('input', () => {
      numeric.value = slider.value;
      onInput();
    }, { signal });
    numeric.addEventListener('input', () => {
      if (numeric.validity.valid && numeric.value !== '') {
        slider.value = numeric.value;
        onInput();
      }
    }, { signal });
    numeric.addEventListener('change', () => {
      update(numeric.value === '' ? Number(slider.value) : Number(numeric.value));
      onInput();
    }, { signal });

    fields[name] = { numeric, get: () => Number(slider.value), set: update, reset: () => update(value) };
  }
  return fields;
}

export function mountLab(host) {
  const kind = host.dataset.threeLab;
  const lesson = lessonLabs[kind];
  const lab = labs[kind] ?? lesson;
  const demo = primaryDemos[kind] ?? lesson;
  const input = lesson ? '<div class="lesson-fields" data-lesson-fields></div>' : lab.input;
  const source = lesson ? '<pre><code data-lesson-source></code></pre>' : lab.source;
  const lifecycle = new AbortController();
  const { signal } = lifecycle;
  const captionId = `three-title-${kind}`;
  host.innerHTML = `
    <section class="three-lab" aria-labelledby="${captionId}">
      <div class="three-lab-heading">
        <h3 id="${captionId}">${lab.title}</h3>
        <div class="three-lab-actions">
          ${demoTools}
          <button type="button" data-reset>รีเซ็ตค่า</button>
        </div>
      </div>
      ${demoPanel}
      ${lab.prompt ? `<p class="three-prompt">${lab.prompt}</p>` : ''}
      <div class="three-layout">
        <div class="three-visual">
          <div class="three-viewport" data-viewport></div>
          <div class="three-views" role="group" aria-label="มุมมองกล้อง">
            <button type="button" data-camera="orbit" aria-pressed="true" disabled>3D</button>
            <button type="button" data-camera="xy" aria-pressed="false" disabled>XY</button>
            <button type="button" data-camera="xz" aria-pressed="false" disabled>XZ</button>
            <button type="button" data-zoom="out" aria-label="ซูมออก" disabled>−</button>
            <button type="button" data-zoom="in" aria-label="ซูมเข้า" disabled>+</button>
          </div>
          <p class="three-guide">${lab.guide ?? 'เลือกมุมกล้องหรือหมุนเพื่อดูภาพจากอีกด้าน'}</p>
          <p class="three-guide">ลากเพื่อหมุน · Shift+ลากเพื่อ Pan · Ctrl+ลาก หรือเลื่อนล้อ / Trackpad เพื่อซูม</p>
          <p class="three-status" role="status" data-status>กำลังโหลดมุมมอง Three.js</p>
        </div>
        <div class="three-controls">${input}</div>
      </div>
      <div class="three-results" data-results aria-label="ผลคำนวณ"></div>
      <details class="three-source">
        <summary>ดูสูตรและ Source Code</summary>
        ${source}
      </details>
    </section>`;

  const field = (name) => host.querySelector(`[data-field="${name}"]`);
  const group = (name) => host.querySelector(`[data-sliders="${name}"]`);
  const readout = host.querySelector('[data-results]');
  const status = host.querySelector('[data-status]');
  if (lesson) host.querySelector('[data-lesson-source]').textContent = lesson.source;
  const cameraButtons = [...host.querySelectorAll('[data-camera]')];
  const zoomButtons = [...host.querySelectorAll('[data-zoom]')];
  for (const code of host.querySelectorAll('pre code.language-lscript')) {
    code.innerHTML = window.highlightLScript(code.textContent, 'lscript');
  }
  const viewportHost = host.querySelector('[data-viewport]');
  let viewport;
  let state;
  let fields;
  let manualCamera = false;
  let activeView = demo.view ?? 'orbit';

  function metric(title, value, tone = '') {
    const item = document.createElement('div');
    item.className = 'three-result';
    if (tone) item.dataset.tone = tone;
    const label = document.createElement('span');
    label.textContent = title;
    const output = document.createElement('strong');
    output.textContent = value;
    item.append(label, output);
    return item;
  }

  function show(results, explanation) {
    const items = document.createElement('div');
    items.className = 'three-metrics';
    items.append(...results);
    const detail = document.createElement('p');
    detail.textContent = explanation;
    readout.replaceChildren(items, detail);
  }

  function meshState() {
    const scenario = field('scenario').value;
    const selection = field('selection');
    const model = meshStudy(scenario, fields.lift.get(), fields.tolerance.get());
    const alreadySelected = selection.value;
    const entries = [
      ...[...model.edges.values()].map(({ key }) => [`edge:${key}`, `Edge ${key}`]),
      ...Object.keys(model.points).map((id) => [`point:${id}`, `Point ${id}`]),
    ];
    if (entries.map(([id]) => id).join('|') !== selection.dataset.options) {
      selection.replaceChildren(...entries.map(([id, label]) => new Option(label, id)));
      selection.dataset.options = entries.map(([id]) => id).join('|');
      selection.value = entries.some(([id]) => id === alreadySelected) ? alreadySelected
        : entries.some(([id]) => id === 'edge:2-3') ? 'edge:2-3' : entries[0][0];
    }
    const [type, id] = selection.value.split(':');
    const edge = model.edges.get(id);
    const selected = type === 'edge'
      ? `Edge ${id} อยู่ใน Face ${edge.faces.join(', ')} (${edge.faces.length} หน้า)`
      : `Point ${id} ${coordinates(model.points[id])} อยู่ใน Face ${model.faces.filter((face) => face.points.includes(Number(id))).map((face) => face.id).join(', ')}`;
    const candidates = model.weld.length
      ? `Weld Candidates: ${model.weld.map(({ pair, distance }) => `${pair.join('–')} (ระยะ ${fixed(distance)})`).join(', ')}`
      : 'ยังไม่มี Weld Candidate ใน Tolerance นี้';
    show([
      metric('Boundary · 1 Face', String(model.counts.boundary), 'muted'),
      metric('Shared · 2 Faces', String(model.counts.shared), 'accent'),
      metric('Non-manifold · 3+ Faces', String(model.counts.nonManifold), 'error'),
    ], `${selected} · ${candidates}`);
    return { ...model, selected: selection.value };
  }

  function vectorState() {
    const a = axes.map((name) => fields[`a${name}`].get());
    const b = axes.map((name) => fields[`b${name}`].get());
    const mode = field('vector-mode').value;
    const data = vectorStudy(a, b);
    if (mode === 'displacement') {
      show([
        metric('B − A', coordinates(data.displacement), 'accent'),
        metric('Magnitude', fixed(data.length)),
        metric('Unit Vector', data.unit ? coordinates(data.unit) : 'ไม่กำหนด'),
      ], data.unit ? 'Magnitude รวม X, Y, Z แม้ในมุม XY จะเห็นแค่สองแกน' : 'A และ B อยู่จุดเดียวกัน จึงไม่มีทิศทางของ Displacement');
    } else {
      const angle = data.angle === null ? 'ไม่กำหนด' : `${fixed(data.angle)}°`;
      if (mode === 'dot') {
        show([
          metric('a · b', fixed(data.dot), 'accent'),
          metric('Projection ของ b บน a', data.projection ? coordinates(data.projection) : 'ไม่กำหนด'),
          metric('มุมระหว่าง a กับ b', angle),
        ], 'ในโหมดนี้ A และ B หมายถึงเวกเตอร์ a และ b ซึ่งเริ่มจาก Origin');
      } else {
        show([
          metric('a × b', coordinates(data.cross), 'accent'),
          metric('ความยาวของ a × b', fixed(Math.hypot(...data.cross))),
          metric('มุมระหว่าง a กับ b', angle),
        ], 'ทิศของ a × b ตั้งฉากกับทั้งสองเวกเตอร์เมื่อผลคูณไม่เป็นศูนย์');
      }
    }
    return { ...data, mode };
  }

  function transformState() {
    const pivot = axes.map((name) => fields[`pivot${name}`].get());
    const point = field('point').value === 'unit' ? [1, 0, 0] : [3, 1, 0];
    const { transform, alternate } = pivotStudy({
      pivot, axis: field('axis').value, angle: fields.angle.get(),
      scale: fields.scale.get(), shift: fields.shift.get(), order: field('order').value,
    });
    const before = [point, [point[0] + .9, point[1], point[2]], [point[0], point[1] + .8, point[2]]];
    const after = before.map(transform);
    const compared = alternate(point);
    show([
      metric('Pivot C', coordinates(pivot), 'highlight'),
      metric('P′ ลำดับที่เลือก', coordinates(after[0]), 'accent'),
      metric('P′ อีกลำดับ', coordinates(compared), 'comparison'),
    ], after[0].every((value, i) => Math.abs(value - compared[i]) < 1e-8)
      ? 'ค่าชุดนี้ให้ตำแหน่งปลายทางเท่ากัน ลองเพิ่ม Translate X หรือเปลี่ยนมุมหมุน'
      : 'จากจุดเริ่มต้นเดียวกัน ลำดับการใช้ Transform ทำให้ตำแหน่งปลายทางต่างกัน');
    return { point, pivot, before, after, alternate: compared };
  }

  function focusPoints() {
    if (lesson) return state.focus;
    if (kind === 'pivot') return [...state.before, ...state.after, state.pivot, state.alternate];
    if (kind === 'mesh') {
      if (state.selected.startsWith('edge:')) {
        const edge = state.edges.get(state.selected.slice(5));
        const linked = state.faces.filter((face) => edge.faces.includes(face.id));
        if (linked.length > 1) return linked.flatMap((face) => face.points.map((id) => state.points[id]));
      }
      return Object.values(state.points);
    }
    const points = [state.a, state.b];
    if (state.mode !== 'displacement') points.push([0, 0, 0]);
    if (state.mode === 'cross') points.push(state.cross);
    if (state.mode === 'dot' && state.projection) points.push(state.projection);
    return points;
  }

  function frame(name = activeView) {
    activeView = name;
    manualCamera = false;
    viewport?.frame(focusPoints(), name);
    markView(name);
  }

  function update() {
    if (lesson) {
      const values = Object.fromEntries(lesson.controls.map((item) => [
        item.name, item.options ? field(item.name).value : fields[item.name].get(),
      ]));
      state = lesson.draw(values);
      show(state.metrics.map((entry) => metric(...entry)), state.explanation);
    } else {
      const calculate = { mesh: meshState, vector: vectorState, pivot: transformState };
      state = calculate[kind]();
    }
    viewport?.update(state);
    if (!manualCamera) frame();
  }

  if (lesson) {
    fields = {};
    const container = host.querySelector('[data-lesson-fields]');
    for (const item of lesson.controls) {
      if (item.options) {
        const label = document.createElement('label');
        label.className = 'three-select';
        label.textContent = item.label;
        const control = document.createElement('select');
        control.dataset.field = item.name;
        control.append(...item.options.map(([value, name]) => new Option(name, value)));
        label.append(control);
        container.append(label);
      } else Object.assign(fields, sliderGroup(container, { [item.name]: item }, update, signal));
    }
  } else if (kind === 'mesh') {
    fields = sliderGroup(group('mesh'), {
      lift: range('Face B · Z', -2, 2, .65, .05),
      tolerance: range('Weld Tolerance', 0, .5, .1, .005),
    }, update, signal);
  } else if (kind === 'vector') {
    fields = {};
    for (const [name, defaults] of [['a', [1, 0, 0]], ['b', [4, 4, 0]]]) {
      const definitions = Object.fromEntries(axes.map((axis, index) => [
        `${name}${axis}`, range(`${name.toUpperCase()}.${axis}`, -6, 6, defaults[index]),
      ]));
      Object.assign(fields, sliderGroup(group(name), definitions, update, signal));
    }
    host.querySelector('[data-perpendicular]').addEventListener('click', () => {
      axes.forEach((axis, i) => {
        fields[`a${axis}`].set(i === 0 ? 1 : 0);
        fields[`b${axis}`].set(i === 1 ? 1 : 0);
      });
      field('vector-mode').value = 'cross';
      update();
    }, { signal });
  } else {
    fields = sliderGroup(group('pivot'), {
      pivotX: range('Pivot X', -4, 4, 2),
      pivotY: range('Pivot Y', -4, 4, 1),
      pivotZ: range('Pivot Z', -4, 4, 0),
      angle: range('Angle (°)', -180, 180, 90, 1),
      scale: range('Scale', .25, 3, 1, .05),
      shift: range('Translate X', -4, 4, 0),
    }, update, signal);
  }

  host.querySelectorAll('select').forEach((select) => select.addEventListener('change', update, { signal }));

  function markView(name) {
    for (const button of cameraButtons) button.setAttribute('aria-pressed', String(button.dataset.camera === name));
  }

  function selectView(name) {
    frame(name);
  }

  cameraButtons.forEach((button) => button.addEventListener('click', () => selectView(button.dataset.camera), { signal }));
  zoomButtons.forEach((button) => button.addEventListener('click', () => {
    manualCamera = true;
    viewport.zoom(button.dataset.zoom === 'in' ? 1.25 : .8);
  }, { signal }));

  function resetControls() {
    Object.values(fields).forEach((item) => item.reset());
    host.querySelectorAll('select').forEach((item) => { item.selectedIndex = 0; });
    if (kind === 'mesh') {
      field('selection').value = 'edge:2-3';
      delete field('selection').dataset.options;
    }
  }

  host.querySelector('[data-reset]').addEventListener('click', () => {
    resetControls();
    update();
    selectView(demo.view);
  }, { signal });

  mountDemo(host, {
    demo,
    control: (key) => fields[key]?.numeric ?? field(key),
    reset: resetControls,
    apply(values) {
      for (const [key, value] of Object.entries(values)) {
        if (fields[key]) fields[key].set(Number(value));
        else field(key).value = value;
      }
      update();
    },
    frame,
    signal,
  });

  function showFailure() {
    const failed = viewport;
    viewport = undefined;
    failed?.dispose();
    viewportHost.dataset.sceneState = 'unavailable';
    viewportHost.textContent = 'มุมมอง 3D ต้องใช้ WebGL 2';
    [...cameraButtons, ...zoomButtons].forEach((button) => { button.disabled = true; });
    status.hidden = false;
    status.textContent = 'ยังปรับค่าและอ่านผลคำนวณได้จากแผงด้านล่าง';
  }

  update();
  import('./interactive-scenes.js').then(({ createViewport }) => {
    if (signal.aborted || !host.isConnected) return;
    viewport = createViewport(viewportHost, {
      kind: lesson ? 'lesson' : kind,
      title: lab.title,
      onSelect(selected) {
        if (lesson) {
          const separator = selected.indexOf(':');
          field(selected.slice(0, separator)).value = selected.slice(separator + 1);
        } else field('selection').value = selected;
        update();
      },
      onOrbit(rotated) {
        manualCamera = true;
        if (rotated) {
          activeView = 'orbit';
          markView(activeView);
        }
      },
      onLost: showFailure,
    });
    viewport.update(state);
    frame();
    viewportHost.dataset.sceneState = 'ready';
    [...cameraButtons, ...zoomButtons].forEach((button) => { button.disabled = false; });
    status.hidden = true;
  }).catch(() => { if (!signal.aborted && host.isConnected) showFailure(); });

  return () => {
    lifecycle.abort();
    viewport?.dispose();
  };
}
