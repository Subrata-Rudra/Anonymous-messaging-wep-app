# 💌 Anonymous Messaging Web App - Benami (Bengali meaning of Anonymous)

An open-source, privacy-first anonymous messaging web app where users can get to know what others think about them by receiving anonymous messages from others — built with Node.js, Express, MongoDB, Redis, BullMQ, Server-Sent Events (SSE), React.js, HTML, CSS, JavaScript.

## 💻 Demo
<img src="./Readme Media/Anonymous Messaging Web App Demo.gif" alt="Demo GIF" width="300" height="660">

## 🌐 Live Demo

🚀 [Try it out on Vercel »](https://benami.vercel.app)

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Redis (for using message queue in BullMq for Server-Sent-Events)
- **Deployment:** Vercel (Frontend), Render (Backend), Render (Redis), MongoDB Cloud (MongoDB)

## ✨ Features

- ✅ **Anonymous Messaging** — Anyone can send a message anonymously without logging in.
- 🔐 **Easy User Authentication** — Register with just an username, no credentials needed.
- 📨 **Inbox** — View all messages sent to your unique anonymous Username.
- 🌊 **Real-time Notifications** — Get Real-time update of newly received messages powered by Server-Sent Events (SSE).
- 📊 **Message Queue System** — BullMQ + Redis handles background jobs like real-time notifications of newly received messages.
- ⏯️ **Pause and Resume Link** - Pause link to stop getting messages and resume it to resume getting messages anytime with just one click.
- 🗑️ **Delete Account** - Delete account when required with just a click.
---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   https://github.com/Subrata-Rudra/Anonymous-messaging-wep-app.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd Anonymous-messaging-wep-app
   ```
3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
4. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Configuration

1. **Set up environment variables for backend:**
   - Create a `.env` file in the `backend` directory.
   - Add the following:
     ```bash
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     REDIS_HOST=127.0.0.1
     ```
2. **Set up environment variables for frontend:**
   - Create a `.env` file in the `frontend` directory.
   - Add the following:
     ```bash
     VITE_BACKEND_SERVER_URL=your_backend_server_url(i.e http://localhost:5000)
     ```
3. **Ensure MongoDB is running and accessible.**
4. **Ensure Redis Server is running and accessible.**

## 🧪 Running the Application Locally

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`.

2. **Start the frontend application:**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🧑‍💻 Author

- **Subrata Rudra**
  - [GitHub](https://github.com/Subrata-Rudra)
  - [LinkedIn](https://www.linkedin.com/in/subrata-rudra-b481741b7/)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🌟 Support & Contributions

If you find this project helpful, please consider giving it a ⭐️ star — it really helps and motivates!

I welcome contributions of all kinds — whether it's bug fixes, feature suggestions, documentation improvements, or code enhancements.
Feel free to fork the repo and submit a pull request!

---
