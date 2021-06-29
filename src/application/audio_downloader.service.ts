export abstract class AudioDownloader {
  abstract downloadAudios(videoUrl: string): Promise<Buffer>;
}
