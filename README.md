# EventBooker Platform

## 1. Overview

EventBooker is a full-stack web application designed to streamline the process of discovering, booking, and managing events. It provides a user-friendly interface for attendees to browse events and a comprehensive dashboard for administrators to manage event listings, user accounts, and bookings.

## 2. Features

_(Please replace with actual features or expand on these examples)_

- **User Authentication:** Secure user registration and login (JWT-based).
- **Event Browsing:** Users can view a list of available events with details.
- **Event Booking:** Registered users can book tickets for events.
- **User Profile Management:** Users can view and update their profile information, including profile picture.
- **Password Management:** Users can change their password.
- **Admin Panel:**
  - Event Management (Create, Read, Update, Delete events).
  - User Management (View users, manage roles - _if applicable_).
  - Booking Management (View bookings - _if applicable_).
- **Responsive Design:** Adapts to various screen sizes for a seamless experience on desktop and mobile devices.
- **Theming:** Supports light and dark modes.

## 3. Technologies Used

_(Please specify versions where appropriate)_

- **Frontend:**
  - React.js
  - Redux (for state management)
  - Ant Design (for UI components)
  - Axios (for API requests)
  - React Router
- **Backend:**
  - Node.js
  - Express.js (or your specific backend framework)
  - MongoDB (or your specific database)
  - Mongoose (ODM for MongoDB - _if applicable_)
  - JSON Web Tokens (JWT) for authentication
  - Swagger/OpenAPI (for API documentation)
  - Cloudinary (for image uploads - _inferred from previous interactions_)
- **DevOps & Other:**
  - Docker & Docker Compose
  - Git & GitHub (or your version control system)

## 4. Prerequisites

