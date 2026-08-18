/* ============================================================
   GENERATOR — Har engine apni type ke passwords banata hai
   Developer: Nawab Zada Hacker ☠️🙌🦅 (Educational Only)
============================================================ */

/* ---------- Helpers ---------- */
function leet(w){
  return w.replace(/a/g,'@').replace(/e/g,'3').replace(/i/g,'1')
          .replace(/o/g,'0').replace(/s/g,'5');
}
function cap(w){ return w.charAt(0).toUpperCase() + w.slice(1); }
function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ---------- Base Wordlists ---------- */
const BASE_WORDS = [
  'admin','password','123456','qwerty','letmein','welcome','monkey','dragon','master','hello',
  'sunshine','princess','football','superman','iloveyou','batman','trustno1','shadow','charlie','michael',
  'jordan','hunter','ranger','soccer','hockey','starwars','naruto','goku','akatsuki','sharingan',
  'pakistan','india','bangladesh','srilanka','turkey','dubai','karachi','lahore','islamabad','peshawar',
  'khan','ahmed','ali','hassan','bilal','umar','zain','sara','aisha','fatima',
  'nawab','hacker','cyber','anonymous','unknown','ghost','ninja','tiger','lion','king',
  'queen','rocket','secret','love','angel','baby','money','freedom','cricket','messi',
  'ronaldo','virat','bhola','jani','bhai','bro','dude','cool','super','power',
  'dark','night','moon','star','fire','water','earth','wind','legend','warrior',
  'allahuakbar','ramadan','eidmubarak','quaid','jinnah','iqbal','pakforce','whatsapp','hacking','virus',
  'killer','beast','wolf','eagle','falcon','phoenix','demon','devil','babygirl','forever',
];

const NAME_WORDS = [
  'alex','sam','john','mike','david','chris','james','daniel','robert','william',
  'joseph','thomas','charles','christopher','anthony','mark','steven','paul','andrew','joshua',
  'kevin','brian','george','edward','ronald','timothy','jason','jeffrey','ryan','jacob',
  'gary','nicholas','eric','jonathan','stephen','larry','justin','scott','brandon','benjamin',
  'samuel','frank','gregory','raymond','alexander','patrick','jack','dennis','jerry','tyler',
  'aaron','henry','douglas','peter','adam','nathan','zachary','kyle','walter','harold',
  'carl','jeremy','keith','roger','gerald','ethan','arthur','terry','christian','sean',
  'lawrence','austin','joe','albert','jesse','willie','billy','bryan','bruce','noah',
  'jordan','dylan','ralph','roy','alan','wayne','eugene','logan','randy','louis',
  'abdullah','usman','hamza','owais','danish','fahad','imran','kamran','salman','shahzad',
];

const YEARS = [
  '0','1','12','123','1234','12345','123456','1234567','12345678','123456789',
  '1947','2000','2001','2002','2003','2004','2005','2006','2007','2008',
  '2009','2010','2011','2012','2013','2014','2015','2016','2017','2018',
  '2019','2020','2021','2022','2023','2024','2025','2026'
];
const SYMS = ['','!','@','#','$','%','^','&','*','_','.'];

/* Platform ke naam bhi wordlist me mil jate hain */
const PLATFORM_WORDS = {
  facebook:  ['facebook','fb','meta','zuck','book','face','fb123','facebook123'],
  tiktok:    ['tiktok','tik','tok','douyin','musical','dance','video','tiktok123'],
  instagram: ['instagram','insta','gram','ig','reel','pic','photo','insta123'],
  snapchat:  ['snapchat','snap','chat','ghost','streak','lens','snap123'],
  gmail:     ['gmail','google','mail','gm','inbox','drive','youtube','gmail123'],
};
const pw = id => PLATFORM_WORDS[id] || [];

/* ---------- 1) HYDRA — Dictionary Attack ---------- */
function genDictionary(platId){
  const p = [];
  const w = [...BASE_WORDS, ...pw(platId)];
  for(const x of w){
    p.push(x);
    for(const y of YEARS) p.push(x + y);
    for(const s of SYMS)  p.push(x + s);
    for(const y of YEARS) for(const s of SYMS.slice(0,5)) p.push(x + y + s);
    p.push(cap(x)+'123', x.toUpperCase(), leet(x), leet(x)+'123');
  }
  return [...new Set(p)];
}

