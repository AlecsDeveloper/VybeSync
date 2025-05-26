export type QueueItem = {
  videoId: string;
  albumId: string;
};

export default class QueueAPI {
  private static QueueArray: QueueItem[] = [];
  private static CurrentElement: QueueItem | null = null;

  static addToQueue(item: QueueItem): void {
    this.QueueArray.push(item);
  }

  static addBulkToQueue(items: QueueItem[]): void {
    this.QueueArray.push(...items);
  }

  static initQueue(): void {
    if (this.QueueArray.length === 0) return;

    this.CurrentElement = this.QueueArray[0];
    this.pushCurrentToPlayer();
  }

  static removeFromQueue(videoId: string): void {
    this.QueueArray = this.QueueArray.filter(item => item.videoId !== videoId);

    if (this.CurrentElement?.videoId === videoId) {
      this.CurrentElement = null;
    }
  }

  static clearQueue(): void {
    this.QueueArray = [];
    this.CurrentElement = null;
  }

  static getCurrentIndex(): number {
    if (!this.CurrentElement) return -1;
    return this.QueueArray.findIndex(item => item.videoId === this.CurrentElement!.videoId);
  }

  static getNextInTheQueue(repeat = false): QueueItem | null {
    const index = this.getCurrentIndex();
    if (index === -1) return null;

    if (index === this.QueueArray.length - 1) {
      return repeat ? this.QueueArray[0] : null;
    }

    return this.QueueArray[index + 1];
  }

  static getPrevInTheQueue(repeat = false): QueueItem | null {
    const index = this.getCurrentIndex();
    if (index === -1) return null;

    if (index === 0) {
      return repeat ? this.QueueArray[this.QueueArray.length - 1] : null;
    }

    return this.QueueArray[index - 1];
  }

  static playNext(repeat = false): void {
    const next = this.getNextInTheQueue(repeat);
    if (!next) return;

    this.CurrentElement = next;
    this.pushCurrentToPlayer();
  }

  static playPrev(repeat = false): void {
    const prev = this.getPrevInTheQueue(repeat);
    if (!prev) return;

    this.CurrentElement = prev;
    this.pushCurrentToPlayer();
  }

  static pushCurrentToPlayer(): void {
    if (!this.CurrentElement) return;
    window.electron.ipcRenderer.invoke("song:pushSong", [
      this.CurrentElement.videoId,
      this.CurrentElement.albumId || "",
    ]);
  }

  static getQueue(): QueueItem[] {
    return [...this.QueueArray];
  }

  static getCurrent(): QueueItem | null {
    return this.CurrentElement;
  }
}