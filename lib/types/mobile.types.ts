export interface PWAConfig {
  name: string
  shortName: string
  description: string
  startUrl: string
  displayMode: 'standalone' | 'minimal-ui' | 'browser' | 'fullscreen'
  backgroundColor: string
  themeColor: string
  icons: PWAIcon[]
  screenshots: PWAScreenshot[]
  categories: string[]
  shortcuts: PWAShortcut[]
}

export interface PWAIcon {
  src: string
  sizes: string
  type: string
  purpose: 'any' | 'monochrome' | 'maskable'
}

export interface PWAScreenshot {
  src: string
  sizes: string
  type: string
  formFactor: 'narrow' | 'wide'
}

export interface PWAShortcut {
  name: string
  shortName: string
  description?: string
  url: string
  icons?: PWAIcon[]
}

export interface OfflineData {
  orderId: string
  lastSyncAt: Date
  data: Record<string, any>
  status: 'synced' | 'pending' | 'failed'
}

export interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  cls: number // Cumulative Layout Shift
  fid: number // First Input Delay
  ttfb: number // Time to First Byte
  tti: number // Time to Interactive
  tbt: number // Total Blocking Time
}

export interface LighthouseReport {
  url: string
  timestamp: Date
  metrics: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
    pwa: number
  }
  opportunities: Array<{
    id: string
    title: string
    savings: number
    description: string
  }>
  diagnostics: Array<{
    id: string
    title: string
    description: string
    items: string[]
  }>
}

export interface NetworkOptimization {
  enableCompressionLevel: 'gzip' | 'brotli'
  enableCaching: boolean
  cacheStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate'
  enableCDN: boolean
  enableImageOptimization: boolean
  enableCodeSplitting: boolean
  enableLazyLoading: boolean
}

export interface ResponsiveLayout {
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
    wide: number
  }
  columns: {
    mobile: number
    tablet: number
    desktop: number
    wide: number
  }
  spacing: {
    compact: number
    comfortable: number
    spacious: number
  }
}

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean
  enableScreenReaderSupport: boolean
  enableHighContrast: boolean
  enableFontSizeAdjustment: boolean
  enableAnimationReduction: boolean
  enableFocusIndicators: boolean
  wcagLevel: 'A' | 'AA' | 'AAA'
}

export interface MobileOptimization {
  enableTouchFriendlyUI: boolean
  touchTargetSize: number // em pixels
  enableGestureSupport: boolean
  gestures: Array<'swipe' | 'pinch' | 'long-press' | 'double-tap'>
  enableVibrationFeedback: boolean
  enableHapticFeedback: boolean
  enableOrientationLock: 'portrait' | 'landscape' | 'auto'
}

export interface CacheStrategy {
  apiCacheDuration: number // em ms
  imageCacheDuration: number
  pageSize: number
  maxCacheSize: number // em MB
  preloadCriticalResources: string[]
}
