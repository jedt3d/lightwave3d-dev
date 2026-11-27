const subtract = (a, b) => a.map((value, index) => value - b[index]);
const add = (a, b) => a.map((value, index) => value + b[index]);
const multiply = (v, scale) => v.map((value) => value * scale);
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
const norm = (point) => Math.hypot(...point);

export function vectorStudy(a, b) {
  const displacement = subtract(b, a);
  const length = norm(displacement);
  const product = dot(a, b);
  const productOfLengths = norm(a) * norm(b);
  const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const cosine = productOfLengths ? Math.max(-1, Math.min(1, product / productOfLengths)) : null;
  return {
    a, b, displacement, length, cross, dot: product,
    unit: length ? multiply(displacement, 1 / length) : null,
    projection: norm(a) ? multiply(a, product / dot(a, a)) : null,
    angle: cosine === null ? null : Math.acos(cosine) * 180 / Math.PI,
  };
}

export function meshStudy(scenario, lift, tolerance) {
  const points = {
    1: [-1.65, -0.38, 0],
    2: [-0.65, 0.95, 0],
    3: [0.65, -0.82, 0],
    4: [1.62, 0.42, lift],
  };
  const faces = [{ id: 'A', points: [1, 2, 3] }];
  if (scenario === 'seam') {
    points[6] = points[3].slice();
    points[7] = add(points[2], [0, 0, 0.125]);
    faces.push({ id: 'B', points: [6, 7, 4] });
  } else {
    faces.push({ id: 'B', points: [3, 2, 4] });
  }
  if (scenario === 'third') {
    points[5] = [0, -0.1, -1.65];
    faces.push({ id: 'C', points: [2, 3, 5] });
  }

  const edges = new Map();
  for (const face of faces) {
    for (let i = 0; i < face.points.length; i++) {
      const pair = [face.points[i], face.points[(i + 1) % face.points.length]].sort((a, b) => a - b);
      const key = pair.join('-');
      if (!edges.has(key)) edges.set(key, { key, points: pair, faces: [] });
      edges.get(key).faces.push(face.id);
    }
  }
  const counts = { boundary: 0, shared: 0, nonManifold: 0 };
  for (const edge of edges.values()) {
    edge.kind = edge.faces.length === 1 ? 'boundary' : edge.faces.length === 2 ? 'shared' : 'nonManifold';
    counts[edge.kind]++;
  }

  const ids = Object.keys(points).map(Number);
  const weld = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const pair = [ids[i], ids[j]];
      const distance = norm(subtract(points[pair[0]], points[pair[1]]));
      if (distance <= tolerance) weld.push({ pair, distance });
    }
  }
  return { points, faces, edges, counts, weld };
}

function rotate(v, axis, angle) {
  const [x, y, z] = v;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  switch (axis) {
    case 'x': return [x, c * y - s * z, s * y + c * z];
    case 'y': return [c * x + s * z, y, c * z - s * x];
    default: return [c * x - s * y, s * x + c * y, z];
  }
}

export function pivotStudy({ pivot, axis, angle, scale, shift, order }) {
  const radians = angle * Math.PI / 180;
  const translation = [shift, 0, 0];
  const pivotTransform = (point) => add(pivot, rotate(multiply(subtract(point, pivot), scale), axis, radians));
  const move = (point) => add(point, translation);
  const transform = order === 'move-first'
    ? (point) => pivotTransform(move(point))
    : (point) => move(pivotTransform(point));
  const alternate = order === 'move-first'
    ? (point) => move(pivotTransform(point))
    : (point) => pivotTransform(move(point));
  return { transform, alternate };
}
