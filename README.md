# BLOGGING-WEBSITE

<!-- ## preview -->

## Deployments
- Frontend deployed link [https://blogging-website-sepia.vercel.app/](https://blogging-website-sepia.vercel.app/) to view frontend
- Backend deployed link [https://blogging-website-5l8x.onrender.com](https://blogging-website-5l8x.onrender.com) to view backend

## Getting started

To get the frontend running locally:
- Clone this repo
- `cd Blogging-website-frontend` to move to frontend folder
- `npm install` to install all req'd dependencies
- `npm run dev` to start the local server (this project Vite)
  
  - Open [http://localhost:5173](http://localhost:5173) to view it

## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone). It uses a custom API for all requests, including authentication.

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRUD users (sign up & settings page - no deleting required)
- CRUD Articles
- CRDD Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

**The general page breakdown looks like this:**

- Home page (URL: https://blogging-website-sepia.vercel.app/ )
    - List of tags
    - List of articles pulled from either Feed, Global, or by Tag
    - Pagination for list of articles
- Sign in/Sign up pages (URL: [/#/login](https://blogging-website-sepia.vercel.app/login), [/#/register](https://blogging-website-sepia.vercel.app/register) )
    - Use JWT (store the token in localStorage)
- Settings page (URL: [/#/settings](https://blogging-website-sepia.vercel.app/settings) )
- Editor page to create/edit articles (URL: /#/editor, /#/editor/article-slug-here )
- Article page (URL: /#/article/article-slug-here )
    - Delete article button (only shown to article's author)
    - Render markdown from server client side
    - Comments section at bottom of page
    - Delete comment button (only shown to comment's author)
<!-- - Profile page (URL: /#/@username, /#/@username/favorites )
    - Show basic user info
    - List of articles populated from author's created articles or author's favorited articles -->

<br />



