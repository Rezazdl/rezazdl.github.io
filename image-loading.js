// Retry only first-party uploaded images; never retry external URLs or data previews.
export function installImageRecovery(root=document,onFailure=()=>{}){
 const states=new WeakMap(),delays=[1000,4000,10000,20000];
 const resolve=img=>{try{const url=new URL(img.getAttribute('src'),root.baseURI);if(url.origin!==new URL(root.baseURI).origin||!url.pathname.includes('/assets/uploads/'))return null;url.searchParams.delete('image-retry');return url}catch{return null}};
 const failed=event=>{
  const img=event.target;if(img?.tagName!=='IMG'||!img.getAttribute('src'))return;
  const url=resolve(img);if(!url)return;
  let state=states.get(img);if(!state||state.key!==url.href){if(state?.timer)clearTimeout(state.timer);state={key:url.href,attempt:0,timer:null,reported:false};states.set(img,state)}
  if(state.timer||state.reported)return;
  if(state.attempt>=delays.length){state.reported=true;onFailure(img);return}
  const delay=delays[state.attempt++];
  state.timer=setTimeout(()=>{state.timer=null;if(!img.isConnected||resolve(img)?.href!==state.key)return;const next=new URL(state.key);next.searchParams.set('image-retry',Date.now()+'-'+state.attempt);img.src=next.href},delay);
 };
 root.addEventListener('error',failed,true);
 root.addEventListener('load',event=>{const state=states.get(event.target);if(state?.timer)clearTimeout(state.timer);states.delete(event.target)},true);
 return ()=>root.removeEventListener('error',failed,true);
}
