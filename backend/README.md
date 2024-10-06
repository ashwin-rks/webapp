# Skill Assessment Project

## Backend Setup

This project is built using Node.js, npm, and PostgreSQL.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

```bash
node -v
npm -v
```

### Setup Instructions

1. Clone the repository or navigate to your project directory.
2. Run the following command to install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the project with the following variables:

   ```plaintext
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/YOUR_DATABASE_NAME"
   JWT_SECRET_KEY="your_jwt_secret_key"
   ```

   Replace `USER`, `PASSWORD`, and `YOUR_DATABASE_NAME` with your PostgreSQL credentials.

4. Run the following commands to set up Prisma:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma seed
   ```

5. Finally, start the server:

   ```bash
   npm run start
   ```

   Make sure port **8000** is free.

