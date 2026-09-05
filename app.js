const userHasHistory = true;
const WIN_FEED_CONFIG = {
  enabled: true,
  minInterval: 1200,
  maxInterval: 2000,
  cardPulseEnabled: true,
  cardPulseCooldown: 7000,
  globalPulseCooldown: 2800,
  pulseDuration: 1600,
  maxLatestWins: 16
};

const categories = [
  { id: 'lobby', label: 'Lobby', icon: '⌂' }, { id: 'live', label: 'Live Casino', icon: '♙' },
  { id: 'slots', label: 'Slots', icon: '✦' }, { id: 'poker', label: 'Poker', icon: '♤' },
  { id: 'fishing', label: 'Fishing', icon: '◒' }, { id: 'crash', label: 'Crash', icon: '↗' },
  { id: 'table', label: 'Table Games', icon: '◈' }, { id: 'originals', label: 'Originals', icon: '◉' }
];
const providers = ['WillBet Studios', 'Evolution', 'Pragmatic Play', 'Playtech', 'PG Soft', 'JDB', 'Red Tiger', 'Microgaming'];
const palettes = ['linear-gradient(145deg,#6126ba,#1c6bd8 54%,#10162f)', 'linear-gradient(155deg,#d5531f,#48102d 55%,#161326)', 'linear-gradient(145deg,#135d71,#17a9c8 52%,#1c265c)', 'linear-gradient(150deg,#83308f,#e65575 58%,#31133d)', 'linear-gradient(145deg,#9a7418,#332249 54%,#121827)', 'linear-gradient(145deg,#d0a02a,#8d2444 58%,#291538)', 'linear-gradient(145deg,#0d5963,#215c9d 56%,#171630)', 'linear-gradient(145deg,#903d49,#1f1b37 55%,#14283b)'];
const symbols = ['LUCKY 7','GOLDEN REEL','NOVA SPIN','ROYAL WILD','CRYSTAL BAY','FORTUNE RUSH','NIGHT VAULT','DRAGON CHANCE'];

