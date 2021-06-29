export abstract class FileUploader {
  abstract upload(file: Buffer, name: string): Promise<string>;
}
