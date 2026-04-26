<div align="center">

# ✅ TaskFlow
### A Clean, Fast & Fully Offline Todo App

<br/>

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-61DAFB?style=for-the-badge&logo=react&logoColor=black)

<br/>

![Status](https://img.shields.io/badge/Status-Active-22c55e?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)

<br/>

> **TaskFlow** is a minimal, snappy task manager built with React Native & Expo.
> No internet. No login. No nonsense — just your tasks, always available.

</div>

---

## 📱 Screenshots

<div align="center">

| Home Screen | Add Task | Priority Levels |
|---|---|---|
| <img src="https://github.com/user-attachments/assets/1b37638b-1ef8-481c-bd32-1b75dcc45dcc" width="220"/> | <img src="https://github.com/user-attachments/assets/01e8c983-6b9b-42bf-aa83-b5ed2afe409d" width="220"/> | <img src="https://github.com/user-attachments/assets/66d44ced-9767-4d0f-8c63-12b3520ab02e" width="220"/> |

| Search Tasks | Task Detail | Completed View |
|---|---|---|
| <img src="https://github.com/user-attachments/assets/8599075b-789f-48b5-bcbf-9f4c9eb03bec" width="220"/> | <img src="https://github.com/user-attachments/assets/d3fa4852-1917-4759-84bd-bce88caf6e6b" width="220"/> | <img src="https://github.com/user-attachments/assets/bc0d3a6e-64f0-4a11-9257-2aacf24bc1b2" width="220"/> |

<details>
<summary>📸 View More Screenshots</summary>
<br/>

| Empty State | |
|---|---|
| <img src="https://github.com/user-attachments/assets/39d59c1f-bd3d-4314-b3cd-0826d005741e" width="220"/> | |

</details>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📱 Core Features
- 📴 **Fully offline** — works without internet
- 🏷️ **Priority levels** — High / Medium / Low
- 🔍 **Instant search** — filter tasks in real time
- ➕ **FAB + Bottom Sheet** — smooth task input
- 🎬 **Smooth animations** — polished UI transitions

</td>
<td width="50%">

### ⚙️ Technical Highlights
- 💾 **Persistent storage** — data survives app restarts
- ⚡ **Lightweight** — fast performance on all devices
- 🌐 **Optional backend** — Node.js + Express support
- 📦 **No login required** — zero friction experience
- 🔁 **AsyncStorage** — reliable local data layer

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React Native (Expo)** | Cross-platform mobile framework |
| **JavaScript** | App logic & components |
| **AsyncStorage** | Offline persistent data storage |
| **Node.js + Express** | Optional backend API |
| **Expo Go** | Development & testing on device |

---

## 📁 Project Structure

```
taskflow-todo-app/
│
├── 📂 mobile/
│   ├── 📂 app/
│   │   ├── _layout.jsx        ← App layout & navigation
│   │   └── index.jsx          ← Main screen
│   │
│   ├── 📂 constants/
│   │   ├── api.js             ← API base URL config
│   │   └── todoApi.js         ← API call functions
│   │
│   ├── app.json               ← Expo config
│   ├── babel.config.js        ← Babel config
│   └── package.json           ← Dependencies
│
└── 📂 server/                 ← Optional backend
    ├── server.js              ← Express server
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have these installed:

```bash
node --version     # v18 or later
npm --version
```

Install Expo CLI globally:
```bash
npm install -g expo-cli
```

Install **Expo Go** on your phone:

[![Expo Go Android](https://img.shields.io/badge/Google_Play-Expo_Go-3DDC84?style=flat-square&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=host.exp.exponent)
[![Expo Go iOS](https://img.shields.io/badge/App_Store-Expo_Go-0D96F6?style=flat-square&logo=app-store&logoColor=white)](https://apps.apple.com/app/expo-go/id982107779)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Moiz8798/taskflow-todo-app.git
cd taskflow-todo-app/mobile
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Start the Development Server

```bash
npx expo start
```

---

### 4️⃣ Run on Your Device

**📱 Physical Device**
> Scan the QR code using **Expo Go** (Android) or your **Camera app** (iOS)

**💻 Emulator**
```bash
# Android
npx expo start --android

# iOS (macOS only)
npx expo start --ios
```

---

## 🔧 Optional Backend Setup

Want to sync tasks with a server instead of local storage?

```bash
# Step 1 — Start the server
cd server
npm install
npm start

# Step 2 — Update your IP in mobile/constants/api.js
const BASE_URL = "http://YOUR_LOCAL_IP:3000";

# Step 3 — Switch API usage in mobile/app/index.jsx
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Metro bundler errors | `npx expo start --clear` |
| Module not found | Delete `node_modules` → run `npm install` |
| Blank screen on device | Update **Expo Go** to latest version |
| Hot reload not working | Shake device → tap **Reload** |
| QR code not scanning | Make sure phone & PC are on same WiFi |

---

## 🚀 Upcoming Features

- [ ] 🌙 Dark mode support
- [ ] ☁️ Cloud sync across devices
- [ ] 🔔 Push notifications & reminders
- [ ] 👤 User authentication
- [ ] 📅 Due dates & calendar view
- [ ] 📊 Task completion statistics

---

## 🤝 Contributing

Contributions are always welcome!

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/your-feature

# 3. Commit your changes
git commit -m "✨ Add your feature"

# 4. Push and open a Pull Request
git push origin feature/your-feature
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and share.

---

<div align="center">

### 👨‍💻 Author

**Abdul Moiz Khan**
*Software Engineer*

[![GitHub](https://img.shields.io/badge/GitHub-Moiz8798-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Moiz8798)

<br/>

⭐ **Found this useful? Give it a star!** ⭐

*Made with ❤️ by Abdul Moiz Khan*

</div>
