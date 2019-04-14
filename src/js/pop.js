(function($, root) {
  class Pop {
    constructor(dataList, bindevent, render) {
      this.dataList = dataList;
      this.bindevent = bindevent;
      this.render = render;
      this.render.renderPop(this.dataList);
      this.bindevent.bindPlayList();
      this.bindDiv();
      this.bindMask();
    }
    bindDiv() {
      $('.pop').on('click', e => {
        let target = e.target;
        if($(target).attr('data-id')) {
          let id = $(target).attr('data-id');
          this.bindevent.nowIndex = parseInt(id);
          this.bindevent.init();
        }
        this.backToBottom();
      })
    }
    bindMask() {
      $('.mask').on('click', () => {
        this.backToBottom();
      })
    }
    backToBottom() {
      $('.pop').css('bottom', this.render.popH);
      $('.mask').css('display', 'none');
    }
  }
  root.Pop = Pop;
})(window.Zepto, window.root || (window.root = {}))