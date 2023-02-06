//creating dummy state  and transaction array of obj
let state = {
  balance: 1000,
  income: 400,
  expense: 100,
  transactions: [
    // {id:uniqueId(),name:'Salary',amount:200,type:'income'}
  ],
};
//initializing imp elements in variables
let balanceEl = document.querySelector("#balance");
let incomeEl = document.querySelector("#income");
let expenseEl = document.querySelector("#expense");
let transactionsUl = document.querySelector("#transaction");
let incomeBtnEl = document.querySelector("#incomeBtn");
let expenseBtnEl = document.querySelector("#expenseBtn");
let nameInputEl = document.querySelector("#name");
let amountInputEl = document.querySelector("#amount");
let textFieldContainerEl = document.querySelector(".form-container");
let currentEditIndex = 0;
let curentEditItem = {};

function init() {
  let localState = JSON.parse(localStorage.getItem("expenseTrackerState")); //getting  stored string obj in  rel obj form

  if (localState != null) {
    //putting condition if there is something in local object
    state = localState; // set local object as real state obj
  }

  updateState();
  initListeners();
}
//function to create new id
function uniqueId() {
  return Math.round(Math.random() * 1000000);
}
//adding event listners
function initListeners() {
  incomeBtnEl.addEventListener("click", onAddIncomeClick);
  expenseBtnEl.addEventListener("click", onAddExpenseClick);
}

//adding to income list
function onAddIncomeClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, "income");
}
//updating new transaction to list by refactoring
function addTransaction(name, amount, type) {
  // logic for the update case
  if (textFieldContainerEl.classList.contains("edit-mode")) {
    state.transactions.splice(currentEditIndex, 1, {
      name: name,
      amount: amount,
      type: type,
    });

    textFieldContainerEl.classList.remove("edit-mode");
    updateState();
    alert("item has been updated updated");
  } else {
    if (name !== "" && amount !== "") {
      let transaction = {
        id: uniqueId(),
        name: name,
        amount: parseInt(amount),
        type: type,
      };

      state.transactions.push(transaction);

      updateState();
    } else {
      alert("Please enter valid data");
    }
  }

  nameInputEl.value = "";
  amountInputEl.value = "";
}
//adding to expense list
function onAddExpenseClick() {
  addTransaction(nameInputEl.value, amountInputEl.value, "expense");
}

//deleting el from list
function onDeleteClick(event) {
  let id = parseInt(event.target.getAttribute("data-id"));
  let deleteIndex;
  for (let i = 0; i < state.transactions.length; i++) {
    if (state.transactions[i].id === id) {
      deleteIndex = i;
      break;
    }
  }

  state.transactions.splice(deleteIndex, 1);

  updateState();
}

function onUpdateClick(event, index) {
  let elem = event.target;

  // get amount without USD sign
  const val = elem.querySelector("span").textContent.substring(1);
  const title = elem.querySelector(".title").textContent;
  textFieldContainerEl.classList.add("edit-mode");
  // set value to the current form
  amountInputEl.value = val;
  nameInputEl.value = title;
  currentEditIndex = index;
}

//calc income expense and balance and updating it
function updateState() {
  let balance = 0,
    income = 0,
    expense = 0,
    item;

  for (let i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];

    if (item.type === "income") {
      income += item.amount;
    } else if (item.type === "expense") {
      expense += item.amount;
    }
  }

  balance = income - expense;

  state.balance = balance;
  state.income = income;
  state.expense = expense;

  localStorage.setItem("expenseTrackerState", JSON.stringify(state)); //store state obj in expenseTrackerState in string form

  render();
}

//func to render list on UI
function render() {
  balanceEl.innerHTML = `\u20B9${state.balance}`;
  incomeEl.innerHTML = `\u20B9${state.income}`;
  expenseEl.innerHTML = `\u20B9${state.expense}`;

  let transactionLi, div, span, item, btn;

  transactionsUl.innerHTML = "";

  for (let i = 0; i < state.transactions.length; i++) {
    item = state.transactions[i];
    transactionLi = document.createElement("li");
    let transactionTitle = document.createElement("strong");
    transactionTitle.className = "title";
    transactionTitle.innerHTML = item.name;
    transactionLi.append(transactionTitle);

    transactionsUl.appendChild(transactionLi);

    div = document.createElement("div");
    span = document.createElement("span");
    if (item.type === "income") {
      span.classList.add("income-amt");
    } else if (item.type === "expense") {
      span.classList.add("expense-amt");
    }
    span.innerHTML = `\u20B9${item.amount}`;

    div.appendChild(span);

    btn = document.createElement("button");
    btn.setAttribute("data-id", item.id);
    btn.innerHTML = "X";

    btn.addEventListener("click", onDeleteClick);

    // make list clickable for edit
    transactionLi.addEventListener("click", function (e) {
      onUpdateClick(e, i);
    });

    div.appendChild(btn);

    transactionLi.appendChild(div);
  }
}

init();
