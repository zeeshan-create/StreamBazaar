/**
 * StreamBazaar Smart Service & Plan AI Specification Detector
 * Automatically determines exact streaming qualities, audio bitrates,
 * plan tiers, and device access rules for all products.
 */

export function detectServiceSpecs(product, selectedPlan = null) {
  const name = (product?.name || '').toLowerCase().trim();
  const cat = (product?.category || '').toLowerCase().trim();
  const desc = (product?.description || '').toLowerCase().trim();
  const plan = selectedPlan || product?.plans?.[0] || {};
  const planLabel = (plan?.label || '').toLowerCase();
  const planQuality = (plan?.quality || '').trim();

  // 1. Music & Audio Streaming (Spotify, Apple Music, etc.)
  const isMusic =
    name.includes('spotify') ||
    name.includes('apple music') ||
    name.includes('tidal') ||
    name.includes('youtube music') ||
    name.includes('jiosaavn') ||
    name.includes('gaana') ||
    name.includes('wynk') ||
    name.includes('deezer') ||
    name.includes('music');

  if (isMusic) {
    return {
      categoryType: 'music',
      featureBadge: '🎵 320kbps Audio',
      summaryQuality: '🎵 320kbps Hi-Res Audio · Ad-Free Music',
      deviceCompatibility: '📱 Mobile, PC & Any Device',
      planPill: '⚡ Instant Delivery • 🛡️ 100% Guarantee • 🎵 320kbps Audio'
    };
  }

  // 2. Anime Streaming (Crunchyroll, etc.)
  const isAnime =
    name.includes('crunchyroll') ||
    name.includes('funimation') ||
    name.includes('hidive') ||
    name.includes('anime');

  if (isAnime) {
    let quality = '1080p FHD';
    const combinedPlan = `${planQuality} ${planLabel}`.toLowerCase();
    if (combinedPlan.includes('4k') || combinedPlan.includes('uhd')) {
      quality = '4K Ultra HD';
    } else if (combinedPlan.includes('mega') || desc.includes('mega')) {
      quality = '1080p Mega Fan';
    } else if (combinedPlan.includes('fan')) {
      quality = '1080p Fan Tier';
    } else if (combinedPlan.includes('1080p') || combinedPlan.includes('full hd') || combinedPlan.includes('fhd')) {
      quality = '1080p FHD';
    } else if (combinedPlan.includes('720p')) {
      quality = '720p HD';
    } else if (plan?.quality && plan.quality.trim()) {
      quality = plan.quality.trim();
    } else if (plan?.label && !['standard', 'custom', 'plan', 'default'].includes(planLabel)) {
      quality = plan.label.trim();
    }
    const displayQuality = quality.startsWith('🍥') ? quality : `🍥 ${quality}`;
    return {
      categoryType: 'anime',
      featureBadge: displayQuality,
      summaryQuality: `${displayQuality} · Ad-Free Simulcasts`,
      deviceCompatibility: '📺 Any Device (TV, Mobile, PC)',
      planPill: `⚡ Instant Delivery • 🛡️ 100% Guarantee • ${displayQuality}`
    };
  }

  // 3. Sports Streaming (FanCode, etc.)
  const isSports =
    name.includes('fancode') ||
    name.includes('fan code') ||
    name.includes('willow') ||
    name.includes('nba') ||
    name.includes('f1') ||
    name.includes('ufc') ||
    name.includes('dazn') ||
    desc.includes('live cricket') ||
    desc.includes('live match');

  if (isSports) {
    return {
      categoryType: 'sports',
      featureBadge: '🏆 1080p Sports',
      summaryQuality: '🏆 1080p 50FPS Live HD Match Pass',
      deviceCompatibility: '📺 Mobile, TV & Web Stream',
      planPill: '⚡ Instant Delivery • 🛡️ 100% Guarantee • 🏆 1080p Sports'
    };
  }

  // 4. Design & Creative Tools (Canva, Adobe)
  const isDesign =
    name.includes('canva') ||
    name.includes('adobe') ||
    name.includes('photoshop') ||
    name.includes('illustrator') ||
    name.includes('figma');

  if (isDesign) {
    let planBadge = '🎨 Canva Pro';
    if (name.includes('adobe') || name.includes('photoshop')) {
      planBadge = '✨ Creative Cloud';
    }
    return {
      categoryType: 'design',
      featureBadge: planBadge,
      summaryQuality: `${planBadge} · Full Lifetime Premium Access`,
      deviceCompatibility: '💻 Any Device (Web, PC, Mobile)',
      planPill: `⚡ Instant Delivery • 🛡️ 100% Guarantee • ${planBadge}`
    };
  }

  // 5. AI & Productivity Tools (ChatGPT, Claude, Perplexity, Grok)
  const isAi =
    cat.includes('ai') ||
    name.includes('chatgpt') ||
    name.includes('openai') ||
    name.includes('claude') ||
    name.includes('perplexity') ||
    name.includes('grok') ||
    name.includes('midjourney') ||
    name.includes('copilot') ||
    name.includes('grammarly') ||
    name.includes('office') ||
    name.includes('365');

  if (isAi) {
    let aiBadge = '🤖 Pro AI Access';
    if (name.includes('chatgpt') || name.includes('gpt')) aiBadge = '🤖 GPT-4o Plus';
    else if (name.includes('claude')) aiBadge = '🧠 Claude 3.5 Pro';
    else if (name.includes('perplexity')) aiBadge = '🔍 Perplexity Pro';
    else if (name.includes('grok')) aiBadge = '⚡ Grok AI Pro';
    else if (name.includes('midjourney')) aiBadge = '🎨 Midjourney Fast';
    else if (name.includes('copilot')) aiBadge = '💻 Copilot AI';
    else if (name.includes('office') || name.includes('365')) aiBadge = '📑 1TB OneDrive & Apps';

    return {
      categoryType: 'ai',
      featureBadge: aiBadge,
      summaryQuality: `${aiBadge} · Private & Unlimited`,
      deviceCompatibility: '💻 Any Device (Web, App, PC)',
      planPill: `⚡ Instant Delivery • 🛡️ 100% Guarantee • ${aiBadge}`
    };
  }

  // 6. VPN Shields (NordVPN, Surfshark, ExpressVPN, Proton)
  const isVpn =
    cat.includes('vpn') ||
    name.includes('vpn') ||
    name.includes('nord') ||
    name.includes('surfshark') ||
    name.includes('express');

  if (isVpn) {
    return {
      categoryType: 'vpn',
      featureBadge: '🛡️ 10Gbps WireGuard',
      summaryQuality: '🛡️ Ultra-Fast 10Gbps · Verified No-Logs',
      deviceCompatibility: '🔒 Any Device (PC, Mobile, TV)',
      planPill: '⚡ Instant Delivery • 🛡️ 100% Guarantee • 🛡️ 10Gbps VPN'
    };
  }

  // 7. Gaming Seats (Steam, PlayStation, Xbox, Epic, PC Games)
  const isGaming =
    cat.includes('gaming') ||
    cat.includes('game') ||
    name.includes('steam') ||
    name.includes('gta') ||
    name.includes('forza') ||
    name.includes('wukong') ||
    name.includes('spider-man') ||
    name.includes('resident evil') ||
    name.includes('god of war') ||
    name.includes('red dead') ||
    name.includes('last of us') ||
    name.includes('fifa') ||
    name.includes('wwe');

  if (isGaming) {
    let gameBadge = '🎮 Any Device';
    let gameCompat = '🎮 PC, Steam Deck, PlayStation & Xbox';
    const combinedPlan = `${planQuality} ${planLabel}`.toLowerCase();
    if (combinedPlan.includes('playstation') || combinedPlan.includes('ps5') || combinedPlan.includes('ps4')) {
      gameBadge = '🎮 PlayStation';
      gameCompat = '🎮 PS4 & PS5 Console Access';
    } else if (combinedPlan.includes('xbox')) {
      gameBadge = '🎮 Xbox';
      gameCompat = '🎮 Xbox One, Series S & Series X';
    } else if (combinedPlan.includes('pc') || combinedPlan.includes('steam')) {
      gameBadge = '🎮 PC Game';
      gameCompat = '💻 PC & Steam Deck Access';
    } else if (plan?.label && !['standard', 'custom', 'plan', 'default'].includes(planLabel)) {
      gameBadge = plan.label.startsWith('🎮') ? plan.label : `🎮 ${plan.label}`;
    }
    return {
      categoryType: 'gaming',
      featureBadge: gameBadge,
      summaryQuality: `${gameBadge} · Full Game License · Lifetime Access`,
      deviceCompatibility: gameCompat,
      planPill: `⚡ Instant Delivery • 🛡️ 100% Guarantee • ${gameBadge}`
    };
  }

  // 8. Movies & Video OTT Streaming (Netflix, Prime, Hotstar, ZEE5, Sony LIV, YouTube)
  let ottQuality = '4K Ultra HD';
  if (
    name.includes('zee5') ||
    name.includes('sonyliv') ||
    name.includes('sony liv') ||
    name.includes('hoichoi') ||
    name.includes('discovery') ||
    name.includes('lionsgate')
  ) {
    ottQuality = '1080p FHD';
  }

  const combinedPlan = `${planQuality} ${planLabel}`.toLowerCase();

  if (combinedPlan.includes('4k') || combinedPlan.includes('uhd')) {
    ottQuality = '4K Ultra HD';
  } else if (combinedPlan.includes('1080p') || combinedPlan.includes('full hd') || combinedPlan.includes('fhd')) {
    ottQuality = '1080p FHD';
  } else if (combinedPlan.includes('720p') || (combinedPlan.includes('hd') && !combinedPlan.includes('full') && !combinedPlan.includes('ultra'))) {
    ottQuality = '720p HD';
  } else if (combinedPlan.includes('private')) {
    ottQuality = 'Private Profile';
  } else if (combinedPlan.includes('shared')) {
    ottQuality = 'Shared Profile';
  } else if (plan?.quality && plan.quality.trim()) {
    ottQuality = plan.quality.trim();
  } else if (plan?.label && !['standard', 'custom', 'plan', 'default'].includes(planLabel)) {
    ottQuality = plan.label.trim();
  }

  let badgeIcon = '📺';
  if (ottQuality.includes('Private')) badgeIcon = '🔒';
  else if (ottQuality.includes('Shared')) badgeIcon = '⚡';

  const featureBadge = ottQuality.startsWith('📺') || ottQuality.startsWith('🔒') || ottQuality.startsWith('⚡')
    ? ottQuality
    : `${badgeIcon} ${ottQuality}`;

  return {
    categoryType: 'ott',
    featureBadge,
    summaryQuality: `${featureBadge} + HDR · 1 Device Access`,
    deviceCompatibility: '📺 TV, Phone, Tablet & Laptop',
    planPill: `⚡ Instant Delivery • 🛡️ 100% Guarantee • ${featureBadge}`
  };
}