function makeGames(category, count, names, extra = {}) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-${index + 1}`, name: names[index % names.length] + (index >= names.length ? ` ${index + 1}` : ''),
    provider: providers[(index + category.length) % providers.length], category, subCategory: extra.subCategories?.[index % extra.subCategories.length] || 'All',
    image: '', cover: palettes[(index + category.length) % palettes.length], symbol: symbols[index % symbols.length],
    playing: Math.round(56 + ((index * 137) % 2410)), playsToday: Math.round(180 + ((index * 389) % 8040)),
    playedToday: Math.round(130 + ((index * 171) % 7100)), rtp: Number((94.1 + ((index * 19) % 44) / 10).toFixed(2)),
    volatility: ['Low','Medium','High'][index % 3], isNew: index < 6, isHot: index % 4 === 0,
    isFavorite: index % 7 === 0, releaseDate: 20260904 - index, popularity: 9000 - index * 211 + (index % 5) * 63,
    ...extra
  }));
}

const slots = makeGames('slots', 30, ['Neon Fortune','Temple of Aurora','Moonlit Safari','Golden Koi','Royal Reels','Wild Mirage','Jade Dominion','Cosmic Cash']);
const live = makeGames('live', 25, ['Velvet Baccarat','Monaco Roulette','Platinum Blackjack','Dragon Tiger Live','Lightning Sic Bo','Gold Vault Roulette','Majestic Blackjack'], { subCategories: ['Baccarat','Roulette','Blackjack','Game Shows'] });
const poker = makeGames('poker', 15, ['Texas Hold’em Pro','Omaha Royale','Short Deck Club','Caribbean Stud','High Stakes Poker']);
const fishing = makeGames('fishing', 15, ['Deep Sea Bounty','Golden Catch','Ocean Hunter','Neptune’s Net','Coral Rush']);
const crash = makeGames('crash', 8, ['Jet Surge','Orbit Crash','Skyline Rush']);
const table = makeGames('table', 10, ['Classic Baccarat','European Roulette','Blackjack Elite','Dragon Tiger']);
const originals = makeGames('originals', 8, ['WillBet Dice','Purple Plinko','Neon Mines','Coin Flip']);
const allGames = [...slots, ...live, ...poker, ...fishing, ...crash, ...table, ...originals];
const recommended = [slots[2], live[0], slots[7], fishing[1], poker[2], slots[15], live[4], originals[0]];
const trending = [live[0], live[1], live[2], slots[4], fishing[3], slots[12], live[7], poker[1]].map((g, i) => ({ ...g, isHot: true, playing: [2400,1800,987,856,744,632,502,429][i] }));
const released = [slots[0], slots[1], live[3], poker[0], fishing[0], slots[5], live[5], originals[1]].map(g => ({ ...g, isNew: true }));
const vipGames = [live[0], live[2], live[5], table[0]].map((g, i) => ({ ...g, name: ['VIP Baccarat','High Limit Blackjack','Premium Roulette','No Commission Baccarat'][i], vipTag: i === 0 ? 'EXCLUSIVE' : 'VIP TABLE', vipSymbol: ['B♛','21','◉','B♜'][i], vipCover: palettes[(i + 3) % palettes.length] }));
const baccaratRoads = [
  { name:'Velvet Baccarat', provider:'Evolution', playing:'2.4K Playing', pattern:'Banker Streak', road:[['b','b','b','b'],['p'],['b','b','b'],['p','p'],['b','b']] },
  { name:'Royal Dragon Baccarat', provider:'Pragmatic Play', playing:'1.8K Playing', pattern:'Player Streak', road:[['p','p','p','p','p'],['b'],['p','p','p'],['b','b'],['p']] },
  { name:'Sapphire Baccarat', provider:'Playtech', playing:'987 Playing', pattern:'Alternating', road:[['b'],['p'],['b'],['p'],['b'],['p'],['b'],['p'],['b']] },
  { name:'Grand Chamber', provider:'WillBet Studios', playing:'856 Playing', pattern:'Two-by-Two', road:[['b','b'],['p','p'],['b','b'],['p','p'],['b','b'],['p','p']] },
  { name:'Aurora Baccarat', provider:'Evolution', playing:'741 Playing', pattern:'Mixed Run', road:[['p','p','t'],['b','b','b'],['p'],['b','b'],['p','p','p'],['b']] }
];

const state = { activeCategory:'lobby', activeSub:'All', search:'', filters:{}, sort:'Popular', showLatestWins:false };
const content = document.querySelector('#pageContent');
const nav = document.querySelector('#categoryNav');
const discoveryControls = document.querySelector('.discovery-controls');
const searchInput = document.querySelector('#searchInput');
const clearSearch = document.querySelector('#clearSearch');
const sheet = document.querySelector('#filterSheet');
const backdrop = document.querySelector('#sheetBackdrop');
let toastTimer;
const playedBadgeKeys = new Set();
const latestWins = [];
const LATEST_WINS_RAIL_LIMIT = 4;
const visibleGameCards = new Set();
const gamePulseTimestamps = new Map();
const maskedUsers = ['Ar***','Jo***','Mi***','Player***','Ka***','Lu***','Sa***','No***'];
let winEventSequence = 0;
let winFeedTimer;
let gameVisibilityObserver;
let activePulse;
let lastGlobalPulseAt = 0;
let isLatestWinsShifting = false;
let latestWinsShiftTimer;
let latestWinsShiftToken = 0;
const latestWinsShiftQueue = [];

const badge = (game, type, label) => `<span class="badge ${type} shine-target" data-badge-key="${game.id}-${type}">${label}</span>`;
const gameCard = (game, type = '', showPlaying = false) => `<button class="game-card ${type}" type="button" data-game-id="${game.id}" aria-label="Open ${game.name}">
  <div class="game-cover" style="--cover:${game.cover}">${game.isHot ? badge(game, 'hot', 'Hot') : ''}${game.isNew ? badge(game, 'new', 'New') : ''}${game.isFavorite ? '<span class="favorite">★</span>' : ''}<span class="cover-symbol">${game.symbol}</span></div>
  <div class="game-meta"><div class="game-name">${game.name}</div><div class="game-provider">${game.provider}</div>${showPlaying ? `<div class="play-count">${game.playing > 999 ? `${(game.playing / 1000).toFixed(1)}K Playing` : `${game.playsToday} Plays Today`}</div>` : ''}</div></button>`;
const section = (title, subtitle, games, type = '', icon = '✦', showPlaying = false) => `<section class="section"><div class="section-head"><div><h2 class="section-title"><span>${icon}</span>${title}</h2>${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}</div><button class="view-all" type="button" data-feedback="View all ${title}">View All ›</button></div><div class="h-scroll">${games.map(g => gameCard(g, type, showPlaying)).join('')}</div></section>`;
const roadCard = road => { let cells = ''; road.road.forEach((col, c) => col.forEach((outcome, r) => { cells += `<span class="road-cell" style="grid-column:${c + 1};grid-row:${r + 1}"><i class="road-dot ${outcome}"></i></span>`; })); return `<article class="baccarat-road-card"><div class="road-info"><span class="dealer-chip">LIVE DEALER</span><h3 class="road-game">${road.name}</h3><p class="road-provider">${road.provider}</p><p class="road-pattern">${road.pattern}</p></div><div class="road-map" aria-label="${road.pattern} baccarat road map">${cells}</div></article>`; };

const formatWinAmount = event => `+${event.amount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} ${event.currency}`;
const winGame = event => vipGames.find(g => g.id === event.gameId && g.name === event.gameName) || allGames.find(g => g.id === event.gameId) || vipGames.find(g => g.id === event.gameId);
const latestWinCard = (event, className = '') => { const game = winGame(event); return `<button class="latest-win-card ${className}" type="button" data-game-id="${event.gameId}" aria-label="Open ${event.gameName}, latest win ${formatWinAmount(event)}"><span class="latest-win-cover" style="--win-cover:${game?.cover || game?.vipCover || palettes[0]}"><b>${game?.symbol || game?.vipSymbol || 'WIN'}</b>${event.multiplier ? `<i>${event.multiplier.toFixed(1)}×</i>` : ''}</span><strong>${formatWinAmount(event)}</strong><span class="latest-win-name">${event.gameName}</span><span class="latest-win-user">${event.userName}</span></button>`; };
const latestWinsSection = () => !WIN_FEED_CONFIG.enabled ? '' : `<section class="section latest-wins-section" aria-label="Latest Wins"><div class="section-head"><div><h2 class="section-title"><span>↗</span>Latest Wins</h2><p class="section-subtitle">Winning on WillBet right now</p></div><button id="viewLatestWins" class="view-all" type="button">View All ›</button></div><div id="latestWinsRail" class="latest-wins-rail"><div class="latest-wins-track">${latestWins.slice(0,LATEST_WINS_RAIL_LIMIT).reverse().map(event => latestWinCard(event)).join('')}</div></div></section>`;
const latestWinsActivity = () => `<section class="section win-activity-page"><div class="activity-head"><button id="closeLatestWins" type="button" aria-label="Back to Casino Lobby">‹</button><div><h1 class="section-title">Live Activity</h1><p class="section-subtitle">Latest winning bets across WillBet</p></div></div><div id="latestWinsList" class="latest-wins-list">${latestWins.map(event => latestWinCard(event, 'latest-win-row')).join('')}</div></section>`;

function randomWinAmount(){ const roll=Math.random(); const range=roll<.6?[1,50]:roll<.9?[50,300]:roll<.99?[300,2000]:[2000,5200]; return Number((range[0]+Math.random()*(range[1]-range[0])).toFixed(2)); }
function pickWinGame(){
  const visibleIds=[...visibleGameCards].map(card=>card.dataset.gameId).filter((id,index,list)=>id&&list.indexOf(id)===index);
  if(visibleIds.length && Math.random()<.42){ const id=visibleIds[Math.floor(Math.random()*visibleIds.length)]; return allGames.find(game=>game.id===id)||vipGames.find(game=>game.id===id); }
  const weighted=[...allGames,...recommended,...trending,...released,...vipGames];
  return weighted[Math.floor(Math.random()*weighted.length)];
}
function createWinEvent(game){ const amount=randomWinAmount(); return { id:`win_${Date.now()}_${++winEventSequence}`,gameId:game.id,gameName:game.name,provider:game.provider,userName:maskedUsers[Math.floor(Math.random()*maskedUsers.length)],amount,currency:'USDT',multiplier:Math.random()<.58?Number((2+Math.random()*(amount>2000?196:62)).toFixed(1)):null,timestamp:Date.now() }; }
function seedLatestWins(){ const seedGames=[slots[1],live[0],slots[4],fishing[3],poker[1],originals[1],live[5],slots[7]]; seedGames.forEach((game,index)=>{ const event=createWinEvent(game); event.timestamp-=index*1800; latestWins.push(event); }); }
function cancelLatestWinsShift(){ latestWinsShiftToken++; clearTimeout(latestWinsShiftTimer); latestWinsShiftQueue.length=0; isLatestWinsShifting=false; }
function syncLatestWinsRail(){
  cancelLatestWinsShift(); const track=document.querySelector('#latestWinsRail .latest-wins-track'); if(!track)return;
  track.style.transition='none'; track.style.transform='translate3d(0,0,0)'; track.innerHTML=latestWins.slice(0,LATEST_WINS_RAIL_LIMIT).reverse().map(event=>latestWinCard(event)).join('');
}
function processLatestWinsShift(){
  if(isLatestWinsShifting||!latestWinsShiftQueue.length)return;
  const track=document.querySelector('#latestWinsRail .latest-wins-track'); if(!track){latestWinsShiftQueue.length=0;return;}
  if(document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches){syncLatestWinsRail();return;}
  const event=latestWinsShiftQueue.shift(); const first=track.firstElementChild; if(!first){syncLatestWinsRail();return;}
  track.insertAdjacentHTML('beforeend',latestWinCard(event)); const second=first.nextElementSibling;
  const shiftDistance=second?second.getBoundingClientRect().left-first.getBoundingClientRect().left:first.getBoundingClientRect().width;
  const token=++latestWinsShiftToken; isLatestWinsShifting=true; track.classList.add('is-shifting');
  requestAnimationFrame(()=>{ track.style.transition='transform 420ms ease-out'; track.style.transform=`translate3d(-${shiftDistance}px,0,0)`; });
  const finish=()=>{ if(token!==latestWinsShiftToken)return; clearTimeout(latestWinsShiftTimer); first.remove(); track.style.transition='none'; track.style.transform='translate3d(0,0,0)'; track.classList.remove('is-shifting'); void track.offsetWidth; track.style.transition=''; isLatestWinsShifting=false; processLatestWinsShift(); };
  track.addEventListener('transitionend',finish,{once:true}); latestWinsShiftTimer=setTimeout(finish,500);
}
function enqueueLatestWinsShift(event){ if(document.hidden)return; latestWinsShiftQueue.push(event); processLatestWinsShift(); }
function updateLatestWins(event){
  latestWins.unshift(event); if(latestWins.length>WIN_FEED_CONFIG.maxLatestWins) latestWins.length=WIN_FEED_CONFIG.maxLatestWins;
  const rail=document.querySelector('#latestWinsRail');
  if(rail)enqueueLatestWinsShift(event);
  const list=document.querySelector('#latestWinsList');
  if(list){ list.insertAdjacentHTML('afterbegin',latestWinCard(event,'latest-win-row latest-win-enter')); while(list.children.length>WIN_FEED_CONFIG.maxLatestWins) list.lastElementChild.remove(); }
}
function observeGameCards(){
  visibleGameCards.clear(); if(gameVisibilityObserver) gameVisibilityObserver.disconnect();
  gameVisibilityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting) visibleGameCards.add(entry.target); else visibleGameCards.delete(entry.target); }),{threshold:.45});
  document.querySelectorAll('.game-card[data-game-id],.vip-card[data-game-id]').forEach(card=>gameVisibilityObserver.observe(card));
}
function pulseVisibleGameCard(event){
  if(!WIN_FEED_CONFIG.cardPulseEnabled||activePulse)return;
  const now=Date.now(); if(now-lastGlobalPulseAt<WIN_FEED_CONFIG.globalPulseCooldown||now-(gamePulseTimestamps.get(event.gameId)||0)<WIN_FEED_CONFIG.cardPulseCooldown)return;
  const matches=[...visibleGameCards].filter(card=>card.isConnected&&card.dataset.gameId===event.gameId); if(!matches.length)return;
  const center=window.innerHeight/2; const target=matches.sort((a,b)=>Math.abs(a.getBoundingClientRect().top+a.getBoundingClientRect().height/2-center)-Math.abs(b.getBoundingClientRect().top+b.getBoundingClientRect().height/2-center))[0];
  const cover=target.querySelector('.game-cover,.vip-cover'); if(!cover)return;
  const pulse=document.createElement('span'); pulse.className='win-pulse'; pulse.textContent=formatWinAmount(event); cover.appendChild(pulse); activePulse=pulse; lastGlobalPulseAt=now; gamePulseTimestamps.set(event.gameId,now);
  requestAnimationFrame(()=>pulse.classList.add('is-visible'));
  setTimeout(()=>{ pulse.classList.add('is-leaving'); setTimeout(()=>{ pulse.remove(); if(activePulse===pulse)activePulse=null; },220); },WIN_FEED_CONFIG.pulseDuration-220);
}
function publishWinEvent(){ const event=createWinEvent(pickWinGame()); updateLatestWins(event); pulseVisibleGameCard(event); }
function scheduleWinEvent(){ if(!WIN_FEED_CONFIG.enabled)return; const delay=WIN_FEED_CONFIG.minInterval+Math.random()*(WIN_FEED_CONFIG.maxInterval-WIN_FEED_CONFIG.minInterval); clearTimeout(winFeedTimer); winFeedTimer=setTimeout(()=>{publishWinEvent();scheduleWinEvent();},delay); }

function renderNav(){ nav.innerHTML = categories.map(c => `<button class="category-pill ${state.activeCategory === c.id ? 'active' : ''}" type="button" role="tab" aria-selected="${state.activeCategory === c.id}" data-category="${c.id}"><span>${c.icon}</span>${c.label}</button>`).join(''); }
function categoryGames(){ return allGames.filter(g => g.category === state.activeCategory && (state.activeCategory !== 'live' || state.activeSub === 'All' || g.subCategory === state.activeSub)); }
function filtered(games){ const term = state.search.trim().toLowerCase(); return games.filter(g => (!term || `${g.name} ${g.provider}`.toLowerCase().includes(term)) && (!state.filters.provider || g.provider === state.filters.provider) && (!state.filters.rtp || (state.filters.rtp === '96%+' ? g.rtp >= 96 : g.rtp < 96)) && (!state.filters.volatility || g.volatility === state.filters.volatility) && (!state.filters.gameType || g.subCategory === state.filters.gameType)); }
function sorted(games){ const out = [...games]; return out.sort((a,b) => state.sort === 'Most Played' ? b.playsToday-a.playsToday : state.sort === 'Newest' ? b.releaseDate-a.releaseDate : state.sort === 'A-Z' ? a.name.localeCompare(b.name) : state.sort === 'RTP High → Low' ? b.rtp-a.rtp : b.popularity-a.popularity); }
function renderLobby(){ const results = state.search ? filtered(allGames) : null; if(results) return `<section class="section"><div class="category-head"><div><h1 class="section-title">Search results</h1><p class="section-subtitle">${results.length} matching games</p></div></div>${results.length ? `<div class="game-grid">${sorted(results).map(g => gameCard(g)).join('')}</div>` : '<div class="empty-state">No games found. Try a game or provider name.</div>'}</section>`;
  if(state.showLatestWins)return latestWinsActivity();
  return `${userHasHistory ? section('Recommend For You','Based on your favorites and recent play',recommended,'','☆') : ''}${section('Trending Now','Live player momentum right now',trending,'trending-card','♨',true)}${latestWinsSection()}${section('New Released','18 games added this week',released,'','✦')}<section class="section"><div class="section-head"><div><h2 class="section-title"><span>◈</span>Baccarat Road Picks</h2><p class="section-subtitle">Follow a table pattern before you sit down</p></div></div><div class="baccarat-rail">${baccaratRoads.map(roadCard).join('')}</div></section><section class="section vip-lounge"><div class="vip-head"><div><p class="vip-kicker">✦ PRIVATE TABLES</p><h2 class="vip-title">VIP <span>Lounge</span></h2><p class="vip-sub">Curated premium live games</p></div><span class="vip-status">PREMIUM</span></div><div class="vip-rail">${vipGames.map(g => `<button class="vip-card" data-game-id="${g.id}" type="button" aria-label="Open ${g.name}"><div class="vip-cover" style="--vip-cover:${g.vipCover}"><span class="vip-tag">${g.vipTag}</span><b>${g.vipSymbol}</b></div><div class="vip-card-info"><strong>${g.name}</strong><span>${g.provider}</span></div></button>`).join('')}</div></section>${section('Slots','Fresh reels and feature-rich sessions',slots.slice(7,14),'','✦')}${section('Live Casino','Real tables, live dealers',live.slice(8,15),'live-card','♙')}${section('Fishing','Ocean arcade favorites',fishing.slice(2,9),'','◒')}${section('Poker','Tournament and cash-table picks',poker.slice(1,8),'','♤')}`; }
function renderCategory(){ let games = sorted(filtered(categoryGames())); const liveChips = state.activeCategory === 'live' ? `<div class="chip-row">${['All','Baccarat','Roulette','Blackjack','Game Shows'].map(s => `<button class="sub-chip ${state.activeSub===s?'active':''}" data-sub="${s}" type="button">${s}</button>`).join('')}</div>` : ''; return `<section class="section category-page">${liveChips}${games.length ? `<div class="game-grid">${games.map(g => gameCard(g, state.activeCategory === 'live' ? 'live-card' : '')).join('')}</div>` : '<div class="empty-state">No games match these filters. Clear filters to restore the full category.</div>'}</section>`; }
function render(){ const isCategory = state.activeCategory !== 'lobby'; cancelLatestWinsShift(); renderNav(); discoveryControls.classList.toggle('is-category',isCategory); document.querySelector('#openFilter').classList.toggle('is-active',isCategory && Object.keys(state.filters).length > 0); document.querySelector('.toolbar-sort').classList.toggle('is-active',isCategory && state.sort !== 'Popular'); document.querySelector('#sortSelect').value=''; content.innerHTML = isCategory ? renderCategory() : renderLobby(); observeShimmers(); observeGameCards(); }

function showToast(message){ const toast = document.querySelector('#launchToast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2300); }
function observeShimmers(){ const badges = document.querySelectorAll('.badge.shine-target'); const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduceMotion){ badges.forEach(el => playedBadgeKeys.add(el.dataset.badgeKey)); return; } const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(!entry.isIntersecting) return; const key = entry.target.dataset.badgeKey; if(!playedBadgeKeys.has(key)){ playedBadgeKeys.add(key); entry.target.classList.add('shine-played'); } observer.unobserve(entry.target); }), { threshold:.25 }); badges.forEach(el => { if(playedBadgeKeys.has(el.dataset.badgeKey)) el.classList.remove('shine-target'); else observer.observe(el); }); }
function filterConfig(){ const c = state.activeCategory; const groups = [{ key:'provider', title:'Provider', choices:providers }]; if(c === 'slots') groups.push({key:'rtp',title:'RTP',choices:['96%+','Below 96%']},{key:'volatility',title:'Volatility',choices:['Low','Medium','High']}); if(c === 'live') groups.push({key:'gameType',title:'Game Type',choices:['Baccarat','Roulette','Blackjack','Game Shows']}); return groups; }
function openSheet(){ document.querySelector('#filterOptions').innerHTML = filterConfig().map(g => `<section class="filter-group"><h3>${g.title}</h3><div class="filter-choices">${g.choices.map(v => `<label class="filter-choice"><input type="radio" name="${g.key}" value="${v}" ${state.filters[g.key]===v?'checked':''}/><span>${v}</span></label>`).join('')}</div></section>`).join(''); backdrop.hidden=false; requestAnimationFrame(()=>sheet.classList.add('open')); sheet.setAttribute('aria-hidden','false'); }
function closeSheet(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); setTimeout(()=>backdrop.hidden=true,280); }
function applySheet(){ const chosen = {}; filterConfig().forEach(g => { const input = document.querySelector(`input[name="${g.key}"]:checked`); if(input) chosen[g.key]=input.value; }); state.filters=chosen; closeSheet(); render(); showToast('Filters applied'); }
function setupEvents(){
  nav.addEventListener('click',e => { const b=e.target.closest('[data-category]'); if(!b)return; state.activeCategory=b.dataset.category; state.activeSub='All'; state.filters={}; state.sort='Popular'; state.showLatestWins=false; render(); window.scrollTo({top:0,behavior:'smooth'}); });
  searchInput.addEventListener('input',e => { state.search=e.target.value; clearSearch.classList.toggle('visible',!!state.search); render(); }); clearSearch.addEventListener('click',()=>{searchInput.value='';state.search='';clearSearch.classList.remove('visible');render();searchInput.focus();});
  content.addEventListener('click',e => { const game=e.target.closest('[data-game-id]'); if(game){const found=allGames.find(g=>g.id===game.dataset.gameId)||vipGames.find(g=>g.id===game.dataset.gameId);showToast(`Launching ${found?.name || 'game'} · demo mode`);return;} if(e.target.closest('#viewLatestWins')){state.showLatestWins=true;render();window.scrollTo({top:0,behavior:'smooth'});return;} if(e.target.closest('#closeLatestWins')){state.showLatestWins=false;render();return;} const sub=e.target.closest('[data-sub]');if(sub){state.activeSub=sub.dataset.sub;render();return;} });
  document.querySelector('#openFilter').addEventListener('click',openSheet); document.querySelector('#sortSelect').addEventListener('change',e=>{if(!e.target.value)return;state.sort=e.target.value;render();showToast(`Sorted by ${state.sort}`);}); document.querySelector('#closeSheet').addEventListener('click',closeSheet); backdrop.addEventListener('click',closeSheet); document.querySelector('#applyFilters').addEventListener('click',applySheet); document.querySelector('#clearFilters').addEventListener('click',()=>{state.filters={};state.activeSub='All';closeSheet();render();showToast('Filters cleared');});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-feedback]');if(b)showToast(`${b.dataset.feedback} · prototype action`);}); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('open'))closeSheet();});
  document.addEventListener('visibilitychange',syncLatestWinsRail);
}
function startJackpot(){ let amount=42680.38; const feed=document.querySelector('#jackpotFeed'), amountEl=document.querySelector('#jackpotAmount'); const tick=()=>{const add=[.12,.86,1.40,2.14,5.30][Math.floor(Math.random()*5)];amount+=add;amountEl.textContent=amount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});amountEl.classList.remove('amount-bump');void amountEl.offsetWidth;amountEl.classList.add('amount-bump');feed.textContent=`✦ +${add.toFixed(2)} USDT added to the Jackpot`;feed.classList.remove('feed-pop');void feed.offsetWidth;feed.classList.add('feed-pop');setTimeout(tick,4000+Math.floor(Math.random()*4001));};setTimeout(tick,5000);}
seedLatestWins();setupEvents();render();startJackpot();scheduleWinEvent();
