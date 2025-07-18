![Screenshot](/mindwell1.jpg)

![Screenshot](/chat1.jpg)
# 🧠 MindWell

MindWell is a modern and secure online health therapy platform designed to support individuals struggling with depression, anxiety, addiction, and more. The platform empowers patients by offering role-based access, personalized therapy booking, real-time communication with doctors, and an integrated AI chatbot powered by **Google Gemini AI**. Doctors and patients can engage via chat and video calls, while doctors can manage notes and appointments seamlessly.

---

## 🚀 Features

### ✅ Authentication & User Roles
- 🔐 **Role-Based Authentication** for **Patients** and **Doctors**
- 🔄 Separate dashboards for patients and doctors with personalized data

### 📅 Appointments
- 🩺 **Patients can book therapy appointments** with available doctors
- 📬 **Doctors receive real-time email notifications** via **Nodemailer**
- ✅ Doctors can **confirm appointments** on their dashboard
- 🕒 **Patients see confirmed appointment time**

### 🤖 AI-Powered Chatbot
- 💬 Patients can chat with a friendly **AI assistant** powered by **Google Gemini API**
- 📚 Get therapeutic suggestions and information in real-time

### 📞 Real-Time Communication
- 🗨️ **Live Chat** between patients and doctors using **Socket.IO**
- 🧠 Notes section for doctors to **take notes** during/after consultation
- 📹 **Video Call support** using **WebRTC**

### ⚙️ Scalability & Performance
- 🔄 Used **Redis** for:
  - **Scaling real-time chat and sockets**
- ⚡ Seamless performance even with multiple concurrent users

### 📧 Email Integration
- ✅ When a patient books an appointment, an **automated email is sent to the doctor**
- 📫 Integrated using **Nodemailer**

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vanta.js and Motion Framer for UI
- **Backend**: Node.js, Express.js
- **Authentication**: JWT
- **Real-time Chat**: Socket.IO + Redis
- **Video Calls**: WebRTC
- **AI Integration**: Google Gemini API
- **Email**: Nodemailer
- **Database**: MongoDB + Redis (for caching)


