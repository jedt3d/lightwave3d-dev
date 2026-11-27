export const demoTools = `
  <button type="button" data-demo-brief aria-expanded="false" aria-controls="lab-brief">โจทย์นี้ให้ทำอะไร?</button>
  <button type="button" data-demo-start aria-expanded="false" aria-controls="lab-demo">สาธิตให้ดู</button>`;

export const demoPanel = `
  <p id="lab-brief" class="lab-brief" hidden></p>
  <div id="lab-demo" class="lab-demo" aria-label="สาธิต Lab" hidden>
    <div class="lab-demo-copy" aria-live="polite" aria-atomic="true">
      <p class="lab-demo-count" data-demo-count></p>
      <h4 data-demo-title></h4>
      <p data-demo-detail></p>
    </div>
    <div class="lab-demo-actions">
      <button type="button" data-demo-prev>ย้อนกลับ</button>
      <button type="button" data-demo-next>ถัดไป</button>
      <button type="button" data-demo-try>ลองเอง</button>
      <button type="button" data-demo-control>ชี้ตัวควบคุม</button>
      <button type="button" data-demo-view>ดูภาพ 3D</button>
    </div>
  </div>`;

export function mountDemo(host, { demo, control, reset, apply, frame, signal }) {
  const guide = host.querySelector('#lab-demo');
  const brief = host.querySelector('#lab-brief');
  const start = host.querySelector('[data-demo-start]');
  const briefButton = host.querySelector('[data-demo-brief]');
  const previous = host.querySelector('[data-demo-prev]');
  const next = host.querySelector('[data-demo-next]');
  const tryIt = host.querySelector('[data-demo-try]');
  const chrome = document.querySelector('.chrome');
  const view = host.querySelector('[data-viewport]');
  brief.textContent = demo.brief;
  let index = 0;
  let changeTimer;
  let viewTimer;
  let target;

  function positionGuide() {
    const offset = getComputedStyle(chrome).position === 'sticky' ? chrome.offsetHeight : 0;
    guide.style.setProperty('--lab-demo-top', `${offset}px`);
    host.style.setProperty('--lab-demo-room', `${Math.max(100, window.innerHeight - offset - guide.offsetHeight - 28)}px`);
    return offset;
  }

  function reveal(element) {
    const offset = positionGuide();
    const { top, bottom, height } = element.getBoundingClientRect();
    const topLimit = offset + guide.offsetHeight + 10;
    if (top >= topLimit && bottom <= window.innerHeight - 10) return;
    const freeHeight = Math.max(0, window.innerHeight - topLimit - height);
    window.scrollBy({ top: top - topLimit - freeHeight / 2, behavior: 'instant' });
  }

  function cancelTimers() {
    clearTimeout(changeTimer);
    clearTimeout(viewTimer);
  }

  function showStep(stepIndex) {
    cancelTimers();
    target?.removeAttribute('data-demo-target');
    index = stepIndex;
    const step = demo.steps[index];
    const preceding = demo.steps.slice(0, index).map((item) => item.change);
    reset();
    apply(Object.assign({}, ...preceding, step.before));
    target = control(step.field);
    target.setAttribute('data-demo-target', '');
    guide.querySelector('[data-demo-count]').textContent = `ขั้นที่ ${index + 1} / ${demo.steps.length}`;
    guide.querySelector('[data-demo-title]').textContent = step.title;
    guide.querySelector('[data-demo-detail]').textContent = step.detail;
    previous.disabled = index === 0;
    next.disabled = index === demo.steps.length - 1;
    if (document.activeElement === next && next.disabled) tryIt.focus({ preventScroll: true });
    if (document.activeElement === previous && previous.disabled) next.focus({ preventScroll: true });
    frame(step.view ?? demo.view);
    reveal(target);
    if (step.change) {
      changeTimer = setTimeout(() => {
        apply(step.change);
        frame(step.view ?? demo.view);
        viewTimer = setTimeout(() => reveal(view), 700);
      }, 650);
    }
  }

  function endDemo(focusTarget) {
    cancelTimers();
    if (focusTarget) reveal(target);
    target?.removeAttribute('data-demo-target');
    guide.hidden = true;
    start.setAttribute('aria-expanded', 'false');
    if (focusTarget) target.focus({ preventScroll: true });
  }

  briefButton.onclick = () => {
    brief.hidden = !brief.hidden;
    briefButton.setAttribute('aria-expanded', String(!brief.hidden));
  };
  start.onclick = () => {
    if (!guide.hidden) { endDemo(false); return; }
    guide.hidden = false;
    start.setAttribute('aria-expanded', 'true');
    next.focus({ preventScroll: true });
    showStep(0);
  };
  previous.onclick = () => showStep(index - 1);
  next.onclick = () => showStep(index + 1);
  tryIt.onclick = () => endDemo(true);
  guide.querySelector('[data-demo-control]').onclick = () => {
    clearTimeout(viewTimer);
    reveal(target);
  };
  guide.querySelector('[data-demo-view]').onclick = () => {
    clearTimeout(viewTimer);
    frame(demo.steps[index].view ?? demo.view);
    reveal(view);
  };

  const controls = host.querySelector('.three-controls');
  controls.addEventListener('input', cancelTimers, { signal });
  controls.addEventListener('change', () => {
    cancelTimers();
    if (!guide.hidden) frame(demo.steps[index].view ?? demo.view);
  }, { signal });
  host.querySelector('[data-reset]').addEventListener('click', () => {
    if (!guide.hidden) endDemo(false);
  }, { signal });
  window.addEventListener('resize', () => { if (!guide.hidden) positionGuide(); }, { signal });
  signal.addEventListener('abort', cancelTimers, { once: true });
}
