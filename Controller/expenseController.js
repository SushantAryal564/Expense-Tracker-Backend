const fs = require("fs");
const expenses = JSON.parse(fs.readFileSync(`${__dirname}/../dummydata.json`));
exports.getAllExpenses = (req, res) => {
  res.status(200).json({
    status: "success",
    result: expenses.length,
    data: {
      expenses,
    },
  });
};
