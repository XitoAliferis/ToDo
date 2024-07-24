
# ToDo

This is a personal project that I felt was something I could create fully tailored to myself as a student. Being in university, there are lots of assignments, tests, and other important responsibilities that I need to meet. When using other reminder apps, I felt they couldn't meet up to what I needed, because of this I created ToDo; a reminder app for everyone.

## Deployment
Click [here](https://to-do-ashen-xi.vercel.app/) to use the deployed version of my To-Do web-app! 

## Web App

The web app of this project was created using React and Tailwind for the front-end, Node.Js for the backend, and Vercel's Postgres SQL Database.

### Front-End

The front-end is built with React, utilizing components such as `App.js`, `Navbar.jsx`, `SideBar.jsx`, `NewReminderPopup.jsx`, `ReminderHeader.jsx`, `ReminderItems.jsx`, `ReminderList.jsx`, `Reminders.jsx`, and `ReminderUtils.jsx`. The application leverages the following features:
- **React Router** for navigation
- **Axios** for HTTP requests
- **Bootstrap** for additional styling
- **UUID** for generating unique IDs
- **Local Storage** for persisting UI state
- **Responsive Design** for better usability across devices

### Back-End

The backend is implemented using Node.js and Fastify, interfacing with a PostgreSQL database hosted on Vercel. Key functionalities include:
- **CRUD operations** for reminders and reminder items
- **Data fetching** from the database
- **State management** to track loading and updating statuses
- **Server-side routing** for handling API requests

### Database

The database schema includes two primary tables: `Reminder` and `ReminderItem`. The `Reminder` table stores information about each reminder group, while the `ReminderItem` table stores individual reminder items. The schema ensures that each reminder item is associated with a reminder group and includes fields for name, completion status, date, group, and whether it is an all-day event.

### API Endpoints

The backend exposes several API endpoints to interact with the database:
- `GET /reminderData` - Fetch all reminder groups
- `POST /reminderData` - Create a new reminder group
- `DELETE /reminderData/:id` - Delete a reminder group
- `GET /reminderItemData` - Fetch all reminder items
- `POST /reminderItemData` - Create a new reminder item
- `POST /editReminderItemData` - Edit an existing reminder item
- `DELETE /reminderItemData/:id` - Delete a reminder item
- `POST /checkReminderItem` - Toggle the completion status of a reminder item

### Setup and Installation

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/XitoAliferis/ToDo.git
   cd ToDo
   ```

2. **Install dependencies** for both the client and server:
   ```bash
   npm install
   cd client
   npm install
   cd ../server
   npm install
   ```

3. ### Create environment files

For the server, create a `.env.development.local` file and add your PostgreSQL credentials:

```env
POSTGRES_URL="put_in_your_URL"
POSTGRES_PRISMA_URL="put_in_your_Prisma_URL"
POSTGRES_URL_NO_SSL="put_in_your_NO_SSL"
POSTGRES_URL_NON_POOLING="put_in_your_NON_POOLING"
POSTGRES_USER="default"
POSTGRES_HOST="put_in_your_host"
POSTGRES_PASSWORD="put_in_your_password"
POSTGRES_DATABASE="put_in_your_database"
```

4. **Run the server**:
   ```bash
   cd server
   npm run dev
   ```

5. **Run the client**:
   ```bash
   cd client
   npm start
   ```

### Usage

Once the application is running, you can access it through your browser. The main features include:
- Viewing today's reminders
- Adding new reminders
- Marking reminders as complete
- Viewing upcoming reminders
- Managing reminder groups


