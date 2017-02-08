// var currentChecked;
//
// var table = document.getElementsByClassName("table")[0];

var btnAdd = document.getElementById("btnAdd");
var btnEdit = document.getElementById("btnEdit");
var btnDelete = document.getElementById("btnDelete");
var btnSave = document.getElementById("btnSave");
var btnCancel = document.getElementById("btnCancel");

var firstButtonPanel = document.getElementById("firstButtonPanel");
var inputName = document.getElementById("inputName");
var inputDescription = document.getElementById("inputDescription");

// var panelAddBook = document.getElementById("panelAddBook");
var inputTab = document.getElementById("inputTab");
var messageWindow = document.getElementById("messageWindow");

var currentAction;
var currentEditingTr;

var model = [
    {"name": "book1", "description": "descr1"},
    {"name": "book2", "description": "descr2"},
    {"name": "book3", "description": "descr3"},
    {"name": "book4", "description": "descr4"}
];

render();


function render() {

    var books = (localStorage.localBookList) ? JSON.parse(localStorage.localBookList) : model;

    var table = document.createElement("table");
    table.id = "bookTable";

    var trHead = document.createElement("tr");
    var thCheckBox = document.createElement("th");
    var thName = document.createElement("th");
    var thDescription = document.createElement("th");

    var checkBoxHead = document.createElement("input");
    checkBoxHead.type = "checkbox";
    checkBoxHead.setAttribute("data-check-all", "");

    // thCheckBox.style.width = "10%";
    // thName.style.width = "45%";
    // thDescription.style.width = "45%";

    thCheckBox.classList.add("columnFirst");
    thName.classList.add("columnSecond");
    thDescription.classList.add("columnThird");


    var label = document.createElement("label");
    label.appendChild(checkBoxHead);
    // label.appendChild(document.createTextNode("Check All"));
    thCheckBox.appendChild(label);
    thName.innerHTML = "Book Name";
    thDescription.innerHTML = "Description";

    trHead.appendChild(thCheckBox);
    trHead.appendChild(thName);
    trHead.appendChild(thDescription);

    var tHead = document.createElement("tHead");
    tHead.appendChild(trHead);
    table.appendChild(tHead);


    var tBody = document.createElement("tBody");


    for (var i = 0; i < books.length; i++) {

        var tr = document.createElement("tr");
        var tdCheckBox = document.createElement("td");
        var tdName = document.createElement("td");
        var tdDescription = document.createElement("td");

        tdCheckBox.classList.add("columnFirst");
        tdName.classList.add("columnSecond");
        tdDescription.classList.add("columnThird");

        var inputCheckBox = document.createElement("input");
        inputCheckBox.type = "checkbox";
        inputCheckBox.setAttribute("data-check-item", "");
        label = document.createElement("label");
        label.appendChild(inputCheckBox);
        tdCheckBox.appendChild(label);

        tdName.innerHTML = books[i].name;
        tdDescription.innerHTML = books[i].description;

        tr.appendChild(tdCheckBox);
        tr.appendChild(tdName);
        tr.appendChild(tdDescription);

        tBody.appendChild(tr);
    }

    table.appendChild(tBody);

    if(tBody.innerHTML === ""){
        var td = document.createElement("td");
        td.innerHTML = "Book List is empty";
        td.colSpan = 3;
        tBody.appendChild(td);
        setDisabled(tHead.querySelector("input"), true);
    }

    document.getElementById("bookContainer").replaceChild(table, document.getElementById("bookTable"));

}

function checkAll(event) {
    if (event.target.hasAttribute("data-check-all")) {
        var arrOfCheckBox = document.querySelector("tbody").querySelectorAll("input");
        for (var i = 0; i < arrOfCheckBox.length; i++) {
            checkItem(arrOfCheckBox[i], event.target.checked);
        }
    } else if (event.target.hasAttribute("data-check-item")) {
        checkItem(event.target, event.target.checked);
    }


}

function checkItem(item, checked) {
    console.log(item.parentNode.parentNode.parentNode);
    item.checked = checked;
    var classList = item.parentNode.parentNode.parentNode.classList;
    checked ? classList.add("rowChecked") : classList.remove("rowChecked");
}


document.addEventListener("click", checkAll);

function getCurrentTable() {
    var rows = document.querySelector("tbody").querySelectorAll("tr");
    var result = [];

    for (var i = 0; i < rows.length; i++) {
        result.push({
            name: rows[i].cells[1].innerHTML,
            description: rows[i].cells[2].innerHTML
        });
        // console.log(rows[1].cells[1].innerHTML);
    }
    return result;
}


