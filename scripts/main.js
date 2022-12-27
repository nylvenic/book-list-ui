const bookTitle = document.querySelector('#bookTitle'),
    author = document.querySelector('#author'),
    isbn = document.querySelector('#isbn'),
    booksTable = document.querySelector('#booksTable'),
    submit = document.querySelector('#submit'),
    table = document.querySelector('table'),
    alert = document.querySelector('.alert'),
    heading = document.querySelector('#heading'),
    container = document.querySelector('.container');

class Book {
    constructor(bookTitle, author, isbn) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.isbn = isbn;
    }
}

class BookStorage {
    constructor() {
        this.books = JSON.parse(localStorage.getItem('books')) || [];
    }

    add(bookTitle, author, isbn) {
        const book = new Book(bookTitle, author, isbn);
        this.books.push(book);
        this.saveToLocalStorage();
    }

    delete(isbn) {
        const bookToDelete = this.books.indexOf(book => book.isbn === isbn);
        this.books.splice(bookToDelete, 1);
        this.saveToLocalStorage();
    }

    render() {
        booksTable.innerHTML = '';
        this.books.forEach(book => {
            const tableRow = document.createElement('tr');
            const properties = Object.keys(book);

            properties.forEach(property => {
                const tableData = document.createElement('td');
                const tableDataText = document.createTextNode(book[property]);
                tableData.appendChild(tableDataText);
                tableRow.appendChild(tableData);
            })

            const trashIcon = document.createElement('td');
            const trashIconHTML = `<td class="delete"><span class="material-symbols-outlined">delete</span></td>`;
            trashIcon.innerHTML = trashIconHTML;
            trashIcon.classList.add('delete');
            tableRow.appendChild(trashIcon);

            booksTable.appendChild(tableRow);
        })
    }

    saveToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }
}

class Alert {
    constructor(msg) {
        this.msg = msg;
        this.alertUI;
        this.selfDestruct();
    }

    createUI(parent, target) {
        this.alertUI = document.createElement('div');
        const messageEl = document.createElement('p');
        const content = document.createTextNode(this.msg);
        this.alertUI.classList.add('alert');
        messageEl.appendChild(content);
        this.alertUI.appendChild(messageEl);
        insertAfter(parent, target, this.alertUI);
    }

    selfDestruct() {
        setTimeout(() => {
            this.alertUI.remove();
        }, 3000);
    }
}

function insertAfter(parent, target, el) {
    parent.insertBefore(el, target.nextSibling);
}

const app = new BookStorage();
app.render();

submit.addEventListener('click', e => {
    e.preventDefault();

    if(!bookTitle.value) {
        const bookTitleError = new Alert('You must enter a book title!');
        bookTitleError.createUI(container, heading);
        return;
    }

    if(!author.value) {
        const authorValueError = new Alert('You must enter an author!');
        authorValueError.createUI(container, heading);
        return;
    }

    if(!isbn.value) {
        const isbnValueError = new Alert('You must enter an ISBN!');
        isbnValueError.createUI(container, heading);
        return;
    }

    app.add(bookTitle.value, author.value, isbn.value);
    app.render();
})

table.addEventListener('click', e => {
    if(e.target.classList.contains('delete') || e.target.parentElement.classList.contains('delete')) {
        let currentISBN;
        if(e.target.classList.contains('delete')) {
            currentISBN = e.target.parentElement.children[2].textContent;
        } else if(e.target.parentElement.classList.contains('delete')) {
            currentISBN = e.target.parentElement.parentElement.children[2].textContent;
        }
        app.delete(currentISBN);
        app.render();
    }
})