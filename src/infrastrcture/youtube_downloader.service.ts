import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs/promises';

import { AudioDownloader } from 'src/application/audio_downloader.service';

export class YouTubeDownloader extends AudioDownloader {
  private readonly outputDirectory = path.resolve(__dirname, '.tmp');

  async downloadAudios(videoUrl: string): Promise<Buffer> {
    const response = await youtubedl(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `${this.outputDirectory}/%(title)s-%(id)s.%(ext)s`,
      printJson: true,
    });

    const filename = `${this.outputDirectory}/${response.title}-${response.id}.mp3`;
    const file = await fs.readFile(filename);

    return file;
  }
}
