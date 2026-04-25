🚀 TaskFlow – Modern Todo App

A clean, fast, and fully offline Todo application built with React Native (Expo).
TaskFlow is designed to provide a smooth and minimal task management experience with no backend dependency.

✨ Features
📱 Fully offline functionality (AsyncStorage)
🏷️ Task priority levels (High / Medium / Low)
🔍 Search tasks instantly
➕ Floating Action Button (FAB) with bottom-sheet input
🎬 Smooth UI animations
💾 Persistent data (saved even after app restart)
⚡ Lightweight and fast performance
🛠️ Tech Stack
React Native (Expo)
JavaScript
AsyncStorage
Node.js + Express (optional backend)
📸 Screenshots

Add your screenshots in a screenshots folder

<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 13 PM" src="https://github.com/user-attachments/assets/1b37638b-1ef8-481c-bd32-1b75dcc45dcc" />

<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 13 PM (1)" src="https://github.com/user-attachments/assets/01e8c983-6b9b-42bf-aa83-b5ed2afe409d" />


<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 14 PM" src="https://github.com/user-attachments/assets/66d44ced-9767-4d0f-8c63-12b3520ab02e" />


<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 14 PM (1)" src="https://github.com/user-attachments/assets/8599075b-789f-48b5-bcbf-9f4c9eb03bec" />


<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 14 PM (3)" src="https://github.com/user-attachments/assets/d3fa4852-1917-4759-84bd-bce88caf6e6b" />


<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 15 PM" src="https://github.com/user-attachments/assets/bc0d3a6e-64f0-4a11-9257-2aacf24bc1b2" />


<img width="709" height="1600" alt="WhatsApp Image 2026-04-25 at 5 00 15 PM (1)" src="https://github.com/user-attachments/assets/39d59c1f-bd3d-4314-b3cd-0826d005741e" />

🚀 Getting Started
📌 Prerequisites
Node.js (v18 or later)

Expo CLI

npm install -g expo-cli
Expo Go (Android/iOS)
⚙️ Installation
# Clone the repository
git clone https://github.com/your-username/taskflow-todo-app.git

# Navigate to project folder
cd taskflow-todo-app/mobile

# Install dependencies
npm install

# Start development server
npx expo start
📱 Running the App
On Physical Device
Scan QR code using:
Expo Go (Android)
Camera app (iOS)
On Emulator

Android

npx expo start --android

iOS (macOS only)

npx expo start --ios
📂 Project Structure
mobile/
├── app/
│   ├── _layout.jsx
│   └── index.jsx
├── constants/
│   ├── api.js
│   └── todoApi.js
├── app.json
├── babel.config.js
└── package.json

server/ (optional backend)
├── server.js
└── package.json
🔧 Optional Backend Setup

If you want to use the backend instead of local storage:

cd server
npm install
npm start

Then:

Update mobile/constants/api.js
Replace YOUR_LOCAL_IP with your system IP
Switch API usage in index.jsx
🐛 Troubleshooting
Issue	Solution
Metro bundler errors	npx expo start --clear
Module not found	Delete node_modules → npm install
Blank screen	Update Expo Go
Hot reload not working	Shake device → Reload
📌 Future Improvements
🌙 Dark mode
☁️ Cloud sync
🔔 Push notifications
👤 User authentication
🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

📄 License

This project is licensed under the MIT License.
