// Guarda o app no aparelho para abrir sem internet.
const CACHE='terrapleno-v4';const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  // com sinal: sempre confere a versão mais nova no servidor (sem usar cópia velha); sem sinal: usa a cópia guardada
  const req=same?fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}):fetch(e.request);
  e.respondWith(req.then(r=>{if(r.ok&&same){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r})
   .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
