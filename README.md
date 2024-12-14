# FormCraft - README

## Project Overview

FormCraft is a versatile platform for creating, managing, and submitting forms. It supports features like user authentication, form duplication, tracking submission counts, and more.

Live URL: [FormCraft](https://form-craft-eight.vercel.app)

## Features

- Create and manage forms.
- User authentication via Supabase.
- Real-time tracking of form submissions.
- Clone (duplicate) forms.
- Responsive design for desktop and mobile.

---

## Running the Project Locally

### Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. Supabase Project
4. Docker (optional, for containerized deployment)

### Environment Variables

Create a `.env.local` file in the root of the project and populate it with the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_PROJECT_REF=your_project_ref
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zenrsr/form-craft.git
   cd form-craft
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Visit the application in your browser:
   ```
   http://localhost:3000
   ```

### Using Docker (Optional)

To run the project using Docker:

1. Build the Docker image:

   ```bash
   docker build -t form-craft .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 --env-file .env.local form-craft
   ```

3. Visit the application in your browser:
   ```
   http://localhost:3000
   ```

---

## API Documentation

### Base URL

The live base URL for all API requests:

```
https://form-craft-eight.vercel.app/api
```

### Authentication

The app uses Supabase for user authentication. Ensure you include the necessary cookies for authenticated routes.

### Endpoints

#### 1. **Create a Form**

- **URL**: `/forms/save`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Form Title",
    "description": "Form Description",
    "fields": [
      { "label": "Email", "type": "email", "required": true },
      { "label": "Name", "type": "text", "required": true }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "form": { "id": "form_id", "title": "Form Title" }
  }
  ```

#### 2. **Fetch Forms**

- **URL**: `/forms/list`
- **Method**: GET
- **Headers**: Authenticated cookies required.
- **Response**:
  ```json
  [
    {
      "id": "form_id",
      "title": "Form Title",
      "submissions": 10
    }
  ]
  ```

#### 3. **Submit a Form**

- **URL**: `/forms/submit`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "formId": "form_id",
    "responses": {
      "field_id_1": "user response",
      "field_id_2": "user response"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "submissionId": "submission_id"
  }
  ```

#### 4. **Duplicate a Form**

- **URL**: `/forms/save`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Form Title (Copy)",
    "description": "Form Description",
    "fields": [
      { "label": "Email", "type": "email", "required": true },
      { "label": "Name", "type": "text", "required": true }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "form": { "id": "form_id_copy", "title": "Form Title (Copy)" }
  }
  ```

---

## Testing API Endpoints with Postman

### Steps to Test

1. **Download and Install Postman**:

   - [Download Postman](https://www.postman.com/downloads/)

2. **Create a New Collection**:

   - Open Postman and create a new collection named "FormCraft API".

3. **Set Up Base URL**:

   - Use the base URL `https://form-craft-eight.vercel.app/api` for all endpoints.

4. **Add Requests**:

   - Add requests for each API endpoint as described in the documentation above.
   - Example:
     - **Name**: `Create a Form`
     - **Method**: POST
     - **URL**: `/forms/save`
     - **Headers**: `Content-Type: application/json`
     - **Body**:
       ```json
       {
         "title": "Sample Form",
         "description": "This is a sample form",
         "fields": [{ "label": "Email", "type": "email", "required": true }]
       }
       ```

5. **Include Authentication**:

   - For authenticated endpoints, ensure cookies are captured by logging into the application in your browser and importing cookies into Postman.
     - Go to **Postman Settings > Cookies**.
     - Import cookies for the domain `https://form-craft-eight.vercel.app`.

6. **Send Requests**:
   - Click **Send** to test the API endpoints and verify responses.

### Saving and Exporting the Collection

1. After configuring all endpoints, save the collection.
2. Export the collection for sharing or reusability:
   - Click on the collection.
   - Click **Export**.
   - Save the JSON file for sharing.

---

## Support

For issues or support, please reach out via GitHub issues.

---

Happy Coding!