/* ---------- 2) HASHCAT — Mask Attack ---------- */
function genMask(platId){
  const p = [];
  const A = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const D = '0123456789'.split('');
  for(const a of A) for(const b of A){
    p.push(a+b+'00', a+b+'11', a+b+'22', a+b+'!', '!'+a+b, a+b+'123');
  }
  for(const w of pw(platId)){
    for(const d of D) p.push(w+d, w+d+d, w+'!'+d, cap(w)+d);
  }
  for(const y of YEARS) for(const s of ['!','@','#']) p.push('abcd'+y+s, y+s+'abcd');
  return [...new Set(p)];
}

/* ---------- 3) JOHN RIPPER — Mutation Attack ---------- */
function genMutation(platId){
  const p = [];
  const w = [...BASE_WORDS, ...pw(platId)];
  for(const x of w){
    p.push(x, cap(x), x.toUpperCase(), x+'1', x+'12', x+'123', x+'!', x+'@', x+'#',
            '!'+x, '@'+x, '#'+x, x+'_', '_'+x, x+'.', '.'+x,
            leet(x), leet(x)+'!', cap(x)+'!', x.split('').reverse().join(''),
            x+x, cap(x)+'123', x+'2024', x+'786');
  }
  return [...new Set(p)];
}

/* ---------- 4) NCRACK — Common List Attack (4000+ passwords) ---------- */
function genCommon(platId, commonList){
  const src = (commonList && commonList.length)
    ? commonList
    : [...BASE_WORDS, ...NAME_WORDS, ...pw(platId)];
  const p = [...src, ...pw(platId)];
  for(const x of src){
    p.push(x+'1', x+'12', x+'123', x+'1234', x+'!', x+'@', x+'#', x+'$',
            x+'786', cap(x), x.toUpperCase(), leet(x));
  }
  for(const x of src.slice(0,80)){
    for(const y of YEARS) p.push(x + y);
  }
  return [...new Set(p)];
}

/* ---------- 5) MEDUSA — Names Attack ---------- */
function genNames(platId){
  const p = [];
  const n = [...NAME_WORDS, ...pw(platId)];
  const by = ['1990','1995','2000','2001','2002','2003','2004','2005','2006','2007','2008',
              '2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019',
              '2020','2021','2022','2023','2024','1947'];
  for(const x of n){
    p.push(x, cap(x), x+'123', x+'786', x+'!', x+'@', x+'00', x+'01');
    for(const y of by) p.push(x+y, x+'_'+y);
  }
  return [...new Set(p)];
}

/* ---------- 6) PATATOR — Sequential Attack ---------- */
function genSequential(platId){
  const p = [];
  const A = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const D = '0123456789'.split('');
  for(const a of A) for(const b of A){
    p.push(a+b, a+b+'0', a+b+'1', '0'+a+b, '1'+a+b, cap(a+b)+'!');
  }
  for(const d of D) for(const e of D){
    p.push(d+e+'0000', d+e+'1111', d+e+'2024', d+e+'786');
  }
  for(let i=0;i<10000;i++) p.push(String(i).padStart(4,'0'));
  for(const w of pw(platId)) for(let i=0;i<500;i+=13) p.push(w+String(i).padStart(4,'0'));
  return [...new Set(p)];
}

/* ---------- 7) AIRCRACK-NG — Numeric/Hex Attack ---------- */
function genHexNumeric(platId){
  const p = [];
  for(let i=0;i<20000;i++) p.push(String(i).padStart(8,'0'));
  for(let i=0;i<10000;i++) p.push(String(i).padStart(6,'0'));
  const H = '0123456789abcdef'.split('');
  for(const a of H) for(const b of H) for(const c of H){
    p.push('00'+a+b+c+'00', 'aa'+a+b+c+'bb', 'ff'+a+b+c+'ff');
  }
  for(const w of pw(platId)) for(let i=0;i<1000;i+=31) p.push(w+String(i).padStart(4,'0'));
  return [...new Set(p)];
}

/* ---------- 8) TURBO-X — MEGA Attack (sab ka mix) ---------- */
function genMega(platId){
  return [...new Set([
    ...genDictionary(platId), ...genMask(platId), ...genMutation(platId),
    ...genNames(platId), ...genSequential(platId), ...genHexNumeric(platId)
  ])];
}

const GENERATORS = {
  dictionary: genDictionary, mask: genMask, mutation: genMutation,
  common: genCommon, names: genNames, sequential: genSequential,
  hexnumeric: genHexNumeric, mega: genMega
};
