  require("whatwg-fetch");
  Promise = require("promise");
  var _ = require('lodash');

  var config = require("../config");
  var BookViewer = require("./BookViewer");


  function openBook(book) {
    BookViewer.init(book);
    BookViewer.OpenPage(0);
  }


  function httpGet(url, cb) {
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        // console.log('response: ', json);
        cb(false, json);
      }).catch(function(ex) {
        console.log('error: ', ex);
        cb(ex);
      });
  }

  function ClickBook(id, page) {
    httpGet(config.settings.api + '/api.php?action=load&id=' + id, function (err, data) {
      if (err) {
        alert(err);
      }
      else {
        openBook(data.book);
        page.close();
      }
    });
  }


  module.exports.work = function () {
    httpGet(config.settings.api + '/api.php?action=list', function (err, data) {
      if (err) {
        alert(err);
      }
      else {

        var page = tabris.create("Page", {
          title: "Перелік видань",
          topLevel: true
        });


        var title = tabris.create("TextView", {
          layoutData: {left: 10, top: 10, right: 10},
          text: "Оберіть видання з переліку доступних:",
          alignment: "center"
        }).appendTo(page);


        var Collection = tabris.create("CollectionView", {
          layoutData: {left: 0, top: ['prev()', 10], right: 0, bottom: 0},
          items: data.list,
          itemHeight: 64,
          initializeCell: function(cell) {

            /*
            var imageView = tabris.create("ImageView", {
              layoutData: {top: 16, centerX: 0, width: 200, height: 200}
            }).appendTo(cell);
            */

            var nameTextView = tabris.create("TextView", {
              layoutData: {left: 16, top: 8, right: 8},
              alignment: "left"
            }).appendTo(cell);

            cell.on("change:item", function(widget, book) {
              // imageView.set("image", {src: person.image});
              nameTextView.set("text", '' + book.id + '. ' + book.title);
            });

          }
        }).on("select", function(target, book) {
          title.set('visible', false);
          Collection.set('visible', false);

          var loading = tabris.create("TextView", {
            layoutData: {centerX: 0, centerY: 0},
            text: 'Завантажуеться видання №' + book.id + '.. <br/> <b>' + book.title + '</b>',
            markupEnabled: true,
            alignment: "center"
          }).appendTo(page);



          ClickBook(book.id, page);
        }).appendTo(page);

        page.open();


      }
    });



  };
