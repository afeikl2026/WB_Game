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
const BIG_WIN_CONFIG = {
  enabled: true,
  amountThreshold: 1000,
  multiplierThreshold: 100,
  displayDuration: 5000,
  transitionDuration: 500
};
const GAME_PLAY_IMAGE = './assets/game-play/wanted-dead-or-a-wild-duel-intro.png';
const BANNER_AUTOPLAY_DURATION = 5000;
const CASINO_BANNERS = Object.freeze([
  { id:'casino-jackpot', type:'jackpot', enabled:true, order:1 },
  { id:'vip-live-tournament', type:'tournament', image:'./assets/game-covers/real/6c39ea6653.avif', kicker:'LIVE EXCLUSIVE', title:'VIP Live Tournament', subtitle:'Exclusive tables · Bigger rewards', ctaText:'Join Now', target:'VIP tournament', enabled:true, order:2 },
  { id:'weekend-cashback', type:'promotion', image:'./assets/game-covers/real/8fe55e9099.avif', kicker:'WEEKEND REWARD', title:'Weekend Cashback', subtitle:'Play more · Get more back', ctaText:'View Promotion', target:'Weekend Cashback', enabled:true, order:3 },
  { id:'new-games-festival', type:'vip', image:'./assets/game-covers/real/75da044051.avif', kicker:'JUST LANDED', title:'New Games Festival', subtitle:'Fresh releases · More ways to win', ctaText:'Play Now', target:'New Games Festival', enabled:true, order:4 }
]);

const categories = [
  { id: 'lobby', label: 'Lobby', icon: '⌂' }, { id: 'live', label: 'Live Casino', icon: '♙' },
  { id: 'slots', label: 'Slots', icon: '✦' }, { id: 'poker', label: 'Poker', icon: '♤' },
  { id: 'fishing', label: 'Fishing', icon: '◒' }, { id: 'crash', label: 'Crash', icon: '↗' },
  { id: 'table', label: 'Table Games', icon: '◈' }, { id: 'originals', label: 'Originals', icon: '◉' }
];
const LIVE_SUBCATEGORIES = Object.freeze([
  { id:'Baccarat', name:'Baccarat', order:1, enabled:true, isDefault:true },
  { id:'Roulette', name:'Roulette', order:2, enabled:true, isDefault:false },
  { id:'Blackjack', name:'Blackjack', order:3, enabled:true, isDefault:false },
  { id:'Game Shows', name:'Game Shows', order:4, enabled:true, isDefault:false }
]);
const enabledLiveSubcategories = () => LIVE_SUBCATEGORIES.filter(category => category.enabled).sort((a,b) => a.order - b.order);
const defaultLiveSubcategory = () => enabledLiveSubcategories().find(category => category.isDefault)?.id || enabledLiveSubcategories()[0]?.id || null;
const resolveLiveSubcategory = selection => enabledLiveSubcategories().some(category => category.id === selection) ? selection : defaultLiveSubcategory();
const providers = ['WillBet Studios', 'Evolution', 'Pragmatic Play', 'Playtech', 'PG Soft', 'JDB', 'Red Tiger', 'Microgaming', 'CQ9', '1win Games', '3 Oaks Gaming', '1X2gaming', '7Mojos'];
const STATIC_GAME_COVER_FALLBACK = '#171827';
const GAME_COVER_ASSETS = Object.freeze([
  './assets/game-covers/real/00323e109a.avif', './assets/game-covers/real/2f38840284.avif',
  './assets/game-covers/real/30657f0563.avif', './assets/game-covers/real/500c61b3ea.avif',
  './assets/game-covers/real/507223cee7.avif', './assets/game-covers/real/5e173d9eeb.avif',
  './assets/game-covers/real/6c39ea6653.avif', './assets/game-covers/real/6c9a6bb529.avif',
  './assets/game-covers/real/6d434b0016.avif', './assets/game-covers/real/75da044051.avif',
  './assets/game-covers/real/7c516d26db.avif', './assets/game-covers/real/8fe55e9099.avif',
  './assets/game-covers/real/97d1423fb0.avif', './assets/game-covers/real/ece5def0bc.avif',
  './assets/game-covers/real/f16de34ab6.avif'
]);
const symbols = ['LUCKY 7','GOLDEN REEL','NOVA SPIN','ROYAL WILD','CRYSTAL BAY','FORTUNE RUSH','NIGHT VAULT','DRAGON CHANCE'];

