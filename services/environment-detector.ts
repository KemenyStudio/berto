export interface EnvironmentInfo {
  isLocal: boolean;
  isVercel: boolean;
  canAccessLocalFiles: boolean;
}

export class EnvironmentDetector {
  private static instance: EnvironmentDetector;
  private environmentInfo: EnvironmentInfo;

  private constructor() {
    this.environmentInfo = this.detectEnvironment();
  }

  public static getInstance(): EnvironmentDetector {
    if (!EnvironmentDetector.instance) {
      EnvironmentDetector.instance = new EnvironmentDetector();
    }
    return EnvironmentDetector.instance;
  }

  private detectEnvironment(): EnvironmentInfo {
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
    const isLocal = !isVercel && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);
    
    return {
      isLocal,
      isVercel,
      canAccessLocalFiles: isLocal
    };
  }

  public getEnvironmentInfo(): EnvironmentInfo {
    return { ...this.environmentInfo };
  }

  public canAccessLocalFiles(): boolean {
    return this.environmentInfo.canAccessLocalFiles;
  }

  public isRemoteDeployment(): boolean {
    return this.environmentInfo.isVercel;
  }

  public shouldUseFileUpload(): boolean {
    return this.isRemoteDeployment();
  }
}

export const environmentDetector = EnvironmentDetector.getInstance(); 