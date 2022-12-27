const bookTitle = document.querySelector('#bookTitle'),
    author = document.querySelector('#author'),
    isbn = document.querySelector('#isbn'),
    tableContent = document.querySelector('#tableContent'),
    submit = document.querySelector('#submit'),
    container = document.querySelector('.container'),
    heading = document.querySelector('#heading');

function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function BookStorage() {
    this.books = JSON.parse(localStorage.getItem('books')) || [];
    this.render();
}

BookStorage.prototype.add = function(title, author, isbn) {
    const BookObj = new Book(title, author, isbn);
    this.books.push(BookObj);
    this.saveToLocalStorage();
    this.render();
}

BookStorage.prototype.delete = function(isbn) {
    const bookToDelete = this.books.indexOf(book => book.isbn === isbn);
    this.books.splice(bookToDelete, 1);
    this.saveToLocalStorage();
    this.render();
}

BookStorage.prototype.render = function() {
    tableContent.innerHTML = '';
    this.books.forEach(book => {
        const tableRow = document.createElement('tr');
        const bookProperties = Object.getOwnPropertyNames(new Book);
        bookProperties.forEach(property => {
            const tableData = document.createElement('td');
            const tableDataText = document.createTextNode(book[property]);
            tableData.appendChild(tableDataText);
            tableRow.appendChild(tableData);
        })
        const trashIcon = createTrashIcon();
        tableRow.appendChild(trashIcon);
        tableContent.appendChild(tableRow);
    })

    function createTrashIcon() {
        const tableData = document.createElement('td');
        tableData.classList.add('delete');
        const trashIconSpan = document.createElement('span');
        trashIconSpan.classList.add('material-symbols-outlined');
        const accessibilityText = document.createTextNode('delete');
        trashIconSpan.appendChild(accessibilityText);
        tableData.appendChild(trashIconSpan);
        return tableData;
    }
}

BookStorage.prototype.saveToLocalStorage = function() {
    localStorage.setItem('books', JSON.stringify(this.books));
}

function Alert(message) {
    this.message = message;
    this.alert;
    this.render();
    this.selfDestruct();
}

Alert.prototype.render = function() {
    this.alert = document.createElement('div');
    const alertContentUI = document.createElement('p');
    const alertTextContent = document.createTextNode(this.message);
    alertContentUI.appendChild(alertTextContent);
    this.alert.appendChild(alertContentUI);
    this.alert.classList.add('alert');
    insertAfter(container, heading, this.alert);
    
    function insertAfter(parent, target, el) {
        parent.insertBefore(el, target.nextSibling);
    }
}

Alert.prototype.selfDestruct = function() {
    setTimeout(() => this.alert.remove(), 2500);
}

function Error(message) {
    Alert.call(this, message);
    this.alert.classList.add('error');
}

Error.prototype = Object.create(Alert.prototype);
Error.prototype.constructor = Error;

function Success(message) {
    Alert.call(this, message);
    this.alert.classList.add('success');
}

Success.prototype = Object.create(Alert.prototype);
Success.prototype.constructor = Success;
const storage = new BookStorage();
storage.render();

submit.addEventListener('click', (e) => {
    e.preventDefault();

    if(!bookTitle.value) {
        new Error('You need to enter a book title!');
        return;    
    }
    
    if(!author.value) {
        new Error('You need to enter an author!');
        return;
    }

    if(!isbn.value) {
        new Error('You need to enter an ISBN!');
        return;
    }

    new Success('You successfully added a book!');
    storage.add(bookTitle.value, author.value, isbn.value);
})

tableContent.addEventListener('click', (e) => {
    const parent = e.target.parentElement;
    if(e.target.classList.contains('delete') || parent.classList.contains('delete')) {
        let isbn = '';
        if(e.target.classList.contains('delete')) {
            isbn = parent.children[2].textContent;
        } else if(parent.classList.contains('delete')) {
            isbn = parent.parentElement.children[2].textContent;
        }
        new Success('Book successfully removed!');
        storage.delete(isbn);
    }
});