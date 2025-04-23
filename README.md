# Hackverse-Medicare

## Overview
Hackverse Medicare is an AI-driven healthcare platform that integrates modern web technologies with machine learning to provide an end-to-end healthcare solution. The platform connects patients with doctors, provides medical insights, and offers telehealth services.

## Project Structure
```
Hackverse-Medicare/
├── client/              # React frontend application
├── server/              # Express.js backend server
├── ML/                  # Machine learning components with Django
└── ...
```

## Features
- **Telehealth Consultations**: Connect with doctors via video calls
- **AI Health Assistant**: Powered by ML models for health insights
- **Appointment Scheduling**: Calendar system for booking medical appointments
- **Medical Dashboard**: Track health metrics and history
- **Secure Authentication**: Protected health information with JWT

## Tech Stack

### Frontend (Client)
- React.js with Vite for build tooling
- Tailwind CSS for styling
- Chart.js for data visualization
- React Router for navigation
- Zego Cloud for video conferencing

### Backend (Server)
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- WebSockets for real-time communication
- Nodemailer for email notifications

### Machine Learning (ML)
- Django framework
- TensorFlow and other ML libraries
- Data analysis tools for health insights
- Google AI services integration

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ with pip
- MongoDB instance
- Google Cloud account (for AI services)

### Installation

#### Client Setup
```bash
cd client
npm install
npm run dev
```

#### Server Setup
```bash
cd server
npm install
npm run dev
```

#### ML Setup
```bash
cd ML
pip install -r requirements.txt
python manage.py runserver
```

## Environment Variables
Create .env files in the respective directories with the following variables:

### Server
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### ML
```
GOOGLE_APPLICATION_CREDENTIALS=path_to_google_creds.json
```

## Contributors
- [Your Name]
- [Team Member 1]
- [Team Member 2]

## License
This project is licensed under the MIT License - see the LICENSE file for details.
