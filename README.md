# Markdown Blog
This is a full stack, functioning blog I built for practice.  When spun up, any visitor can write or edit any entry.  I haven't added user sessions yet because I built this over the weekend, but the Editor (`/editor`) and Home (`/`) views both work for creating, fetching, and updating articles via the browser app, with corresponding updates to PostgreSQL database on the backend.  This includes scripts for automating the building of the database.

Right now the statics can be served from anywhere, and the server runs on port 8081.  The frontend looks for `localhost:8081` as the base for the API, but the api base url formation is wrapped in a function with a one line, variable assignment update to point it to an actual base domain, and nothing else will need to be changed for it to function.

## Website Layout
### Editor
At the website's `/editor` path, the user can click any existing article and edit its fields and content.  The content is edited in markdown and stored as such in the backend database, and the markdown is converted to HTML with showdownjs by the frontend after it is fetched for viewing in the home (`/`) page.

It's worth noting that in its current state, **anyone visiting the site can edit or create any article**.  I just made this for practice so I didn't get to setting up the user session logic, but it wouldn't be too much extra work now that everything else works.

## Home
The root path of the website lists the articles available.  When one list item is clicked, it fetches the full article data, converts the markdown body text to HTML, hides the listing and renders the article.


## Backend
You can read more about the backend server & PostgreSQL logic [here](backend/)