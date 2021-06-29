export interface DownloadedAudio {
  buffer: Buffer;
  author: string;
  title: string;
  description: string;
}

export abstract class AudioDownloader {
  abstract downloadAudios(videoUrl: string): Promise<DownloadedAudio>;
}
