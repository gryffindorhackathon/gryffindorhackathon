var bestUI = angular.module('bestUI', ['ngRoute', 'kendo.directives']).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);

bestUI.controller('BestUIController', ['$scope', function ($scope) {
  $scope.greeting = 'Hola!';
  $scope.treeData = new kendo.data.HierarchicalDataSource({
    data: [
      {text: "Item 1"},
      {
        text: "Item 2", items: [
        {text: "SubItem 2.1"},
        {text: "SubItem 2.2"}
      ]
      },
      {text: "Item 3"}
    ]
  });

  $scope.click = function (dataItem) {
    alert(dataItem.text);
  };

  function makeItem() {
    var txt = kendo.toString(new Date(), "HH:mm:ss");
    return {text: txt};
  };

  $scope.addAfter = function (item) {
    var array = item.parent();
    var index = array.indexOf(item);
    var newItem = makeItem();
    array.splice(index + 1, 0, newItem);
  };

  $scope.addBelow = function () {
    // can't get this to work by just modifying the data source
    // therefore we're using tree.append instead.
    var newItem = makeItem();
    $scope.tree.append(newItem, $scope.tree.select());
  };

  $scope.remove = function (item) {
    var array = item.parent();
    var index = array.indexOf(item);
    array.splice(index, 1);

    $scope.selectedItem = undefined;
  };
}]);
$("#horizontal").kendoSplitter({
  panes: [
    {collapsible: true},
    {collapsible: false},
    {collapsible: true}
  ]
});

$("#vertical-left").kendoSplitter({
  orientation: "vertical",
  panes: [
    {collapsible: false, size: "100px"},
    {collapsible: false, size: "100px"}
  ]
});
$("#vertical-center").kendoSplitter({
  orientation: "vertical",
  panes: [
    {collapsible: false, size: "100px"},
    {collapsible: false, size: "100px"}
  ]
});

var sc = "function validateField(fieldValue){\n\n}";
var code = document.getElementById("code");
var editor = CodeMirror(code, {
  value: (sc),
  lineNumbers: true,
  mode: "javascript",
  matchBrackets: {bothBrackets: true},
  highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
});
var widgets = [];
function updateHints() {
  editor.operation(function () {
    for (var i = 0; i < widgets.length; ++i) {
      editor.removeLineWidget(widgets[i]);
    }
    widgets.length = 0;

    JSHINT(editor.getValue());
    for (var i = 0; i < JSHINT.errors.length; ++i) {
      var err = JSHINT.errors[i];
      if (!err) {
        continue;
      }
      var msg = document.createElement("div");
      var icon = msg.appendChild(document.createElement("span"));
      icon.innerHTML = "!!";
      icon.className = "lint-error-icon";
      msg.appendChild(document.createTextNode(err.reason));
      msg.className = "lint-error";
      widgets.push(editor.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
    }
  });
  var info = editor.getScrollInfo();
  var after = editor.charCoords({line: editor.getCursor().line + 1, ch: 0}, "local").top;
  if (info.top + info.clientHeight < after) {
    editor.scrollTo(null, after - info.clientHeight + 3);
  }
}

var waiting;
editor.on("change", function () {
  clearTimeout(waiting);
  waiting = setTimeout(updateHints, 500);
});

setTimeout(updateHints, 100);

