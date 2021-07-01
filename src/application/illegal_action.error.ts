import { UrlType } from './url_classifier.service';

export class IlligalActionError extends Error {
  constructor(readonly url: string, readonly urlType: UrlType) {
    super(`You can not add "${url}" to the feed, because it's ${urlType}`);
  }
}
