var bestUI = angular.module('bestUI', ['ngRoute', 'kendo.directives', 'cfp.hotkeys'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

bestUI.controller('BestUIController', ['$scope', 'hotkeys', function ($scope, hotkeys) {

  $scope.showCodeEditor = function () {
    $scope.editingCode = true;
  };

  $scope.closeCodeEditor = function () {
    $scope.editingCode = false;
  };

  hotkeys.add({
    combo: '1',
    description: 'Go to First Screen',
    callback: function(){
      $("#tabstrip > ul > li:nth-child(1) > span.k-link").click();
    }
  });
  hotkeys.add({
    combo: '2',
    description: 'Go to Cardholder Screen',
    callback: function(){
      $("#tabstrip > ul > li:nth-child(2) > span.k-link").click();
    }
  });
  hotkeys.add({
    combo: '3',
    description: 'Go to Summary Screen',
    callback: function(){
      $("#tabstrip > ul > li:nth-child(3) > span.k-link").click();
    }
  });

  hotkeys.add({
    combo: 'v',
    description: 'Open validation script editor',
    callback: $scope.showCodeEditor
  });

  hotkeys.add({
    combo: 'esc',
    description: 'Close validation script editor',
    callback: $scope.closeCodeEditor
  });

  $scope.treeData = new kendo.data.HierarchicalDataSource({
    data: [
      {
        text: "Addresses dictionary",
        type: "Dictionary",
        systemCode: "addressesDictionary"
      },
      {
        text: "Card Holder",
        systemCode: "cardHolder",
        type: "Class Instance",
        items: [
          {
            text: "Name",
            systemCode: "name",
            type: "Text"
          },
          {
            text: "Surname",
            systemCode: "surname",
            type: "Text"
          },
          {
            text: "Age",
            systemCode: "age",
            type: "number"
          },
          {
            text: "Gender",
            systemCode: "gender",
            type: "Dictionary"
          },
          {
            text: "Address", items: [
            {text: "Street name"},
            {text: "City"},
            {text: "Zip Code"}
          ]
          },
          {text: "Smoker"}
        ]
      },
      {
        text: "Packages",
        type: "advancedQuotation",
        systemCode: "packages",
        items: [
          {
            text: "Visa Gold",
            type: "Quotation option",
            systemCode: "visaGold"
          },
          {
            text: "Visa Silver",
            type: "Quotation option",
            systemCode: "visaGold"
          }
        ]
      },
      {text: "Policy Header"},
      {text: "Policy holder"},
      {text: "Risks"},
      {text: "Quotation"}
    ]
  });

  $scope.firstScreen = new kendo.data.HierarchicalDataSource({
    data: [
      {text: "First screen label label"},
      {
        text: "Section", items: [
        {text: "Slider"},
        {text: "Number"}
      ]
      },
      {text: "Next"}
    ]
  });
  $scope.cardholder = new kendo.data.HierarchicalDataSource({
    data: [
      {text: "Cardholder label"},
      {
        text: "Section", items: [
        {text: "Text"},
        {text: "Number"}
      ]
      },
      {
        text: "Group", items: [
        {text: "Dictionary"},
        {text: "Number"}
      ]
      },
      {text: "Prev"},
      {text: "Next"}
    ]
  });
  $scope.summaryScreen = new kendo.data.HierarchicalDataSource({
    data: [
      {text: "Summary screen label"},
      {text: "Prev"}
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

  $scope.resetData = function () {
    $scope.treeData = new kendo.data.HierarchicalDataSource({
      data: [
        {
          text: "Addresses dictionary",
          type: "Dictionary",
          systemCode: "addressesDictionary"
        },
        {
          text: "Card Holder",
          systemCode: "cardHolder",
          type: "Class Instance",
          items: [
            {
              text: "Name",
              systemCode: "name",
              type: "Text"
            },
            {
              text: "Surname",
              systemCode: "surname",
              type: "Text"
            },
            {
              text: "Age",
              systemCode: "age",
              type: "number"
            },
            {
              text: "Gender",
              systemCode: "gender",
              type: "Dictionary"
            },
            {
              text: "Address", items: [
              {text: "Street name"},
              {text: "City"},
              {text: "Zip Code"}
            ]
            },
            {text: "Smoker"}
          ]
        },
        {
          text: "Packages",
          type: "advancedQuotation",
          systemCode: "packages",
          items: [
            {
              text: "Visa Gold",
              type: "Quotation option",
              systemCode: "visaGold"
            },
            {
              text: "Visa Silver",
              type: "Quotation option",
              systemCode: "visaGold"
            }
          ]
        },
        {text: "Policy Header"},
        {text: "Policy holder"},
        {text: "Risks"},
        {text: "Quotation"}
      ]
    });
  };

  var waiting;
  $scope.activateHints = function(){

    editor.on("change", function () {
      clearTimeout(waiting);
      waiting = setTimeout(updateHints, 500);
    });
    updateHints();
  };

  $scope.updateHints = function () {
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

}]);

$("#horizontal").kendoSplitter({
  panes: [
    {collapsible: true, size:'20%'},
    {collapsible: false},
    {collapsible: true, size:'20%'}
  ]
});

$("#vertical-left").kendoSplitter({
  orientation: "vertical",
  panes: [
    {collapsible: false, size: "600px"},
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
$("#tabstrip").kendoTabStrip({
  animation: {
    open: {
      effects: "fadeIn"
    }
  }
});


