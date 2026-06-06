interface NavigatorUADataBrand {
  brand: string;
  version: string;
}

interface NavigatorUAData {
  readonly brands: NavigatorUADataBrand[];
  readonly mobile: boolean;
  readonly platform: string;
}

interface Navigator {
  readonly userAgentData?: NavigatorUAData;
  readonly deviceMemory?: number;
}
