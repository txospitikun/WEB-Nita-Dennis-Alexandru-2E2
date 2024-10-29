# WEB Technologies 

**Year 2 - Semester 2 - UAIC FII**
<a href="https://edu.info.uaic.ro/web-technologies/">Course Description</a>

The course required a full-stack application (vanilla HTML/CSS + JS & node.js) that could allow some parents or legal guardians to record different things about their children. (feeding/sleeping times, semnificative photos and recordings and so on).

The project was made in cooperation with another colleague @meareantz. I have focused on the backend primary, but our tasks were splitted so we had to tip our toes in every technology of the project.




# API Examples + SQL Format
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
```

CREATE TABLE `Users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `RegisterDate` date NOT NULL DEFAULT (curdate()),
  `Privilege` int NOT NULL,
  `Suspended` tinyint(1) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `PhoneNo` varchar(20) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Language` varchar(255) DEFAULT NULL,
  `CivilState` tinyint(1) DEFAULT NULL,
  `CivilPartner` varchar(255) DEFAULT NULL,
  `AccountType` int DEFAULT NULL,
  `PictureRef` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `Childrens` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Gender` varchar(255) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `PictureRef` varchar(255) DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `childrens_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Childrengroups` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Creation_Date` date NOT NULL,
  `PictureRef` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `childrengroups_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Feeding` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `Time` time DEFAULT NULL,
  `Unit` varchar(50) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `FoodType` varchar(100) DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `ChildrenID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `UserID` (`UserID`),
  KEY `ChildrenID` (`ChildrenID`),
  CONSTRAINT `feeding_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `feeding_ibfk_2` FOREIGN KEY (`ChildrenID`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Groupentries` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GroupID` int NOT NULL,
  `ChildrenID` int NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `GroupID` (`GroupID`,`ChildrenID`),
  KEY `ChildrenID` (`ChildrenID`),
  CONSTRAINT `groupentries_ibfk_1` FOREIGN KEY (`ChildrenID`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `groupentries_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `childrengroups` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Grouprelations` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GroupID` int NOT NULL,
  `ChildrenRelationOne` int NOT NULL,
  `ChildrenRelationTwo` int NOT NULL,
  `TypeOfRelation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ChildrenRelationOne` (`ChildrenRelationOne`),
  KEY `ChildrenRelationTwo` (`ChildrenRelationTwo`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `grouprelations_ibfk_1` FOREIGN KEY (`ChildrenRelationOne`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `grouprelations_ibfk_2` FOREIGN KEY (`ChildrenRelationTwo`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `grouprelations_ibfk_3` FOREIGN KEY (`GroupID`) REFERENCES `childrengroups` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Medias` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ChildrenID` int DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `InTimeline` tinyint(1) NOT NULL,
  `MediaType` varchar(255) NOT NULL,
  `PictureRef` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `ChildrenID` (`ChildrenID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `medias_ibfk_1` FOREIGN KEY (`ChildrenID`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `medias_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Healthcare` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ChildID` int NOT NULL,
  `Date` date NOT NULL,
  `TypeOf` int NOT NULL,
  `Title` text NOT NULL,
  `Description` text,
  `FileRef` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `healthcare_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `healthcare_ibfk_2` FOREIGN KEY (`ChildID`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Groupchat` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GroupID` int NOT NULL,
  `Message` text NOT NULL,
  `UserID` int NOT NULL,
  `Message_Date` date NOT NULL,
  `Message_Time` time NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `GroupID` (`GroupID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `groupchat_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `childrengroups` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `groupchat_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Sleeping` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `SleepTime` time DEFAULT NULL,
  `AwakeTime` time DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `ChildrenID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `UserID` (`UserID`),
  KEY `ChildrenID` (`ChildrenID`),
  CONSTRAINT `sleeping_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `sleeping_ibfk_2` FOREIGN KEY (`ChildrenID`) REFERENCES `childrens` (`ID`) ON DELETE CASCADE
);

CREATE TABLE `Relations` (
  `ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `First` int NOT NULL,
  `SECOND` int NOT NULL,
  `RelationType` int NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`)
);

CREATE TABLE `blacklistedtokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);


```


