(function($, player, root) {
  class Render {
    constructor(dataList) {
      this.dataList = dataList;
    }
    renderAll(data) {
      this.renderAlbum(data);
      this.renderIsLike(data.isLike);
      this.renderTime(0, '.start-time');
      this.renderTime(data.duration, '.end-time');
    }
    renderAlbum(data) {
      $('.text-wrapper > .song-name').text(data.song);
      $('.text-wrapper > .singer-name').text(data.singer);
      $('.text-wrapper > .album-name').text(data.album);
      let img = new Image();
      img.src = data.image;
      img.onload = () => {
        $('.album-img > img').attr('src', data.image);
        player.blurImg(img, $('body'));
      }
    }
    renderIsLike(isLike) {
      if(isLike) {
        $('.favorite').addClass('isFavorite');
      }else {
        $('.favorite').removeClass('isFavorite');
      }
    }
    renderTime(duration, ele) {
      let time = this.formatTime(duration);
      $(ele).text(time);
    }
    renderPop(dataList) {
      let fragment = document.createDocumentFragment();
      dataList.forEach((data, index) => {
        let div = document.createElement('div');
        div.setAttribute('data-id', index);
        div.innerText = data.song;
        fragment.appendChild(div);
      })
      $('.pop').prepend(fragment);
      this.popH = - 32 * (dataList.length + 1) + 'px';
      $('.pop').css('bottom', this.popH);
      $('.mask').css('display', 'none');
    }
    formatTime(time) {
      let m = Math.floor(time / 60);
      let s = time - m * 60;
      m = m.toString().padStart(2, '0');
      s = s.toString().padStart(2, '0');
      return m + ":" + s;
    }
  }
  root.Render = Render;
})(window.Zepto, window.player || (window.player = {}), window.root || (window.root = {}))