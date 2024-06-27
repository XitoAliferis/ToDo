const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });
const fastify = require('fastify')({ logger: true });
const { v4: uuidv4 } = require('uuid'); // Import UUID library
const moment = require('moment-timezone');



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
        allday BOOLEAN,
        daily BOOLEAN,
        userId VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS Reminder (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        color VARCHAR(255),
        userId VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
}



async function preloadData() {
    testUser = "FayuthArx5ZR0riuhG5uzL6ab8x2";
    const reminderItemData = [
        { id: uuidv4(), name: "Sarah's Birthday", done: true, date: "2025-01-26T00:00:00.000Z", group: "Sarah's Reminders", allday: true, userId: testUser, created_at: new Date().toISOString() },
        { id: uuidv4(), name: "Xito's Birthday", done: false, date: "2024-12-14T00:00:00.000Z", group: "Xito's Reminders", allday: true, userId: testUser, created_at: new Date().toISOString() }
    ];

    const reminderData = [
        { id: uuidv4(), name: "Sarah's Reminders", color: "#febed4", userId: testUser, created_at: new Date().toISOString() },
        { id: uuidv4(), name: "Xito's Reminders", color: "#4d79ff", userId: testUser, created_at: new Date(new Date().getTime() + 1000).toISOString() }
    ];
    

    for (const x of reminderItemData) {
        await sql`
        INSERT INTO ReminderItem (id, name, done, date, "group", allday, userId, created_at)
        VALUES (${x.id}, ${x.name}, ${x.done}, ${new Date(x.date)}, ${x.group}, ${x.allday}, ${x.userId}, ${x.created_at})
        ON CONFLICT (id) DO NOTHING;
        `;
    }

    for (const x of reminderData) {
        await sql`
        INSERT INTO Reminder (id, name, color, userId, created_at)
        VALUES (${x.id}, ${x.name}, ${x.color}, ${x.userId}, ${x.created_at})
        ON CONFLICT (id) DO NOTHING;
        `;
    }
}


async function setReminderItemData(x) {
    let dateString = x.date;

    // If allday is true, use the date as it is without converting to local
    const estDate = new Date(dateString);

    const createdAt = new Date().toISOString(); // Get the current timestamp
    console.log(x.daily)
    await sql`
        INSERT INTO ReminderItem (id, name, done, date, "group", allday, daily, userId, created_at)
        VALUES (${x.id}, ${x.name}, ${x.done}, ${estDate}, ${x.group}, ${x.allday},${x.daily},${x.userId}, ${createdAt})
        ON CONFLICT (id) DO NOTHING;
    `;
}


  

async function setReminderData(x) {
    
    const createdAt = new Date().toISOString(); // Get the current timestamp

    await sql`
        INSERT INTO Reminder (id, name, color, userId, created_at)
        VALUES (${x.id}, ${x.name}, ${x.color}, ${x.userId}, ${createdAt})
        ON CONFLICT (id) DO NOTHING;
    `;
}


async function getReminderItemData(userId) {
    return await sql`SELECT * FROM ReminderItem WHERE userId = ${userId} ORDER BY date;`;
  }
  
  async function getReminderData(userId) {
    return await sql`SELECT * FROM Reminder WHERE userId = ${userId} ORDER BY created_at;`;
  }

async function editReminderItemData(reminderItem) {
    const estDate = (reminderItem.date);

    await sql`
        UPDATE ReminderItem
        SET name = ${reminderItem.name}, done = ${reminderItem.done}, date = ${estDate}, "group" = ${reminderItem.group}, allday = ${reminderItem.allday}, daily = ${reminderItem.daily}
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

async function editReminderData(reminder) {
    await sql`
        UPDATE Reminder
        SET name = ${reminder.name}, color = ${reminder.color}
        WHERE id = ${reminder.id};
    `;
}




fastify.post('/editReminderData', async (request, reply) => {
    try {
        const reminder = request.body;
        await editReminderData(reminder);
        reply.code(200).send({ success: true, reminder });
    } catch (error) {
        reply.code(500).send({ success: false, error: error.message });
    }
});


fastify.get('/reminderItemData', async (request, reply) => {
    try {
        const { userId } = request.query;
        const reminderItemDataSQL = await getReminderItemData(userId);
        return reminderItemDataSQL.rows;
    } catch (error) {
        reply.code(500).send(error);
    }
});

  fastify.post('/reminderItemData', async (request, reply) => {
    try {
      const newReminder = request.body;
      await setReminderItemData(newReminder);
      reply.code(201).send(newReminder);
    } catch (error) {
      reply.code(500).send(error);
    }
  });
  
  fastify.get('/reminderData', async (request, reply) => {
    try {
        const { userId } = request.query;
        const reminderDataSQL = await getReminderData(userId);
        return reminderDataSQL.rows;
    } catch (error) {
        reply.code(500).send(error);
    }
});
  
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
// Update the check status of a reminder item
async function toggleReminderItemDone(id) {
    const reminderItem = await sql`SELECT * FROM ReminderItem WHERE id = ${id}`;
    if (reminderItem.rowCount > 0) {
        const newDoneState = !reminderItem.rows[0].done;
        await sql`
            UPDATE ReminderItem
            SET done = ${newDoneState}
            WHERE id = ${id};
        `;
        return { ...reminderItem.rows[0], done: newDoneState };
    } else {
        throw new Error('Reminder item not found');
    }
}

fastify.post('/checkReminderItem', async (request, reply) => {
    try {
        const { id } = request.body;
        const updatedReminder = await toggleReminderItemDone(id);
        reply.code(200).send(updatedReminder);
    } catch (error) {
        reply.code(500).send({ success: false, error: error.message });
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
