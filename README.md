

# Dog Response Code Explorer

## Description
This project is a web application that provides an interactive platform for exploring and managing HTTP response codes using dog images from [http.dog](https://http.dog/). It allows users to log in, filter response codes, save lists with relevant details, and manage these lists (edit/delete). Developed using **HTML, CSS, JavaScript** for the frontend and **C# with .NET** for the backend, the application aims to enhance understanding of HTTP response codes in a fun and engaging way.

## Features

### **1. Authentication**
- **Login/Signup**: Users can create an account and securely log in to manage their response code lists.

### **2. Search Page**
- **Filter Response Codes**:  
  Users can filter HTTP response codes using patterns like:
  - Specific code: `203`
  - Prefix filter: `2xx` (All codes starting with 2)
  - Custom patterns: `20x`, `3xx`, `21x` (Uses regex-like patterns for flexible filtering)
- **Dog Images**: Once a filter is applied, corresponding dog images are displayed from [http.dog](https://http.dog/).
- **Save Lists**: After filtering, users can save the list of filtered response codes along with their associated dog images.

### **3. Lists Page**
- **View Saved Lists**: Displays all the lists that the user has stored, with list names and creation dates.
- **Edit Lists**: Users can modify existing lists by updating their name, response codes, or images.
- **Delete Lists**: Users can delete any saved list from the application.

---

## Database

### **Database Management System**
- **SQL Server**:  
  The application uses SQL Server to store and manage user data and list details efficiently.

### **Database Structure**

1. **Users Table**  
   Stores user account information.
   - `UserId` (Primary Key): Unique identifier for each user.  
   - `Username`: The username of the user.  
   - `Password`: Securely hashed password for authentication.  
   - `CreatedDate`: The date the user account was created.

2. **Lists Table**  
   Stores information about saved response code lists.  
   - `ListId` (Primary Key): Unique identifier for each list.  
   - `UserId` (Foreign Key): Links the list to its owner.  
   - `ListName`: The name of the saved list.  
   - `CreationDate`: The date the list was created.  
   - `ResponseCodes`: A serialized collection of response codes in the list.  
   - `ImageLinks`: A serialized collection of image URLs corresponding to the response codes.

---

## Backend Functionality

### **Technology Stack**
- **Backend Framework**: C# with .NET Core.
- **Database ORM**: Entity Framework Core for seamless interaction with the SQL Server database.

### **API Endpoints**

1. **Authentication**
   - **POST** `/api/auth/signup`: Registers a new user.  
   - **POST** `/api/auth/login`: Authenticates an existing user and returns a session token.

2. **Search & Save**
   - **GET** `/api/search?filter=<pattern>`: Fetches response codes and corresponding images based on the filter.  
   - **POST** `/api/lists`: Saves a new list with the provided details (list name, response codes, and image links).

3. **List Management**
   - **GET** `/api/lists`: Retrieves all lists belonging to the logged-in user.  
   - **GET** `/api/lists/<listId>`: Fetches details of a specific list.  
   - **PUT** `/api/lists/<listId>`: Updates an existing list.  
   - **DELETE** `/api/lists/<listId>`: Deletes a specific list.

---

## Frontend Functionality

### **Pages**

1. **Login/Signup Page**
   - User-friendly forms for authentication with client-side validation.

2. **Search Page**
   - Interactive filter functionality for HTTP response codes.  
   - Dynamic display of dog images based on selected filters.  
   - Ability to save filtered lists with custom names.

3. **Lists Page**
   - Displays all saved lists with their names and creation dates.  
   - Options to view, edit, or delete lists.  
   - Shows response codes and dog images for the selected list.

---

## Installation

### Prerequisites
- **.NET Core SDK** (for backend development)
- **SQL Server** (or SQL Server Express for local development)
- A modern browser (for frontend)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/dog-response-code-explorer.git
   cd dog-response-code-explorer
