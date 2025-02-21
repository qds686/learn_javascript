// document.write(123); // Failed to execute 'write' on 'Document': It isn't possible to write into a document from an asynchronously-loaded external script unless it is explicitly opened.

window.onload = function () {
  document.write(123); // 123
}