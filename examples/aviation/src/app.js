import { bearingTo, relativeBearing, groundVector, step } from './physics.js';
const $ = id => document.getElementById(id);
const initial = { x: -10, y: -10, heading: 45, tas: 120, windFrom: 270, windSpeed: 20 };
let state = { ...initial }, station = { x: 4, y: 6 }, running = false, last = 0, trail = [];
const fields = [ ['heading', '航向', 0, 359, '°'], ['tas', '真空速', 0, 250, ' kt'], ['windFrom', '风向（来向）', 0, 359, '°'], ['windSpeed', '风速', 0, 80, ' kt'], ['x', '飞机东西位置', -20, 20, ' NM'], ['y', '飞机南北位置', -20, 20, ' NM'] ];
for (const [key, label, min, max, unit] of fields) {
  const div = document.createElement('div'); div.className = 'control';
  const title = document.createElement('label'); title.htmlFor = key; title.textContent = label;
  const output = document.createElement('output'); output.id = `${key}-value`; title.append(output);
  const input = document.createElement('input'); Object.assign(input, { id: key, type: 'range', min, max, step: key === 'x' || key === 'y' ? .1 : 1, value: state[key] });
  input.addEventListener('input', () => { state[key] = Number(input.value); if (key === 'x' || key === 'y') trail = []; render(); });
  div.append(title, input); $('controls').append(div);
}
const ns = 'http://www.w3.org/2000/svg';
for (let a = 0; a < 360; a += 5) {
  const g = document.createElementNS(ns, 'g'); g.setAttribute('transform', `rotate(${a} 150 150)`);
  const line = document.createElementNS(ns, 'line');
  for (const [k,v] of Object.entries({ x1:150, y1:27, x2:150, y2:a % 30 === 0 ? 42 : 34, stroke:'#d3dee0', 'stroke-width':a % 30 === 0 ? 2 : 1 })) line.setAttribute(k,v);
  g.append(line); $('ticks').append(g);
  if (a % 30 === 0) {
    const t = document.createElementNS(ns, 'text'); const rad = a * Math.PI / 180;
    t.setAttribute('x',150 + 94 * Math.sin(rad)); t.setAttribute('y',155 - 94 * Math.cos(rad)); t.setAttribute('text-anchor','middle'); t.setAttribute('fill','#e3e6df'); t.setAttribute('font-size','16');
    t.textContent = String(a / 10).padStart(2,'0'); $('ticks').append(t);
  }
}
const degrees = n => n === null ? '—' : `${String(Math.round(n) % 360).padStart(3,'0')}°`;
function render() {
  const bearing = bearingTo(state, station), rb = relativeBearing(state.heading, bearing), ground = groundVector(state.heading,state.tas,state.windFrom,state.windSpeed);
  $('aircraft').setAttribute('transform',`translate(${state.x} ${-state.y}) rotate(${state.heading})`);
  $('station').setAttribute('transform',`translate(${station.x} ${-station.y})`);
  for (const [key,value] of Object.entries({ x1:state.x, y1:-state.y, x2:station.x, y2:-station.y })) $('bearing-line').setAttribute(key,value);
  $('needle').style.visibility = rb === null ? 'hidden' : 'visible';
  if (rb !== null) $('needle').setAttribute('transform',`rotate(${rb} 150 150)`);
  $('rb').textContent=degrees(rb); $('bearing').textContent=degrees(bearing); $('track').textContent=degrees(ground.track); $('gs').textContent=`${ground.speed.toFixed(1)} kt`;
  $('signal').textContent=rb === null ? '台站附近 · 方位不定' : '信号正常';
  for (const [key,,, ,unit] of fields) { $(key).value=state[key]; $(`${key}-value`).textContent=`${Number(state[key].toFixed(1))}${unit}`; }
  $('trail').setAttribute('points',trail.map(p=>`${p.x},${-p.y}`).join(' '));
  $('run').textContent=running ? '暂停运行' : '开始运行';
}
$('map').addEventListener('click', event => {
  const p = $('map').createSVGPoint(); p.x=event.clientX; p.y=event.clientY;
  const local=p.matrixTransform($('map').getScreenCTM().inverse());
  const x=Math.max(-20,Math.min(20,local.x)), y=Math.max(-20,Math.min(20,-local.y));
  if (event.shiftKey) station={x,y}; else { state={...state,x,y}; trail=[]; } render();
});
$('run').addEventListener('click',()=>{ running=!running; last=0; $('status').textContent=running ? '运行中 · 时间 ×10' : '已暂停'; render(); });
$('reset').addEventListener('click',()=>{ state={...initial};station={x:4,y:6};running=false;last=0;trail=[];$('status').textContent='已重置';render(); });
function frame(now) {
  if (running && last) {
    const previous=state; state=step(state,Math.min((now-last)/1000,.1)*10);
    if (!trail.length) trail.push({x:previous.x,y:previous.y});
    const tail=trail.at(-1); if (Math.hypot(state.x-tail.x,state.y-tail.y)>.03) trail.push({x:state.x,y:state.y});
    if (trail.length>2000) trail.shift();
    if (Math.abs(state.x)>20 || Math.abs(state.y)>20) { state.x=Math.max(-20,Math.min(20,state.x));state.y=Math.max(-20,Math.min(20,state.y));running=false;$('status').textContent='到达平面边界，已暂停；请重置或调整位置。'; }
    render();
  }
  last=now; requestAnimationFrame(frame);
}
render();requestAnimationFrame(frame);
