# Markdown Blog
This is a full stack, functioning blog I built for practice.  When spun up, any visitor can write or edit any entry.  I haven't added user sessions yet because I built this over the weekend, but the Editor (`/editor`) and Home (`/`) views both work for creating, fetching, and updating articles via the browser app, with corresponding updates to PostgreSQL database on the backend.  This includes scripts for automating the building of the database.

Right now the statics can be served from anywhere, and the server runs on port 8081.  The frontend looks for `localhost:8081` as the base for the API, but the api base url formation is wrapped in a function with a one line, variable assignment update to point it to an actual base domain, and nothing else will need to be changed for it to function.