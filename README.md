<h1>🥬 FridgeNotes</h1>

<p><strong>A real-time shared grocery list app for households — stay in sync, avoid duplicates, and never forget what’s in the fridge.</strong></p>

<hr/>

<h2>✨ Overview</h2>
<p>
FridgeNotes is a full-stack web application that allows multiple users in a household 
to collaboratively manage a grocery list in real time.
</p>
<p>
Users can create or join a house, add items, mark them as purchased, and see updates instantly 
across all connected devices.
</p>

<hr/>

<h2>🖥️ Preview</h2>
<ul>
Click on the link to preview the webstie : </br>
https://fridge-notes-2.onrender.com/dashboard




<img width="1436" height="755" alt="Screenshot 2026-05-01 at 3 25 27 PM" src="https://github.com/user-attachments/assets/f732f28f-9d53-482e-8fc8-c919ca639601" />

  <li>Grocery List (Real-Time Updates)</li>
    <img width="1436" height="754" alt="Screenshot 2026-05-01 at 3 26 06 PM" src="https://github.com/user-attachments/assets/4288b7f9-d549-4db3-a0d6-eac089803f67" />
  <li>Add / Manage Items</li>
    <li>Dashboard</li><img width="865" height="652" alt="Screenshot 2026-05-01 at 3 27 16 PM" src="https://github.com/user-attachments/assets/0c07524c-b5aa-431e-a419-bca6479bf605" />
</ul>

<hr/>

<h2>🚀 Features</h2>

<h3>🔐 Authentication</h3>
<ul>
  <li>Signup & Login with JWT-based authentication</li>
  <li>Persistent sessions</li>
</ul>

<h3>🏠 House Management</h3>
<ul>
  <li>Create or join a house via invite code</li>
  <li>Multiple members per house</li>
</ul>

<h3>🛒 Grocery List</h3>
<ul>
  <li>Add, update, delete items</li>
  <li>Categorisation & priority support</li>
  <li>Notes & quantity tracking</li>
</ul>

<h3>✅ Real-Time Sync</h3>
<ul>
  <li>Instant updates using WebSockets</li>
  <li>All members see changes live</li>
</ul>

<h3>🔄 Item Actions</h3>
<ul>
  <li>Toggle purchased status</li>
  <li>Track who purchased items</li>
  <li>Clear purchased items</li>
</ul>

<hr/>

<h2>🧠 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React (Vite)</li>
  <li>React Router</li>
  <li>Context API (State Management)</li>
  <li>Axios (API calls)</li>
  <li>Tailwind CSS (UI)</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>MongoDB + Mongoose</li>
  <li>JWT Authentication</li>
  <li>Socket.IO (Real-time communication)</li>
</ul>

<hr/>

<h2>📡 Architecture</h2>

<pre>
Frontend (React)
        ↓
   REST API (Express)
        ↓
    MongoDB (Database)

+ Socket.IO for real-time updates
</pre>

<hr/>

<h2>⚙️ Installation</h2>

<h3>1. Clone the repository</h3>
<pre>
git clone https://github.com/your-username/fridge-notes.git
cd fridge-notes
</pre>

<h3>2. Setup Backend</h3>
<pre>
cd backend
npm install
</pre>

<p>Create <code>.env</code> file:</p>
<pre>
PORT=4121
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
</pre>

<p>Run backend:</p>
<pre>
npm run dev
</pre>

<h3>3. Setup Frontend</h3>
<pre>
cd frontend
npm install
</pre>

<p>Create <code>.env</code> file:</p>
<pre>
VITE_API_URL=http://localhost:4121/api
</pre>

<p>Run frontend:</p>
<pre>
npm run dev
</pre>

<hr/>

<h2>🔌 Real-Time Events</h2>

<table>
  <tr>
    <th>Event</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>item:added</td>
    <td>New item created</td>
  </tr>
  <tr>
    <td>item:updated</td>
    <td>Item edited</td>
  </tr>
  <tr>
    <td>item:purchased</td>
    <td>Toggle purchased status</td>
  </tr>
  <tr>
    <td>item:deleted</td>
    <td>Item removed</td>
  </tr>
  <tr>
    <td>items:cleared</td>
    <td>Purchased items cleared</td>
  </tr>
</table>

<hr/>

<h2>📁 Project Structure</h2>

<pre>
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
</pre>

<hr/>

<h2>🧪 Future Improvements</h2>
<ul>
  <li>📱 Mobile responsiveness improvements</li>
  <li>🔔 Notifications for updates</li>
  <li>🧾 History tracking</li>
  <li>🧠 Smart suggestions (AI-based grocery predictions)</li>
  <li>🌐 Deployment (Docker + Cloud)</li>
</ul>

<hr/>

<h2>👨‍💻 Author</h2>
<p><strong>Aryan Rodrigues</strong></p>
<p>
GitHub: 
<a href="https://github.com/aryanrods" target="_blank">
https://github.com/aryanrods
</a>
</p>

<hr/>

<h2>📜 License</h2>
<p>This project is licensed under the MIT License.</p>
