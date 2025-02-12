# Taskly - Manage Tasks and Todos

## Overview

**Taskly** is a project I developed as I was practising the implementation
of PostgreSQL, Sequelize and express ts. With taskly, you can create and manage daily tasks and todo lists related to household chores, health, studies or work.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Environment Variables](#environment-variables)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Project Structure](#project-structure)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- Email Password Authentication, no verification required.
- Cookie based JWT token authentication.
- Create, Edit, Manage and Delete Tasks and Todos.

---

## Technologies Used

- **Language:** [TypeScript]
- **Framework and Packages:** [Express.ts, Node.ts, Sequelize, PostgreSQL]
- **Database:** [MySql]
- **Authentication:** [Cookies, JWT]
- **Other Tools:**
  - Logging: [Morgan]
  - Environment Configuration: [dotenv]
  - API Documentation: [Postman]

---

## Setup and Installation

### Prerequisites

1. Install [Node.js](https://nodejs.org/) and npm.
2. Clone the repository:
   ```bash
   git clone https://github.com/PritamU/chatly_backend
   cd your-repo
   ```

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (see [Environment Variables](#environment-variables)).

3. Start the application:

   - Development:
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm run start
     ```

4. Access the application at [http://localhost:PORT](http://localhost:PORT).

---

## Environment Variables

Create a `.env` file in the root of the project and configure the following variables:

```plaintext
PORT=The Port Where the application runs
NODE_ENV=The Environment (development and production)
CORS_DOMAIN=Domains allowed by cors seperated by comma (domain1.com,domain2.com)
COOKIE_DOMAIN=Domain Allowed to set cookie
JWT_SECRET=secret key used to generate JWT token
SUPER_ADMIN_USERNAME=username for a superadmin for admin dashboard
SUPER_ADMIN_PASSWORD=password for a superadmin for admin dashboard
DB_USERNAME = Username for PostgreSQL Database Connection
DB_PASSWORD = Password for PostgreSQL Database Connection
DB_DATABASE = Database name for PostgreSQL Database Connection
DB_HOST = Host name for PostgreSQL Database Connection
DB_DIALECT = Dialect for PostgreSQL Database Connection
```

---

## Database Design

### Schema

#### Example Models:

1. **Admins**

   - `id` (Primary Key)
   - `name` (Name of the user assigned randomly)
   - `username` (Username of the admin to be used for log in credentials)
   - `password` (password of the admin to be used for log in credentials)
   - `isPrimary` (boolean to define if it's a primary admin or not)
   - `status` (boolean to identify an active or disabled admin)

2. **Users**

   - `id` (Primary Key)
   - `index` (Auto Increment Numeric Index)
   - `status` (Boolean to identify active and inactive user)
   - `email` (User Email)
   - `name` (Name of the user)
   - `password` (Account Password)
   - `search_vector` (Vector to assist search logic)

3. **Todos(Tasks)**
   - `id` (Primary Key)
   - `index` (Auto Increment Numeric Index)
   - `userId` (ID of the user who created the task, can be referenced)
   - `title` (Title of the task)
   - `description` (Title of the task)
   - `status` (Current Status of the Task. Possible Values : pending,in-progress,completed,paused)
   - `tag` (Tag associated with the task, is of datatype string)
   - `priority` (Priority given to the task. Possible Values : low, medium, high)
   - `startAt` (Start Time of the Task)
   - `endAt` (Task Deadline)
   - `subTasks` (Array of Objects consisting of two fields - title(string), status(boolean))
   - `search_vector` (Index to assist in search logic)

---

## API Documentation

API documentation is available at Postman Collection.

## Project Structure

```plaintext
src/
├── config/             # Configuration files (e.g., database config)
├── controllers/        # Route controllers
├── middleware/         # Custom middleware (e.g., auth, validation)
├── constants/          # Const values
├── models/             # Database models (e.g., Sequelize)
├── migrations/         # Database migrations
├── routes/             # API routes
├── utils/              # Utility functions
├── types/              # Type Definitions and Interfaces
├── index.ts            # Main application entry point and server setup
```

---

## Deployment

### Docker

1. Build the Docker Image:

```powershell
    docker-compose build
```

2. Run the Container:

```powershell
    docker-compose up

```

### Hosting Platform

- Render (https://taskly-backend.pritamupadhya.site)
- Netlify (For Frontend - https://taskly.pritamupadhya.site)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Contributions are not accepted currently.

---

## License

This project is not really licensed to be honest.

---

## Contact

For questions or support, reach out to:

- **Name**: [Pritam Upadhya]
- **Email**: [contactpritam2@gmail.com]
- **GitHub**: [https://github.com/PritamU]
- **Portfolio**: [https://pritamupadhya.site]
