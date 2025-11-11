# 🧩 Frontend Take-Home Task — Member Management Panel

Welcome to the **Senior Frontend Engineer** take-home assignment.

Your goal is to build a small **Member Management Panel** using the provided mock API and the pre-configured React + TypeScript project in this repository.

This task focuses on functionality, architecture, and reasoning — **we will not be judging the styling**.

To start, please fork this repository. Any work you do should be committed to that repo. Once you're done, share the link to your repo with the finalized code with us. Please make sure that we have sufficient permissions to view the repository.

We expect you to spend a maximum of 3 hours on this task. Please record your screen while you work on the assignment. Voiceover explaining your thought process is welcome, but not required.
---

## 🎯 Task Overview

Build a simple admin panel that allows:

1. Viewing a paginated list of members  
2. Adding a new member  
3. Viewing and editing member details  
4. Deleting members  
5. Uploading or changing a member’s profile photo

---

## ⚙️ Project Setup

1. **Fork this repository** to your own GitHub account.  
2. Install dependencies and start the app:

```bash
yarn
yarn dev
```

3. You will be provided with an **API key** before starting.  
   Use the same key consistently for all API requests — **it is what connects the data on the backend to you.**

The project is already set up with React, TypeScript, React Router, Material UI, styled-components and Vite.  
You may install other libraries or tools if you believe they improve your solution.

---

## 🧠 Requirements

### 1) Members List Page (`/`)
- Fetch and display members from the API with pagination (`page` / `limit`).
- Show each member’s name, date of birth, sex, status, and photo (if available).
- Allow adding a new member.
- Clicking a member opens their detail view.

### 2) Member Details Page (`/members/:id`)
- Fetch a single member by ID.
- Allow editing all fields and updating the profile photo.
- Allow deleting a member with confirmation.

### 3) General
- Include the provided API key in every request using the `X-Api-Key` header.
- Use TypeScript across the project.
- Structure your code as if it were part of a production application. Design it with scalability and long-term maintainability in mind (as much as possible within the time constraints).

---

# 🧰 API Documentation

You’ll use the **Mock Members API**, a stateless backend for creating, reading, updating, and deleting members.

---

## Base URL

```
https://mock-members-api-154716608073.us-central1.run.app/
```

---

## Authentication

All endpoints require an API key via the `X-Api-Key` header.

```
X-Api-Key: <your-provided-key>
```

You will receive this key before starting the task.  
Each key corresponds to an isolated data namespace.

---

## Data Types

### Member Object

```typescript
{
  id: string;             // UUID or string ID
  firstName: string;
  lastName: string;
  dateOfBirth: string;    // "YYYY-MM-DD"
  sex: "male" | "female" | "other";
  status: "ACTIVE" | "PAUSED";
  photoUrl: string | null; // data URL when uploaded, else null
  createdAt: string;      // ISO datetime
  updatedAt: string;      // ISO datetime
}
```

### Paginated Response

```typescript
{
  data: Member[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
```

### Error Response

```typescript
{
  error: string;
  details?: any;
}
```

---

## Endpoints

---

### 1) List Members (Paginated)
**GET** `/members?page=1&limit=10`  
Returns a paginated list of members. On the first request, the namespace initializes with 5 default members.

**Query Params:**
- `page` (number, default 1)
- `limit` (number, default 10)

**Response:**
```json
{
  "data": [
    {
      "id": "m-1",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1985-06-15",
      "sex": "male",
      "status": "ACTIVE",
      "photoUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalItems": 5,
  "totalPages": 1
}
```

**Errors:**
- `400 Bad Request` – invalid `page` or `limit`  
- `401 Unauthorized` – missing API key

---

### 2) Get Single Member
**GET** `/members/:id`  
_Authentication required._

**Response:**
```json
{
  "id": "m-1",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1985-06-15",
  "sex": "male",
  "status": "ACTIVE",
  "photoUrl": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `404 Not Found` – member not found

---

### 3) Create Member
**POST** `/members`  
`Content-Type: application/json`  
_Authentication required._

**Body:**
```json
{
  "firstName": "Ava",
  "lastName": "Kim",
  "dateOfBirth": "1992-03-21",
  "sex": "female",
  "status": "ACTIVE"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "firstName": "Ava",
  "lastName": "Kim",
  "dateOfBirth": "1992-03-21",
  "sex": "female",
  "status": "ACTIVE",
  "photoUrl": null,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Errors:**
- `400 Bad Request` – validation errors  
- `401 Unauthorized` – missing API key

---

### 4) Update Member
**PATCH** `/members/:id`  
`Content-Type: application/json`

All fields are optional; at least one must be provided.

**Example Body:**
```json
{
  "firstName": "Jonathan",
  "status": "PAUSED"
}
```

**Response:**
```json
{
  "id": "m-1",
  "firstName": "Jonathan",
  "lastName": "Doe",
  "dateOfBirth": "1985-06-15",
  "sex": "male",
  "status": "PAUSED",
  "photoUrl": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T10:35:00.000Z"
}
```

**Errors:**
- `400 Bad Request` – invalid or empty update  
- `404 Not Found` – member not found

---

### 5) Delete Member
**DELETE** `/members/:id`

**Response:**
```json
{ "success": true }
```

**Errors:**
- `404 Not Found` – member not found

---

### 6) Upload Member Photo
**PUT** `/members/:id/photo`  
`Content-Type: multipart/form-data`

**Form Field:**

| Field | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | JPEG, PNG, or WebP image |

**Constraints:**
- Max size: 3 MB  
- Allowed types: `image/jpeg`, `image/png`, `image/webp`

**Response:**
```json
{ "photoUrl": "data:image/png;base64,iVBOR..." }
```

**Errors:**
- `400 Bad Request` – missing or invalid file  
- `404 Not Found` – member not found  
- `413 Payload Too Large` – exceeds 3 MB  
- `415 Unsupported Media Type` – invalid type

---

## ⚠️ Notes

- Each provided API key has **isolated data**.  
- Data persists in memory while the service is running.  
- The first `GET /members` request initializes your namespace with 5 default members (`m-1` → `m-5`).  
- Default member limit: **1,000** per key; max **200** photos per key.  

---

## 🚀 Submission

1. Push your fork to your GitHub account.  
2. Ensure the app runs locally with:

```bash
yarn
yarn dev
```

3. Include a short section in your README explaining:
   - Any assumptions you made  
   - How you approached data fetching and state management  
   - Any trade-offs or shortcuts you took  

Then share the repository link.

Good luck!