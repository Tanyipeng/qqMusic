(function ($, root) {
  let url = '../mock/data.json';
  $.ajax({
    type: 'GET',
    url,
    success(data) {
      console.log(data);
      let render = new root.Render(data);
      render.renderAll(data[0]);
      let audio = root.audio;
      audio.loadAudio(data[0].audio);
      let bindevent = new root.BindEvent(0, data, render);
      new root.Pop(data, bindevent, render);
      $('.wrapper').removeClass('hide');
    },
    error(err) {
      throw err;
    }
  })
})(window.Zepto, window.root || (window.root = {}))