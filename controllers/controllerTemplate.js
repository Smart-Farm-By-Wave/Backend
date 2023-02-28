const Report = require("./../models/reportModel");
const User = require("./../models/userModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const badge = require("./../utils/badge");

exports.postReport = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get the token and check if it's exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  let decoded = {};
  if (!token) {
    decoded.id = undefined;
  } else {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  if (!decoded.id)
    return next(new AppError("You must login to report user"), 401);

  if (decoded.id == req.body.reportID)
    return next(new AppError("You cannot report yourself", 400));
  if (!req.body.reportID || !req.body.reportDescription) {
    return next(new AppError("Please enter reportID or description"), 400);
  }

  const reportedUser = await User.findById(req.body.reportID);

  if (!reportedUser) {
    return next(new AppError("Reported ID not found"), 400);
  }
  const report = {
    reporterID: decoded.id,
    reportedID: req.body.reportID,
    description: req.body.reportDescription,
    reportedTime: Date.now(),
  };

  const createdReport = await Report.create(report);
  badge();

  res.status(201).json({
    status: "success",
  });
});
