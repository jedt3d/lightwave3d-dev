import {
  AmbientLight, ArrowHelper, DirectionalLight, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DoubleSide, GridHelper,
  LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshStandardMaterial, OrbitControls, OrthographicCamera,
  Raycaster, Scene, SphereGeometry, Vector2, Vector3, WebGLRenderer,
} from './three-r187.js';

const viewPositions = { orbit: [6, 4, 7], xy: [0, 0, 9], xz: [0, 9, .00005] };
const axisColors = { X: '#df754c', Y: '#55a775', Z: '#6596e2' };
const labels = {
  vector: 'ภาพสามมิติของเวกเตอร์',
  mesh: 'ภาพสามมิติของจุด ขอบ และหน้า Mesh',
  pivot: 'ภาพสามมิติของ Transform ก่อนและหลัง',
};

function disposeResources(object) {
  const resources = new Set();
  object.traverse((item) => {
    if (item.geometry) resources.add(item.geometry);
    if (item.material) {
      for (const material of Array.isArray(item.material) ? item.material : [item.material]) resources.add(material);
    }
  });
  for (const resource of resources) resource.dispose();
}

export function createViewport(container, { kind, title, onSelect, onOrbit, onLost }) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { antialias: true, alpha: false });
  if (!context) throw new Error('WebGL 2 unavailable');

  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', labels[kind] ?? title);

  const overlay = document.createElement('div');
  overlay.className = 'three-labels';
  overlay.setAttribute('aria-hidden', 'true');
  container.append(canvas, overlay);

  const scene = new Scene();
  const backdrop = new Scene();
  const objects = new Scene();
  scene.add(backdrop, objects);
  const camera = new OrthographicCamera(-4, 4, 2.5, -2.5, 0.01, 300);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false;
  controls.enableZoom = true;
  controls.zoomSpeed = .45;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.minZoom = .55;
  controls.maxZoom = 5;

  const light = new DirectionalLight('#fff1df', 2.65);
  light.position.set(-1.7, 2.1, 5);
  scene.add(light, new AmbientLight('#e4ebff', .66));

  const grid = new GridHelper(10, 10, '#626b74', '#626b74');
  grid.material.opacity = 0.32;
  grid.material.transparent = true;
  grid.renderOrder = -2;
  backdrop.add(grid);

  let state;
  let extent = 4;
  let width = 1;
  let height = 1;
  let pointerStart;
  let zoomDrag;
  let wheelFrame = 0;
  let wheelDelta = 0;
  let markers = [];
  let framePoints;
  let pickable = [];
  const raycaster = new Raycaster();
  const coordinates = new Vector2();
  raycaster.params.Line.threshold = 0.1;

  function mark(text, position, color) {
    const label = document.createElement('span');
    label.textContent = text;
    if (color) label.style.color = color;
    overlay.append(label);
    markers.push({ label, vector: new Vector3(...position) });
  }

  function segment(a, b, color, options = {}) {
    const material = new LineBasicMaterial({ color, ...options });
    const geometry = new BufferGeometry().setAttribute('position', new BufferAttribute(new Float32Array([...a, ...b]), 3));
    const object = new LineSegments(geometry, material);
    objects.add(object);
    return object;
  }

  function edgeTube(a, b, color, radius) {
    const start = new Vector3(...a);
    const offset = new Vector3(...b).sub(start);
    const geometry = new CylinderGeometry(radius, radius, offset.length(), 8);
    const object = new Mesh(geometry, new MeshBasicMaterial({ color }));
    object.position.copy(start).addScaledVector(offset, .5);
    object.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), offset.normalize());
    objects.add(object);
  }

  function dot(position, color, radius = 0.09) {
    const object = new Mesh(new SphereGeometry(radius, 14, 10), new MeshBasicMaterial({ color }));
    object.position.set(...position);
    objects.add(object);
    return object;
  }

  function face(points, color, opacity) {
    const geometry = new BufferGeometry().setAttribute('position', new BufferAttribute(new Float32Array(points.flat()), 3));
    const material = new MeshBasicMaterial({ color, opacity, transparent: true, side: DoubleSide, depthWrite: false });
    objects.add(new Mesh(geometry, material));
  }

  function arrow(a, b, color) {
    const start = new Vector3(...a);
    const direction = new Vector3(...b).sub(start);
    const length = direction.length();
    if (length < 0.0001) return;
    const head = Math.min(length * .3, .30);
    objects.add(new ArrowHelper(direction.normalize(), start, length, new Color(color), head, head * .72));
  }

  function makeAxes() {
    const names = Object.keys(axisColors);
    names.forEach((name, index) => {
      const positive = [0, 0, 0];
      const negative = [0, 0, 0];
      positive[index] = extent * .8;
      negative[index] = -extent * .8;
      segment(negative, positive, axisColors[name], { transparent: true, opacity: .52 });
      mark(name, positive, axisColors[name]);
    });
  }

  function render() {
    renderer.render(scene, camera);
    if (framePoints) {
      const visible = framePoints.every((point) => {
        const projected = new Vector3(...point).project(camera);
        return Math.abs(projected.x) < .96 && Math.abs(projected.y) < .96 && Math.abs(projected.z) < 1;
      });
      container.dataset.frameVisible = String(visible);
    } else delete container.dataset.frameVisible;
    for (const { label, vector } of markers) {
      const projected = vector.clone().project(camera);
      label.hidden = Math.abs(projected.x) > .98 || Math.abs(projected.y) > .98 || Math.abs(projected.z) > 1;
      const x = (projected.x * .5 + .5) * width;
      const y = (.5 - projected.y * .5) * height;
      const halfLabel = label.offsetWidth / 2;
      label.style.left = `${Math.min(width - halfLabel - 3, Math.max(halfLabel + 3, x))}px`;
      label.style.top = `${Math.max(label.offsetHeight + 5, y)}px`;
    }
  }

  function fitCamera() {
    const aspect = width / height;
    let vertical = extent * Math.max(1 / aspect, 1);
    if (framePoints) {
      camera.updateMatrixWorld();
      vertical = .45;
      for (const point of framePoints) {
        const local = new Vector3(...point).applyMatrix4(camera.matrixWorldInverse);
        vertical = Math.max(vertical, Math.abs(local.y) / .72, Math.abs(local.x) / (aspect * .78));
      }
    }
    camera.left = -vertical * aspect;
    camera.right = vertical * aspect;
    camera.top = vertical;
    camera.bottom = -vertical;
    camera.updateProjectionMatrix();
  }

  function aim(name, center) {
    camera.zoom = 1;
    camera.position.set(...viewPositions[name]).setLength(40).add(center);
    controls.target.copy(center);
    controls.update();
    fitCamera();
    render();
  }

  function frame(points, name = 'orbit') {
    if (!points?.length) return;
    framePoints = points;
    const center = new Vector3();
    const low = new Vector3(Infinity, Infinity, Infinity);
    const high = new Vector3(-Infinity, -Infinity, -Infinity);
    for (const point of points) {
      const vector = new Vector3(...point);
      low.min(vector);
      high.max(vector);
    }
    center.addVectors(low, high).multiplyScalar(.5);
    container.dataset.frameCenter = center.toArray().map((value) => value.toFixed(2)).join(',');
    aim(name, center);
  }

  function resize() {
    const size = container.getBoundingClientRect();
    if (size.width < 1 || size.height < 1) return;
    width = size.width;
    height = size.height;
    renderer.setSize(width, height, false);
    fitCamera();
    render();
  }

  function rebuild(next) {
    state = next;
    disposeResources(objects);
    objects.clear();
    overlay.replaceChildren();
    markers = [];
    pickable = [];
    const theme = getComputedStyle(document.documentElement);
    const accent = theme.getPropertyValue('--lw-accent').trim();
    const muted = theme.getPropertyValue('--lw-muted').trim();
    const highlight = theme.getPropertyValue('--lw-highlight').trim();
    const errorColor = theme.getPropertyValue('--lw-error').trim();
    const canvasColor = theme.getPropertyValue('--lw-viewport').trim();
    const success = theme.getPropertyValue('--lw-success').trim();
    grid.visible = state.grid !== false;
    scene.background = new Color(canvasColor);
    const max = (points, minimum) => Math.max(minimum, ...points.flat().map((value) => Math.abs(value) * 1.4));
    const zero = [0, 0, 0];

    if (kind === 'vector') {
      const { a, b, mode, projection, cross } = state;
      extent = max([a, b, ...(mode === 'cross' ? [cross] : []), ...(mode === 'dot' && projection ? [projection] : [])], 3.1);
      makeAxes();
      const aPoint = mode === 'displacement' ? a : zero;
      if (mode !== 'displacement') arrow(zero, a, highlight);
      arrow(aPoint, b, accent);
      if (mode === 'dot' && projection) {
        arrow(zero, projection, axisColors.Y);
        segment(b, projection, muted, { transparent: true, opacity: .7 });
        mark('projₐ b', projection, axisColors.Y);
      }
      if (mode === 'cross') {
        arrow(zero, cross, axisColors.Y);
        if (cross.some(Boolean)) mark('a × b', cross, axisColors.Y);
      }
      dot(a, highlight);
      dot(b, accent);
      mark(mode === 'displacement' ? 'A' : 'a', a, highlight);
      mark(mode === 'displacement' ? 'B' : 'b', b, accent);
    }

    if (kind === 'mesh') {
      const { points, faces, edges, selected } = state;
      extent = max(Object.values(points), 2.35);
      makeAxes();
      const kinds = { boundary: muted, shared: accent, nonManifold: errorColor };
      const faceColors = [accent, '#bd854d', '#a48bd4'];
      faces.forEach((item, index) => face(item.points.map((id) => points[id]), faceColors[index], .24));
      for (const edge of edges.values()) {
        const active = selected === `edge:${edge.key}`;
        const [a, b] = edge.points.map((id) => points[id]);
        edgeTube(a, b, kinds[edge.kind], active ? .035 : .014);
        const object = segment(a, b, kinds[edge.kind], { visible: false });
        object.userData.selection = `edge:${edge.key}`;
        pickable.push(object);
      }
      const coincident = new Map();
      for (const [id, point] of Object.entries(points)) {
        const key = point.join(',');
        if (!coincident.has(key)) coincident.set(key, []);
        coincident.get(key).push(id);
      }
      for (const ids of coincident.values()) {
        const point = points[ids[0]];
        const selection = ids.find((id) => selected === `point:${id}`) ?? ids[0];
        const active = selected === `point:${selection}`;
        const object = dot(point, active ? highlight : accent, active ? .13 : .085);
        object.userData.selection = `point:${selection}`;
        pickable.push(object);
        mark(ids.join('/'), point, active ? highlight : undefined);
      }
    }

    if (kind === 'pivot') {
      const { point, pivot, before, after, alternate } = state;
      extent = max([...before, ...after, pivot, alternate], 3.25);
      makeAxes();
      face(before, muted, .22);
      face(after, accent, .32);
      for (let i = 0; i < before.length; i++) {
        segment(before[i], before[(i + 1) % before.length], muted);
        segment(after[i], after[(i + 1) % after.length], accent);
      }
      segment(pivot, point, muted, { transparent: true, opacity: .7 });
      arrow(point, after[0], accent);
      dot(point, muted);
      dot(after[0], accent);
      dot(pivot, highlight, .13);
      dot(alternate, axisColors.Y, .065);
      mark('P', point);
      mark('P′', after[0], accent);
      mark('C', pivot, highlight);
      if (alternate.some((value, index) => Math.abs(value - after[0][index]) > .001)) {
        mark('P′ อีกลำดับ', alternate, axisColors.Y);
      }
    }
    if (state.drawing) {
      const colors = { accent, muted, highlight, error: errorColor, success, panel: canvasColor };
      const color = (name) => colors[name] ?? name ?? accent;
      const drawing = state.drawing;
      extent = max(state.focus ?? [[0, 0, 0]], 2);
      if (state.grid !== false) makeAxes();
      for (const item of drawing.faces) face(item.points, color(item.tone), item.opacity ?? .26);
      for (const item of drawing.lines) {
        if (item.arrow) arrow(item.a, item.b, color(item.tone));
        else if (item.width) edgeTube(item.a, item.b, color(item.tone), item.width);
        else segment(item.a, item.b, color(item.tone));
      }
      for (const item of drawing.surfaces) {
        const surface = new Mesh(new SphereGeometry(item.radius, 48, 32), new MeshStandardMaterial({
          color: item.color, roughness: item.roughness, metalness: .06,
        }));
        surface.position.set(...item.center);
        objects.add(surface);
      }
      for (const item of drawing.points) {
        if (item.radius !== 0) {
          const marker = dot(item.position, color(item.tone), item.radius);
          if (item.selection) {
            marker.userData.selection = item.selection;
            pickable.push(marker);
          }
        }
        if (item.label) mark(item.label, item.position, color(item.tone));
      }
    }
    fitCamera();
    render();
  }

  function zoom(factor) {
    camera.zoom = Math.min(controls.maxZoom, Math.max(controls.minZoom, camera.zoom * factor));
    camera.updateProjectionMatrix();
    render();
  }

  function onWheel(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
    wheelDelta += event.deltaY * scale;
    if (wheelFrame) return;
    wheelFrame = requestAnimationFrame(() => {
      wheelFrame = 0;
      // Coalesced touchpad input and mouse-wheel notches use the same per-frame cap.
      const delta = Math.max(-38, Math.min(38, wheelDelta));
      wheelDelta = 0;
      if (delta) {
        onOrbit(false);
        zoom(Math.exp(-delta * .00115));
      }
    });
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    if (event.ctrlKey && event.pointerType === 'mouse') {
      event.preventDefault();
      event.stopImmediatePropagation();
      zoomDrag = { id: event.pointerId, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      return;
    }
    pointerStart = [event.clientX, event.clientY, event.shiftKey];
  }

  function onPointerMove(event) {
    if (zoomDrag?.id !== event.pointerId) return;
    event.stopImmediatePropagation();
    const delta = event.clientY - zoomDrag.y;
    zoomDrag.y = event.clientY;
    if (delta) {
      onOrbit(false);
      zoom(Math.exp(-Math.max(-32, Math.min(32, delta)) * .005));
    }
  }

  function onPointerUp(event) {
    if (zoomDrag?.id === event.pointerId) {
      event.stopImmediatePropagation();
      zoomDrag = undefined;
      return;
    }
    if (!pointerStart) return;
    const [x, y, panning] = pointerStart;
    pointerStart = undefined;
    if (Math.hypot(x - event.clientX, y - event.clientY) > 5) {
      onOrbit(!panning);
      return;
    }
    if (panning || !pickable.length) return;
    const rect = canvas.getBoundingClientRect();
    coordinates.set(2 * (event.clientX - rect.left) / rect.width - 1, 1 - 2 * (event.clientY - rect.top) / rect.height);
    raycaster.setFromCamera(coordinates, camera);
    const hits = raycaster.intersectObjects(pickable, false);
    const hit = hits.find(({ object }) => object.userData.selection.startsWith('point:')) ?? hits[0];
    if (hit) onSelect(hit.object.userData.selection);
  }

  function onLostCapture(event) {
    if (zoomDrag?.id === event.pointerId) zoomDrag = undefined;
  }

  function onContextMenu(event) {
    if (event.ctrlKey) event.preventDefault();
  }

  function onContextLost(event) { event.preventDefault(); onLost(); }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const themeObserver = new MutationObserver(() => { if (state) rebuild(state); });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  controls.addEventListener('change', render);
  canvas.addEventListener('wheel', onWheel, { capture: true, passive: false });
  canvas.addEventListener('pointerdown', onPointerDown, true);
  canvas.addEventListener('pointermove', onPointerMove, true);
  canvas.addEventListener('pointerup', onPointerUp, true);
  canvas.addEventListener('lostpointercapture', onLostCapture);
  canvas.addEventListener('contextmenu', onContextMenu);
  canvas.addEventListener('webglcontextlost', onContextLost);
  resize();
  aim('orbit', new Vector3());

  return {
    update: rebuild, frame,
    zoom,
    dispose() {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      controls.removeEventListener('change', render);
      controls.dispose();
      cancelAnimationFrame(wheelFrame);
      canvas.removeEventListener('wheel', onWheel, true);
      canvas.removeEventListener('pointerdown', onPointerDown, true);
      canvas.removeEventListener('pointermove', onPointerMove, true);
      canvas.removeEventListener('pointerup', onPointerUp, true);
      canvas.removeEventListener('lostpointercapture', onLostCapture);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      disposeResources(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      overlay.remove();
    },
  };
}
