# CRUD API (nodejs-ts-crud-api)
This project is a Node.js application written in TypeScript. It includes scripts for development, building, and running the application in production, as well as code formatting and cleanup tasks.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 22 or above)
- [npm](https://www.npmjs.com/) (version 10 or above)

## Getting Started

### Installation

```bash
npm install
```
###  Environment Variables
Create (Update) a .env file in the root directory to configure environment variables (e.g., PORT):
```bash
PORT=3000
```
## Available Scripts
Here is a list of npm scripts that you can use to manage the project:

### 1. `npm run clean`

Deletes the `dist` folder. Use this to clean up the compiled output before building the project.

```bash
npm run clean
```

###  2. `npm run format`
Formats the TypeScript code using Prettier. This will automatically reformat all .ts files in the src folder.

```bash
npm run format
```
###  3. `npm run build`
Compiles the TypeScript code into JavaScript. The output will be placed in the dist folder.

```bash
npm run build
```

###  4. `npm run start:dev`
Runs the application in development mode using ts-node and nodemon. The server will restart automatically whenever you make changes to the source code.

```bash
npm run start:dev
```

###  5. `npm run start:prod`
Runs the application in production mode. Make sure to build the project first using npm run build.
```bash
npm run start:prod
```

###  6. `npm test`
Runs the test scripts.
```bash
npm run test
```