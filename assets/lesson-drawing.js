export const rgb = { a: '#598ec5', b: '#d98b59', c: '#9f89d3' };
export const fmt = (n) => String(Number(n.toFixed(3)));
export const xyz = (values) => '(' + values.map(fmt).join(', ') + ')';
export const add = (a, b) => a.map((v, i) => v + b[i]);
export const sub = (a, b) => a.map((v, i) => v - b[i]);
export const mul = (a, k) => a.map((v) => v * k);
export const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
export const mix = (a, b, t) => add(a, mul(sub(b, a), t));
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const unit = (a) => mul(a, 1 / (Math.hypot(...a) || 1));
export const radians = (angle) => angle * Math.PI / 180;
export const turn = ([x, y, z], angle) => [x * Math.cos(radians(angle)) - y * Math.sin(radians(angle)), x * Math.sin(radians(angle)) + y * Math.cos(radians(angle)), z];

export function drawing(grid = true) {
  const points = [], lines = [], faces = [], surfaces = [], bounds = [];

  function line(a, b, tone = 'muted', arrow = false, width) {
    lines.push({ a, b, tone, arrow, width });
    bounds.push(a, b);
  }

  function point(position, label = '', tone = 'accent', radius = .08, selection) {
    points.push({ position, label, tone, radius, selection });
    bounds.push(position);
  }

  function polygon(vertices, tone, opacity = .24, outline = true) {
    for (let i = 1; i < vertices.length - 1; i++) {
      faces.push({ points: [vertices[0], vertices[i], vertices[i + 1]], tone, opacity });
    }
    bounds.push(...vertices);
    if (outline) vertices.forEach((v, i) => line(v, vertices[(i + 1) % vertices.length], tone));
  }

  function tile([x, y, z], label, tone = 'accent', size = [1, .55]) {
    const [halfX, halfY] = size.map((n) => n / 2);
    polygon([[x - halfX, y - halfY, z], [x + halfX, y - halfY, z], [x + halfX, y + halfY, z], [x - halfX, y + halfY, z]], tone);
    point([x, y - .14, z + .025], label, tone, 0);
  }

  function box(center, size, tone = 'accent') {
    const corners = [0, 1, 2, 3, 4, 5, 6, 7].map((index) =>
      center.map((v, axis) => v + (index & (1 << axis) ? .5 : -.5) * size[axis]));
    corners.forEach((point, i) => {
      for (const neighbor of [i ^ 1, i ^ 2, i ^ 4]) if (neighbor > i) line(point, corners[neighbor], tone, false, .018);
    });
    return corners;
  }

  function surface(center, radius, roughness, color) {
    surfaces.push({ center, radius, roughness, color });
    bounds.push(add(center, [radius, radius, radius]), sub(center, [radius, radius, radius]));
  }

  return {
    line, point, polygon, tile, box, surface,
    finish(metrics, explanation, focus = bounds) {
      return { drawing: { points, lines, faces, surfaces }, grid, metrics, explanation, focus };
    },
  };
}

export function flow(d, labels, active, { x = -2.1, y = .7, spacing = 1.4 } = {}) {
  labels.forEach((label, i) => {
    const center = [x + spacing * i, y, 0];
    d.tile(center, label, i === active ? 'highlight' : i < active ? 'success' : 'muted', [spacing - .29, .56]);
    if (i > 0) d.line([center[0] - spacing / 2 - .14, y, 0], [center[0] - spacing / 2 + .12, y, 0], i <= active ? 'accent' : 'muted', true);
  });
}
