let magicGrid = new MagicGrid({
    container: '.container',
    animate: true,
    gutter: 30,
    items: 10,
    static: false,
    useMin: true
});
magicGrid.listen();


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyARv6upwpJMts8fjkS0TcMSQIXZ9yZFcEY",
    authDomain: "books-bf3ac.firebaseapp.com",
    databaseURL: "https://books-bf3ac.firebaseio.com",
    projectId: "books-bf3ac",
    storageBucket: "books-bf3ac.appspot.com",
    messagingSenderId: "34875339326",
    appId: "1:34875339326:web:24322b3978b9aa21b6d76f",
    measurementId: "G-T6YXYMP5L3"
};
// Initialize Firebase using the above config.
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

// Actual functionaltiy starts from here.
// Delete the book if the count reaches zero while removing.
function deleteBook(bookID){
    firebase.database().ref("all").child(bookID).remove();
}
// For updating the book count (Either add or delete copies).
function writeData(data, i, bookID) {
    if (i < 0 && (data + i) < 1){
        console.log("Here");
        deleteBook(bookID);
        return;
    }
    else{
        firebase.database().ref("all").child(bookID).set({count: data +i});
    }
}
// Add the book into inventory if the user asks to increment the count of a non existant book.
// This creates a new entry in the database.
function addNewBook(bookID, toIncBy) {
    firebase.database().ref("all").child(bookID).set({
      count : toIncBy
    });
}
// For updating counts in real time and helping differentiate divs belonging to books that are/aren't in the inventory.
function checkIfPresent(bookID){
    // Gets the reference to the book by ID.
    var ref = firebase.database().ref("all").child(bookID).child("count");
    ref.on("value", function(snapshot) {
        // Finds the current count of the book, 
        // Gets the corresponding div and the text field that has the count.
        // This part is run everytime a value changes in the database, making the book counts realtime.
        var childData = snapshot.val();
        var div = document.getElementsByClassName(bookID)[0];
        //console.log(div);
        var idText = "count".concat(bookID);
        var para = document.getElementById(idText);
        if (childData == null){
            // If the book is not present anymore, make the cover dark and the count empty.
            div.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9) ), url('http://books.google.com/books/content?id=${bookID}&printsec=frontcover&img=1&zoom=1&source=gbs_api')`;
            para.innerHTML = "";
        }
        else{
            // If the book exists, Make the cover visible and update the count.
            div.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('http://books.google.com/books/content?id=${bookID}&printsec=frontcover&img=1&zoom=1&source=gbs_api')`;
            para.innerHTML = childData;
        }
    });
}

// Handles addition/deletion of books.
function writeUserData(bookID, add) {
    // Gets database reference for given bookID.
    var ref = firebase.database().ref("all").child(bookID).child("count");
    var toIncBy = parseInt(document.getElementById("inc").value); // Gets the value entered in the count box.
    ref.once("value", function(snapshot) {
        var childData = snapshot.val();
        if (childData == null){
            // Makes a new book in the database if it doesnt already exist and add was pressed.
            if (add){
                addNewBook(bookID, toIncBy);
                return;
            }
            // Does nothing when a book that doesnt exist has to be removed.
            else{
                return;
            }
        } else if(childData == 1 && !add){ // To delete the book from the database.
            deleteBook(bookID);
            return;
        }
        // Increments and decrements book count in the database.
        if (add){
            writeData(childData, toIncBy, bookID);
        }
        else{
            writeData(childData, -1 * toIncBy, bookID);
        }
    });
}
// Empty old search results.
function clearDiv() {
    document.getElementById("cont").innerHTML = "";
}
// When the add/remove button is clicked, this function handles the writing of data to the database.
function bookClick() {
    var n = this.className.split(" ");
    var value = n[n.length - 1];
    // Identifies which button was pressed depending on class.
    if (value == "btn-primary"){
        writeUserData(this.id, true);
    } else {
        writeUserData(this.id, false);
    }
}

