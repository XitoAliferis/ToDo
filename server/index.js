const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });
const fastify = require('fastify')({ logger: true });
const { v4: uuidv4 } = require('uuid'); // Import UUID library

const timeZone = 'America/New_York'; // Set the desired time zone

// Function to convert date to EST
function convertToLocal(date) {
        // Ensure the input is a valid Date object
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
    
        // Check if the conversion to Date was successful
        if (isNaN(date.getTime())) {
            throw new TypeError("Invalid date");
        }
        
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds()));

}

async function createTable() {
    await sql`
    DROP TABLE reminder, reminderitem`;
    await sql`
      CREATE TABLE IF NOT EXISTS ReminderItem (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        done BOOLEAN,
        date TIMESTAMP,
        "group" VARCHAR(255),
        allDay BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS Reminder (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        color VARCHAR(255)
      );
    `;
}

async function preloadData() {
    const reminderItemData = [
        { id: uuidv4(), name: "Sarah's Birthday", done: true, date: "2025-01-26T00:00:00.000Z", group: "Sarah's Reminders", allDay: false },
        { id: uuidv4(), name: "Xito's Birthday", done: false, date: "2024-12-14T00:00:00.000Z", group: "Xito's Reminders", allDay: false  }
    ];

    const reminderData = [
        { id: uuidv4(), name: "Sarah's Reminders", color: "#febed4" },
        { id: uuidv4(), name: "Xito's Reminders", color: "#acbda1" },
    ];

    for (const x of reminderItemData) {
        const estDate = convertToLocal(x.date).toISOString();
        await sql`
        INSERT INTO ReminderItem (id, name, done, date, "group", allDay)
        VALUES (${x.id}, ${x.name}, ${x.done}, ${estDate}, ${x.group}, ${x.allDay})
        ON CONFLICT (id) DO NOTHING;
        `;
    }

    for (const x of reminderData) {
        await sql`
        INSERT INTO Reminder (id, name, color)
        VALUES (${x.id}, ${x.name}, ${x.color})
        ON CONFLICT (id) DO NOTHING;
        `;
    }
}

async function setReminderItemData(x) {
    let dateString = x.date;
  
    // If allDay is true, use the date as it is without converting to local
    const estDate = x.allDay ? new Date(dateString).toISOString().slice(0, 10) : convertToLocal(new Date(dateString)).toISOString();
    console.log(estDate);
  
    const createdAt = new Date().toISOString(); // Get the current timestamp
  
    await sql`
        INSERT INTO ReminderItem (id, name, done, date, "group", allDay, created_at)
        VALUES (${uuidv4()}, ${x.name}, ${x.done}, ${estDate}, ${x.group}, ${x.allDay}, ${createdAt});
    `;
  }
  

async function setReminderData(x) {
    await sql`
        INSERT INTO Reminder (id, name, color)
        VALUES (${uuidv4()}, ${x.name}, ${x.color});
    `;
}

async function getReminderItemData() {
    return await sql`SELECT * FROM ReminderItem ORDER BY date;`;
}

async function getReminderData() {
    return await sql`SELECT * FROM Reminder;`;
}

async function editReminderItemData(reminderItem) {
    const estDate = convertToLocal(reminderItem.date).toISOString();
    await sql`
    UPDATE ReminderItem
    SET name = ${reminderItem.name}, done = ${reminderItem.done}, date = ${estDate}, "group" = ${reminderItem.group}
    WHERE id = ${reminderItem.id};
    `;
}

// Declare a route for GET /reminderItemData
fastify.get('/reminderItemData', async (request, reply) => {
    try {
        const reminderItemDataSQL = await getReminderItemData();
        return reminderItemDataSQL.rows;
    } catch (error) {
        reply.code(500).send(error);
    }
});

// Declare a route for POST /reminderItemData
fastify.post('/reminderItemData', async (request, reply) => {
    try {
        const newReminder = request.body;
        console.log(newReminder);
        await setReminderItemData(newReminder);
        reply.code(201).send(newReminder);
    } catch (error) {
        reply.code(500).send(error);
    }
});

// Declare a route for GET /reminderData
fastify.get('/reminderData', async (request, reply) => {
    try {
        const reminderDataSQL = await getReminderData();
        return reminderDataSQL.rows;
    } catch (error) {
        reply.code(500).send(error);
    }
});

// Declare a route for POST /reminderData
fastify.post('/reminderData', async (request, reply) => {
    try {
        const newReminder = request.body;
        await setReminderData(newReminder);
        reply.code(201).send(newReminder);
    } catch (error) {
        reply.code(500).send(error);
    }
});

// Declare a route for POST /checkReminderItem
fastify.post('/checkReminderItem', async (request, reply) => {
    try {
        const { id } = request.body;
        const reminderItemDataSQL = await getReminderItemData();
        const updatedItems = reminderItemDataSQL.rows.map(async reminder => {
            if (reminder.id === id) {
                await editReminderItemData({ id: reminder.id, name: reminder.name, done: !reminder.done, date: reminder.date, group: reminder.group });
                return { ...reminder, done: !reminder.done };
            }
            return reminder;
        });

        const resolvedUpdatedItems = await Promise.all(updatedItems);
        reply.code(200).send(resolvedUpdatedItems);
    } catch (error) {
        reply.code(500).send(error);
    }
});

// Run the server!
const start = async () => {
    try {
        await createTable();
        await preloadData();
        await fastify.listen({ port: 5000, host: '0.0.0.0' });
        fastify.log.info(`Server started on port 5000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
