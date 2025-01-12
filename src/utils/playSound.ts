export class SoundHelper {
  private audio: HTMLAudioElement;
  private isPlaying: boolean;

  constructor(soundUrl: string) {
    this.audio = new Audio(soundUrl);
    this.audio.loop = true; // Loop the sound
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0; // Reset playback position
      this.isPlaying = false;
    }
  }
}