function addDiv(name, id) {
    // Creating new div to add.
    var div = document.createElement('div');
    div.className = String(id);
    // Book name
    var text = String(name);
    var bname = document.createElement('a');
    // Clickable link to the books page for details.
    bname.href = "https://books.google.com/ebooks?id=".concat(id);
    // Open link in new tab.
    bname.target = "_blank";
    bname.innerHTML += name;
    bname.style = "position: absolute; color: white; left: 5px; top: 5px; font-weight: bold";
    div.appendChild(bname);

    // Count of book
    // Initially zero, is updated in the checkIfPresent function after the div is created.
    var cnt = document.createElement("p");
    var cntn = document.createTextNode("");
    cnt.appendChild(cntn);
    cnt.id = "count".concat(id);
    cnt.style = "position: absolute; bottom: 0; right: 5; width: 100px; text-align:right; color: white;";
    div.appendChild(cnt);
    // Positions div inside of grid, adds book cover as background image.
    div.style = `text-align: top-right; position: absolute; background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('http://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1&source=gbs_api'); background-repeat: no-repeat; background-size: 200px 400px;`

    // Creating the add/remove buttons and positioning them in each books div. 
    // Event listener keeps track of clicks.
    var btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.id = String(id);
    btn.addEventListener('click', bookClick);
    btn.type = "button";
    btn.innerHTML += "+";
    btn.style = "position: absolute; font-size: 12px; bottom: 0; left: 0; width: 30px; text-align:center";
    var btn2 = document.createElement("button");
    btn2.className = "btn btn-danger";
    btn2.id = String(id);
    btn2.addEventListener('click', bookClick);
    btn2.type = "button";
    btn2.innerHTML += "-";
    btn2.style = "position: absolute; font-size: 12px; bottom: 0; right: 0; width: 30px; text-align:center";

    // Adding in the buttons.
    div.appendChild(btn);
    div.appendChild(btn2);

    // Adding the div to the container.
    document.getElementById('cont').appendChild(div);

};
// Adds all map elements that come out the search to a div which is then added to the grid.
function onMapElements(value, key, map) {
    addDiv(value, key);
}
// Checks and updates the counts in real time.
function checker(value, key, map){
    checkIfPresent(key);
}
// Repostions the contents of the grid.
// Has to be done on every addition/removal.
function reposition(){
    magicGrid.positionItems();
}
// Function to get the inventory.
function getInv(){
    // Clear whats already in the grid to make space for inventory. Also happens when performing a new search.
    // Remove to append to the grid instead of clearing it.
    clearDiv();
    var ref = firebase.database().ref("all");
    ref.once("value")
        .then(function(snapshot) {
            var key = snapshot.val();
            // For every key (bookID) in the database, get book name and add corresponding div as done in the earlier function.
            for (var i in key){
                var query = "https://www.googleapis.com/books/v1/volumes/".concat(i);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                   if (this.readyState == 4 && this.status == 200) {
                       var myObj = JSON.parse(this.responseText);
                       // After adding the div, reposition the grid elements to make it look consistent.
                       addDiv(myObj.volumeInfo.title, myObj.id);
                       reposition();
                       // To keep track of counts from the database and keep updating them in realtime.
                       checkIfPresent(myObj.id);
                    }
                };
                xmlhttp.open("GET", query, true);
                xmlhttp.send();
            }
    });
}
// Runs when a search is performed.
function search() {
    clearDiv();
    let map = new Map();
    // Do the search for books and put in the ID and names in a map.
    var query = document.getElementById("search").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
           var myObj = JSON.parse(this.responseText);
           for (i = 0; i < myObj.items.length; i++){
               map.set(myObj.items[i].id, myObj.items[i].volumeInfo.title);
           }
           // As done when populating the inventory, add every map element to the div.
           map.forEach(onMapElements);
           // Reposition and then check for changes in real time as done earlier with the inventory grid.
           reposition();
           map.forEach(checker);
        }
    };
    var toSend = "https://www.googleapis.com/books/v1/volumes?q=".concat(query);
    xmlhttp.open("GET", toSend, true);
    xmlhttp.send();
}