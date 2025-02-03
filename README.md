Here’s a **detailed README.md** file content for your GitHub repository. This README will provide a clear overview of the project, its setup, usage, and features.

---

# **Graphical Authentication System (Image-Based Authentication)**
A **secure two-step authentication system** that uses **image sequence-based authentication** along with traditional password authentication. This project ensures a high level of security by implementing **fake authentication redirection** when incorrect credentials are entered.

## **🚀 Features**
- **User Registration**: Users register with an email, password, and a sequence of selected images from a chosen category.
- **Two-Step Login Authentication**:
  1. **Step 1**: User logs in with email and password.
  2. **Step 2**: User selects images in the correct sequence.
- **Fake Authentication Handling**:
  - If the user enters the wrong password, they are redirected to a **fake authentication page**.
  - Fake authentication page displays **random images from all categories**, misleading unauthorized users.
  - Any sequence input on this page results in **"Access Denied"**.
- **Session Management**:
  - Sessions are stored securely in MongoDB.
  - Expiry handling ensures users are logged out after inactivity.
- **Secure Hashing**:
  - Passwords are hashed using **bcrypt**.
  - Image sequence is stored securely.
- **User Dashboard**:
  - Displays user details after successful authentication.
  - Logout functionality included.

---

## **📁 Project Structure**
```
Graphical_Pass/
│── Backend/                   # Server-side code (Node.js, Express, MongoDB)
│   ├── config/
│   │   ├── db.js               # Database connection
│   ├── models/
│   │   ├── User.js             # User schema and authentication logic
│   ├── routes/
│   │   ├── authRoutes.js       # User authentication API
│   │   ├── imgRoutes.js        # Image retrieval API
│   ├── public/
│   │   ├── images/             # Image categories (Animals, Chocolates, Companies)
│   ├── server.js               # Main server file
│
│── Frontend/                   # Client-side files
│   ├── index.html               # Home page
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   ├── imgAuth.html             # Image authentication page
│   ├── fake_img.html            # Fake authentication page
│   ├── access_denied.html       # Access denied page
│   ├── dashboard.html           # User dashboard
│   ├── css/style.css            # Main styling
│   ├── js/login.js              # Login logic
│   ├── js/register.js           # Registration logic
│   ├── js/imgAuth.js            # Image authentication logic
│   ├── js/fakeImg.js            # Fake authentication logic
│
│── README.md                    # Project documentation
│── package.json                  # Dependencies & scripts
│── .env                          # Environment variables
```

---

## **⚙️ Installation & Setup**
### **1️⃣ Prerequisites**
Make sure you have the following installed:
- **[Node.js](https://nodejs.org/en/)** (v16+ recommended)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (Local or Atlas)
- **npm** (Node Package Manager)

### **2️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/graphical-auth-system.git
cd graphical-auth-system/Backend
```

### **3️⃣ Install Dependencies**
```bash
npm install
```

### **4️⃣ Configure Environment Variables**
Create a `.env` file in the `Backend/` directory:
```
MONGO_URI=mongodb://127.0.0.1:27017/graphicalPassAuth
SESSION_SECRET=your_secret_key
PORT=4000
```

### **5️⃣ Start the Server**
```bash
node server.js
```
🚀 **Server running at:** `http://localhost:4000`

---

## **🛠️ API Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | Registers a new user |
| **POST** | `/api/auth/login` | Logs in the user (Step 1) |
| **POST** | `/api/auth/verify-image-auth` | Verifies image sequence (Step 2) |
| **POST** | `/api/auth/logout` | Logs out the user |
| **GET** | `/api/images/get-user-images` | Fetches user's authentication images |
| **GET** | `/api/images/fake-auth-images` | Fetches fake authentication images |

---

## **🖥️ Usage Guide**
### **🔹 Registration**
1. Select **email, password, contact details**.
2. Choose a **category (Animals, Chocolates, Companies)**.
3. Select **5 images** in a sequence (your passkey).
4. Click **Register**.

### **🔹 Login Process**
1. Enter **email & password**.
2. If correct, proceed to **image authentication**.
3. Select the images in the **correct order**.
4. If correct → **Dashboard** ✅.
5. If incorrect → **Fake authentication page** (random images).
   - Any input here results in **Access Denied**.

### **🔹 Dashboard & Logout**
- After successful authentication, users are redirected to their **dashboard**.
- Click **Logout** to end the session.

---

## **🖼️ UI Design Improvements**
- **Responsive Navbar** on all pages except **dashboard**.
- **Modern Bootstrap UI** with:
  - Rounded buttons.
  - Box shadows for a smooth appearance.
  - Grid-based **image selection layout**.
  - Centered **verify buttons** with animation.
  - Enhanced **alerts and pop-ups** for error handling.

---

## **📌 Future Enhancements**
- 🔐 **2FA Integration** (Google Authenticator)
- 📷 **Face Recognition Authentication**
- 🌐 **Multi-Language Support**
- 📊 **Admin Dashboard to View Login Attempts**
- 🔄 **Password Reset Feature**
- 🔍 **Enhanced Logging & Analytics**

---

## **🤝 Contributing**
Want to contribute? Follow these steps:
1. **Fork** the repository.
2. Create a **feature branch** (`git checkout -b feature-name`).
3. **Commit changes** (`git commit -m "Added feature"`).
4. **Push to GitHub** (`git push origin feature-name`).
5. Create a **Pull Request**.


