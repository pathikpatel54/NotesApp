# NotesApp
<img width="1512" alt="image" src="https://user-images.githubusercontent.com/36487705/231492977-0a9b8104-3e14-43b9-9b34-187b22f5c2b3.png">
This is a simple web app for creating and storing encrypted notes, built using React, Golang, and MongoDB. All notes are encrypted end-to-end, meaning that only the user can access their own notes, and even the server administrators cannot read them.

Features
Create, read, update, and delete encrypted notes
All notes are encrypted end-to-end using AES-GCM encryption
Password-based encryption with key derivation using scrypt
Secure login with authentication and session management
Responsive and intuitive user interface built using React
Backend API built using Golang and MongoDB
Dockerized deployment for easy setup and portability
Getting Started
To run this app on your local machine, you will need to have Docker installed. Once Docker is installed, follow these steps:

Clone this repository: git clone https://github.com/yourusername/encrypted-notes-app.git
Navigate to the project directory: cd encrypted-notes-app
Start the Docker containers: docker-compose up -d
Open your web browser and go to http://localhost:3000
You should now see the login page for the app. You can create a new account and start creating encrypted notes.

Architecture
The app consists of two main components: a frontend built using React, and a backend API built using Golang and MongoDB.

The frontend communicates with the backend API using HTTP requests and JSON data. All data is encrypted end-to-end using the user's password as the encryption key.

The backend API is responsible for storing and retrieving encrypted notes from MongoDB. It also handles user authentication and session management using JSON Web Tokens (JWT).

Contributing
Contributions to this project are welcome! If you find a bug or have a feature request, please open an issue. If you would like to contribute code, please fork the repository and submit a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.



