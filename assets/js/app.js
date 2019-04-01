// BUGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalInc) {
    if (totalInc > 0) {
      this.percentage = Math.round((this.value / totalInc) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(cur) {
      sum = sum + cur.value;
    });

    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },

    totals: {
      exp: 0,
      inc: 0
    },

    buget: 0,
    percentage: -1
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

    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBuget: function() {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // calculate the buget: income - expenses
      data.buget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });

      return allPerc;
    },

    getBuget: function() {
      return {
        buget: data.buget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage"
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp

        description: document.querySelector(DOMstrings.inputDesc).value,

        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string wuth place holder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">+ %value%</div><div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline">' +
          "</i></button></div></div></div>";
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%">' +
          '<div class="item__description">%description%</div> ' +
          '<div class="right clearfix">' +
          '<div class="item__value">%value%</div>' +
          '<div class="item__percentage">21%</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          "</div></div></div>";
      }

      // Replace the placeholder text with somw actual data
      newHtml = html.replace("%id%", obj.id);

      newHtml = newHtml.replace("%description%", obj.description);

      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML to the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.buget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function(percentage) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percentage[index] > 0) {
          current.textContent = percentage[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
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

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the buget
    budgetController.calculateBuget();

    // 2. return the buget
    var budget = budgetController.getBuget();

    // 3. Display the buget on the UI
    UIController.displayBudget(budget);
  };

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetController.calculatePercentages();

    // 2. Read percentage from the buget controller
    var percentages = budgetController.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Get the filed input data
    input = UICtrl.getinput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the buget controller
      newItem = bugetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UIController.addListItem(newItem, input.type);

      // 4. Clear the field
      UIController.clearField();

      // 5. Calculate and update buget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitId, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-1
      splitId = itemID.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);

      // 1. Delete the item from the data structure
      budgetController.deleteItem(type, ID);

      // 2. Delete the item from the ui
      UIController.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log("Apllication has started");
      UIController.displayBudget({
        buget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventlistner();
    }
  };
})(budgetController, UIController);

controller.init();
