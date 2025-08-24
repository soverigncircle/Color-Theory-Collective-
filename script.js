
const brandLines = {
  "Schwarzkopf (concept)": [
    "Igora Royal Naturals (—0)","Igora Royal Ash (—1)","Igora Royal Beige (—4)",
    "Igora Royal Gold (—5)","Igora Royal Chocolate (—6)","Igora Royal Violet (—2)",
    "Igora Royal Copper (—7)","Igora Royal Red (—8)","Igora Fashion (Mix Tones)",
    "Igora Highlifts (—1 —11 —12)","Igora Vibrance (Demi) Naturals","Igora Vibrance Toners",
    "Igora Royal Absolutes (—00)","Igora Deep Toners","Igora Pastel Toners",
    "tbh (true beautiful honest)","BLONDME Toners","Silver Whites"
  ],
  "#MyDentity (concept)": ["Permanent","Demi","Xpress Toners","Direct Dyes"],
  "Wella (concept)": ["Koleston Perfect","Illumina","Color Touch","Shinefinity"],
  "Goldwell (concept)": ["Topchic","Colorance","Elumen"],
  "Pravana (concept)": ["Chromasilk","Vivids"],
  "Danger Jones (concept)": ["Vibrant Direct Dyes"],
  "Generic Pro (Levels)": ["Naturals"]
};
const tones = ["Neutral","Ash","Violet","Beige","Gold","Copper","Red","Mocha/Chocolate","Silver","Pastel"];
const developers = ["5vol","10vol","20vol","30vol","40vol"];

const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));

function fillSelect(sel, arr){ sel.innerHTML=""; arr.forEach(v=>{const o=document.createElement('option'); o.value=v; o.textContent=v; sel.appendChild(o);}); }

function initMixer(){
  const brandSel = $("#brand"), lineSel=$("#line"), levelSel=$("#level"), toneSel=$("#tone"), devSel=$("#developer");
  const shadeA=$("#shadeA"), shadeB=$("#shadeB"), rA=$("#ratioA"), rB=$("#ratioB"), sw=$("#swatch");
  fillSelect(brandSel, Object.keys(brandLines));
  brandSel.addEventListener('change', ()=> fillSelect(lineSel, brandLines[brandSel.value]||[])); brandSel.dispatchEvent(new Event('change'));
  fillSelect(levelSel, Array.from({length:12},(_,i)=>String(i+1)));
  fillSelect(toneSel, tones); fillSelect(devSel, developers);

  function paint(){
    const a=shadeA.value||"#9b72ff", b=shadeB.value||"#e5d8ff";
    const ra=parseFloat(rA.value||"1"), rb=parseFloat(rB.value||"1"); const pct=Math.max(0,Math.min(100,(ra/(ra+rb))*100));
    sw.style.background=`linear-gradient(90deg, ${a} ${pct}%, ${b} ${pct}%)`;
    const params=new URLSearchParams({brand:brandSel.value,line:lineSel.value,level:levelSel.value,tone:toneSel.value,dev:devSel.value,a:a,b:b,ra:rA.value,rb:rB.value});
    $("#share").value=location.origin+location.pathname+"#mixer?"+params.toString();
  }
  $$("#mixer select, #mixer input").forEach(x=>x.addEventListener('input', paint));
  $("#copy").addEventListener('click', ()=>{navigator.clipboard?.writeText($("#share").value)});
  if(location.hash.startsWith("#mixer?")){
    const qs=new URLSearchParams(location.hash.split("?")[1]);
    for(const [k,v] of qs.entries()){ const el=document.getElementById(k==='a'?'shadeA':k==='b'?'shadeB':k); if(el){el.value=v;} }
  }
  paint();
}

async function initAI(){
  $("#analyze").addEventListener('click', async ()=>{
    const key=$("#key").value.trim(); if(!key){ alert("Enter your OpenAI key first."); return; }
    const image=$("#imgurl").value.trim(); if(!image){ alert("Paste an image URL."); return; }
    $("#aitext").textContent="Analyzing…";
    try{
      const r=await fetch("/.netlify/functions/vision",{
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-openai-key": key },
        body: JSON.stringify({ image, task:"hair_analysis" })
      });
      const j=await r.json();
      $("#aitext").textContent=j.text || JSON.stringify(j,null,2);
    }catch(e){
      $("#aitext").textContent="Error: "+e.message;
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{ initMixer(); initAI(); });
