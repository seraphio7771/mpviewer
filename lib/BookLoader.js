  var _ = require('lodash');

  var config = require("../config");
  var BookViewer = require("./BookViewer");


  function openBook(book) {
    BookViewer.init(book);
    BookViewer.OpenPage(0);
  }

  function httpRequest(method, url, cb) {
    var xhr = new tabris.XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === xhr.DONE) {
        cb(null, JSON.parse(xhr.responseText));
      }
    };
    xhr.open(method, url);
    xhr.send();
  }

  function ClickBook(url, page) {
    var children = page.children();

    children[2].set('visible', true);
    children[2].set('text', 'Завантаження..');

    httpRequest('GET', url, function (err, data) {
      children[2].set('visible', false);

      if (err) {
        children[1].set('visible', true);
        alert(err);
      }
      else {
        children[2].set('visible', true);
        children[2].set('text', 'Відкриття..');

        data.book.api = parseAPIUrl(url);
        openBook(data.book);
        if (page) {
          page.close();
        }
      }
    });
  }

  function parseAPIUrl(url) {
    var m = url.match(/(^.+)api\.php/);
    return m[1];
  }

  function scanCode(cb) {
    cordova.plugins.barcodeScanner.scan(function(result) {
      cb(null, result);
    }, function(error) {
      cb(error, null);
    });
  }

  function scanStart(page) {
    var children = page.children();

    children[1].set('visible', false);
    children[2].set('visible', true);
    children[2].set('text', 'Сканування..');

    scanCode(function (err, res) {
      children[2].set('visible', false);

      if (err) {
        children[1].set('visible', true);
        alert(err);
      }
      else if (res.text) {
        ClickBook(res.text, page);
      }
      else {
        children[1].set('visible', true);
      }
    });
  }


  module.exports.work = function () {
    tabris.ui.set({
      background: "#444",
      textColor: "#ccc"
    });

    var page = tabris.create("Page", {
      title: "Переглядач видань MobPress",
      background: "#d5edfd",
      topLevel: true
    });

    var logo = tabris.create("ImageView", {
      layoutData: {left: 50, top: "15%", right: 50},
      image: {src: "img/logoApp.png"},
      scaleMode: "fit"
    }).appendTo(page);

    var btn = tabris.create("Button", {
      text: "Сканувати QR код",
      background: "#337ab7",
      textColor: "white",
      layoutData: {centerX: 0, bottom: 20}
    }).appendTo(page);

    btn.on("select", function() {
      scanStart(page);
    });

    var text = tabris.create("TextView", {
      font: "24px",
      textColor: "#337ab7",
      text: "",
      visible: false,
      layoutData: {centerX: 0, bottom: 20}
    }).appendTo(page);

    page.open();
  };
