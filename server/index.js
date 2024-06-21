const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });
const fastify = require('fastify')({ logger: true });
const { v4: uuidv4 } = require('uuid'); // Import UUID library
const moment = require('moment-timezone');



async function createTable() {
    // await sql`
    // DROP TABLE reminder, reminderitem`;
    await sql`
      CREATE TABLE IF NOT EXISTS ReminderItem (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        done BOOLEAN,
        date TIMESTAMP,
        "group" VARCHAR(255),
        allday BOOLEAN,
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
        { id: uuidv4(), name: "Sarah's Birthday", done: true, date: "2025-01-26T00:00:00.000Z", group: "Sarah's Reminders", allday: true },
        { id: uuidv4(), name: "Xito's Birthday", done: false, date: "2024-12-14T00:00:00.000Z", group: "Xito's Reminders", allday: true  }
    ];

    const reminderData = [
        { id: uuidv4(), name: "Sarah's Reminders", color: "#febed4" },
        { id: uuidv4(), name: "Xito's Reminders", color: "#4d79ff" },
    ];

    for (const x of reminderItemData) {
        const estDate = new Date(x.date);
        await sql`
        INSERT INTO ReminderItem (id, name, done, date, "group", allday)
        VALUES (${x.id}, ${x.name}, ${x.done}, ${estDate}, ${x.group}, ${x.allday})
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

    // If allday is true, use the date as it is without converting to local
    const estDate = new Date(dateString);
    console.log(estDate);

    const createdAt = new Date().toISOString(); // Get the current timestamp

    await sql`
        INSERT INTO ReminderItem (id, name, done, date, "group", allday, created_at)
        VALUES (${x.id}, ${x.name}, ${x.done}, ${estDate}, ${x.group}, ${x.allday}, ${createdAt})
        ON CONFLICT (id) DO NOTHING;
    `;
}


  

async function setReminderData(x) {
    await sql`
        INSERT INTO Reminder (id, name, color)
        VALUES (${x.id}, ${x.name}, ${x.color})
        ON CONFLICT (id) DO NOTHING;
    `;
}


async function getReminderItemData() {
    return await sql`SELECT * FROM ReminderItem ORDER BY date;`;
}

async function getReminderData() {
    return await sql`SELECT * FROM Reminder;`;
}

async function editReminderItemData(reminderItem) {
    const estDate = (reminderItem.date);

    await sql`
        UPDATE ReminderItem
        SET name = ${reminderItem.name}, done = ${reminderItem.done}, date = ${estDate}, "group" = ${reminderItem.group}, allday = ${reminderItem.allday}
        WHERE id = ${reminderItem.id};
    `;
}


fastify.post('/editReminderItemData', async (request, reply) => {
    try {
        const reminder = request.body;
        await editReminderItemData(reminder);
        reply.code(200).send({ success: true, reminder });
    } catch (error) {
        reply.code(500).send({ success: false, error });
    }
});

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

// DELETE /reminderItemData/:id route
fastify.delete('/reminderItemData/:id', async (request, reply) => {
    try {
        const { id } = request.params;
        await sql`DELETE FROM ReminderItem WHERE id = ${id}`;
        reply.code(200).send({ success: true, id });
    } catch (error) {
        reply.code(500).send({ success: false, error });
    }
});

// DELETE /reminderData/:id route
fastify.delete('/reminderData/:id', async (request, reply) => {
    try {
        const { id } = request.params;
        await sql`DELETE FROM Reminder WHERE id = ${id}`;
        reply.code(200).send({ success: true, id });
    } catch (error) {
        reply.code(500).send({ success: false, error });
    }
});
// Declare a route for POST /checkReminderItem
fastify.post('/checkReminderItem', async (request, reply) => {
    try {
        const { id } = request.body;
        const reminderItemDataSQL = await getReminderItemData();
        const updatedItems = reminderItemDataSQL.rows.map(async reminder => {
            if (reminder.id === id) {
                await editReminderItemData({ id: reminder.id, name: reminder.name, done: !reminder.done, date: reminder.date, group: reminder.group, allday: reminder.allday});
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
      // await preloadData();
        await fastify.listen({ port: 5000, host: '0.0.0.0' });
        fastify.log.info(`Server started on port 5000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
