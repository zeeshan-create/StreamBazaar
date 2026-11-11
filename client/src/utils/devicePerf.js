/**
 * StreamBazaar Device Capability & Performance Engine
 * Automatically analyzes hardware specifications (CPU cores, RAM, GPU/OS)
 * and adapts animation speeds, rendering paths, and compositing layers.
 */

export const detectDeviceCapability = () => {
  if (typeof window === 'undefined') {
    return { tier: 'mid', isLowEnd: false, isAndroid: false, isIOS: false, cores: 4, memory: 4 };
  }

  const nav = window.navigator || {};
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const ua = nav.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On Android devices with budget specs (<= 4 cores OR <= 4GB RAM),
  // backdrop-filter and dynamic box-shadows cause frame drops (lag).
  const isLowEnd = cores <= 4 || memory <= 4 || prefersReducedMotion;
  const tier = (cores >= 8 && memory >= 8 && !prefersReducedMotion) ? 'high' : (isLowEnd ? 'low' : 'mid');

  return {
    cores,
    memory,
    isAndroid,
    isIOS,
    isLowEnd,
    tier,
    animationDuration: isLowEnd || isAndroid ? 0.08 : 0.14
  };
};

export const applyDevicePerformanceAttributes = () => {
  if (typeof document === 'undefined') return;
  const cap = detectDeviceCapability();
  const root = document.documentElement;

  root.dataset.deviceTier = cap.tier;
  if (cap.isAndroid) root.dataset.isAndroid = 'true';
  if (cap.isLowEnd) root.dataset.isLowEnd = 'true';
  if (cap.isIOS) root.dataset.isIos = 'true';

  return cap;
};
