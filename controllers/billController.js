const Transaction = require('../models/transactionModel.js');
const catchAsync = require('../utils/catchAsync.js');

exports.getAllBills = catchAsync(async (req, res, next) => {
  const bills = await Transaction.find({
    user: req.user._id,
    recurring: true,
  }).sort('-date');

  const uniqueBills = bills.filter(
    (b, index, self) => index === self.findIndex((t) => t.name === b.name),
  );

  const today = new Date();
  const todayDay = today.getDate();

  const billsWithStatus = uniqueBills.map((b) => {
    const billDay = new Date(b.date).getDate();
    const diffDays = billDay - todayDay;

    let status;
    if (diffDays < 0) status = 'paid';
    else if (diffDays >= 0 && diffDays <= 3) status = 'due-soon';
    else status = 'upcoming';

    return { ...b.toObject(), status };
  });

  const paid = billsWithStatus.filter((b) => b.status === 'paid');
  const dueSoon = billsWithStatus.filter((b) => b.status === 'due-soon');
  const upcoming = billsWithStatus.filter((b) => b.status === 'upcoming');

  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills: billsWithStatus,
      totalPaid: paid.length,
      totalAmountPaid: paid.reduce((acc, b) => acc + Math.abs(b.amount), 0),
      totalDueSoon: dueSoon.length,
      totalAmountDueSoon: dueSoon.reduce(
        (acc, b) => acc + Math.abs(b.amount),
        0,
      ),
      totalUpcoming: upcoming.length,
      totalAmountUpcoming: upcoming.reduce(
        (acc, b) => acc + Math.abs(b.amount),
        0,
      ),
    },
  });
});
