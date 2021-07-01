import { Injectable } from '@nestjs/common';

export enum UrlType {
  Video = 'video',
  Paylist = 'playlist',
  Channel = 'channel',
}

@Injectable()
export class UrlClassifier {
  extract(str?: string): string | null {
    const url = str?.match(/https:\/\/\S+/i)?.[0];

    return url ?? null;
  }

  whatIsIt(url: string): UrlType {
    if (url.includes('/playlist?')) {
      return UrlType.Paylist;
    }

    if (url.includes('/channel/')) {
      return UrlType.Channel;
    }

    return UrlType.Video;
  }
}
