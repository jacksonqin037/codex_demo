// One model registry is shared by browser, server, tests, and planner validation.
export const presets = {
  ohm: {title:'欧姆定律 · 直流电路', subject:'电学', description:'理想直流电源、电阻、电流表串联，电压表并联于电阻两端。',
    parameters:[['voltage','电源电压',0,24,0.1,6,'V'],['resistance','负载电阻',10,1000,1,100,'Ω']],
    quantities:[['voltage','电压',0,30,'V'],['current','电流',0,3,'A']],
    defaultInstruments:['voltmeter','ammeter']},
  rc: {title:'RC 电路 · 充放电暂态', subject:'电学', description:'理想电源经电阻为电容充电；切换至放电后，电容经同一电阻释放能量。',
    parameters:[['voltage','电源电压',0,24,0.1,12,'V'],['resistance','电阻',100,10000,10,1000,'Ω'],['capacitance','电容',100,10000,100,1000,'μF']],
    quantities:[['voltage','电容电压',0,30,'V'],['current','电流',-0.3,0.3,'A']],
    defaultInstruments:['voltmeter','ammeter','oscilloscope']},
  spring: {title:'弹簧振子 · 阻尼运动', subject:'力学', description:'水平无摩擦导轨上的质量块，与线性弹簧、黏性阻尼器相连。初始位移后自由释放。',
    parameters:[['mass','质量',0.1,5,0.1,1,'kg'],['stiffness','弹簧刚度',1,100,1,20,'N/m'],['damping','阻尼系数',0,10,0.1,0.5,'N·s/m'],['initial','初始位移',0.01,0.3,0.01,0.15,'m']],
    quantities:[['position','位移',-0.35,0.35,'m'],['force','弹簧力',-35,35,'N']],
    defaultInstruments:['displacement','force','oscilloscope']}
};
export const instruments = {voltmeter:{name:'直流电压表',quantity:'voltage'},ammeter:{name:'直流电流表',quantity:'current'},oscilloscope:{name:'数据采集示波器',quantity:null},displacement:{name:'位移传感器',quantity:'position'},force:{name:'弹簧力传感器',quantity:'force'}};
export function defaults(model) {return Object.fromEntries(presets[model].parameters.map(([id,,,,,v])=>[id,v]));}
// Parameter tuple: id, label, min, max, step, initial, unit.
export function validateScene(input) {
  if (!input || typeof input!=='object' || !Object.hasOwn(presets,input.model)) throw new Error('暂不支持该实验模型，请选择欧姆定律、RC 电路或弹簧振子。');
  const preset=presets[input.model], parameters=defaults(input.model);
  if(input.parameters!==undefined && (!input.parameters || typeof input.parameters!=='object' || Array.isArray(input.parameters))) throw new Error('参数必须为对象');
  for(const [id,,min,max] of preset.parameters) {
    const v=input.parameters?.[id];
    if(v!==undefined) {if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max) throw new Error(`${id} 超出允许范围 ${min}–${max}`); parameters[id]=v;}
  }
  const selected=input.instruments??preset.defaultInstruments;
  if(!Array.isArray(selected)||selected.length>8||selected.some(x=>!preset.defaultInstruments.includes(x))) throw new Error('仪表与实验模型不匹配');
  return {version:1,model:input.model,title:typeof input.title==='string'?input.title.slice(0,80):preset.title,parameters,instruments:[...new Set(selected)]};
}
const rules=[['rc',/\bRC\b|电容|充放电|充电|放电/i],['spring',/弹簧|振子|阻尼|质量块/i],['ohm',/欧姆|直流|电阻|电路|电流表|电压表/i]];
export function parseDescription(text) {
  if(typeof text!=='string'||!text.trim()||text.length>4000) throw new Error('请输入 1–4000 字的实验描述');
  const model=rules.find(([,re])=>re.test(text))?.[0];
  if(!model) throw new Error('尚未识别该场景。目前支持欧姆定律、RC 充放电、弹簧阻尼振子；其他实验需要注册模型。');
  const scene=validateScene({model}), parameters={};
  const extract=(id,re,factor=1)=>{const match=text.match(re);if(match)parameters[id]=Number(match[1])*factor;};
  if(model!=='spring') {
    extract('voltage',/([-+]?\d+(?:\.\d+)?)\s*(?:V\b|伏(?:特)?)/i);
    const resistance=text.match(/([-+]?\d+(?:\.\d+)?)\s*(kΩ|k欧|Ω|欧姆|欧)/i);
    if(resistance)parameters.resistance=Number(resistance[1])*(/^k/i.test(resistance[2])?1000:1);
  }
  if(model==='rc') {const c=text.match(/([-+]?\d+(?:\.\d+)?)\s*(μF|µF|uF|mF|微法)/i);if(c)parameters.capacitance=Number(c[1])*(/^mF$/i.test(c[2])?1000:1);}
  if(model==='spring') {
    extract('mass',/([-+]?\d+(?:\.\d+)?)\s*(?:kg\b|千克)/i);
    extract('stiffness',/([-+]?\d+(?:\.\d+)?)\s*N\s*\/\s*m\b/i);
    extract('damping',/阻尼(?:系数)?\s*[为=:：]?\s*([-+]?\d+(?:\.\d+)?)/);
    const x=text.match(/(?:位移|拉开)\s*[为=:：]?\s*([-+]?\d+(?:\.\d+)?)\s*(cm|厘米|m\b|米)/i);
    if(x)parameters.initial=Number(x[1])*(/cm|厘米/i.test(x[2])?0.01:1);
  }
  // Explicit extra apparatus cannot be quietly replaced by an unrelated graphic.
  const unsupported=text.match(/压力表|温度计|万用表|信号发生器|频谱仪|航向仪|陀螺仪|机器人/);
  if(unsupported)throw new Error(`暂未注册“${unsupported[0]}”组件，无法保证该仪器的正确外观和行为。请先扩展组件库。`);
  const names=[['voltmeter',/电压表/],['ammeter',/电流表/],['oscilloscope',/示波器/],['displacement',/位移传感器/],['force',/力传感器/]];
  const requested=names.filter(([,re])=>re.test(text)).map(([id])=>id);
  return validateScene({...scene,parameters,instruments:requested.length?requested:scene.instruments});
}
export function initialState(scene) {return {t:0,connected:false,charging:true,voltage:0,position:scene.parameters.initial??0,velocity:0};}
export function advance(scene,state,dt) {
  if(!Number.isFinite(dt)||dt<0||dt>0.25)throw new Error('时间步长须处于 0–0.25 秒');
  const s={...state,t:state.t+dt},p=scene.parameters;
  if(scene.model==='rc' && state.connected) {const tau=p.resistance*p.capacitance*1e-6,target=state.charging?p.voltage:0;s.voltage=target+(state.voltage-target)*Math.exp(-dt/tau);}
  if(scene.model==='spring' && state.connected) {
    // Bounded semi-implicit substeps keep high stiffness / low mass stable.
    const n=Math.max(1,Math.ceil(dt/0.001)),h=dt/n;
    for(let i=0;i<n;i++){s.velocity+=(-p.stiffness*s.position-p.damping*s.velocity)/p.mass*h;s.position+=s.velocity*h;}
  }
  return s;
}
export function readings(scene,state) {
  const p=scene.parameters;
  if(scene.model==='ohm')return {voltage:state.connected?p.voltage:0,current:state.connected?p.voltage/p.resistance:0,power:state.connected?p.voltage**2/p.resistance:0};
  if(scene.model==='rc')return {voltage:state.voltage,current:state.connected?((state.charging?p.voltage:0)-state.voltage)/p.resistance:0,tau:p.resistance*p.capacitance*1e-6};
  return {position:state.position,force:-p.stiffness*state.position,velocity:state.velocity,energy:0.5*p.mass*state.velocity**2+0.5*p.stiffness*state.position**2};
}
export function gaugeFraction(value,min,max) {return Math.max(0,Math.min(1,(value-min)/(max-min)));}
