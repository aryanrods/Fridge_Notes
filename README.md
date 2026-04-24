🥬 FridgeNotes

A real-time shared grocery list app for households — stay in sync, avoid duplicates, and never forget what’s in the fridge.

✨ Overview

FridgeNotes is a full-stack web application that allows multiple users in a household to collaboratively manage a grocery list in real time.

Users can create or join a house, add items, mark them as purchased, and see updates instantly across all connected devices.

🖥️ Preview

Dashboard

Grocery List (Real-Time Updates)

Add / Manage Items

🚀 Features
🔐 Authentication
Signup & Login with JWT-based auth
Persistent sessions
🏠 House Management
Create or join a house via invite code
Multiple members per house
🛒 Grocery List
Add, update, delete items
Categorisation & priority support
Notes & quantity tracking
✅ Real-Time Sync
Instant updates using WebSockets
All members see changes live
🔄 Item Actions
Toggle purchased status
Track who purchased items
Clear purchased items
🧠 Tech Stack
Frontend
React (Vite)
React Router
Context API (State Management)
Axios (API calls)
Tailwind CSS (UI)
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Socket.IO (real-time communication)
📡 Architecture
Frontend (React)
        ↓
   REST API (Express)
        ↓
    MongoDB (Database)

+ Socket.IO for real-time updates
⚙️ Installation
1. Clone the repository
git clone https://github.com/your-username/fridge-notes.git
cd fridge-notes
2. Setup Backend
cd backend
npm install

Create .env file:

PORT=4121
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173

Run backend:

npm run dev
3. Setup Frontend
cd frontend
npm install

Create .env:

VITE_API_URL=http://localhost:4121/api

Run frontend:

npm run dev
🔌 Real-Time Events

FridgeNotes uses Socket.IO for live updates.

Events:
Event	Description
item:added	New item created
item:updated	Item edited
item:purchased	Toggle purchased
item:deleted	Item removed
items:cleared	Purchased items cleared
📁 Project Structure
frontend/
├── pages/
├── components/
├── context/
├── services/
└── hooks/

backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── sockets/
🧪 Future Improvements
📱 Mobile responsiveness improvements
🔔 Notifications for updates
🧾 History tracking
🧠 Smart suggestions (AI-based grocery predictions)
🌐 Deployment (Docker + Cloud)
👨‍💻 Author

Aryan Rodrigues

GitHub: https://github.com/aryanrods

📜 License

This project is licensed under the MIT License.
