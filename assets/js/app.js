// BUGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },

    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string wuth place holder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">+ %value%</div><div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline">' +
          "</i></button></div></div></div>";
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%">' +
          '<div class="item__description">%description%</div> ' +
          '<div class="right clearfix">' +
          '<div class="item__value">%value%</div>' +
          '<div class="item__percentage">21%</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          "</div></div></div>";
      }
      //  html =  '<div class="item clearfix" id="income-1">'+
      //   '<div class="item__description">Sold car</div>'+
      //   '<div class="right clearfix">'+
      //   '<div class="item__value">+ 1,500.00</div>'+
      //   '<div class="item__delete">'+
      //   '<button class="item__delete--btn"> '+
      //   '<i class="ion-ios-close-outline"></i></button>'+
      //   '</div></div></div>';

      // Replace the placeholder text with somw actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML to the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearField: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDesc + ", " + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fields.forEach(function(cur, i, arr) {
        cur.value = "";
      });

      fieldsArr[0].focus();
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function(bugetCtrl, UICtrl) {
  // Event Listner
  var setupEventlistner = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      // console.log(event);

      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Get the filed input data
    input = UICtrl.getinput();

    // 2. Add the item to the buget controller
    newItem = bugetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the UI
    UIController.addListItem(newItem, input.type);
    // 4. Clear the field
    UIController.clearField();

    // 5. Calculate the buget

    // 6. Display the buget on the UI
  };

  return {
    init: function() {
      console.log("Apllication has started");
      setupEventlistner();
    }
  };
})(budgetController, UIController);

controller.init();
