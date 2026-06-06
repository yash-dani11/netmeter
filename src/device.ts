import { DeviceInfo } from "./types";

export const getDevice = (): DeviceInfo => {
  const language = navigator.language;
  const userAgent = navigator.userAgent;
  const platform =
    navigator.userAgentData?.platform ?? navigator.platform ?? "unknown";
  const { brand: browserName, version: browserVersion } =
    navigator.userAgentData?.brands?.[0] ?? {};
  const browser = browserName
    ? {
        name: browserName,
        version: browserVersion ?? "unknown",
      }
    : {
        name: "unknown",
        version: "unknown",
      };

  const pdfViewerEnabled = navigator.pdfViewerEnabled ?? null;
  const device = {
    cores: navigator.hardwareConcurrency ?? null,
    deviceMemory: navigator.deviceMemory ?? null,
  };
  const screen = {
    dpr: window.devicePixelRatio,
    width: window.screen.width,
    height: window.screen.height,
    availableWidth: window.screen.availWidth,
    availableHeight: window.screen.availHeight,
    orientation: window.screen?.orientation?.type ?? null,
    isTouchScreen: (navigator.maxTouchPoints ?? 0) > 0,
    pixelDepth: window.screen.pixelDepth,
    colorDepth: window.screen.colorDepth,
  };

  return {
    screen,
    language,
    browser,
    device,
    platform,
    pdfViewerEnabled,
    userAgent,
  };
};
