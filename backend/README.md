# Markdown Blog: Backend
This is the vanilla NodeJS & PostgreSQL backend of the Markdown Blog.  Scripts encapsulate the build and run logic, making it quite simple.

## Instructions
Follow these instructions to build and run the app.  Three simple steps.
1. Run `npm install` in the `backend/` directory to install the npm packages.
2. Run `npm run init` to initialize the app.
    * Right now this just runs `npm run init_db`, which in turn runs the `init_db.sh` script that builds the DB, installs the DB extensions, and builds the DB tables.
3. Run `npm start` to run the server.

## Structure
### `backend/src/`
Contains the NodeJS server and database query logic.

### `backend/src/server.js`
The NodeJS server code.  This defines the endpoints and the business logic in each.  In a logic project I would break this up into different files with their own routers, usually organized by REST resource like `/api/articles/*` and `/api/users/*`

### `backend/src/db.js`
This is the Node-PostgreSQL database query library.  Here you can see the exact SQL queries used for each REST operation

### `backend/pg`
Contains the psql scripts to build the DB and tables, and the `init_db.sh` script (run with `npm run init` or `npm run init_db`) which orchestrates all of these
