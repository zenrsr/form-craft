# Form Craft

Welcome to the **Form Craft** project! This is a web application designed for creating, managing, and submitting forms. This README provides instructions on how to set up the project locally, details of its API, and guidelines for contributing.

---

## Live Demo

The live application is deployed at: **[Form Craft on Vercel](https://form-craft-eight.vercel.app)**

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- (Optional) [Docker](https://www.docker.com/)

---

## Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/zenrsr/form-craft.git
cd form-craft
```

### 2. Install Dependencies

Install all necessary packages using npm or yarn:

```bash
npm install
# OR
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and configure the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SUPABASE_PROJECT_REF=<your-supabase-project-ref>
```

Make sure these variables match your Supabase project settings.

### 4. Start the Development Server

Run the application locally:

```bash
npm run dev
# OR
yarn dev
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## Running with Docker (Optional)

### 1. Build the Docker Image

```bash
docker build -t form-craft .
```

### 2. Run the Docker Container

```bash
docker run -p 3000:3000 --env-file .env.local form-craft
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## API Documentation

The following API routes are available:

### **1. Save Form**

**POST** `/api/forms/save`

- **Description**: Saves a new form or duplicates an existing form.
- **Request Body**:
  ```json
  {
    "title": "Form Title",
    "description": "Form Description",
    "fields": [{ "label": "Field Label", "type": "text", "required": true }]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "form": {
      "id": "123",
      "title": "Form Title",
      "description": "Form Description",
      "fields": [ ... ]
    }
  }
  ```

---

### **2. List Forms**

**GET** `/api/forms/list`

- **Description**: Retrieves a list of all forms created by the user.
- **Response**:
  ```json
  [
    {
      "id": "123",
      "title": "Form Title",
      "description": "Form Description",
      "fields": [ ... ],
      "submissionCount": 10
    }
  ]
  ```

---

### **3. Submit Form**

**POST** `/api/forms/submit`

- **Description**: Submits responses to a form.
- **Request Body**:
  ```json
  {
    "formId": "123",
    "responses": {
      "FieldID": "Response",
      "AnotherFieldID": "Another Response"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "submissionId": "456"
  }
  ```

---

### **4. Get Form Details**

**GET** `/api/forms/:formId`

- **Description**: Fetches details of a specific form by ID.
- **Response**:
  ```json
  {
    "id": "123",
    "title": "Form Title",
    "description": "Form Description",
    "fields": [ ... ]
  }
  ```

---

### Postman Collection

Use the following steps to test the API using Postman:

1. Download the Postman collection: **[Postman Collection](https://example.com/form-craft-postman.json)**.
2. Import it into Postman.
3. Configure the environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## Contribution

We welcome contributions! Please follow the steps below:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

---

For any issues or support, contact **support@formcraft.com**.
