# Blogging-Website

[![wakatime](https://wakatime.com/badge/user/018d8a5a-cab1-4ae5-8c4a-50cef4948510/project/0c780a41-1f8b-4729-9422-d23507e75908.svg)](https://wakatime.com/badge/user/018d8a5a-cab1-4ae5-8c4a-50cef4948510/project/0c780a41-1f8b-4729-9422-d23507e75908)

<figure><embed src="https://wakatime.com/share/@018d8a5a-cab1-4ae5-8c4a-50cef4948510/a816097e-3502-4990-a595-e19f8a36f65a.svg"></embed></figure>

**Blogging-Website** is a software that provides a social blogging platform with various features and functionalities. The software allows users to create and manage their blogs, as well as interact with other users through comments and favorites.

## Key Features

- **User Authentication**: Blogging-Website uses JWT (JSON Web Tokens) for user authentication, allowing users to log in and sign up for an account.
  
- **CRUD Operations**: The software provides full CRUD (Create, Read, Update, Delete) functionality for users, articles, and comments.

- **Article Management**: Blogging-Website allows users to create, edit, and delete articles, as well as view a list of articles pulled from either a feed, global feed, or by tag.

<!-- - **Pagination**: The software provides pagination for lists of articles, allowing users to view a certain number of articles per page. -->

<!-- - **Favoriting Articles**: Users can favorite articles, making it easy to access their favorite articles.

- **Following Other Users**: Blogging-Website allows users to follow other users, giving them the ability to see the latest articles published by the users they follow. -->

## General Page Breakdown

Here’s an overview of the main pages of Blogging-Website:

### Home Page
- **URL**: [https://blogging-website.3sangeetha3.me/](https://blogging-website.3sangeetha3.me/)
- Displays:
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for the list of articles

### Sign In/Sign Up Pages
- **Sign In URL**: `/#/login`
- **Sign Up URL**: `/#/register`
- User authentication using JWT (JSON Web Tokens), where the token is stored in `localStorage`.

### Settings Page
- **URL**: `/#/settings`
- Allows users to modify their profile information.

### Editor Page
- **URL**: `/#/editor`
- **Edit Article URL**: `/#/editor/article-slug-here`
- This page allows users to create or edit articles.

### Article Page
- **URL**: `/#/article/article-slug-here`
- Displays the full article content and includes:
  - A delete button for the article (only shown to the article's author)
  - Markdown rendering on the client-side from the server
  - A comments section at the bottom of the page
  - A delete comment button (only shown to the comment's author)

### Profile Page
- **URL**: `/#/@username`
- Displays the user’s profile with a list of their articles and favorited articles.

---

<!-- ## Installation Guide

To install **BLOGGING-WEBSITE**, follow these steps:

### Step 1: Clone the Repository
Open your terminal and navigate to the directory where you want to install **BLOGGING-WEBSITE**. Then, clone the repository using the following command:

```bash
git clone https://github.com/3sangeetha3/BLOGGING-WEBSITE.git
``` -->
## Installation Guide

To install BLOGGING-WEBSITE, follow these steps:

### Prerequisites:
- Ensure you have **Node.js** and **npm** installed on your system.

### Steps:
1. Clone the repository:
    ```bash
    git clone https://github.com/3sangeetha3/BLOGGING-WEBSITE.git
    ```
2. Navigate to the project directory:
    ```bash
    cd BLOGGING-WEBSITE
    ```
3. Install the required dependencies using npm:
    ```bash
    npm install
    ```
4. Navigate to the Frontend Directory:
   ```bash
   cd Blogging-website-frontend
   ```
   - Start the frontend:
    ```bash
    npm run dev
    ```
    This command will start the local server, and you can access the frontend of BLOGGING-WEBSITE by navigating to http://localhost:5173 in your browser.

5. Navigate to the Backend Directory:
   ```bash
   cd Blogging-website-Backend 
   ```
   - Start the backend:
    ```bash
    npm run dev
    ```
   This command will start the backend server, and you can access the backend of BLOGGING-WEBSITE by navigating to http://localhost:3000

---
## Environment Variables

Before running the **BLOGGING-WEBSITE**, you need to create a `.env` file in the root of the project to store your environment variables. 

### Steps to Create a `.env` File

1. Create a new file named `.env` in the root directory of the project.
2. Add the following environment variables to the `.env` file:

```plaintext
PORT=3000
DATABASE_URI=your_database_uri_here
ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

### Important Notes

- Replace `your_database_uri_here` with your actual MongoDB connection string.
- Replace `your_access_token_secret_here` with a secure secret for your access tokens.
- Make sure to keep your `.env` file private and do not share it publicly.

---

## Show your support

Give a ⭐️ if this project helped you!


Thank you for using **Blogging-Website**! We hope it enhances your blogging experience. Stay tuned for future updates.
