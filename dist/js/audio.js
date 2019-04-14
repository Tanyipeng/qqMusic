(function($, root) {
  class AudioManage {
    constructor() {
      let audio = new Audio();
      this.audio = audio;
      this.status = 'pause';
    }
    play() {
      this.status = 'playing';
      this.audio.play();
    }
    pause() {
      this.status = 'pause';
      this.audio.pause();
    }
    loadAudio(src) {
      this.status = 'pause';
      this.audio.src = src;
      this.audio.load();
    }
    playTo(time) {
      this.audio.currentTime = time;
    }
  }
  root.audio = new AudioManage();
})(window.Zepto, window.root || (window.root = {}))