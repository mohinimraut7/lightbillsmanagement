  const mongoose = require("mongoose");
  const billSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      username: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      password: {
        type: String,
        trim: true,
      },
      contactNumber: {
        type: String,
      },
      address: {
        type: String,
        trim: true,
      },
      role: {
        type: String,
        trim: true,
      },
      ward: {
        type: String,
        trim: true,
      },
      totalConsumption: {
        type: Number,
      },
      meterNumber:{
        type: Number,
      },
      meterStatus: {
        type: String,
        trim: true,
      },
      previousReadingDate: {
        type: Date,
      },
      previousReading: {
        type: Number,
      },
      currentReadingDate: {
        type: Date,
      },
      currentReading: {
        type: Number,
      },
      billDate: {
        type: Date,
      },
      currentBillAmount: {
        type: Number,
      },
      totalArrears: {
        type: Number,
      },
      netBillAmount: {
        type: Number,
      },
      roundedBillAmount: {
        type: Number,
      },
      ifPaidByThisDate: {
        type: Date,
      },
      earlyPaymentAmount: {
        type: Number,
      },
      ifPaidBefore: {
        type: Number,
      },
      dueDate: {
        type: Date,
      },
      dueAlert:{
        type: Boolean,
        default: false,
      },
      ifPaidAfter: {
        type: Number,
      },
      overdueDate: {
        type: Date,
      },
      paymentStatus:{
        type:String,
      },
      approvedStatus:{
        type:String,
      },
      paidAmount: {
        type: Number,
      },
      pendingAmount: {
        type: Number,
      },
      forwardForGeneration: {
        type: Boolean,
        default: false,
      },
      flagStatus: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  
  billSchema.pre('save', function (next) {
    const today = new Date();
    const twoDaysBeforeDue = new Date(this.dueDate);
    twoDaysBeforeDue.setDate(this.dueDate.getDate() - 2);
    if (today.toDateString() === twoDaysBeforeDue.toDateString()) {
      this.dueAlert = true;
    } else {
      this.dueAlert = false;
    }
    next();
  });
  module.exports = mongoose.model("Bill", billSchema);
