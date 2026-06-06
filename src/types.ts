export interface PingResult {
  /** Latency of the request in milliseconds (HTTP round-trip time) */
  latencyMs: number;
}

/** Options shared by `ping` and `measureNetworkSpeed`. */
export interface NetworkMeasureOptions {
  /** Number of samples to run. Default: `3`. */
  samples?: number;
}

/** Function signature for network measurement helpers. */
export type NetworkMeasureFn<T> = (
  url: string,
  options?: NetworkMeasureOptions,
) => Promise<T>;

export interface NetworkSpeedResult {
  /** Total bytes downloaded during the request */
  bytes: number;

  /** Download speed in megabits per second (Mbps) */
  speedMbps: number;

  /** Download speed in megabytes per second (MB/s) */
  speedMBps: number;

  /** Duration of the download in seconds */
  durationSec: number;
}

export interface DeviceInfo {
  /** Screen-related information */
  screen: {
    /** Device pixel ratio */
    dpr: number;

    /** Screen width in pixels */
    width: number;

    /** Screen height in pixels */
    height: number;

    /** Available screen width (excluding OS UI) */
    availableWidth: number;

    /** Available screen height (excluding OS UI) */
    availableHeight: number;

    /**
     * Screen orientation type (e.g. "portrait-primary", "landscape-primary")
     * May be null in unsupported browsers
     */
    orientation: string | null;

    /** Whether device has touch capability */
    isTouchScreen: boolean;

    /** Screen pixel depth */
    pixelDepth: number;

    /** Screen color depth */
    colorDepth: number;
  };

  /** Browser language (e.g. "en-US") */
  language: string;

  /** Browser information */
  browser: {
    /** Browser name (from UA Client Hints or fallback) */
    name: string;

    /** Browser version (or "unknown" if not available) */
    version: string;
  };

  /** Hardware-related device information */
  device: {
    /** Number of logical CPU cores (or null if unavailable) */
    cores: number | null;

    /** Approximate device memory in GB (or null if unavailable) */
    deviceMemory: number | null;
  };

  /**
   * Platform information (OS / architecture)
   * Preferably from UA Client Hints when available
   */
  platform: string;

  /**
   * Whether PDF viewer is enabled in the browser
   * May be null in unsupported browsers
   */
  pdfViewerEnabled: boolean | null;

  /** Raw browser user agent string */
  userAgent: string;
}