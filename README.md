# Submission for Book Inventory Management site.
# JS App using firebase realtime database as backend that updates the inventory details in real time.

## Assumptions - 
1. There can be multiple users trying to modify/read the inventory at the same time. Need the app to update values in real time.
2. Users might want to add/remove multiple books at once, implemented a field to enter the count for this.
3. User does not want to manually remove books that are no longer in the inventory - it is handled automatically.
4. The inventory cannot have a negative number of books.

## Reasoning - 
1. Because of assumption #1, I chose to work with firebase realtime database because it makes it really easy to update values in real time.
2. The same application contents are kept in sync on multiple browser pages. The page does not need reloading to display the count of book on the screen. 
3. No operation takes place in the backend as the whole application can be done using just one dyncamic grid to display the books. This makes iot really simple to put this page into another application as something like book inventory management can also be integrated with
billing applications.
4. For expandability, modules like pyrebase can be used to access the data that is pushed onto the database.

## How to run,
Deployed [here](https://bim-spoonshot-maanas.herokuapp.com/).
 To run locally -             
Create python venv, Install the requirements from the requirements.txt file, 
These include Flask which is used to render the page.
Then,    
`export FLASK_APP=app.py`
and `flask run`

#### Maanas Dwivedi
##### E17CSE156, Bennett University
