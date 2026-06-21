# 📸 Backend Image Upload API

A production-ready **Node.js REST API** for managing posts with image uploads, built with **Express.js**, **MongoDB (Mongoose)**, **Multer**, and **ImageKit** for cloud media storage.

---

## 🚀 Features

- **Full CRUD** operations for posts (Create, Read, Update, Delete)
- **Cloud image upload** using ImageKit — no local disk storage
- **Memory-based file buffering** with Multer (`memoryStorage`) for efficient handling
- **Automatic old image cleanup** on post update — deletes from ImageKit before uploading new file
- **Cascading delete** — removes image from cloud when post is deleted
- **MongoDB + Mongoose** for persistent, schema-validated data storage
- **Environment-based config** using `.env` and `dotenv`
- Clean **service-layer architecture** — storage logic is decoupled from route handlers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB (via Mongoose v9) |
| File Upload | Multer v2 (memory storage) |
| Image CDN | ImageKit (`@imagekit/nodejs`) |
| Config | dotenv |
| Dev Server | Nodemon |

---

## 📁 Project Structure

```
Backend-Image-Upload/
├── server.js                  # Entry point — DB connection + server boot
└── src/
    ├── app.js                 # Express app + all route definitions
    ├── db/
    │   └── db.js              # MongoDB connection logic
    ├── models/
    │   └── post.model.js      # Mongoose Post schema
    └── services/
        └── storage.service.js # ImageKit upload/delete abstraction
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/prempscode/Image_post-NodeJS.git
cd Image_post-NodeJS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

> Get your ImageKit private key from [imagekit.io](https://imagekit.io) → Developer options.

### 4. Start the server

```bash
# Development (with auto-reload)
npx nodemon server.js

# Production
node server.js
```

Server runs on **http://localhost:3000**

---

## 📡 API Endpoints

### `GET /posts`
Fetch all posts.

**Response:**
```json
{
  "message": "post showed up",
  "fetchedPosts": [ ... ]
}
```

---

### `POST /create-post`
Create a new post with an optional image.

**Request:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `caption` | string | No |
| `image` | file | No |

**Response:**
```json
{
  "message": "post created successfully",
  "post": {
    "_id": "...",
    "caption": "My first post",
    "image": "https://ik.imagekit.io/...",
    "fileId": "imagekit_file_id"
  }
}
```

---

### `PATCH /posts/:id`
Update a post's caption and/or image. If a new image is provided, the old one is **automatically deleted from ImageKit**.

**Request:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `caption` | string | No |
| `image` | file | No |

**Response:**
```json
{
  "message": "Post updated",
  "post": { ... }
}
```

---

### `DELETE /posts/:id`
Delete a post. If the post has an image, it is **removed from ImageKit** before deletion.

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

---

## 🧠 Architecture Highlights

### Why `memoryStorage`?
Instead of saving files to disk temporarily, this API buffers the uploaded file directly in memory as a `Buffer`. This allows immediate base64 encoding and upload to ImageKit without touching the filesystem — cleaner and more cloud-friendly.

```js
const upload = multer({ storage: multer.memoryStorage() });
```

### Service Layer Pattern
All ImageKit interactions are isolated in `storage.service.js`. Routes simply call `uploadFile(buffer)` and `deleteFile(fileId)`, keeping business logic clean and the storage provider easy to swap.

```js
// storage.service.js
async function uploadFile(buffer) {
  return await imageKit.files.upload({
    file: buffer.toString("base64"),
    fileName: "image.jpg",
  });
}
```

### Automatic Cleanup on Update
When a post's image is replaced, the old `fileId` (stored in MongoDB) is used to delete the previous file from ImageKit before uploading the new one — preventing orphaned files in the CDN.

---

## 📦 Dependencies

```json
{
  "@imagekit/nodejs": "^7.8.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "imagekit": "^6.0.0",
  "mongoose": "^9.7.1",
  "multer": "^2.2.0",
  "nodemon": "^3.1.14"
}
```

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `MONO_URI` | MongoDB connection string |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key |

---

## 📌 Future Improvements

- [ ] Add input validation (e.g., Joi or Zod)
- [ ] Add authentication middleware (JWT)
- [ ] Paginate `GET /posts` response
- [ ] Support multiple image uploads per post
- [ ] Add error handling middleware
- [ ] Write unit and integration tests

---

## 👨‍💻 Author

Built with ❤️ by [Prem](https://github.com/prempscode)  
Feel free to ⭐ the repo if you found it useful!
