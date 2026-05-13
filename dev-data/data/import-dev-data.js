const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('../../models/transactionModel.js');
const Budget = require('../../models/budgetModel.js');
const Pot = require('../../models/potModel.js');
const User = require('../../models/userModel.js');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log('DB connection successful');
});

//Read Json File

const { transactions, budgets, pots } = JSON.parse(
  fs.readFileSync(`${__dirname}/data.json`, 'utf-8'),
);

//Import data

const importData = async () => {
  try {
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@finance.com',
      password: 'Demo1234!',
      passwordConfirmation: 'Demo1234!',
    });
    await Transaction.create(
      transactions.map((t) => ({ ...t, user: demoUser._id })),
    );
    await Budget.create(budgets.map((b) => ({ ...b, user: demoUser._id })));
    await Pot.create(pots.map((p) => ({ ...p, user: demoUser._id })));
    console.log('✅ Data Successfully loaded!');
  } catch (err) {
    console.log(err.message); // ← message plus lisible
  }
  process.exit();
};

// Delete data from collection

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Transaction.deleteMany();
    await Budget.deleteMany();
    await Pot.deleteMany();
    console.log('Data Successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
