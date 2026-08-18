/* ============================================================
    DATA — Platforms & Attack Engines
   Developer: Nawab Zada Hacker ☠️🙌🦅 (Educational Only)
============================================================ */

const PLATFORMS = [
  { id:'facebook',  name:'Facebook',  ico:'📘', color:'#1877f2' },
  { id:'tiktok',    name:'TikTok',    ico:'🎵', color:'#00f2ea' },
  { id:'instagram', name:'Instagram', ico:'📸', color:'#e1306c' },
  { id:'snapchat',  name:'Snapchat',  ico:'👻', color:'#fffc00' },
  { id:'gmail',     name:'Gmail',     ico:'✉️', color:'#ea4335' },
];

/* Har engine ki apni password-generation type (gen) hai */
const ENGINES = [
  { id:'hydra',    name:'HYDRA',       ico:'🐴', color:'#ff2b3a', speed:220,  gen:'dictionary',
    desc:'Dictionary Attack — words × years × symbols' },
  { id:'hashcat',  name:'HASHCAT',     ico:'⚡', color:'#ffd000', speed:450,  gen:'mask',
    desc:'Mask Attack — aaa0, aaa1, digit masks' },
  { id:'john',     name:'JOHN RIPPER', ico:'🧟', color:'#00e5ff', speed:150,  gen:'mutation',
    desc:'Mutation Attack — word mangling rules' },
  { id:'ncrack',   name:'NCRACK',      ico:'🐉', color:'#b026ff', speed:200,  gen:'common',
    desc:'Top-1000 Common Passwords (basic-1000.txt)' },
  { id:'medusa',   name:'MEDUSA',      ico:'🐍', color:'#00ff88', speed:180,  gen:'names',
    desc:'Names Attack — names × birth-years × symbols' },
  { id:'patator',  name:'PATATOR',     ico:'💥', color:'#ff8a00', speed:260,  gen:'sequential',
    desc:'Sequential Attack — aa, ab, 0000–9999' },
  { id:'aircrack', name:'AIRCRACK-NG', ico:'📡', color:'#ff66cc', speed:320,  gen:'hexnumeric',
    desc:'Numeric/Hex Attack — 8-digit + hex masks' },
  { id:'turbo',    name:'TURBO-X',     ico:'🚀', color:'#ffffff', speed:900,  gen:'mega',
    desc:'MEGA Attack — sab engines ka mix, sab se fast' },
];
