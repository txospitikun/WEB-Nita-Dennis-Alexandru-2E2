# childcare-manager-web


# RESTAPI

# POSTS
/api/register
```
Payload:
{
    "firstname":"Dennis",
    "lastname":"Nita",
    "email":"abcdef12@gmail.com",
    "password":"123",
    "confirm_password":"123"
}

Response:
(User registered succesfully - Status: 200)
{
    "RegisterResponse": 100,
    "JWT": "eyJ... (the token is longer and should be saved as cookie) ...ppkJCyjU="
}

(Email already exists - Status: 401)
{
    "RegisterResponse": 101
}

(Password mismatch - Status: 401)
{
    "RegisterResponse": 102
}
```

/api/login
```
Payload:
{
    {
    "email":"dennis@hotmail.com",
    "password":"parolamea"
}

Response:
(User authentificated sucessfully - Status: 200)
{
    "LoginResponse": 200,
    "JWT": "eyJ... (the token is longer and should be saved as cookie) ...ppkJCyjU="
}

(User not found or password wrong - Status: 401)
{
    "LoginResponse": 201
}
```
/api/insert_children
```
Payload: (JWT token as cookie)
{
    "FirstName":"Luca",
    "LastName":"Cozloschi",
    "Gender":"Male",
    "DateOfBirth":"2003-03-02"
}
(JWT Token is expired or invalid. Should redirect to login page - Status: 401)
{
    "InsertChildrenResponse": 10
}

(Children succesfully added. Status: 200)
{
    "InsertChildrenResponse": 300
}
```
#GETS

/api/get_children // JWT token as cookie
```
Payload: JWT as header
Response: --- STATUS 200
{
    "Response": 200,
    "ChildrenInfo": [
        {
            "ID": 16,
            "FirstName": "Luca",
            "LastName": "Cozloschi",
            "Gender": "Male",
            "DateOfBirth": "2003-03-01T22:00:00.000Z",
            "PictureRef": "not implemented",
            "UserID": 15
        },
        {
            "ID": 17,
            "FirstName": "Marian",
            "LastName": "Ciotir",
            "Gender": "Male",
            "DateOfBirth": "2003-03-01T22:00:00.000Z",
            "PictureRef": "not implemented",
            "UserID": 15
        }
    ]
}

Response: 401 - INVALID AUTHENTIFICATION --- STATUS 401
Response: 404 - NO CHILDREN FOUND        --- STATUS 404

```
/api/get_feeding_entries_by_date?date=2024-06-18 // JWT token as cookie
```
Response: --- STATUS 200
[
    {
        "ID": 10,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 11,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    }
]

GetFeedingEntryResponse: 301 - invalid entry id  --- STATUS: 400
GetFeedingEntryResponse: 404 - no entries found  --- STATUS: 404
GetFeedingEntryResponse: 1 - for backend errors  --- STATUS: 505
```
api/get_feeding_entry?id=1 // id is child's id // JWT token as cookie
```
Response: --- STATUS 200
[
    {
        "ID": 10,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 11,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 12,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 13,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    }
]

GetFeedingEntryResponse: 301 - invalid entry id  --- STATUS: 400
GetFeedingEntryResponse: 404 - no entries found  --- STATUS: 404
GetFeedingEntryResponse: 1 - for backend errors  --- STATUS: 505
```
# PUTS
/api/edit_feeding_entry
```
Payload:
{
    "ID": 9,
    "SelectedChildren": 1,
    "Date": "2023-03-11",
    "Time": "14:00:00",
    "Unit": "ml",
    "Quantity": 2000,
    "FoodType": "Milk"
}

Response:

EditFeedingEntryResponse: 404 if no entries affected
EditFeedingEntryResponse: 300 if edited sucesfully 

```

# DELETE
/api/delete_feeding_entry?id=9

# SQL Tabels:
Users:
```
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RegisterDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    Privilege INT NOT NULL,
    Suspended BOOLEAN NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    PhoneNo VARCHAR(20),
    Location VARCHAR(255),
    Language VARCHAR(255),
    CivilState BOOLEAN,
    CivilPartner INT,
    AccountType INT,
    PictureRef VARCHAR(255)
);

```
Children:
```
CREATE TABLE Childrens (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Gender VARCHAR(255) NOT NULL,
    DateOfBirth DATE NOT NULL,
    PictureRef VARCHAR(255),
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

```
Relations:
```
CREATE TABLE Relations (
    ID SERIAL PRIMARY KEY,
    First INT NOT NULL,
    SECOND INT NOT NULL,
    RelationType INT NOT NULL
);
```

