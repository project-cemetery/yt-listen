import youtubedl from 'youtube-dl-exec';
import path from 'path';
import fs from 'fs/promises';

import {
  AudioDownloader,
  DownloadedAudio,
} from 'src/application/audio_downloader.service';

export class YouTubeDownloader extends AudioDownloader {
  private readonly outputDirectory = path.resolve(__dirname, '.tmp');

  async downloadAudios(videoUrl: string): Promise<DownloadedAudio> {
    const response = await youtubedl(videoUrl, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `${this.outputDirectory}/%(id)s.%(ext)s`,
      printJson: true,
      noPlaylist: true,
    });

    const filename = `${this.outputDirectory}/${response.id}.mp3`;
    const file = await fs.readFile(filename);
    await fs.unlink(filename);

    return {
      buffer: file,
      author: response.channel,
      title: response.title,
      description: response.description,
    };
  }
}
