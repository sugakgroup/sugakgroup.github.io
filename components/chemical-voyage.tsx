'use client';
import { useEffect, useRef, useState } from 'react';

/** A conceptual, animated chemical-space visualization. Points are possibilities, not measured data. */
export function ChemicalVoyage({ theme = 'blue', speed = 1, english = false, label = '化学空間の模式映像。無数の可能性の中を、小さな探索の光へ向かって進みます。' }: { theme?: 'blue'|'silver'|'red'|'green'|'white'; speed?: number; english?: boolean; label?: string }) {
 const canvasRef=useRef<HTMLCanvasElement>(null);const pauseRef=useRef(false);
 const [paused,setPaused]=useState(false);const [available,setAvailable]=useState(true);const [ready,setReady]=useState(false);const [reduced,setReduced]=useState(false);
 useEffect(()=>{pauseRef.current=paused;},[paused]);
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;
  const pref=window.matchMedia('(prefers-reduced-motion: reduce)');let reduce=pref.matches;setReduced(reduce);
  const onPref=()=>{reduce=pref.matches;setReduced(reduce);};pref.addEventListener('change',onPref);
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl){setAvailable(false);pref.removeEventListener('change',onPref);return;}
  const shaders:WebGLShader[]=[];const programs:WebGLProgram[]=[];
  const make=(vertex:string,fragment:string)=>{const p=gl.createProgram()!;for(const [kind,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const){const s=gl.createShader(kind)!;gl.shaderSource(s,source);gl.compileShader(s);gl.attachShader(p,s);shaders.push(s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('Shader not supported');programs.push(p);return p;};
  let sky:WebGLProgram;let stars:WebGLProgram;
  try{
   sky=make('attribute vec2 p;varying vec2 uv;void main(){uv=p;gl_Position=vec4(p,0.,1.);}',`precision mediump float;varying vec2 uv;uniform float t;uniform float aspect;uniform vec3 tint;uniform float white;
    void main(){vec2 p=uv;p.x*=aspect;vec2 beacon=vec2(.36*aspect,.08);float d=length(p-beacon);float halo=.014/(d*d+.016);float cloud=exp(-pow((p.y+.18*sin(p.x*1.7+t*.014))*2.1,2.))*exp(-abs(p.x)*.4);vec3 dark=vec3(.008,.016,.029)+tint*cloud*.065;dark+=vec3(1.,.70,.32)*halo*.11;float core=exp(-d*d*16000.);dark+=vec3(1.,.91,.64)*core;vec3 pale=vec3(.91,.94,.90)-tint*cloud*.1-vec3(.06,.05,.03)*halo;gl_FragColor=vec4(mix(dark,pale,white),1.);}`);
   stars=make(`attribute vec4 point;uniform float t;uniform float aspect;uniform float dpr;varying float alpha;varying float warm;
    void main(){float z=mod(point.z-t*10.,1800.)+22.;float curve=sin(z*.002+t*.016)*90.;vec2 xy=point.xy;xy.x+=curve;xy.y+=cos(t*.019)*18.;vec2 screen=xy/z*1.28;screen.x/=aspect;screen+=vec2(.36,.08);gl_Position=vec4(screen,0.,1.);float depth=clamp(1.-z/1850.,0.,1.);gl_PointSize=clamp((1.+point.w*1.9+depth*.6)*dpr,.8,3.9*dpr);alpha=(.18+.95*point.w)*smoothstep(22.,150.,z)*(.4+depth*.6);warm=step(.984,point.w);}`,`precision mediump float;uniform vec3 tint;uniform float white;varying float alpha;varying float warm;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);float a=exp(-d*d*20.)*alpha;vec3 c=mix(tint,vec3(1.,.76,.37),warm);c=mix(c,vec3(.16,.35,.27),white);gl_FragColor=vec4(c,a);}`);
  }catch{setAvailable(false);for(const p of programs)gl.deleteProgram(p);for(const s of shaders)gl.deleteShader(s);pref.removeEventListener('change',onPref);return;}
  const colors:Record<string,number[]>={blue:[.42,.61,.94],silver:[.70,.75,.79],red:[.85,.28,.16],green:[.59,.83,.33],white:[.42,.61,.50]};const tint=colors[theme];const isWhite=theme==='white'?1:0;
  const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const count=32000;const data=new Float32Array(count*4);let seed=62831;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<count;i++){const cluster=i%3===0;data[i*4]=(rnd()-.5)*2600;data[i*4+1]=(rnd()-.5)*(cluster?290:1700);data[i*4+2]=rnd()*1800;data[i*4+3]=Math.pow(rnd(),2);}
  const points=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,points);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  const skyP=gl.getAttribLocation(sky,'p'),starP=gl.getAttribLocation(stars,'point');
  const skyT=gl.getUniformLocation(sky,'t'),starT=gl.getUniformLocation(stars,'t');
  let aspect=1,dpr=1,visible=true,disposed=false,lost=false,frame=0,previous=0,elapsed=0,lastDraw=-1;
  const resize=()=>{const r=canvas.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));aspect=canvas.width/canvas.height;gl.viewport(0,0,canvas.width,canvas.height);lastDraw=-1;};
  const ro=new ResizeObserver(resize);ro.observe(canvas);const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});io.observe(canvas);
  const draw=(now:number)=>{if(disposed||lost)return;const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;
   if(visible&&!document.hidden){if(!pauseRef.current&&!reduce)elapsed+=dt*speed;if(lastDraw!==elapsed){
    gl.disable(gl.BLEND);gl.useProgram(sky);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(skyP);gl.vertexAttribPointer(skyP,2,gl.FLOAT,false,0,0);gl.uniform1f(skyT,elapsed);gl.uniform1f(gl.getUniformLocation(sky,'aspect'),aspect);gl.uniform3fv(gl.getUniformLocation(sky,'tint'),tint);gl.uniform1f(gl.getUniformLocation(sky,'white'),isWhite);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);gl.disableVertexAttribArray(skyP);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,isWhite?gl.ONE_MINUS_SRC_ALPHA:gl.ONE);gl.useProgram(stars);gl.bindBuffer(gl.ARRAY_BUFFER,points);gl.enableVertexAttribArray(starP);gl.vertexAttribPointer(starP,4,gl.FLOAT,false,0,0);gl.uniform1f(starT,elapsed);gl.uniform1f(gl.getUniformLocation(stars,'aspect'),aspect);gl.uniform1f(gl.getUniformLocation(stars,'dpr'),dpr);gl.uniform3fv(gl.getUniformLocation(stars,'tint'),tint);gl.uniform1f(gl.getUniformLocation(stars,'white'),isWhite);gl.drawArrays(gl.POINTS,0,count);gl.disableVertexAttribArray(starP);lastDraw=elapsed;setReady(true);
   }}frame=requestAnimationFrame(draw);
  };resize();frame=requestAnimationFrame(draw);
  const contextLost=(event:Event)=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);setAvailable(false);setReady(false);};canvas.addEventListener('webglcontextlost',contextLost);
  return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();pref.removeEventListener('change',onPref);canvas.removeEventListener('webglcontextlost',contextLost);gl.deleteBuffer(quad);gl.deleteBuffer(points);for(const p of programs)gl.deleteProgram(p);for(const s of shaders)gl.deleteShader(s);};
 },[theme,speed]);
 return <div className={`chemical-voyage voyage-${theme} ${ready?'voyage-ready':''}`} role="group" aria-label={label}>{theme==='silver'?<picture className="voyage-fallback voyage-poster" aria-hidden="true"><source media="(max-width:560px)" srcSet="/images/chemical-voyage-mobile.png"/><img src="/images/chemical-voyage-desktop.png" width={1600} height={540} alt="" fetchPriority="high" loading="eager"/></picture>:<div className="voyage-fallback"/>}<canvas ref={canvasRef} aria-hidden="true"/>{available&&!reduced?<button type="button" className="voyage-toggle" onClick={()=>setPaused(p=>!p)} aria-pressed={paused} aria-label={english ? (paused ? 'Resume animation' : 'Pause animation') : (paused?'化学空間の映像を再開':'化学空間の映像を停止')}>{paused?'▶ RESUME':'Ⅱ PAUSE'}</button>:<span className="voyage-static">STILL VIEW</span>}<span className="voyage-caption">CHEMICAL SPACE / CONCEPTUAL VISUALIZATION</span></div>;
}