function makeGames(category, count, names, extra = {}) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-${index + 1}`, name: names[index % names.length] + (index >= names.length ? ` ${index + 1}` : ''),
    provider: providers[(index + category.length) % providers.length], category, subCategory: extra.subCategories?.[index % extra.subCategories.length] || 'All', isAvailableInRegion:true,
    cover: '', coverFallback: STATIC_GAME_COVER_FALLBACK, symbol: symbols[index % symbols.length],
    playing: Math.round(56 + ((index * 137) % 2410)), playsToday: Math.round(180 + ((index * 389) % 8040)),
    playedToday: Math.round(130 + ((index * 171) % 7100)), rtp: Number((94.1 + ((index * 19) % 44) / 10).toFixed(2)),
    volatility: ['Low','Medium','High'][index % 3], isNew: index < 6, isHot: index % 4 === 0,
    isFavorite: index % 7 === 0, releaseDate: 20260904 - index, popularity: 9000 - index * 211 + (index % 5) * 63,
    ...extra
  }));
}

const slots = makeGames('slots', 30, ['Neon Fortune','Temple of Aurora','Moonlit Safari','Golden Koi','Royal Reels','Wild Mirage','Jade Dominion','Cosmic Cash']);
const live = makeGames('live', 25, ['Velvet Baccarat','Monaco Roulette','Platinum Blackjack','Dragon Tiger Live','Lightning Sic Bo','Gold Vault Roulette','Majestic Blackjack'], { subCategories: ['Baccarat','Roulette','Blackjack','Game Shows'] });
live.forEach(game => {
  game.subCategory=/baccarat/i.test(game.name) ? 'Baccarat' : /roulette/i.test(game.name) ? 'Roulette' : /blackjack/i.test(game.name) ? 'Blackjack' : 'Game Shows';
});
const poker = makeGames('poker', 15, ['Texas Hold’em Pro','Omaha Royale','Short Deck Club','Caribbean Stud','High Stakes Poker']);
const fishing = makeGames('fishing', 15, ['Deep Sea Bounty','Golden Catch','Ocean Hunter','Neptune’s Net','Coral Rush']);
const crash = makeGames('crash', 8, ['Jet Surge','Orbit Crash','Skyline Rush']);
const table = makeGames('table', 10, ['Classic Baccarat','European Roulette','Blackjack Elite','Dragon Tiger']);
const originals = makeGames('originals', 8, ['WillBet Dice','Purple Plinko','Neon Mines','Coin Flip']);
const allGames = [...slots, ...live, ...poker, ...fishing, ...crash, ...table, ...originals];
const RESTRICTED_GAME_IDS = new Set(['slots-2','live-1','poker-3','fishing-4','table-1','originals-3']);
const REGION_RESTRICTED_MESSAGE = 'Not available in your region. If you are using a VPN, please disable it.';
allGames.forEach(game => { game.isAvailableInRegion=!RESTRICTED_GAME_IDS.has(game.id); });
const descriptionThemes = {
  slots:'A fast-paced reel experience with layered features, bonus opportunities, and a polished WillBet presentation built for quick sessions.',
  live:'A hosted table experience with a refined studio atmosphere, flexible pacing, and classic casino action streamed live.',
  poker:'A strategic card-room format with familiar rules, focused decision points, and tables suited to every playing style.',
  fishing:'An arcade-style ocean adventure with interactive targets, vivid rewards, and easy-to-follow action.',
  crash:'A quick multiplier game where timing, pace, and controlled risk create a high-energy round.',
  table:'A classic casino table with clear rules, familiar mechanics, and a premium room feel.',
  originals:'A WillBet original built for simple discovery, quick play, and a clean, distinctive interaction loop.'
};
allGames.forEach((game,index) => {
  game.cover = GAME_COVER_ASSETS[index % GAME_COVER_ASSETS.length];
  game.image = game.cover;
  game.tags = [game.isNew && 'New', game.isHot && 'Hot', index % 11 === 0 && 'Jackpot'].filter(Boolean);
  game.description = descriptionThemes[game.category];
});
const providerGameTypeFor = game => {
  if(game.category !== 'live') return '';
  if(/baccarat/i.test(game.name)) return 'Baccarat';
  if(/blackjack/i.test(game.name)) return 'Blackjack';
  if(/dragon tiger/i.test(game.name)) return 'Dragon Tiger';
  if(/roulette/i.test(game.name)) return 'Roulette';
  if(/sic bo/i.test(game.name)) return 'Sic Bo';
  return '';
};
allGames.forEach(game => { game.gameType = providerGameTypeFor(game); });
const providerDefinitions = [
  { id:'pragmatic-play', name:'Pragmatic Play', logo:'', mark:'PRAGMATIC', accent:'#8f6ff0' },
  { id:'evolution', name:'Evolution', logo:'', mark:'EVOLUTION', accent:'#d9ad62' },
  { id:'pg-soft', name:'PG Soft', logo:'', mark:'PG SOFT', accent:'#e76c6e' },
  { id:'jdb', name:'JDB', logo:'', mark:'JDB', accent:'#4cc7d4' },
  { id:'red-tiger', name:'Red Tiger', logo:'', mark:'RED TIGER', accent:'#e45e62' },
  { id:'cq9', name:'CQ9', logo:'', mark:'CQ9', accent:'#f0b24b' },
  { id:'microgaming', name:'Microgaming', logo:'', mark:'MICROGAMING', accent:'#63b9ec' },
  { id:'1win-games', name:'1win Games', logo:'', mark:'1WIN', accent:'#4c92f0' },
  { id:'3-oaks-gaming', name:'3 Oaks Gaming', logo:'', mark:'3 OAKS', accent:'#d7ad5d' },
  { id:'1x2gaming', name:'1X2gaming', logo:'', mark:'1X2', accent:'#63bc86' },
  { id:'7mojos', name:'7Mojos', logo:'', mark:'7MOJOS', accent:'#e66daf' },
  { id:'willbet-studios', name:'WillBet Studios', logo:'', mark:'WILLBET', accent:'#bc73ed' },
  { id:'playtech', name:'Playtech', logo:'', mark:'PLAYTECH', accent:'#8ea8c4' }
];
const listedProviderNames = new Set(providerDefinitions.map(provider => provider.name));
const providerCatalog = [
  ...providerDefinitions,
  ...[...new Set(allGames.map(game => game.provider))].filter(name => !listedProviderNames.has(name)).map((name,index) => ({ id:`provider-${index + 1}`,name,logo:'',mark:name.toUpperCase(),accent:'#9e78c1' }))
].map(provider => ({ ...provider, gameCount:allGames.filter(game => game.provider === provider.name).length }));
const RECENT_PROVIDER_LIMIT = 4;
const loadRecentProviderIds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('willbet-recent-providers') || '[]');
    return Array.isArray(saved) ? saved.filter(id => providerCatalog.some(provider => provider.id === id)).slice(0,RECENT_PROVIDER_LIMIT) : [];
  } catch { return []; }
};
const saveRecentProviderIds = ids => {
  try { localStorage.setItem('willbet-recent-providers', JSON.stringify(ids)); } catch {}
};
allGames.forEach(game => { game.providerId = providerCatalog.find(provider => provider.name === game.provider)?.id || ''; });
const recommended = [slots[2], live[0], slots[7], fishing[1], poker[2], slots[15], live[4], originals[0]];
const trending = [live[0], live[1], live[2], slots[4], fishing[3], slots[12], live[7], poker[1]].map((g, i) => ({ ...g, isHot: true, playing: [2400,1800,987,856,744,632,502,429][i] }));
const released = [slots[0], slots[1], live[3], poker[0], fishing[0], slots[5], live[5], originals[1]].map(g => ({ ...g, isNew: true }));
const vipRoadCovers = [
  './assets/game-covers/real/6c39ea6653.avif',
  './assets/game-covers/real/8fe55e9099.avif',
  './assets/game-covers/real/75da044051.avif',
  './assets/game-covers/real/30657f0563.avif'
];
const vipGames = [live[0], live[2], live[5], table[0]].map((g, i) => ({ ...g, name: ['VIP Baccarat','High Limit Blackjack','Premium Roulette','No Commission Baccarat'][i], vipTag: i === 0 ? 'EXCLUSIVE' : 'VIP TABLE', minBet: [100, 250, 500, 1000][i], vipCover:`url('${vipRoadCovers[i]}') center/cover no-repeat`, tags:[i === 0 ? 'Exclusive' : 'VIP', ...g.tags] }));
const baccaratTableGames = live.filter(game => /baccarat/i.test(game.name));
const baccaratRoads = [
  { name:'Velvet Baccarat', provider:'Evolution', gameId:'live-1', cover:'./assets/game-covers/real/6c39ea6653.avif', playing:'2.4K Playing', pattern:'Banker Streak', road:[['b','b','b','b'],['p'],['b','b','b'],['p','p'],['b','b']] },
  { name:'Royal Dragon Baccarat', provider:'Pragmatic Play', gameId:'live-2', cover:'./assets/game-covers/real/8fe55e9099.avif', playing:'1.8K Playing', pattern:'Player Streak', road:[['p','p','p','p','p'],['b'],['p','p','p'],['b','b'],['p']] },
  { name:'Sapphire Baccarat', provider:'Playtech', gameId:'live-3', cover:'./assets/game-covers/real/75da044051.avif', playing:'987 Playing', pattern:'Alternating', road:[['b'],['p'],['b'],['p'],['b'],['p'],['b'],['p'],['b']] },
  { name:'Grand Chamber Baccarat', provider:'WillBet Studios', gameId:'live-6', cover:'./assets/game-covers/real/30657f0563.avif', playing:'856 Playing', pattern:'Two-by-Two', road:[['b','b'],['p','p'],['b','b'],['p','p'],['b','b'],['p','p']] },
  { name:'Aurora Baccarat', provider:'Evolution', gameId:'live-7', cover:'./assets/game-covers/real/6c39ea6653.avif', playing:'741 Playing', pattern:'Mixed Run', road:[['p','p','t'],['b','b','b'],['p'],['b','b'],['p','p','p'],['b']] },
  ...Array.from({length:10},(_,index)=>{
    const game=baccaratTableGames[index%baccaratTableGames.length];
    const tableNames=['Imperial Baccarat','Golden Dragon Baccarat','Emerald Baccarat','Royal Crown Baccarat','Majestic Baccarat','Fortune Palace Baccarat','Pearl Room Baccarat','Oriental Baccarat','Grand Salon Baccarat','Private Baccarat'];
    const patternRoads=[
      { pattern:'Banker Two-by-Two', road:[['b','b'],['p','p'],['b','b'],['p'],['b','b','b'],['p']] },
      { pattern:'Player Run', road:[['p','p','p'],['b'],['p','p','p','p'],['b','b'],['p']] },
      { pattern:'Chop Pattern', road:[['b'],['p'],['b'],['p'],['b'],['p'],['b'],['p']] },
      { pattern:'Banker Long Run', road:[['b','b','b','b','b'],['p'],['b','b','b'],['p','p']] },
      { pattern:'Balanced Road', road:[['p','p'],['b','b'],['p'],['b','b','b'],['p','p'],['b']] }
    ][index%5];
    return { name:tableNames[index], provider:game.provider, gameId:game.id, cover:vipRoadCovers[index%vipRoadCovers.length], playing:`${[632,587,542,498,461,426,398,364,331,298][index]} Playing`, tableInfo:`Min ${[50,100,100,200,50,100,250,100,200,500][index]} USDT`, ...patternRoads };
  })
];
const LOBBY_BACCARAT_ROAD_LIMIT = 5;

const rotateLobbyGames = (games, startIndex = 0) => [...games.slice(startIndex), ...games.slice(0, startIndex)];
const lobbyDetailCategories = {
  recommended: { id:'recommended', title:'Recommend For You', subtitle:'Based on your favorites and recent play', icon:'☆', games:recommended, homeGames:recommended },
  trending: { id:'trending', title:'Trending Now', subtitle:'Live player momentum right now', icon:'♨', cardType:'trending-card', showPlaying:true, games:trending, homeGames:trending },
  released: { id:'released', title:'New Released', subtitle:'18 games added this week', icon:'✦', games:released, homeGames:released },
  slots: { id:'slots', title:'Slots', subtitle:'Fresh reels and feature-rich sessions', icon:'✦', games:rotateLobbyGames(slots, 7), homeGames:rotateLobbyGames(slots, 7).slice(0, 7) },
  live: { id:'live', title:'Live Casino', subtitle:'Real tables, live dealers', icon:'♙', cardType:'live-card', games:rotateLobbyGames(live, 8), homeGames:rotateLobbyGames(live, 8).slice(0, 7) },
  fishing: { id:'fishing', title:'Fishing', subtitle:'Ocean arcade favorites', icon:'◒', games:rotateLobbyGames(fishing, 2), homeGames:rotateLobbyGames(fishing, 2).slice(0, 7) },
  poker: { id:'poker', title:'Poker', subtitle:'Tournament and cash-table picks', icon:'♤', games:rotateLobbyGames(poker, 1), homeGames:rotateLobbyGames(poker, 1).slice(0, 7) }
};

const state = { activeCategory:'lobby', activeSub:null, lastLiveSub:null, search:'', filters:{}, sort:'Popular', currentView:'casino', lobbyDetailCategory:null, activeProvider:null, providerSearch:'', providerGameType:'All', recentProviderIds:loadRecentProviderIds(), activeGame:null, gameDetailReturn:null, gameDetailStack:[], detailFullscreen:false, detailCurrency:'USDT', detailDescriptionExpanded:false, visibleGameCount:10, visibleProviderCount:10, gamePlayMode:null, gamePlayType:null, gamePlayPanelOpen:false };
const PAGE_SIZE = 10;
const resetPagination = () => { state.visibleGameCount = PAGE_SIZE; state.visibleProviderCount = PAGE_SIZE; };
function pageSlice(items, key){ const total=items.length; const count=Math.min(Math.max(state[key] || PAGE_SIZE, PAGE_SIZE), total); return { items:items.slice(0,count), total, count }; }
function paginationMarkup(kind, count, total){ if(total <= PAGE_SIZE) return ''; const noun = kind === 'providers' ? 'providers' : 'games'; return `<div class="load-more" data-load-more-wrap="${kind}"><span class="load-more-count">${count < total ? `${count} / ${total}` : `${total} ${noun} shown`}</span>${count < total ? `<button class="load-more-button" type="button" data-load-more="${kind}" data-total="${total}">Load More</button>` : ''}</div>`; }
function pagedGameGrid(games, cardType = '', showPlaying = false, ordered = false){ const result = pageSlice(ordered ? games : sorted(games), 'visibleGameCount'); return `<div class="game-grid">${result.items.map(game => gameCard(game, cardType, showPlaying)).join('')}</div>${paginationMarkup('games', result.count, result.total)}`; }
const appShell = document.querySelector('.app-shell');
const topHeader = document.querySelector('.top-header');
const bottomNav = document.querySelector('.bottom-nav');
const content = document.querySelector('#pageContent');
const nav = document.querySelector('#categoryNav');
const discoveryControls = document.querySelector('.discovery-controls');
const bannerCarousel = document.querySelector('#casinoBannerCarousel');
const bannerTrack = document.querySelector('#casinoBannerTrack');
const bannerProgress = document.querySelector('#casinoBannerProgress');
const bigWinMarquee = document.querySelector('#bigWinMarquee');
const searchInput = document.querySelector('#searchInput');
const clearSearch = document.querySelector('#clearSearch');
const sheet = document.querySelector('#filterSheet');
const backdrop = document.querySelector('#sheetBackdrop');
const shareSheet = document.querySelector('#shareSheet');
const shareBackdrop = document.querySelector('#shareBackdrop');
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
let gamePlayInteractionCleanup;
let activeBannerIndex = 0;
let bannerAutoplayTimer;
let bannerResetTimer;
let activeBigWinEvent;
let bigWinExitTimer;
let bigWinEndTimer;
const bigWinQueue = [];

const badge = (game, type, label) => `<span class="badge ${type} shine-target" data-badge-key="${game.id}-${type}">${label}</span>`;
const restrictedGameOverlay = game => game.isAvailableInRegion === false ? '<span class="game-restricted-overlay" role="status" aria-label="Not available in your region"><span class="game-restricted-icon" aria-hidden="true">ⓘ</span><span>Not available in<br />your region</span></span>' : '';
const gameCard = (game, type = '', showPlaying = false) => `<button class="game-card ${type}${game.isAvailableInRegion === false ? ' is-region-restricted' : ''}" type="button" data-game-id="${game.id}" aria-label="${game.isAvailableInRegion === false ? `${game.name} is not available in your region` : `Play ${game.name} by ${game.provider}`}">
  <div class="game-cover" style="--cover-background:${game.coverFallback || STATIC_GAME_COVER_FALLBACK}"><span class="fallback-cover-title" aria-hidden="true">${game.name}</span>${game.cover ? `<img class="game-cover-image" src="${game.cover}" alt="" loading="lazy" decoding="async" style="--image-position:${game.imagePosition || 'center'}" onerror="this.hidden=true" />` : ''}${game.isHot ? badge(game, 'hot', 'Hot') : ''}${game.isNew ? badge(game, 'new', 'New') : ''}${game.isFavorite ? '<span class="favorite">★</span>' : ''}${restrictedGameOverlay(game)}</div>
  ${showPlaying ? `<div class="game-meta"><div class="play-count">${game.playing > 999 ? `${(game.playing / 1000).toFixed(1)}K Playing` : `${game.playsToday} Plays Today`}</div></div>` : ''}</button>`;
const section = (title, subtitle, games, type = '', icon = '✦', showPlaying = false, lobbyDetailId = '') => `<section class="section"><div class="section-head"><div><h2 class="section-title"><span>${icon}</span>${title}</h2>${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}</div>${lobbyDetailId ? `<button class="view-all" type="button" data-lobby-detail="${lobbyDetailId}">View All ›</button>` : ''}</div><div class="h-scroll">${games.map(g => gameCard(g, type, showPlaying)).join('')}</div></section>`;
const roadCard = (road, detailed = false) => { const cover=road.cover ? `url('${road.cover}') center/cover no-repeat` : STATIC_GAME_COVER_FALLBACK; let cells = ''; road.road.forEach((col, c) => col.forEach((outcome, r) => { cells += `<span class="road-cell" style="grid-column:${c + 1};grid-row:${r + 1}"><i class="road-dot ${outcome}"></i></span>`; })); const details=detailed ? `<p class="road-game">${road.name}</p><p class="road-provider">${road.provider}</p><p class="road-playing">${road.tableInfo||road.playing}</p>` : ''; const tag=detailed?'button':'article'; const attrs=detailed?` type="button" data-road-game-id="${road.gameId}" aria-label="Open ${road.name}, ${road.pattern}"`:''; return `<${tag} class="baccarat-road-card ${detailed?'baccarat-road-card-detail':''}"${attrs}><div class="road-info" style="--road-cover:${cover}"><span class="dealer-chip">${road.pattern}</span>${details}</div><div class="road-map" aria-label="${road.pattern} baccarat road map">${cells}</div></${tag}>`; };

const activeCasinoBanners = () => CASINO_BANNERS.filter(banner => banner.enabled).sort((a,banner) => a.order - banner.order);
const jackpotBanner = isClone => `<section class="jackpot" aria-label="WillBet Casino Jackpot"><div class="jackpot-art" aria-hidden="true"></div><div class="jackpot-copy"><p class="eyebrow">✦ WILLBET CASINO JACKPOT</p><p class="jackpot-amount"><span class="jackpot-amount-value" ${isClone ? '' : 'id="jackpotAmount"'}>42,680.38</span> <small>USDT</small></p><p class="jackpot-subtitle">Every Bet Builds the Pot</p><p class="jackpot-timer">◉ Weekly Jackpot <b>·</b> 02D 13H 42M</p></div><div class="jackpot-feed jackpot-feed-text" ${isClone ? '' : 'id="jackpotFeed"'} aria-live="polite">✦ +2.14 USDT added to the Jackpot</div></section>`;
const promotionBanner = banner => `<article class="promo-banner" style="--banner-image:url('${banner.image}')" aria-label="${banner.title}"><div class="promo-banner-copy"><span class="promo-banner-kicker">✦ ${banner.kicker}</span><h2>${banner.title}</h2><p>${banner.subtitle}</p>${banner.ctaText ? `<button class="promo-banner-cta" type="button" data-banner-target="${banner.target}">${banner.ctaText}</button>` : ''}</div></article>`;
const bannerSlide = (banner,isClone=false) => `<div class="casino-banner-slide" data-banner-id="${banner.id}">${banner.type === 'jackpot' ? jackpotBanner(isClone) : promotionBanner(banner)}</div>`;

function resetBannerProgress(){
  bannerProgress.innerHTML = activeCasinoBanners().map((banner,index) => `<span class="banner-segment" data-banner-index="${index}" aria-label="Banner ${index + 1} of ${activeCasinoBanners().length}"><i></i></span>`).join('');
  requestAnimationFrame(() => { const segment=bannerProgress.querySelector(`[data-banner-index="${activeBannerIndex}"]`); if(segment){ segment.style.setProperty('--banner-progress-duration', `${BANNER_AUTOPLAY_DURATION}ms`); segment.classList.add('is-active'); } });
}
function scheduleBannerAutoplay(){
  clearTimeout(bannerAutoplayTimer);
  if(document.hidden || activeCasinoBanners().length < 2) return;
  bannerAutoplayTimer = setTimeout(advanceCasinoBanner, BANNER_AUTOPLAY_DURATION);
}
function advanceCasinoBanner(){
  const banners = activeCasinoBanners();
  if(banners.length < 2) return;
  const isLoop = activeBannerIndex === banners.length - 1;
  const nextVisualIndex = isLoop ? banners.length : activeBannerIndex + 1;
  activeBannerIndex = isLoop ? 0 : activeBannerIndex + 1;
  bannerTrack.style.transform = `translate3d(-${nextVisualIndex * 100}%,0,0)`;
  resetBannerProgress();
  scheduleBannerAutoplay();
  if(isLoop){
    clearTimeout(bannerResetTimer);
    bannerResetTimer = setTimeout(() => { bannerTrack.classList.add('is-resetting'); bannerTrack.style.transform='translate3d(0,0,0)'; requestAnimationFrame(() => bannerTrack.classList.remove('is-resetting')); }, 430);
  }
}
function renderCasinoBanners(){
  const banners = activeCasinoBanners();
  activeBannerIndex = 0;
  bannerTrack.innerHTML = banners.map(bannerSlide).join('') + (banners.length > 1 ? bannerSlide(banners[0],true) : '');
  bannerTrack.style.transform='translate3d(0,0,0)';
  resetBannerProgress();
  scheduleBannerAutoplay();
}
function resetBannerAutoplayForVisibility(){
  clearTimeout(bannerAutoplayTimer);
  if(!document.hidden){ resetBannerProgress(); scheduleBannerAutoplay(); }
}

const formatWinAmount = event => `+${event.amount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} ${event.currency}`;
const isBigWin = event => BIG_WIN_CONFIG.enabled && (event.amount >= BIG_WIN_CONFIG.amountThreshold || (event.multiplier || 0) >= BIG_WIN_CONFIG.multiplierThreshold);
const bigWinMetric = event => (event.multiplier || 0) >= BIG_WIN_CONFIG.multiplierThreshold
  ? `${Number.isInteger(event.multiplier) ? event.multiplier : event.multiplier.toFixed(1)}×`
  : `${event.amount.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})} ${event.currency}`;
const canShowBigWin = () => !document.hidden && state.currentView !== 'gamePlay';
function clearBigWinMarquee({clearQueue=false}={}){
  clearTimeout(bigWinExitTimer); clearTimeout(bigWinEndTimer);
  activeBigWinEvent=undefined;
  bigWinMarquee.classList.remove('is-visible','is-exiting');
  bigWinMarquee.hidden=true;
  if(clearQueue) bigWinQueue.length=0;
}
function processBigWinQueue(){
  if(activeBigWinEvent || !bigWinQueue.length || !canShowBigWin()) return;
  const event=bigWinQueue.shift(); activeBigWinEvent=event;
  const metric=bigWinMetric(event);
  bigWinMarquee.dataset.gameId=event.gameId;
  bigWinMarquee.setAttribute('aria-label',`Open ${event.gameName}, a big win of ${metric}`);
  bigWinMarquee.innerHTML=`<span class="big-win-icon" aria-hidden="true">✦</span><span class="big-win-copy">Congratulations <b>${event.userName}</b> won <strong>${metric}</strong> on <em>${event.gameName}</em>!</span><span class="big-win-arrow" aria-hidden="true">›</span>`;
  bigWinMarquee.hidden=false;
  requestAnimationFrame(()=>bigWinMarquee.classList.add('is-visible'));
  bigWinExitTimer=setTimeout(()=>{ bigWinMarquee.classList.remove('is-visible'); bigWinMarquee.classList.add('is-exiting'); },BIG_WIN_CONFIG.displayDuration-BIG_WIN_CONFIG.transitionDuration);
  bigWinEndTimer=setTimeout(()=>{ clearBigWinMarquee(); processBigWinQueue(); },BIG_WIN_CONFIG.displayDuration);
}
function enqueueBigWin(event){
  if(!isBigWin(event) || !canShowBigWin()) return;
  bigWinQueue.push(event); processBigWinQueue();
}
function handleBigWinVisibility(){
  if(document.hidden) clearBigWinMarquee({clearQueue:true});
  else processBigWinQueue();
}
const winGame = event => vipGames.find(g => g.id === event.gameId && g.name === event.gameName) || allGames.find(g => g.id === event.gameId) || vipGames.find(g => g.id === event.gameId);
const latestWinCard = (event, className = '') => { const game = winGame(event); const isActivityRow = className.includes('latest-win-row'); const cover = game?.cover ? `<img src="${game.cover}" alt="" loading="lazy" decoding="async" style="--image-position:${game.imagePosition || 'center'}" onerror="this.hidden=true" />` : `<b>${game?.symbol || game?.vipSymbol || 'WIN'}</b>`; return `<button class="latest-win-card ${className}" type="button" data-game-id="${event.gameId}" aria-label="Open ${event.gameName}, latest win ${formatWinAmount(event)}"><span class="latest-win-cover" style="--win-cover:${game?.coverFallback || STATIC_GAME_COVER_FALLBACK}">${cover}${event.multiplier ? `<i>${event.multiplier.toFixed(1)}×</i>` : ''}</span><span class="latest-win-user">${event.userName}</span><strong>${formatWinAmount(event)}</strong>${isActivityRow ? `<span class="latest-win-name">${event.gameName}</span>` : ''}</button>`; };
const latestWinsSection = () => !WIN_FEED_CONFIG.enabled ? '' : `<section class="section latest-wins-section" aria-label="Latest Wins"><div class="section-head"><div><h2 class="section-title"><span>↗</span>Latest Wins</h2><p class="section-subtitle">Winning on WillBet right now</p></div></div><div id="latestWinsRail" class="latest-wins-rail"><div class="latest-wins-track">${latestWins.slice(0,LATEST_WINS_RAIL_LIMIT).reverse().map(event => latestWinCard(event)).join('')}</div></div></section>`;

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
  if(!WIN_FEED_CONFIG.cardPulseEnabled||activePulse||!isGameAvailableInRegion(winGame(event)))return;
  const now=Date.now(); if(now-lastGlobalPulseAt<WIN_FEED_CONFIG.globalPulseCooldown||now-(gamePulseTimestamps.get(event.gameId)||0)<WIN_FEED_CONFIG.cardPulseCooldown)return;
  const matches=[...visibleGameCards].filter(card=>card.isConnected&&card.dataset.gameId===event.gameId); if(!matches.length)return;
  const center=window.innerHeight/2; const target=matches.sort((a,b)=>Math.abs(a.getBoundingClientRect().top+a.getBoundingClientRect().height/2-center)-Math.abs(b.getBoundingClientRect().top+b.getBoundingClientRect().height/2-center))[0];
  const cover=target.querySelector('.game-cover,.vip-cover'); if(!cover)return;
  const pulse=document.createElement('span'); pulse.className='win-pulse'; pulse.textContent=formatWinAmount(event); cover.appendChild(pulse); activePulse=pulse; lastGlobalPulseAt=now; gamePulseTimestamps.set(event.gameId,now);
  requestAnimationFrame(()=>pulse.classList.add('is-visible'));
  setTimeout(()=>{ pulse.classList.add('is-leaving'); setTimeout(()=>{ pulse.remove(); if(activePulse===pulse)activePulse=null; },220); },WIN_FEED_CONFIG.pulseDuration-220);
}
function publishWinEvent(){ const event=createWinEvent(pickWinGame()); updateLatestWins(event); pulseVisibleGameCard(event); enqueueBigWin(event); }
function scheduleWinEvent(){ if(!WIN_FEED_CONFIG.enabled)return; const delay=WIN_FEED_CONFIG.minInterval+Math.random()*(WIN_FEED_CONFIG.maxInterval-WIN_FEED_CONFIG.minInterval); clearTimeout(winFeedTimer); winFeedTimer=setTimeout(()=>{publishWinEvent();scheduleWinEvent();},delay); }

function renderNav(){ nav.innerHTML = categories.map(c => `<button class="category-pill ${state.activeCategory === c.id ? 'active' : ''}" type="button" role="tab" aria-selected="${state.activeCategory === c.id}" data-category="${c.id}"><span>${c.icon}</span>${c.label}</button>`).join(''); }
function isSearchMode(){ return state.search.trim().length > 0; }
function activateLiveSubcategory(selection = state.lastLiveSub){ const resolved=resolveLiveSubcategory(selection); state.activeSub=resolved; if(resolved)state.lastLiveSub=resolved; return resolved; }
function categoryGames(){ const liveSubcategory=state.activeCategory==='live' ? activateLiveSubcategory() : null; return allGames.filter(game => game.category === state.activeCategory && (state.activeCategory !== 'live' || game.subCategory === liveSubcategory)); }
function filtered(games){ const term = state.search.trim().toLowerCase(); return games.filter(g => (!term || g.name.toLowerCase().includes(term)) && (!state.filters.provider || g.provider === state.filters.provider) && (!state.filters.rtp || (state.filters.rtp === '96%+' ? g.rtp >= 96 : g.rtp < 96)) && (!state.filters.volatility || g.volatility === state.filters.volatility) && (!state.filters.gameType || g.subCategory === state.filters.gameType)); }
function globalGameSearch(){ const term=state.search.trim().toLowerCase(); return term ? allGames.filter(game=>game.name.toLowerCase().includes(term)) : []; }
function sorted(games){ const out = [...games]; return out.sort((a,b) => state.sort === 'Newest' ? b.releaseDate-a.releaseDate : state.sort === 'A-Z' ? a.name.localeCompare(b.name) : state.sort === 'Z-A' ? b.name.localeCompare(a.name) : state.sort === 'RTP High → Low' ? b.rtp-a.rtp : b.popularity-a.popularity); }
const escapeAttribute = value => String(value).replace(/[&<>'"]/g,character => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[character]);
const providerLogo = provider => `<span class="provider-logo" style="--provider-accent:${provider.accent}" aria-hidden="true">${provider.logo ? `<img src="${provider.logo}" alt="" />` : `<abbr title="${provider.name}">${provider.mark}</abbr>`}</span>`;
const providerCard = provider => `<button class="provider-card" type="button" data-provider-id="${provider.id}" aria-label="Browse ${provider.name} games">${providerLogo(provider)}<strong>${provider.name}</strong><small>${provider.gameCount} ${provider.gameCount === 1 ? 'Game' : 'Games'}</small></button>`;
const providerNameSort = (a,b) => a.name.localeCompare(b.name, 'en', {sensitivity:'base'});
const providerGameTypeOrder = ['Baccarat','Blackjack','Dragon Tiger','Roulette','Sic Bo','Game Shows','Other'];
const providerGameTypeSort = (a,b) => {
  const aIndex=providerGameTypeOrder.indexOf(a), bIndex=providerGameTypeOrder.indexOf(b);
  return (aIndex < 0 ? providerGameTypeOrder.length : aIndex) - (bIndex < 0 ? providerGameTypeOrder.length : bIndex) || a.localeCompare(b);
};
const providerGameTypes = games => [...new Set(games.map(game=>game.gameType).filter(Boolean))].sort(providerGameTypeSort);
const providerSortOptions = () => ['Popular','Newest','A-Z','Z-A','RTP High → Low'].map(option=>`<option value="${option}" ${state.sort===option?'selected':''}>${option}</option>`).join('');
const providerGrid = providers => `<div class="provider-grid">${providers.length ? providers.map(providerCard).join('') : '<div class="empty-state provider-empty">No providers match your search.</div>'}</div>`;
const providerGroup = (label, providers, className='') => providers.length ? `<section class="provider-group ${className}"><h2>${label}</h2>${providerGrid(providers)}</section>` : '';
function renderProviderListContent(){
  const term=state.providerSearch.trim().toLowerCase();
  if(term){ const result=pageSlice(providerCatalog.filter(provider=>provider.name.toLowerCase().includes(term)).sort(providerNameSort),'visibleProviderCount'); return providerGrid(result.items)+paginationMarkup('providers',result.count,result.total); }
  const recent=state.recentProviderIds.map(id=>providerCatalog.find(provider=>provider.id===id)).filter(Boolean);
  const numeric=providerCatalog.filter(provider=>/^\d/.test(provider.name)).sort(providerNameSort);
  const alphabetic=providerCatalog.filter(provider=>/^[a-z]/i.test(provider.name)).sort(providerNameSort);
  const result=pageSlice([...numeric,...alphabetic],'visibleProviderCount');
  const visibleNumeric=result.items.filter(provider=>/^\d/.test(provider.name));
  const visibleAlphabetic=result.items.filter(provider=>/^[a-z]/i.test(provider.name));
  return providerGroup('Recent',recent,'recent-provider-group')+providerGroup('0–9',visibleNumeric)+providerGroup('A–Z',visibleAlphabetic)+paginationMarkup('providers',result.count,result.total);
}
function renderProviderList(){ return `<section class="provider-page provider-list-page"><header class="provider-page-nav"><button id="providerBack" class="provider-back" type="button" aria-label="Back to Casino">‹</button><h1>Providers</h1><span aria-hidden="true"></span></header><label class="search-box provider-search"><span aria-hidden="true">⌕</span><input id="providerSearchInput" type="search" value="${escapeAttribute(state.providerSearch)}" placeholder="Search providers" autocomplete="off" /></label><div id="providerListResults">${renderProviderListContent()}</div></section>`; }
function renderProviderGames(){
  const provider=providerCatalog.find(item=>item.id===state.activeProvider);
  if(!provider)return renderProviderList();
  const providerGames=allGames.filter(game=>game.provider===provider.name);
  const gameTypes=providerGameTypes(providerGames);
  const showGameTypeFilter=gameTypes.length >= 2;
  const activeGameType=showGameTypeFilter && gameTypes.includes(state.providerGameType) ? state.providerGameType : 'All';
  if(activeGameType !== state.providerGameType) state.providerGameType=activeGameType;
  const filteredProviderGames=activeGameType==='All' ? providerGames : providerGames.filter(game=>game.gameType===activeGameType); const visibleGames=pageSlice(sorted(filteredProviderGames),'visibleGameCount');
  const typeFilter=showGameTypeFilter ? `<div class="chip-row provider-type-chips" aria-label="Game type filter">${['All',...gameTypes].map(type=>`<button class="sub-chip ${activeGameType===type?'active':''}" data-provider-game-type="${escapeAttribute(type)}" type="button">${type}</button>`).join('')}</div>` : '';
  const sortControl=`<label class="toolbar-action toolbar-sort provider-sort ${state.sort!=='Popular'?'is-active':''}" aria-label="Sort provider games" title="Sort provider games"><span aria-hidden="true">⇅</span><select id="providerSortSelect" aria-label="Sort provider games">${providerSortOptions()}</select></label>`;
  return `<section class="provider-page provider-games-page"><header class="provider-page-nav"><button id="providerGamesBack" class="provider-back" type="button" aria-label="Back to Providers">‹</button><h1>Provider Games</h1><span aria-hidden="true"></span></header><div class="provider-profile">${providerLogo(provider)}<div><h2>${provider.name}</h2><p>${providerGames.length} ${providerGames.length===1?'Game':'Games'}</p></div></div>${providerGames.length ? `<div class="provider-game-toolbar">${typeFilter}${sortControl}</div>${visibleGames.count ? `<div class="game-grid provider-game-grid">${visibleGames.items.map(game=>gameCard(game)).join('')}</div>${paginationMarkup('games',visibleGames.count,visibleGames.total)}` : '<div class="empty-state">No games found</div>'}` : '<div class="empty-state">No games are available from this provider in the current prototype.</div>'}</section>`;
}
function openProviderGames(providerId){
  if(!providerCatalog.some(provider=>provider.id===providerId))return;
  recordRecentProvider(providerId);
  resetPagination();
  state.activeProvider=providerId;
  state.providerGameType='All';
  state.currentView='providerGames';
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}
function recordRecentProvider(providerId){
  if(!providerCatalog.some(provider=>provider.id===providerId))return;
  state.recentProviderIds=[providerId,...state.recentProviderIds.filter(id=>id!==providerId)].slice(0,RECENT_PROVIDER_LIMIT);
  saveRecentProviderIds(state.recentProviderIds);
}
function findGame(gameId){ return allGames.find(game=>game.id===gameId) || vipGames.find(game=>game.id===gameId); }
function isGameAvailableInRegion(game){ return Boolean(game) && game.isAvailableInRegion !== false; }
function showRegionRestrictedToast(){ showToast(REGION_RESTRICTED_MESSAGE); }
function updateFavorite(gameId){ const game=findGame(gameId); if(!game)return false; const next=!game.isFavorite; allGames.filter(item=>item.id===gameId).forEach(item=>item.isFavorite=next); [recommended,trending,released,vipGames].forEach(list=>list.filter(item=>item.id===gameId).forEach(item=>item.isFavorite=next)); return next; }
function recommendedGames(game){ return allGames.filter(item=>item.provider===game.provider&&item.id!==game.id).slice(0,7); }
function openGameDetail(gameId){ const game=findGame(gameId); if(!game)return; if(!isGameAvailableInRegion(game)){showRegionRestrictedToast();return;} if(state.currentView==='gameDetail'){ state.gameDetailStack.push({activeGame:state.activeGame,detailFullscreen:state.detailFullscreen,detailCurrency:state.detailCurrency,detailDescriptionExpanded:state.detailDescriptionExpanded}); } else { state.gameDetailReturn=state.currentView; state.gameDetailStack=[]; } state.activeGame=game.id; state.detailFullscreen=false; state.detailCurrency='USDT'; state.detailDescriptionExpanded=false; state.currentView='gameDetail'; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function closeGameDetail(){ const previous=state.gameDetailStack.pop(); if(previous){ Object.assign(state,previous); render(); window.scrollTo({top:0,behavior:'smooth'}); return; } state.currentView=state.gameDetailReturn||'casino'; state.activeGame=null; state.gameDetailReturn=null; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function startGamePlay(playType){ if(!isGameAvailableInRegion(findGame(state.activeGame))){showRegionRestrictedToast();return;} state.gamePlayMode=state.detailFullscreen?'fullscreen':'windowed'; state.gamePlayType=playType; state.gamePlayPanelOpen=false; state.currentView='gamePlay'; render(); window.scrollTo(0,0); }
function closeGamePlay(){ state.currentView='gameDetail'; state.gamePlayMode=null; state.gamePlayType=null; state.gamePlayPanelOpen=false; render(); window.scrollTo(0,0); }
function returnGamePlayHome(){ state.currentView='casino'; state.activeCategory='lobby'; state.activeSub=null; state.search=''; state.filters={}; state.sort='Popular'; state.lobbyDetailCategory=null; state.activeGame=null; state.gameDetailReturn=null; state.gameDetailStack=[]; state.gamePlayMode=null; state.gamePlayType=null; state.gamePlayPanelOpen=false; searchInput.value=''; clearSearch.classList.remove('visible'); render(); window.scrollTo(0,0); }
function renderGamePlay(){ const game=findGame(state.activeGame); const mode=state.gamePlayMode==='fullscreen'?'fullscreen':'windowed'; const playType=state.gamePlayType==='demo'?'Demo Play':'Real Money Play'; return `<section class="game-play-screen is-${mode}" aria-label="${escapeAttribute(game?.name||'Casino game')} ${playType}"><div class="game-play-view"><img class="game-play-image" src="${GAME_PLAY_IMAGE}" alt="${escapeAttribute(game?.name||'Casino')} game screen" /><div class="game-play-control-zone"><div id="gamePlayControlWrap" class="game-play-control-wrap is-right"><button id="gamePlayControl" class="game-play-control" type="button" aria-label="Open game controls" aria-expanded="false"><span class="game-play-control-home-icon" aria-hidden="true"></span><span class="game-play-control-close-icon" aria-hidden="true">×</span></button><div id="gamePlayPanel" class="game-play-panel" role="group" aria-label="Game controls" hidden><button id="gamePlayHome" type="button">Home</button><button id="gamePlayClose" type="button">Close</button></div></div></div></div></section>`; }
function renderGameDetail(){ const game=findGame(state.activeGame); if(!game)return renderLobby(); const provider=providerCatalog.find(item=>item.id===game.providerId); const tags=[...(game.tags||[])]; const related=recommendedGames(game); const hasDescription=Boolean(game.description); const descriptionNeedsToggle=game.description?.length>118; const cover=game.image?`<img src="${game.image}" alt="" loading="eager" decoding="async" style="--image-position:${game.imagePosition||'center'}" onerror="this.hidden=true" />`:`<b>${game.name}</b>`; const providerIdentity=provider?providerLogo(provider):`<span class="detail-provider-fallback" aria-hidden="true">${game.provider.slice(0,2)}</span>`; return `<section class="game-detail-page"><header class="game-detail-header"><button id="detailBack" class="detail-back" type="button" aria-label="Back to games">‹</button><h1 title="${escapeAttribute(game.name)}">${game.name}</h1><button id="detailFavorite" class="detail-icon-button ${game.isFavorite?'is-favorite':''}" type="button" aria-label="${game.isFavorite?'Remove':'Add'} ${game.name} ${game.isFavorite?'from':'to'} favorites">${game.isFavorite?'★':'☆'}</button><button id="detailShare" class="detail-icon-button" type="button" aria-label="Share ${game.name}">↗</button></header><div class="detail-overview"><div class="detail-cover" style="--cover:${game.cover}">${cover}</div><div class="detail-side"><div class="detail-stats"><div class="detail-stat"><strong>${game.rtp.toFixed(2)}%</strong><small>RTP</small></div><div class="detail-stat"><strong>${game.volatility}</strong><small>Volatility</small></div></div><div class="detail-settings"><div class="detail-setting"><span>Fullscreen</span><button id="detailFullscreen" class="detail-switch ${state.detailFullscreen?'is-on':''}" type="button" role="switch" aria-checked="${state.detailFullscreen}" aria-label="Fullscreen ${state.detailFullscreen?'on':'off'}"></button></div><label class="detail-setting"><span>Display currency</span><select id="detailCurrency" class="detail-currency" aria-label="Display currency">${['USDT','BTC','ETH','USD'].map(currency=>`<option value="${currency}" ${state.detailCurrency===currency?'selected':''}>${currency}</option>`).join('')}</select></label></div></div></div><div class="detail-actions"><button id="detailFunPlay" class="detail-fun-play" type="button">Fun Play</button><button id="detailPlayNow" class="detail-play-now" type="button">Play Now</button></div><section class="detail-info" aria-label="Game information"><div class="detail-provider-row"><button class="detail-provider-link" data-detail-provider="${game.providerId}" type="button">${providerIdentity}<strong>${game.provider}</strong></button></div>${tags.length?`<div class="detail-tags">${tags.map(tag=>`<span class="detail-tag ${tag.toLowerCase()}">${tag}</span>`).join('')}</div>`:''}${hasDescription?`<div class="detail-description"><h2>Game description</h2><p class="${state.detailDescriptionExpanded?'':'is-collapsed'}">${game.description}</p>${descriptionNeedsToggle?`<button id="detailDescriptionToggle" type="button">${state.detailDescriptionExpanded?'Show Less':'Show All'}</button>`:''}</div>`:''}</section>${related.length?`<section class="detail-recommendations"><div class="section-head"><div><h2 class="section-title"><span>✦</span>Recommended Games</h2><p class="section-subtitle">More from ${game.provider}</p></div></div><div class="h-scroll">${related.map(item=>gameCard(item)).join('')}</div></section>`:''}</section>`; }
function renderLobbyCategoryDetail(){
  const category=lobbyDetailCategories[state.lobbyDetailCategory];
  if(!category) return '<section class="provider-page category-detail-page"><div class="empty-state">No games found</div></section>';
  return `<section class="provider-page category-detail-page"><header class="provider-page-nav"><button id="categoryDetailBack" class="provider-back" type="button" aria-label="Back to Casino Lobby">‹</button><h1>${category.title}</h1><span aria-hidden="true"></span></header>${category.games.length ? pagedGameGrid(category.games, category.cardType || '', Boolean(category.showPlaying), true) : '<div class="empty-state">No games found</div>'}</section>`;
}
function renderBaccaratRoadPicksPage(){
  return `<section class="provider-page baccarat-road-picks-page"><header class="provider-page-nav"><button id="baccaratRoadPicksBack" class="provider-back" type="button" aria-label="Back to Casino Lobby">‹</button><h1>Baccarat Road Picks</h1><span aria-hidden="true"></span></header><p class="baccarat-road-page-subtitle">More live table patterns to help you find your next seat.</p><div class="baccarat-road-list">${baccaratRoads.map(road=>roadCard(road,true)).join('')}</div></section>`;
}
function renderLobby(){ const results = isSearchMode() ? globalGameSearch() : null; if(results) return `<section class="section search-results-page"><div class="category-head"><div><h1 class="section-title">Search Results</h1><p class="section-subtitle">${results.length} matching games</p></div></div>${results.length ? pagedGameGrid(results) : '<div class="empty-state">No games found</div>'}</section>`;
  const lobbySection=category=>section(category.title,category.subtitle,category.homeGames,category.cardType || '',category.icon,Boolean(category.showPlaying),category.id);
  return `${userHasHistory ? lobbySection(lobbyDetailCategories.recommended) : ''}${lobbySection(lobbyDetailCategories.trending)}${latestWinsSection()}${lobbySection(lobbyDetailCategories.released)}<section class="section"><div class="section-head"><div><h2 class="section-title"><span>◈</span>Baccarat Road Picks</h2><p class="section-subtitle">Follow a table pattern before you sit down</p></div><button class="view-all" type="button" data-baccarat-road-picks>View All ›</button></div><div class="baccarat-rail">${baccaratRoads.slice(0,LOBBY_BACCARAT_ROAD_LIMIT).map(roadCard).join('')}</div></section><section class="section vip-lounge"><div class="vip-head"><div><p class="vip-kicker">✦ PRIVATE TABLES</p><h2 class="vip-title">VIP <span>Lounge</span></h2><p class="vip-sub">Curated premium live games</p></div><span class="vip-status">PREMIUM</span></div><div class="vip-rail">${vipGames.map(g => `<button class="vip-card${g.isAvailableInRegion === false ? ' is-region-restricted' : ''}" data-game-id="${g.id}" type="button" aria-label="${g.isAvailableInRegion === false ? `${g.name} is not available in your region` : `Open ${g.name}`}"><div class="vip-cover" style="--vip-cover:${g.vipCover}"><span class="vip-tag">${g.vipTag}</span>${restrictedGameOverlay(g)}</div><div class="vip-card-info"><span class="vip-min-bet">From <b>${g.minBet} USDT</b></span></div></button>`).join('')}</div></section>${lobbySection(lobbyDetailCategories.slots)}${lobbySection(lobbyDetailCategories.live)}${lobbySection(lobbyDetailCategories.fishing)}${lobbySection(lobbyDetailCategories.poker)}`; }
function renderCategory(){ if(state.activeCategory==='live')activateLiveSubcategory(); const games = filtered(categoryGames()); const liveChips = state.activeCategory === 'live' ? `<div class="chip-row">${enabledLiveSubcategories().map(category => `<button class="sub-chip ${state.activeSub===category.id?'active':''}" data-sub="${category.id}" type="button">${category.name}</button>`).join('')}</div>` : ''; return `<section class="section category-page">${liveChips}${games.length ? pagedGameGrid(games, state.activeCategory === 'live' ? 'live-card' : '') : '<div class="empty-state">No games match these filters. Clear filters to restore the full category.</div>'}</section>`; }
function render(){ const isCasinoView=state.currentView==='casino'; const isGamePlay=state.currentView==='gamePlay'; const isFullscreenGame=isGamePlay&&state.gamePlayMode==='fullscreen'; const searchMode=isCasinoView&&isSearchMode(); const isCategory=isCasinoView&&state.activeCategory!=='lobby'; if(gamePlayInteractionCleanup)gamePlayInteractionCleanup(); cancelLatestWinsShift(); renderNav(); discoveryControls.hidden=!isCasinoView; bannerCarousel.hidden=!isCasinoView; nav.hidden=searchMode; document.querySelector('#providersEntry').hidden=searchMode; topHeader.hidden=isFullscreenGame; bottomNav.hidden=isFullscreenGame; appShell.classList.toggle('is-game-play-windowed',isGamePlay&&!isFullscreenGame); appShell.classList.toggle('is-game-play-fullscreen',isGamePlay); document.body.classList.toggle('is-game-play-active',isGamePlay); discoveryControls.classList.toggle('is-category',isCategory&&!searchMode); discoveryControls.classList.toggle('is-search-mode',searchMode); document.querySelector('#openFilter').classList.toggle('is-active',isCategory && Object.keys(state.filters).length > 0); document.querySelector('.toolbar-sort').classList.toggle('is-active',isCategory && state.sort !== 'Popular'); document.querySelector('#sortSelect').value=''; content.innerHTML=isGamePlay?renderGamePlay():state.currentView==='gameDetail'?renderGameDetail():state.currentView==='providers'?renderProviderList():state.currentView==='providerGames'?renderProviderGames():state.currentView==='categoryDetail'?renderLobbyCategoryDetail():state.currentView==='baccaratRoadPicks'?renderBaccaratRoadPicksPage():isCategory&&!searchMode?renderCategory():renderLobby(); observeShimmers(); observeGameCards(); if(isGamePlay){clearBigWinMarquee({clearQueue:true});setupGamePlayInteractions();}else processBigWinQueue(); }

function setupGamePlayInteractions(){
  const view=document.querySelector('.game-play-view'); const zone=document.querySelector('.game-play-control-zone'); const wrap=document.querySelector('#gamePlayControlWrap'); const button=document.querySelector('#gamePlayControl'); const panel=document.querySelector('#gamePlayPanel');
  if(!view||!zone||!wrap||!button||!panel)return;
  const controller=new AbortController(); const {signal}=controller; const drag={pointerId:null,startX:0,startY:0,startLeft:0,startTop:0,moved:false,suppressClick:false};
  const clamp=(value,min,max)=>Math.min(Math.max(value,min),Math.max(min,max));
  const setPanelOpen=open=>{state.gamePlayPanelOpen=open;panel.hidden=!open;button.setAttribute('aria-expanded',String(open));button.classList.toggle('is-open',open);button.setAttribute('aria-label',open?'Close game controls':'Open game controls');};
  const updateSide=()=>{const isLeft=parseFloat(wrap.style.left||'0')+wrap.offsetWidth/2<zone.clientWidth/2;wrap.classList.toggle('is-left',isLeft);wrap.classList.toggle('is-right',!isLeft);};
  const placeDefault=()=>{wrap.style.left=`${Math.max(0,zone.clientWidth-wrap.offsetWidth)}px`;wrap.style.top='16px';updateSide();};
  requestAnimationFrame(placeDefault);
  button.addEventListener('pointerdown',event=>{drag.pointerId=event.pointerId;drag.startX=event.clientX;drag.startY=event.clientY;drag.startLeft=parseFloat(wrap.style.left)||0;drag.startTop=parseFloat(wrap.style.top)||0;drag.moved=false;wrap.classList.remove('is-snapping');button.setPointerCapture(event.pointerId);event.preventDefault();},{signal});
  button.addEventListener('pointermove',event=>{if(event.pointerId!==drag.pointerId)return;const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)>=5){drag.moved=true;setPanelOpen(false);}if(!drag.moved)return;wrap.style.left=`${clamp(drag.startLeft+dx,0,zone.clientWidth-wrap.offsetWidth)}px`;wrap.style.top=`${clamp(drag.startTop+dy,0,zone.clientHeight-wrap.offsetHeight)}px`;updateSide();event.preventDefault();},{signal});
  const finishDrag=event=>{if(event.pointerId!==drag.pointerId)return;if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);if(drag.moved){drag.suppressClick=true;const snapLeft=parseFloat(wrap.style.left||'0')+wrap.offsetWidth/2<zone.clientWidth/2?0:zone.clientWidth-wrap.offsetWidth;wrap.classList.add('is-snapping');wrap.style.left=`${Math.max(0,snapLeft)}px`;updateSide();}drag.pointerId=null;};
  button.addEventListener('pointerup',finishDrag,{signal}); button.addEventListener('pointercancel',finishDrag,{signal});
  button.addEventListener('click',event=>{if(drag.suppressClick){drag.suppressClick=false;event.preventDefault();return;}setPanelOpen(!state.gamePlayPanelOpen);},{signal});
  view.addEventListener('pointerdown',event=>{if(state.gamePlayPanelOpen&&!wrap.contains(event.target))setPanelOpen(false);},{signal});
  panel.addEventListener('pointerdown',event=>event.stopPropagation(),{signal});
  document.querySelector('#gamePlayClose').addEventListener('click',closeGamePlay,{signal});
  document.querySelector('#gamePlayHome').addEventListener('click',returnGamePlayHome,{signal});
  const keepInBounds=()=>{const left=wrap.classList.contains('is-left')?0:zone.clientWidth-wrap.offsetWidth;wrap.style.left=`${Math.max(0,left)}px`;wrap.style.top=`${clamp(parseFloat(wrap.style.top)||0,0,zone.clientHeight-wrap.offsetHeight)}px`;updateSide();};
  window.addEventListener('resize',keepInBounds,{signal});
  gamePlayInteractionCleanup=()=>{controller.abort();gamePlayInteractionCleanup=null;};
}

function showToast(message){ const toast = document.querySelector('#launchToast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2300); }
function observeShimmers(){ const badges = document.querySelectorAll('.badge.shine-target'); const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduceMotion){ badges.forEach(el => playedBadgeKeys.add(el.dataset.badgeKey)); return; } const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(!entry.isIntersecting) return; const key = entry.target.dataset.badgeKey; if(!playedBadgeKeys.has(key)){ playedBadgeKeys.add(key); entry.target.classList.add('shine-played'); } observer.unobserve(entry.target); }), { threshold:.25 }); badges.forEach(el => { if(playedBadgeKeys.has(el.dataset.badgeKey)) el.classList.remove('shine-target'); else observer.observe(el); }); }
function filterConfig(){ const c = state.activeCategory; const groups = [{ key:'provider', title:'Provider', choices:providers }]; if(c === 'slots') groups.push({key:'rtp',title:'RTP',choices:['96%+','Below 96%']},{key:'volatility',title:'Volatility',choices:['Low','Medium','High']}); if(c === 'live') groups.push({key:'gameType',title:'Game Type',choices:enabledLiveSubcategories().map(category=>category.id)}); return groups; }
function openSheet(){ document.querySelector('#filterOptions').innerHTML = filterConfig().map(g => `<section class="filter-group"><h3>${g.title}</h3><div class="filter-choices">${g.choices.map(v => `<label class="filter-choice"><input type="radio" name="${g.key}" value="${v}" ${state.filters[g.key]===v?'checked':''}/><span>${v}</span></label>`).join('')}</div></section>`).join(''); backdrop.hidden=false; requestAnimationFrame(()=>sheet.classList.add('open')); sheet.setAttribute('aria-hidden','false'); }
function closeSheet(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); setTimeout(()=>backdrop.hidden=true,280); }
function openShareSheet(){ shareBackdrop.hidden=false; shareSheet.setAttribute('aria-hidden','false'); requestAnimationFrame(()=>shareSheet.classList.add('open')); }
function closeShareSheet(){ shareSheet.classList.remove('open'); shareSheet.setAttribute('aria-hidden','true'); setTimeout(()=>shareBackdrop.hidden=true,220); }
function shareCurrentGame(action){ const game=findGame(state.activeGame); const link=`${window.location.origin}${window.location.pathname}?game=${encodeURIComponent(game?.id||'')}`; if(action==='copy')navigator.clipboard?.writeText(link).catch(()=>{}); const messages={copy:'Game link copied',telegram:'Telegram share · prototype action',x:'Share to X · prototype action',more:'More share options · prototype action'}; closeShareSheet(); showToast(messages[action]||'Share · prototype action'); }
function applySheet(){ const chosen = {}; filterConfig().forEach(g => { const input = document.querySelector(`input[name="${g.key}"]:checked`); if(input) chosen[g.key]=input.value; }); state.filters=chosen; resetPagination(); closeSheet(); render(); showToast('Filters applied'); }
function setupEvents(){
  bannerCarousel.addEventListener('click',event=>{ const cta=event.target.closest('[data-banner-target]'); if(!cta)return; showToast(`${cta.dataset.bannerTarget} · prototype action`); resetBannerProgress(); scheduleBannerAutoplay(); });
  bigWinMarquee.addEventListener('click',()=>{ const gameId=bigWinMarquee.dataset.gameId; clearBigWinMarquee(); if(gameId)openGameDetail(gameId); });
  nav.addEventListener('click',e => { const b=e.target.closest('[data-category]'); if(!b)return; state.activeCategory=b.dataset.category; if(state.activeCategory==='live')activateLiveSubcategory();else state.activeSub=null; state.filters={}; state.sort='Popular'; resetPagination(); state.lobbyDetailCategory=null; render(); window.scrollTo({top:0,behavior:'smooth'}); });
  searchInput.addEventListener('input',e => { resetPagination(); state.search=e.target.value; clearSearch.classList.toggle('visible',!!state.search); render(); }); clearSearch.addEventListener('click',()=>{searchInput.value='';state.search='';clearSearch.classList.remove('visible');resetPagination();render();searchInput.focus();});
  document.querySelector('#providersEntry')?.addEventListener('click',()=>{state.currentView='providers';state.activeProvider=null;state.providerSearch='';resetPagination();render();window.scrollTo({top:0,behavior:'smooth'});});
  content.addEventListener('input',e=>{if(e.target.id!=='providerSearchInput')return;state.providerSearch=e.target.value;state.visibleProviderCount=PAGE_SIZE;const results=document.querySelector('#providerListResults');if(results)results.innerHTML=renderProviderListContent();});
  content.addEventListener('click',e => {
    if(e.target.closest('#detailBack')){closeGameDetail();return;}
    if(e.target.closest('#detailFavorite')){updateFavorite(state.activeGame);render();return;}
    if(e.target.closest('#detailShare')){openShareSheet();return;}
    if(e.target.closest('#detailFullscreen')){state.detailFullscreen=!state.detailFullscreen;render();return;}
    if(e.target.closest('#detailFunPlay')){startGamePlay('demo');return;}
    if(e.target.closest('#detailPlayNow')){startGamePlay('real');return;}
    if(e.target.closest('#detailDescriptionToggle')){state.detailDescriptionExpanded=!state.detailDescriptionExpanded;render();return;}
    const detailProvider=e.target.closest('[data-detail-provider]');
    if(detailProvider){openProviderGames(detailProvider.dataset.detailProvider);state.gameDetailStack=[];return;}
    const lobbyDetail=e.target.closest('[data-lobby-detail]');
    if(lobbyDetail){resetPagination();state.lobbyDetailCategory=lobbyDetail.dataset.lobbyDetail;state.currentView='categoryDetail';render();window.scrollTo({top:0,behavior:'smooth'});return;}
    if(e.target.closest('[data-baccarat-road-picks]')){state.currentView='baccaratRoadPicks';render();window.scrollTo({top:0,behavior:'smooth'});return;} const loadMore=e.target.closest('[data-load-more]'); if(loadMore){ const key=loadMore.dataset.loadMore==='providers'?'visibleProviderCount':'visibleGameCount'; const total=Number(loadMore.dataset.total)||0; const scrollY=window.scrollY; state[key]=Math.min((state[key]||PAGE_SIZE)+PAGE_SIZE,total); render(); requestAnimationFrame(()=>window.scrollTo(0,scrollY)); return; }
    const roadPick=e.target.closest('[data-road-game-id]');
    if(roadPick){openGameDetail(roadPick.dataset.roadGameId);return;}
    const game=e.target.closest('[data-game-id]');
    if(game){openGameDetail(game.dataset.gameId);return;}
    const provider=e.target.closest('[data-provider-id]');
    if(provider){openProviderGames(provider.dataset.providerId);return;}
    if(e.target.closest('#providerGamesBack')){state.currentView='providers';render();window.scrollTo({top:0,behavior:'smooth'});return;}
    if(e.target.closest('#providerBack')){state.currentView='casino';render();window.scrollTo({top:0,behavior:'smooth'});return;}
    if(e.target.closest('#categoryDetailBack')){state.currentView='casino';state.lobbyDetailCategory=null;render();window.scrollTo({top:0,behavior:'smooth'});return;}
    if(e.target.closest('#baccaratRoadPicksBack')){state.currentView='casino';render();window.scrollTo({top:0,behavior:'smooth'});return;}
    const providerGameType=e.target.closest('[data-provider-game-type]');if(providerGameType){state.providerGameType=providerGameType.dataset.providerGameType;state.visibleGameCount=PAGE_SIZE;render();return;}
    const sub=e.target.closest('[data-sub]');if(sub){resetPagination();activateLiveSubcategory(sub.dataset.sub);render();return;}
  });
  content.addEventListener('change',e=>{if(e.target.matches('#detailCurrency'))state.detailCurrency=e.target.value;if(e.target.matches('#providerSortSelect')){state.sort=e.target.value;state.visibleGameCount=PAGE_SIZE;render();showToast(`Sorted by ${state.sort}`);}});
  document.querySelector('#openFilter').addEventListener('click',openSheet); document.querySelector('#sortSelect').addEventListener('change',e=>{if(!e.target.value)return;state.sort=e.target.value;state.visibleGameCount=PAGE_SIZE;render();showToast(`Sorted by ${state.sort}`);}); document.querySelector('#closeSheet').addEventListener('click',closeSheet); backdrop.addEventListener('click',closeSheet); document.querySelector('#applyFilters').addEventListener('click',applySheet); document.querySelector('#clearFilters').addEventListener('click',()=>{state.filters={};resetPagination();if(state.activeCategory==='live')activateLiveSubcategory();closeSheet();render();showToast('Filters cleared');});
  document.querySelector('#closeShareSheet').addEventListener('click',closeShareSheet); shareBackdrop.addEventListener('click',closeShareSheet); shareSheet.addEventListener('click',e=>{const option=e.target.closest('[data-share-action]');if(option)shareCurrentGame(option.dataset.shareAction);});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-feedback]');if(b)showToast(`${b.dataset.feedback} · prototype action`);}); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheet.classList.contains('open'))closeSheet();if(e.key==='Escape'&&shareSheet.classList.contains('open'))closeShareSheet();});
  document.addEventListener('visibilitychange',()=>{ syncLatestWinsRail(); resetBannerAutoplayForVisibility(); handleBigWinVisibility(); });
}
function startJackpot(){ let amount=42680.38; const feeds=[...document.querySelectorAll('.jackpot-feed-text')], amountEls=[...document.querySelectorAll('.jackpot-amount-value')]; const tick=()=>{const add=[.12,.86,1.40,2.14,5.30][Math.floor(Math.random()*5)];amount+=add;amountEls.forEach(amountEl=>{amountEl.textContent=amount.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});amountEl.classList.remove('amount-bump');void amountEl.offsetWidth;amountEl.classList.add('amount-bump');});feeds.forEach(feed=>{feed.textContent=`✦ +${add.toFixed(2)} USDT added to the Jackpot`;feed.classList.remove('feed-pop');void feed.offsetWidth;feed.classList.add('feed-pop');});setTimeout(tick,4000+Math.floor(Math.random()*4001));};setTimeout(tick,5000);}
renderCasinoBanners();seedLatestWins();setupEvents();render();startJackpot();scheduleWinEvent();
