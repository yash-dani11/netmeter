import {
  NetworkMeasureFn,
  NetworkMeasureOptions,
  NetworkSpeedResult,
  PingResult,
} from "./types";
import { DEFAULT_SAMPLE_COUNT, median, withSamples } from "./utils";

/**
 * Measures round-trip latency to a URL.
 *
 * Runs up to `samples` requests and returns the median latency from
 * successful samples only. Failed attempts are skipped; throws if none succeed.
 *
 * @param url - Absolute URL to ping
 * @param options - Measurement options. `samples` defaults to `3`
 * @returns Median latency in milliseconds
 * @throws {Error} If no samples succeed
 */
export const ping: NetworkMeasureFn<PingResult> = async (
  url,
  { samples = DEFAULT_SAMPLE_COUNT }: NetworkMeasureOptions = {},
) => {
  const results = await withSamples(async () => {
    const cacheBustedUrl = new URL(url);
    cacheBustedUrl.searchParams.append(
      "_cacheBuster",
      `${Date.now()}-${Math.random()}`,
    );

    const start = performance.now();
    const response = await fetch(cacheBustedUrl.toString(), {
      cache: "no-store",
      method: "HEAD",
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const end = performance.now();

    return {
      latencyMs: end - start,
    };
  }, samples);

  const successfulResults = results.filter(
    (result): result is PingResult => result !== undefined,
  );

  if (successfulResults.length === 0) {
    throw new Error("All ping samples failed");
  }

  return {
    latencyMs: median(successfulResults.map((result) => result.latencyMs)),
  };
};

/**
 * Measures download speed for a URL.
 *
 * Downloads the response body over up to `samples` attempts and returns the
 * median of each metric from successful samples only. Failed attempts are
 * skipped; throws if none succeed.
 *
 * @param url - Absolute URL to a file used for the speed test
 * @param options - Measurement options. `samples` defaults to `3`
 * @returns Median download metrics (bytes, speeds, duration)
 * @throws {Error} If no samples succeed, the request fails, or streaming is unsupported
 */
export const measureNetworkSpeed: NetworkMeasureFn<NetworkSpeedResult> = async (
  url,
  { samples = DEFAULT_SAMPLE_COUNT }: NetworkMeasureOptions = {},
) => {
  const results = await withSamples(async () => {
    const cacheBustedUrl = new URL(url);
    cacheBustedUrl.searchParams.append(
      "_cacheBuster",
      `${Date.now()}-${Math.random()}`,
    );

    const start = performance.now();
    const response = await fetch(cacheBustedUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Streaming not supported in this browser");
    }

    const reader = response.body.getReader();

    let bytes = 0;
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      if (value) {
        bytes += value.byteLength;
      }
    }

    reader.releaseLock();

    const end = performance.now();

    const durationSec = (end - start) / 1_000;
    const safeDuration = Math.max(durationSec, 0.001);
    const bits = bytes * 8;
    const speedMbps = bits / 1_000_000 / safeDuration;
    const speedMBps = bytes / 1_000_000 / safeDuration;

    return {
      bytes,
      speedMbps,
      speedMBps,
      durationSec,
    };
  }, samples);

  const successfulResults = results.filter(
    (result): result is NetworkSpeedResult => result !== undefined,
  );

  if (successfulResults.length === 0) {
    throw new Error("All network speed samples failed");
  }

  return {
    bytes: median(successfulResults.map((result) => result.bytes)),
    speedMbps: median(successfulResults.map((result) => result.speedMbps)),
    speedMBps: median(successfulResults.map((result) => result.speedMBps)),
    durationSec: median(successfulResults.map((result) => result.durationSec)),
  };
};

export type { NetworkMeasureFn, NetworkMeasureOptions };
