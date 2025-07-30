# Real-Time Chat Application

A real-time chat application built with Next.js, Socket.IO, and Prisma.

## Features

- User authentication (signup/login)
- Real-time messaging using Socket.IO
- User selection for private messaging
- Message history
- Responsive UI

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd socket_chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/socket_chat"
   JWT_SECRET="your-secret-key"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Authentication

1. **Sign Up**: Create a new account by providing your name, email, and password.
2. **Login**: Use your email and password to log in.

### Chatting

1. After logging in, you'll be redirected to the home page where you can see a list of all users.
2. Click on a user to start a chat with them.
3. Type your message in the input field and press Enter or click the Send button.
4. Messages are delivered in real-time to the recipient if they are online.

## Socket.IO Implementation Details

### Client-Side Socket Implementation

The client-side socket implementation is located in `src/lib/socket.js`. It provides:

- A socket instance configured to connect to the server
- Helper functions for authentication and connection
- Auto-reconnection capabilities

```javascript
// Connect and authenticate socket
import { connectSocket, authenticateSocket } from "../lib/socket";

// In your component
useEffect(() => {
  const token = localStorage.getItem('token');
  connectSocket();
  authenticateSocket(token);
}, []);
```

### Server-Side Socket Implementation

The server-side socket implementation is in `src/app/api/socket/route.js`. It handles:

1. **User Authentication**: Verifies JWT tokens to identify users
2. **Message Storage**: Stores messages in the database
3. **Message Delivery**: Delivers messages to the intended recipient
4. **Active User Tracking**: Keeps track of online users

### Socket Events

- **authenticate**: Sent from client to server with JWT token
- **send-message**: Sent from client to server with message data
- **receive-message**: Sent from server to client when a message is received
- **message-sent**: Sent from server to client as confirmation of message delivery

## API Routes

### Authentication

- **POST /api/auth/signup**: Create a new user account
- **POST /api/auth/login**: Authenticate a user and get JWT token

### Users

- **GET /api/users**: Get all users (requires authentication)

### Messages

- **GET /api/messages?receiverId=<id>**: Get messages between current user and specified receiver
- **POST /api/messages**: Create a new message

## Database Schema

The application uses two main models:

### User

```prisma
model User {
  id       String @id @default(uuid())
  email    String @unique
  name     String
  password String

  messagesSent     Message[] @relation("SentMessages")
  messagesReceived Message[] @relation("ReceivedMessages")
}
```

### Message

```prisma
model Message {
  id         String   @id @default(uuid())
  senderId   String
  receiverId String
  content    String
  timestamp  DateTime @default(now())
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.