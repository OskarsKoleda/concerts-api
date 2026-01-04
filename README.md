# Concerts API

This is a backend training project built with **Node.js** and **TypeScript**. It serves as the API for the Concerts frontend application, managing events, user authentication, and event visitation tracking.

## Project Purpose

This repository was created as a hands-on learning project to master modern backend development patterns, including:

- RESTful API design.
- Secure authentication and authorization.
- Database modeling and complex queries with MongoDB.
- Automated testing (Unit & Integration).
- External service integration (Cloudinary for image management).

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Joi
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt
- **File Handling:** Multer & Cloudinary API
- **Testing:** Jest & Supertest
- **Utilities:** Slugify, Lodash, Cross-env

## Related Projects

- **Frontend Repository:** [Concerts FE](https://github.com/OskarsKoleda/concerts)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)
- Cloudinary account for image uploads

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure your environment variables (DB URI, JWT Secret, Cloudinary credentials).
4. Run the development server:
   ```bash
   npm run dev
   ```

### Running Tests

To run the full test suite (unit and integration tests):

```bash
npm test
```
