const CACHE='fretory-v5.3.0';
const ASSETS=['./','./index.html','./styles.css?v=5.3.0','./app.js?v=5.3.0','./theory-questions.js?v=5.3.0','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fretory-v')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||!request.url.startsWith(self.registration.scope))return;
  const isPage=request.mode==='navigate';
  const url=new URL(request.url);
  const shellPage=isPage&&(url.pathname===new URL(self.registration.scope).pathname
    ||url.pathname===new URL('./index.html',self.registration.scope).pathname);
  // Keep versioned assets paired with the installed app shell.
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE).catch(()=>null);
    const cached=()=>cache?.match(request);
    if(shellPage){
      const shell=await cache?.match('./index.html');
      if(shell)return shell;
    }
    if(!isPage){
      const hit=await cached();
      if(hit)return hit;
    }
    try{
      const response=await fetch(request);
      if(response.ok){
        if(cache)await cache.put(request,response.clone()).catch(()=>{});
        return response;
      }
      return await cached()||response;
    }catch{
      return await cached()||(isPage&&await cache?.match('./index.html'))||Response.error();
    }
  })());
});