- Node.js (e.g., v18.x or later)
- npm (Node Package Manager) or yarn
- MongoDB (ensure it's installed and running, or provide connection string for a cloud instance)
- Docker Desktop (optional, if using Docker for local development)

## 5. Getting Started

**IMPORTANT NOTE ON ENVIRONMENT VARIABLES:** This application relies on environment variables for crucial settings like API keys, database connections, and service URLs. You will need to create environment configuration files (commonly `.env` or `.env.local`) in both the `backend` and `frontend/event-app` directories. Detailed instructions are provided in sections 5.2 (Backend Setup) and 5.3 (Frontend Setup). **Failure to configure these correctly will prevent the application from starting or functioning properly.**

### 5.1. Clone the Repository

```bash
git clone https://github.com/mohamedbakeer2341/ATC_01093263533>
cd EventBooker
```

### 5.2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install -legacy-peer-deps
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the necessary environment variables. Refer to `.env.example` if one exists, or add common variables like:
    ```env
    NODE_ENV=development
    PORT=5000 # Or your preferred backend port
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    JWT_EXPIRES_IN=1d # Or your preferred JWT expiration
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    # Add other backend-specific variables
    ```
    _(**Note:** Ensure `.env` is listed in your `.gitignore` file to prevent committing secrets.)_

### 5.3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend/event-app
    # (Adjust path if different)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Set up environment variables (if any):**
    Create a `.env` file in the `frontend/event-app` directory if your frontend requires specific environment variables (e.g., `REACT_APP_API_URL`).
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    # (Adjust if your backend runs on a different port or path)
    ```

## 6. Running the Application

### 6.1. Running the Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Start the backend server:**
    ```bash
    npm run dev
    # (Or your specific script, e.g., npm start)
    ```
    The backend should typically be running on `http://localhost:5000` (or the port specified in your `.env`).

### 6.2. Running the Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/event-app
    # (Adjust path if different)
    ```
2.  **Start the frontend development server:**
    ```bash
    npm start
    # or
    # yarn start
    ```
    The frontend application should typically open in your browser at `http://localhost:3000`.

### 6.3. API Documentation

- **Base API URL (Deployed):** `https://eventbooker-024e32ba58a3.herokuapp.com/api`
- **Base API URL (Local via `npm run dev` or Docker):** `http://localhost:5000/api`
- **Swagger/OpenAPI Documentation (Deployed):** `https://eventbooker-024e32ba58a3.herokuapp.com/api-docs`
- **Swagger/OpenAPI Documentation (Local via `npm run dev` or Docker):** `http://localhost:5000/api-docs`

### 6.4. Frontend URL

- **Local Development (via `npm start` or Docker):** `http://localhost:3000` (typically)
- **Deployed Application:** `https://event-booker-frontend.vercel.app/`
  _(Note: The deployed frontend application is configured to connect to the deployed backend API: `https://eventbooker-024e32ba58a3.herokuapp.com/api`)_

6.4.1. Admin Demo Credentials
For testing admin features, you can use the following demo credentials:

Email: admin@areeb.com

Password: mmmm123321

### 6.5. Running with Docker Compose

These instructions assume you have Docker and Docker Compose installed on your system. This Docker Compose setup is designed for local development, creating a self-contained environment where the frontend (typically on `http://localhost:3000`) communicates with the backend (typically on `http://localhost:5000/api`) running in separate containers on your local machine.

1.  **Prerequisites:**

    - Ensure Docker Desktop (or Docker Engine with Docker Compose plugin) is installed and running.
    - Make sure no other services are using the ports defined in your `docker-compose.yml` (commonly 3000 for frontend, 5000 for backend).

2.  **Environment Variables:**

    - **Backend:** The backend service in `docker-compose.yml` should be configured to use an `.env` file (e.g., `backend/.env`). Ensure this file exists and contains all necessary backend environment variables as described in section `5.2. Backend Setup`.
    - **Frontend:** If your frontend requires environment variables (like `REACT_APP_API_URL`), these should ideally be built into the Docker image or supplied via the `docker-compose.yml`. For `REACT_APP_` variables used by Create React App, they are typically baked in at build time.
      - If you're using Vite and `VITE_` prefixed variables, ensure your `frontend/event-app/Dockerfile` and `docker-compose.yml` are set up to pass these build arguments or environment variables correctly.
      - The frontend is generally configured to connect to the backend at `http://localhost:5000/api` (or whatever the backend service is exposed as from the Docker network, often the same as local non-Docker development).

3.  **Build and Start the Services:**
    Navigate to the project root directory (where `docker-compose.yml` is located) and run:

    ```bash
    docker-compose up --build
    ```

    - `--build`: This flag tells Docker Compose to build the images before starting the containers. It's good practice to include this if you've made changes to the `Dockerfile` or application code that affects the image.
    - This command will start all services defined in your `docker-compose.yml` (typically frontend and backend). You'll see logs from all services in your terminal.

4.  **Accessing the Application:**

    - **Frontend:** Open your browser and go to `http://localhost:3000` (or the port you've mapped for the frontend service in `docker-compose.yml`).
    - **Backend API:** The backend will be accessible at `http://localhost:5000/api` (or the port you've mapped for the backend service). API documentation (Swagger) should be available at `http://localhost:5000/api-docs`.

5.  **Running in Detached Mode:**
    To run the containers in the background (detached mode), use:

    ```bash
    docker-compose up --build -d
    ```

    You can view logs using `docker-compose logs -f` or `docker-compose logs <service_name>`.

6.  **Stopping the Application:**
    To stop and remove the containers, networks, and volumes created by `up`, navigate to the project root and run:

    ```bash
    docker-compose down
    ```

    If you want to remove volumes (like database data if persisted in a volume), you can add the `-v` flag:

    ```bash
    docker-compose down -v
    ```

7.  **Rebuilding Images:**
    If you only want to rebuild images without necessarily restarting services immediately, you can use:
    ```bash
    docker-compose build
    ```
    Then start with `docker-compose up`.

## 7. Folder Structure

```
EventBooker/
├── .git/
├── .gitignore
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/  (if applicable)
│   │   ├── utils/     (if applicable)
│   │   └── server.js  (or app.js, index.js - main entry point)
│   ├── .env           (locally, not committed)
│   ├── package.json
│   └── ...            (other backend files/folders)
├── frontend/
│   └── event-app/
│       ├── public/
│       └── src/
│           ├── app/           (e.g., Redux store, API setup)
│           ├── assets/
│           ├── components/
│           ├── features/      (e.g., Redux slices, services)
│           ├── hooks/
│           ├── pages/
│           ├── routes/        (if you have a route config file)
│           ├── styles/
│           ├── utils/
│           ├── App.js
│           ├── index.js
│           └── ...            (other frontend files/folders)
│       ├── .env           (locally, not committed)
│       ├── package.json
│       └── ...            (other frontend files/folders)
├── docker-compose.yml
└── README.md
```

_(This is a general structure, please adjust to match your project's actual layout.)_

## 8. Contributing

_(Placeholder - please define your contribution guidelines)_
We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeatureName`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## 9. License

_(Placeholder - Choose a license, e.g., MIT)_
This project is licensed under the **[TODO: Specify License, e.g., MIT License]**. See the `LICENSE` file for details (if you add one).

---

_Remember to replace placeholders like `[TODO: ...]` and `<your-repository-url>` with actual information._
