# netmeter

Lightweight browser utilities for measuring network performance and collecting device information.

Use **netmeter** when you need simple, typed helpers for latency checks, download speed tests, and a structured snapshot of the user's device — without pulling in a heavy analytics SDK.

## Features

- **Ping / latency** — measure round-trip time (3 samples by default, median result)
- **Download speed** — measure throughput in Mbps and MB/s (3 samples by default, median result)
- **Device info** — screen, browser, platform, and hardware details
- **TypeScript-first** — exported types for all return values
- **Zero runtime dependencies**

## Requirements

- A browser environment
- For network helpers: a URL you control (or trust) that is reachable from your page

## Installation

```bash
npm install netmeter
```

```bash
pnpm add netmeter
```

```bash
yarn add netmeter
```

## Quick start

```ts
import { getDevice, ping, measureNetworkSpeed } from "netmeter";

// Device snapshot (synchronous)
const device = getDevice();
console.log(device.platform, device.screen.width, device.browser.name);

// Latency (milliseconds). Default: 3 samples, returns median.
const { latencyMs } = await ping("https://example.com/favicon.ico");

// Download speed. Default: 3 samples, returns median.
const speed = await measureNetworkSpeed(
  "https://example.com/assets/test-file.bin",
);
console.log(speed.speedMbps, speed.speedMBps, speed.bytes, speed.durationSec);
```

## API

### `getDevice()`

Returns a snapshot of device and browser information.

```ts
import { getDevice } from "netmeter";

const info = getDevice();
```

**Returns:** `DeviceInfo`

---

### `ping(url, options)`

Measures round-trip latency to a URL. Runs multiple samples and returns the median latency. **`samples` defaults to `3`.**

```ts
import { ping } from "netmeter";

const result = await ping("https://example.com/ping");
// { latencyMs: 42.5 }

// Override sample count
await ping("https://example.com/ping", { samples: 5 });
```

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `url`     | `string` | Absolute URL to ping |
| `options.samples` | `number` (optional) | Number of samples to run. **Default: `3`** |

**Returns:** `Promise<PingResult>`

**Throws:** `Error` if all samples fail.

---

### `measureNetworkSpeed(url, options)`

Measures download speed for a URL. Runs multiple samples and returns the median of each value. **`samples` defaults to `3`.**

```ts
import { measureNetworkSpeed } from "netmeter";

const result = await measureNetworkSpeed("https://example.com/speed-test.bin");
// { bytes: 1048576, speedMbps: 12.4, speedMBps: 1.55, durationSec: 0.84 }

// Override sample count
await measureNetworkSpeed("https://example.com/speed-test.bin", { samples: 5 });
```

| Parameter | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| `url`     | `string` | Absolute URL to a file used for the speed test |
| `options.samples` | `number` (optional) | Number of samples to run. **Default: `3`** |

**Returns:** `Promise<NetworkSpeedResult>`

**Throws:** `Error` if all samples fail.

## Types

```ts
import type {
  DeviceInfo,
  NetworkSpeedResult,
  PingResult,
} from "netmeter";
```

### `PingResult`

| Field       | Type     | Description              |
| ----------- | -------- | ------------------------ |
| `latencyMs` | `number` | Round-trip latency in ms |

### `NetworkSpeedResult`

| Field         | Type     | Description                     |
| ------------- | -------- | ------------------------------- |
| `bytes`       | `number` | Total bytes downloaded          |
| `speedMbps`   | `number` | Download speed in megabits/sec  |
| `speedMBps`   | `number` | Download speed in megabytes/sec |
| `durationSec` | `number` | Download duration in seconds    |

### `DeviceInfo`

| Field              | Type              | Description                                  |
| ------------------ | ----------------- | -------------------------------------------- |
| `userAgent`        | `string`          | Raw browser user agent string                |
| `language`         | `string`          | Browser language (e.g. `"en-US"`)            |
| `platform`         | `string`          | OS / platform string                         |
| `pdfViewerEnabled` | `boolean \| null` | PDF viewer support, or `null` if unavailable |
| `browser`          | `object`          | `{ name: string; version: string }`          |
| `device`           | `object`          | `{ cores: number \| null; deviceMemory: number \| null }` |
| `screen`           | `object`          | See below                                    |

**`screen` fields**

| Field             | Type             | Description                          |
| ----------------- | ---------------- | ------------------------------------ |
| `dpr`             | `number`         | Device pixel ratio                   |
| `width`           | `number`         | Screen width in pixels               |
| `height`          | `number`         | Screen height in pixels              |
| `availableWidth`  | `number`         | Width excluding OS UI chrome         |
| `availableHeight` | `number`         | Height excluding OS UI chrome        |
| `orientation`     | `string \| null` | e.g. `"portrait-primary"`, or `null` |
| `isTouchScreen`   | `boolean`        | Whether touch input is available     |
| `pixelDepth`      | `number`         | Screen pixel depth                   |
| `colorDepth`      | `number`         | Screen color depth                   |

## Usage notes

### Choosing a speed-test URL

Use a static file on your own origin or CDN. Larger files tend to give more stable results.

### CORS

The target URL must be reachable from your page (same-origin, or cross-origin with CORS allowed).

### Accuracy

Both `ping` and `measureNetworkSpeed` accept an optional `samples` option (**default: `3`**). Each runs multiple measurements and returns the median to reduce noise from fluctuating network conditions.

### Privacy

Only collect and share device data your users have agreed to.

## License

[MIT](LICENSE) — see the `LICENSE` file for details.
