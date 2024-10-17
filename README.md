# 🚀 VentureVoice - A Full-Stack Blog Platform developed using ReactJS, Node.js, Express, and SQL, designed for sharing startup news and blogs.

In today’s startup ecosystem, a robust content platform can set you apart. Here’s a quick rundown of building a full-stack blog platform using **React**, **MySQL**, and **Express**, which is flexible, scalable, and allows users to create dynamic, engaging content.

## 🌟 Key Features:

- **🏠 Homepage**: Fetches all posts from the MySQL database. Posts are categorized (e.g., Business, Innovation, Lifestyle).
- **📝 Single Post View**: Clicking a post shows its content along with author details. Only the owner can edit or delete the post.
- **🖋️ Rich Text Editor**: Integrated with `ReactQuill` for styling, users can format text and upload images.
- **🖼️ Image Storage**: Images are stored on a server, with only the URL saved in the database.
- **📂 Post Categories**: Categories like Finance, Sustainability, and Health & Wellness help organize content, with the URL updating dynamically based on category selection.
- **🔗 Sidebar Recommendations**: Shows similar posts based on the current post's category or the author’s other posts.
- **🧭 Routing**: `React Router DOM` is used for smooth navigation between pages.
- **🔒 Authentication & Authorization**: Using `JWT (JSON Web Tokens)` for secure access, ensuring only the post creator can edit or delete content.

## ⚙️ Backend (API):

The backend uses **Express** to interact with **MySQL**. 

- **👤 User Table**: Contains user info (id, username, email, password).
- **📑 Post Table**: Stores post details (id, title, description, category, and image URL).
- 🖼️ Images are stored on a server while their URLs are saved in the database for easy access.

## 🔐 Authentication Flow:

JWT (JSON Web Token) is utilized for both authentication and authorization. Upon a successful login, the user's JWT token is securely stored in **HttpOnly cookies** 🍪, ensuring that the token is inaccessible to client-side JavaScript, which helps prevent **XSS (Cross-Site Scripting) attacks**. The token confirms the user's identity and grants access to sensitive actions such as editing or deleting data, while also ensuring secure transmission over **HTTPS**.

To efficiently manage session states across components, **non-sensitive user data** like `email`, `ID`, and `username` are stored in `localStorage`. This approach minimizes security risks, as the actual token handling and authorization logic remain protected, with the JWT securely stored in cookies.

This strategy streamlines session management, enabling a smooth user experience while maintaining strong security controls.

## 🔒 Security & Data Management:

- **🔑 Bcrypt.js** encrypts user passwords.
- Posts and user data are managed through **SQL foreign keys**, ensuring data integrity. If a user is deleted 🗑️, all their posts are deleted, providing an organized content lifecycle.
