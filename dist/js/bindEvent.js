(function($, root, window) {
  class BindEvent {
    constructor(nowIndex, dataList, render) {
      this.nowIndex = nowIndex;
      this.dataList = dataList;
      this.len = dataList.length;
      this.render = render;
      this.audio = root.audio;
      this.deg = 0;
      this.timer = null;
      this._timer = null;
      this.startTime = 0;
      this.endTime = 0;
      this.allTime = 0;
      this.pro = 0;
      this.nowWidth = 0;
      this.nowPageX = 0;
      this.nextPageX = 0;
      this.bindIsLike();
      this.bindPrev();
      this.bindPlay();
      this.bindNext();
      this.bindSpot();
    }
    bindIsLike() {
      $('.favorite').on('click', () => {
        let nowData = this.dataList[this.nowIndex];
        nowData.isLike = !nowData.isLike;
        nowData.isLike
          ? $('.favorite').addClass('isFavorite')
          : $('.favorite').removeClass('isFavorite');
      });
    }
    bindPrev() {
      $('.prev').on('click', () => {
        this.checkNext(-1);
      });
    }
    bindPlay() {
      let _this = this;
      $('.play').on('click', function() {
        $(this).toggleClass('playing');
        if (_this.audio.status === 'pause') {
          _this.audio.play();
          _this.rotateImg('play');
          _this.moveSpot('play');
        } else {
          _this.audio.pause();
          _this.rotateImg('pause');
          _this.moveSpot('pause');
        }
      });
    }
    bindNext() {
      $('.next').on('click', () => {
        this.checkNext(1);
      });
    }
    bindPlayList() {
      $('.song-list').on('click', () => {
        $('.pop').css('bottom', '0');
        $('.mask').css('display', 'block');
      })
    }
    bindSpot() {
      $('.spot').on('touchstart', e => {
        if (this.audio.status === 'playing') {
          this.audio.pause();
          this.rotateImg('pause');
          this.moveSpot('pause');
          $('.play').removeClass('playing');
        }
        this.lineWidth = $('.time-progress-line').width();
        this.nowWidth = this.lineWidth * this.pro;
        this.nowPageX = page(e, 'X');
      });
      $('.spot').on('touchmove', e => {
        this.nextPageX = page(e, 'X');
        let result = this.nextPageX - this.nowPageX;
        this.nowPageX = this.nextPageX;
        this.nowWidth += result;
        this.pro = this.nowWidth / this.lineWidth;
        this.pro = this.pro < 0 ? 0 : this.pro > 1 ? 1 : this.pro;
        this.allTime = this.dataList[this.nowIndex].duration * this.pro;
        this.spotGo();
        this.render.renderTime(Math.floor(this.allTime), '.start-time');
      });
      $('.spot').on('touchend', () => {
        this.audio.playTo(this.allTime);
        if (this.audio.status === 'pause') {
          this.audio.play();
          this.rotateImg('play');
          this.moveSpot('play');
          $('.play').addClass('playing');
        }
      });
    }
    checkNext(num) {
      this.nowIndex += num;
      this.nowIndex = (this.nowIndex + this.len) % this.len;
      this.init();
    }
    init() {
      this.deg = 0;
      this.allTime = 0;
      $('.play').removeClass('playing');
      this.render.renderAll(this.dataList[this.nowIndex]);
      this.audio.loadAudio(this.dataList[this.nowIndex].audio);
      window.clearInterval(this.timer);
      window.cancelAnimationFrame(this._timer);
      $('.album-wrapper').css({
        transition: 'none',
        transform: `rotateZ(0deg)`
      });
      this.pro = 0;
      this.spotGo();
    }
    rotateImg(flag) {
      let _flag = flag === 'play';
      if (_flag) {
        $('.album-wrapper').css('transition', 'transform .2s ease-out');
        this.timer = window.setInterval(() => {
          this.deg += 2;
          $('.album-wrapper').css('transform', `rotateZ(${this.deg}deg)`);
        }, 200);
      } else {
        $('.album-wrapper').css('transition', 'none');
        window.clearInterval(this.timer);
      }
    }
    moveSpot(flag) {
      let _flag = flag === 'play';
      if (_flag) {
        let data = this.dataList[this.nowIndex];
        this.startTime = window.Date.now();
        let _this = this;
        function go() {
          _this._timer = window.requestAnimationFrame(() => {
            _this.endTime = window.Date.now();
            _this.allTime += (_this.endTime - _this.startTime) / 1000;
            _this.startTime = _this.endTime;
            if (_this.allTime >= data.duration) {
              _this.checkNext(1);
              if (_this.audio.status === 'pause') {
                _this.audio.play();
                _this.rotateImg('play');
                _this.moveSpot('play');
                $('.play').addClass('playing');
              }
            }
            _this.pro = _this.allTime / data.duration;
            _this.spotGo();
            _this.render.renderTime(Math.floor(_this.allTime), '.start-time');
            go();
          });
        }
        go();
      } else {
        window.cancelAnimationFrame(this._timer);
      }
    }
    spotGo() {
      let newPro = (this.pro - 1) * 100 + '%';
      $('.time-progress-line-spot').css('transform', `translateX(${newPro})`);
    }
  }
  function page(e, o) {
    return (
      e.targetTouches[0][`page${o}`] - 60 ||
      e.targetTouches[0][`client${o}`] - 60
    );
  }
  root.BindEvent = BindEvent;
})(window.Zepto, window.root || (window.root = {}), window);
