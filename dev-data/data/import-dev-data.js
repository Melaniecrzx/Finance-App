const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('../../models/transactionModel.js');
const Budget = require('../../models/budgetModel.js');
const Pot = require('../../models/potModel.js');

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
    await Transaction.create(transactions);
    await Budget.create(budgets);
    await Pot.create(pots);
    console.log('Data Successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete data from collection

const deleteData = async () => {
  try {
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
