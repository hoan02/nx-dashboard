export interface DeviceInfo {
  deviceType: string;
  deviceModel: string;
  deviceVendor: string;
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
  ip: string;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  isValid: boolean;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface SessionResponse {
  message: string;
  result: boolean;
  data: {
    sessions: Session[];
  };
}
