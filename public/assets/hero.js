/* SORTS · sortsgame.com · the front-page performance.
   Tiles rain across the full width, each word of the intro sentence is
   traced and burst, its letters fly up and print the headline, then the
   case refills and hands itself to the visitor. Tap anywhere mid-show to
   skip. Reduce Motion gets the printed sentence and a live board at once. */
(function(){
  const stage=document.getElementById('stage');
  if(!stage)return;
  const SENTENCE=["TRACE","SPELL","BLAST","REPEAT"];
  const BAG="EEEEEEAAAAIIIIOOOONNNRRRTTTLLSSSUUDDGBCMPFHVWY";
  const VAL={A:1,B:3,C:3,D:2,E:1,F:4,G:2,H:4,I:1,J:8,K:5,L:1,M:3,N:1,O:1,P:3,Q:10,R:1,S:1,T:1,U:1,V:4,W:4,X:8,Y:4,Z:10};
  const WORDS=new Set(("the and for are but not you all any can was one our out day get see two way who did its let say she too use ace act add age ago aid aim air ant ape apt arc arm art ash ask ate awe bad bag ban bar bat bed bee beg bet bid big bin bit bow box bud bug bun bus buy cab cap car cat cog cot cow cry cub cup cut dab dam den dew dig dim dip dog dot dry dub due dug dye ear eat egg ego elf elm end era eve ewe eye fad fan far fat fed fee few fib fig fin fir fit fix fly foe fog fox fry fun fur gag gap gas gel gem get gig got gum gun gut guy gym had ham hat hay hem hen hew hex hid hip hit hoe hog hop hot hub hue hug hum hut ice icy ill imp ink inn ion ire ivy jab jam jar jaw jay jet jig job jog jot joy jug jut keg key kid kin kit lab lad lag lap law lay led leg lid lie lip lit lob log lot low lug mad map mar mat men met mew mid mix mob mop mow mud mug nab nag nap net new nib nil nip nod nor nub nun nut oak oar oat odd ode off oft oil old one opt orb ore owe owl own pad pal pan par pat paw pay pea peg pen pet pew pie pig pin pit ply pod pot pry pub pun pup rag ram ran rap rat raw ray red rib rid rig rim rip rob rod roe rot row rub rue rug rum run rut rye sad sag sap sat saw sea set sew shy sin sip sir sit six ski sky sly sob sod son sop sow soy spa spy sty sub sue sum sun tab tad tag tan tap tar tax tea ten tie tin tip toe ton top tot tow toy try tub tug urn van vat vet vex via vie vow wad wag war wax web wed wee wet why wig win wit woe wok won woo wow yak yam yap yaw yes yet yew zip zoo sort sorts sore sores rose roses rest rust ruse tore torn tors rots orts sets toes note notes tone tones stone snort store onset word words game type types page pages book books trace print blast burst chain cast case core bore bone tale sale salt slot lost lots slat last list silt tilt tile time lime line mine mint hint hind bind bend bond band land sand said maid mail main rain gain grain train brain stain sting string strong wrong bring being begin below elbow vowel novel level lever fever never seven event scent spent spend blend bland brand grand stand stamp stomp stump plump climb crumb thumb thump truck track trick brick block black blank plank plant slant chant chart charm smash flash flesh fresh crash trash stash slash clash class glass grass brass press dress crest wrist twist exist crisp brisk flask blast beast feast least yeast toast coast boast roast pull pulls lock locks clean sharp spell spells repeat repeats").split(/\s+/));
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const caseEl=document.getElementById('case');
  const tracer=document.getElementById('tracer');
  const pill=document.getElementById('pill');
  const pillWd=pill.querySelector('.wd'), pillPt=pill.querySelector('.pt');
  const hint=document.getElementById('hint');
  const after=document.getElementById('after');
  const cue=document.getElementById('cue');
  const hl=document.getElementById('hl');

  hl.querySelectorAll('.w').forEach(w=>{
    w.dataset.word.split('').forEach(ch=>{
      const s=document.createElement('span');s.className='ch';s.textContent=ch;w.appendChild(s);
    });
  });

  const gap=6;
  let COLS,ROWS,size,tiles=[],path=[],down=false,live=false,pillT=null,skipped=false;
  function geometry(){
    const w=caseEl.clientWidth;
    const target=Math.min(64,Math.max(42,w/12));
    COLS=Math.max(7,Math.round((w+gap)/(target+gap)));
    size=(w-gap*(COLS-1))/COLS;
    ROWS=innerHeight<700?3:4;
    caseEl.style.height=(size*ROWS+gap*(ROWS-1)+6)+"px";
  }
  const letter=()=>BAG[Math.random()*BAG.length|0];
  const colour=()=>Math.random()<.2?('c'+(1+(Math.random()*5|0))):'';
  const sleep=ms=>new Promise(r=>setTimeout(r,skipped?0:ms));
  const jit=()=> (Math.random()*2.2-1.1).toFixed(2);
  const fast=()=>reduce||skipped;

  function place(t,anim){
    t.el.style.width=size+"px";t.el.style.height=size+"px";
    t.el.style.fontSize=(size*.5)+"px";
    t.el.style.transition=(anim&&!fast())
      ?"transform .12s ease, top .42s cubic-bezier(.3,1.4,.5,1)"
      :"transform .12s ease";
    t.el.style.left=(t.col*(size+gap))+"px";
    t.el.style.top=(t.row*(size+gap))+"px";
  }
  function makeTile(col,row,ch,drop){
    const el=document.createElement('button');
    el.type='button';el.className='tile-b '+colour();el.tabIndex=-1;
    const L=ch||letter();
    el.innerHTML=L+'<span class="v">'+VAL[L]+'</span>';
    el.style.transform='rotate('+jit()+'deg)';
    el.style.left=(col*(size+gap))+"px";
    el.style.top=(drop&&!fast()?-(size+gap)*(1.6+(ROWS-1-row)*.7+Math.random()):row*(size+gap))+"px";
    const t={el,col,row,L};el._tile=t;
    caseEl.appendChild(el);tiles.push(t);
    requestAnimationFrame(()=>place(t,true));
    return t;
  }
  function clearBoard(){tiles.forEach(t=>t.el.remove());tiles=[];tracer.innerHTML='';}
  function buildBoard(word,row,offOverride){
    clearBoard();
    const off=(offOverride!=null)?offOverride:Math.max(0,Math.min(COLS-word.length,
      Math.floor(Math.random()*(COLS-word.length+1))));
    const order=[];
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)order.push([c,r]);
    order.forEach(([c,r],i)=>{
      const ch=(r===row&&c>=off&&c<off+word.length)?word[c-off]:null;
      if(fast())makeTile(c,r,ch,false);
      else setTimeout(()=>{if(!fast())makeTile(c,r,ch,true);else if(!tiles.some(t=>t.col===c&&t.row===r))makeTile(c,r,ch,false);}, i*7 + Math.random()*70);
    });
    return off;
  }
  function drawPath(pts){
    tracer.innerHTML='';
    if(pts.length<2)return;
    tracer.setAttribute('viewBox','0 0 '+caseEl.clientWidth+' '+caseEl.clientHeight);
    const pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');
    pl.setAttribute('points',pts.map(t=>(t.col*(size+gap)+size/2)+','+(t.row*(size+gap)+size/2)).join(' '));
    pl.setAttribute('fill','none');pl.setAttribute('stroke','rgba(200,64,43,.5)');
    pl.setAttribute('stroke-width',Math.max(6,size*.18));
    pl.setAttribute('stroke-linecap','round');pl.setAttribute('stroke-linejoin','round');
    tracer.appendChild(pl);
  }
  function sparks(x,y,cls){
    if(fast())return;
    const cols={c1:'#C23E29',c2:'#4F855A',c3:'#43719A',c4:'#B98F3B',c5:'#7E5F98','':'#B28636'};
    for(let i=0;i<7;i++){
      const s=document.createElement('span');s.className='spark';
      s.style.background=i%3?cols[cls]||'#B28636':'#FFFFFF';
      s.style.left=x+"px";s.style.top=y+"px";caseEl.appendChild(s);
      const a=Math.random()*Math.PI*2,d=size*(0.6+Math.random());
      s.animate([{transform:'translate(0,0)',opacity:1},
        {transform:'translate('+Math.cos(a)*d+'px,'+Math.sin(a)*d+'px) rotate('+(180+Math.random()*360)+'deg)',opacity:0}],
        {duration:520,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>s.remove();
    }
  }
  function cls(t){return (t.el.className.match(/c[1-5]/)||[''])[0];}
  function burst(list){
    list.forEach(t=>{
      sparks(t.col*(size+gap)+size/2,t.row*(size+gap)+size/2,cls(t));
      t.el.classList.add('pop');
      setTimeout(()=>t.el.remove(),fast()?0:400);
      tiles=tiles.filter(x=>x!==t);
    });
  }
  function flyTo(t,target){
    if(fast()){target.classList.add('on');return;}
    const from=t.el.getBoundingClientRect();
    const to=target.getBoundingClientRect();
    const f=document.createElement('div');
    f.className='fly';f.textContent=t.L;
    f.style.width=from.width+"px";f.style.height=from.height+"px";
    f.style.left=from.left+"px";f.style.top=from.top+"px";
    f.style.fontSize=(from.width*.5)+"px";
    document.body.appendChild(f);
    f.getBoundingClientRect();
    const th=to.height*1.02;
    f.style.width=(to.width*1.12)+"px";f.style.height=th+"px";
    f.style.left=(to.left-(to.width*.06))+"px";f.style.top=to.top+"px";
    f.style.fontSize=(th*.62)+"px";f.style.opacity="0";
    setTimeout(()=>{target.classList.add('on');f.remove();},580);
  }
  async function playWord(word,slot){
    const row=(slot%2===0)?1:Math.max(0,ROWS-2);
    const off=buildBoard(word,row);
    await sleep(820);
    const run=[];
    for(let i=0;i<word.length;i++){
      const t=tiles.find(x=>x.row===row&&x.col===off+i);
      if(!t)continue;
      run.push(t);t.el.classList.add('sel');drawPath(run);
      await sleep(120);
    }
    await sleep(240);
    const targets=hl.querySelectorAll('.w')[slot].querySelectorAll('.ch');
    run.forEach((t,i)=>{if(targets[i])flyTo(t,targets[i]);});
    targets.forEach((s,i)=>{if(i>=run.length)s.classList.add('on');});
    const blast=new Set(run);
    run.forEach(t=>{const c=cls(t);if(!c)return;
      tiles.forEach(o=>{if(blast.has(o))return;
        if(Math.abs(o.col-t.col)+Math.abs(o.row-t.row)===1&&cls(o)===c)blast.add(o);});
    });
    tracer.innerHTML='';
    burst([...blast]);
    await sleep(660);
    const dot=hl.querySelectorAll('.dot')[slot];
    if(dot)dot.classList.add('on');
    await sleep(200);
  }

  /* interactive phase */
  function extend(t){
    if(path.includes(t)){
      if(path.length>1&&path[path.length-2]===t){const d=path.pop();d.el.classList.remove('sel');drawPath(path);}
      return;
    }
    if(path.length){
      const p=path[path.length-1];
      if(Math.abs(p.col-t.col)+Math.abs(p.row-t.row)!==1)return;
    }
    path.push(t);t.el.classList.add('sel');drawPath(path);
  }
  function showPill(word,pts){
    pillWd.textContent=word;pillPt.textContent='+'+pts;
    pill.classList.add('on');
    clearTimeout(pillT);pillT=setTimeout(()=>pill.classList.remove('on'),1600);
  }
  function refill(){
    for(let c=0;c<COLS;c++){
      const col=tiles.filter(t=>t.col===c).sort((a,b)=>b.row-a.row);
      let r=ROWS-1;
      col.forEach(t=>{t.row=r--;place(t,true);});
      while(r>=0)makeTile(c,r--,null,true);
    }
  }
  function release(){
    if(!down)return;down=false;
    const w=path.map(t=>t.L).join('');
    const ok=path.length>=3&&WORDS.has(w.toLowerCase());
    if(ok){
      let pts=path.reduce((s,t)=>s+VAL[t.L],0)*3;
      const blast=new Set(path);
      path.forEach(t=>{const c=cls(t);if(!c)return;
        tiles.forEach(o=>{if(blast.has(o))return;
          if(Math.abs(o.col-t.col)+Math.abs(o.row-t.row)===1&&cls(o)===c){blast.add(o);pts+=5;}});
      });
      showPill(w,pts);
      burst([...blast]);
      setTimeout(refill,reduce?0:320);
    }else if(path.length){
      path.forEach(t=>t.el.classList.add('shake'));
      setTimeout(()=>tiles.forEach(t=>t.el.classList.remove('shake')),320);
    }
    path.forEach(t=>t.el.classList.remove('sel'));
    path=[];drawPath(path);
  }
  function hit(e){
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const btn=el&&el.closest?el.closest('.tile-b'):null;
    return btn&&btn._tile&&tiles.includes(btn._tile)?btn._tile:null;
  }
  function goLive(){
    if(live)return;
    live=true;caseEl.classList.add('live');
    hint.classList.add('on');after.classList.add('on');cue.classList.add('on');
    caseEl.addEventListener('pointerdown',e=>{
      if(!live)return;e.preventDefault();
      const t=hit(e);if(!t)return;
      down=true;path=[];extend(t);
      try{caseEl.setPointerCapture(e.pointerId);}catch(_){}
    });
    caseEl.addEventListener('pointermove',e=>{if(down){const t=hit(e);if(t)extend(t);}});
    caseEl.addEventListener('pointerup',release);
    caseEl.addEventListener('pointercancel',release);
    document.addEventListener('pointerup',release);
  }
  function finishNow(){
    hl.querySelectorAll('.ch').forEach(s=>s.classList.add('on'));
    hl.querySelectorAll('.dot').forEach(d=>d.classList.add('on'));
    document.querySelectorAll('.fly').forEach(f=>f.remove());
    buildBoard("SORTS",Math.max(1,Math.floor(ROWS/2)),Math.max(0,Math.floor((COLS-5)/2)));
    goLive();
  }
  async function run(){
    geometry();
    if(reduce){finishNow();return;}
    stage.addEventListener('pointerdown',function skipper(e){
      if(live)return;
      if(e.target.closest&&e.target.closest('a,nav'))return;
      skipped=true;stage.removeEventListener('pointerdown',skipper);
    });
    for(let i=0;i<SENTENCE.length;i++){
      if(skipped)break;
      await playWord(SENTENCE[i],i);
    }
    finishNow();
  }
  addEventListener('resize',()=>{
    const oldCols=COLS;geometry();
    if(COLS!==oldCols&&live){buildBoard("SORTS",Math.max(1,Math.floor(ROWS/2)),Math.max(0,Math.floor((COLS-5)/2)));}
    else tiles.forEach(t=>place(t,false));
  });
  run();
})();

/* dusk & lamp: gentle scroll-linked lighting on the home page */
(function(){
  const dusk=document.querySelector('.dusk');
  const night=document.querySelector('.night');
  if(!dusk||!night)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  function onScroll(){
    const r=dusk.getBoundingClientRect();
    const p=Math.min(1,Math.max(0,1-(r.top/(innerHeight*.85))));
    dusk.style.setProperty('--duskp',p.toFixed(2));
    const n=night.getBoundingClientRect();
    const lamp=Math.min(1,Math.max(0,1-(n.top/(innerHeight*.9))));
    night.style.setProperty('--lamp',(0.2+0.8*lamp).toFixed(2));
  }
  addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

/* preview video: play only in view, respect Reduce Motion */
(function(){
  const v=document.getElementById('pv');
  if(!v)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){v.play().catch(()=>{});}else v.pause();});
  },{threshold:.35});
  io.observe(v);
})();