btnAdd.addEventListener("click", addBook);
btnSave.addEventListener("click", saveBook);
btnEdit.addEventListener("click", editBook);
btnDelete.addEventListener("click", deleteBook);
btnCancel.addEventListener("click", cancel);


function addBook() {

    // activateInputs();

    setInputVisible(true);

    currentAction = "addBook";
}


function saveBook() {

    if (inputName.value.length < 5 || inputDescription.value.length < 5
        || inputName.value.length > 20 || inputDescription.value.length > 40 ) {
        showMessage("*Name should contain from 5 to 20 characters<br>" +
            "Description - from 5 to 40 characters");
        // messageWindow.innerHTML = "*Name and Description should consist of more than 5 symbols";
        return;
    }

    var currentTable = getCurrentTable();
    //comment
    if (currentAction === "addBook") {

        var newBook = {
            name: inputName.value,
            description: inputDescription.value
        };

        currentTable.push(newBook);


    } else if(currentAction === "editBook"){
        currentEditingTr.cells[1].innerHTML = inputName.value;
        currentEditingTr.cells[2].innerHTML = inputDescription.value;
        currentTable = getCurrentTable();
    }

    localStorage.localBookList = JSON.stringify(currentTable);
    render();
    clearInputs();
    // disableInputs();
    setInputVisible(false);


}
function clearInputs() {
    inputName.value = "";
    inputDescription.value = "";
}



function setInputVisible(status) {

    var visible = status ? "visible" : "hidden";

    inputTab.style.visibility = visible;
    messageWindow.style.visibility = visible;
    firstButtonPanel.style.visibility = visible;

    setDisabled(btnAdd, status);
    setDisabled(btnEdit, status);
    setDisabled(btnDelete, status);


    var arrOfCheckBox = document.getElementById("bookTable").querySelectorAll("input");

    for( var i = 0; i < arrOfCheckBox.length; i++){
        setDisabled(arrOfCheckBox[i], status);
    }

}



function setDisabled(elem, status) {
    status ?
        elem.setAttribute("disabled", "")
        : elem.removeAttribute("disabled");
}

function getArrayOfChecked(){
    var arrOfCheckBox = document.querySelector("tbody").querySelectorAll("input");
    var allChecked = [].filter.call(arrOfCheckBox, function (elem) {
        return elem.checked;
    });
    return allChecked;
}

function showMessage(text) {
    messageWindow.style.visibility = "visible";
    messageWindow.innerHTML = text;
}

function hideMessage(delay) {
    setTimeout(function () {
        messageWindow.style.visibility = "hidden";
        messageWindow.innerHTML = "";
    }, delay);
}

function editBook() {

    var allChecked = getArrayOfChecked();

    if(allChecked.length >= 0){
        showMessage("*Please select just one book, that you want to edit");
        hideMessage(2000);
        btnEdit.blur();
        return;
    }

    currentAction = "editBook";

    // activateInputs();
    setInputVisible(true);

    var tr = allChecked[0].parentNode.parentNode.parentNode;

    currentEditingTr = tr;

    inputName.value = tr.cells[1].textContent;
    inputDescription.value = tr.cells[2].textContent;

}


function deleteBook() {

    var allChecked = getArrayOfChecked();

    if(allChecked.length == 0){
        showMessage("*Please select the books, that you want to delete");
        hideMessage(2000);
        btnDelete.blur();
        return;
    }

    var agree = confirm("Are you sure you want to delete selected books ?");
    if(!agree) return;

    var bookTable = document.querySelector("tBody");

    for( var i = 0; i < allChecked.length; i++){
        var tr = allChecked[i].parentNode.parentNode.parentNode;
        bookTable.removeChild(tr);
    }
    var currentTable = getCurrentTable();
    localStorage.localBookList = JSON.stringify(currentTable);
    render();
}

function cancel() {
    clearInputs();
    // disableInputs();
    setInputVisible(false);
}




// table.addEventListener("click", buttonClick);


// function buttonClick(event){

// 	var target = event.target;
// 	if(!target.classList.contains("checkbox")){
// 		return;
// 	} 
// 		if(target.checked){

// 			target.parentNode.classList.toggle("checked");

// 			if(currentChecked){
// 				currentChecked.parentNode.classList.toggle("checked");
// 				currentChecked.checked = false;
// 			}
// 				currentChecked = target;
// 		}else{
// 			currentChecked.parentNode.classList.toggle("checked");
// 			currentChecked = null;
// 		}

// };








function move() {

    //
    // var number = 10;
    //
    // var read = function(){
    //
    // };

}


console.dir(move);






























