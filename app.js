var config = require("./config");

if ("release" == config.settings.operation_mode) {
  var book = require("./book");
  var BookViewer = require("./lib/BookViewer");

  BookViewer.init(book);
  BookViewer.OpenPage(0);
}
else {
  var BookLoader = require("./lib/BookLoader");
  BookLoader.work();
}







