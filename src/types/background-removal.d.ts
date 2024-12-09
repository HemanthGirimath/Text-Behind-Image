declare module '@imgly/background-removal-js' {
  export function removeBackground(
    blob: Blob,
    options?: {
      debug?: boolean;
      model?: 'small' | 'medium' | 'large';
      progress?: (progress: number) => void;
      publicPath?: string;
    }
  ): Promise<Blob>;
}
