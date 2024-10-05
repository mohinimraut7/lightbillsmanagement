const Bill = require('../models/bill');
const User = require('../models/user'); 
const bcrypt=require('bcryptjs');

exports.addBill = async (req, res) => {
  const requesterRole = req?.user?.role;
  if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin' && requesterRole !=='Executive Engineer' && requesterRole !=='Junior Engineer') { 
    return res.status(403).json({ message: "You don't have authority to add bill" }); 
  }
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      contactNumber,
      address,
      role,
      ward,
      meterNumber,
      totalConsumption,
      meterStatus,
      previousReadingDate,
      previousReading,
      currentReadingDate,
      currentReading,
      billDate,
      currentBillAmount,
      totalArrears,
      netBillAmount,
      roundedBillAmount,
      ifPaidByThisDate,
      earlyPaymentAmount,
      ifPaidBefore,
      dueDate,
      ifPaidAfter,
      overdueDate,
      paymentStatus,
      approvedStatus,
      paidAmount,
      pendingAmount,
      forwardForGeneration,
    } = req.body;
    let user = await User.findOne({ email, username });
    if (!user) {
      const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
      user = new User({
        firstName,
        lastName,
        username,
        email,
        password:hashedPassword,
        contactNumber,
        address,
        role,
        ward,
      });
      await user.save();
    }
    const bill = new Bill({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      contactNumber: user.contactNumber,
      address: user.address,
      role: user.role,
      ward: user.ward,
      totalConsumption,
      meterNumber,
      meterStatus,
      previousReadingDate,
      previousReading,
      currentReadingDate,
      currentReading,
      billDate,
      currentBillAmount,
      totalArrears,
      netBillAmount,
      roundedBillAmount,
      ifPaidByThisDate,
      earlyPaymentAmount,
      ifPaidBefore,
      dueDate,
      ifPaidAfter,
      overdueDate,
      paymentStatus,
      approvedStatus,
      paidAmount,
      pendingAmount,
      forwardForGeneration,
    });
    if (paidAmount === roundedBillAmount && pendingAmount === 0) {
      bill.paymentStatus = 'Paid';
      switch (requesterRole) {
        case 'Junior Engineer':
          bill.approvedStatus = 'PendingForExecutiveEngineer';
          bill.paymentStatus = 'Paid';
          break;
        case 'Executive Engineer':
          bill.approvedStatus = 'PendingForAdmin';
          bill.paymentStatus = 'Paid';
          break;
        case 'Admin':
          bill.approvedStatus = 'PendingForSuperAdmin';
          bill.paymentStatus = 'Paid';
          break;
        case 'Super Admin':
          bill.approvedStatus = 'Done';
          bill.paymentStatus = 'Paid';
          break;
        default:
          console.error(`Unexpected role: ${requesterRole}`);
          break;
      }
    }else if (paidAmount > 0 && paidAmount < roundedBillAmount) {
      bill.paymentStatus = 'Partial';
      switch (requesterRole) {
        case 'Junior Engineer':
          bill.approvedStatus = 'PendingForExecutiveEngineer';
          bill.paymentStatus = 'Partial';
          break;
        case 'Executive Engineer':
          bill.approvedStatus = 'PendingForAdmin';
          bill.paymentStatus = 'Partial';

          break;
        case 'Admin':
          bill.approvedStatus = 'PendingForSuperAdmin';
          bill.paymentStatus = 'Partial';
          break;
        case 'Super Admin':
          bill.approvedStatus = 'PartialDone';
          bill.paymentStatus = 'Partial';
          break;
        default:
          console.error(`Unexpected role: ${requesterRole}`);
          break;
      }
    } else {
      if (pendingAmount === roundedBillAmount) {
        bill.paymentStatus = 'UnPaid';
      } else {
        bill.paymentStatus = 'Pending';
      }
    }
    await bill.save();
    res.status(201).json({
      message: 'Bill created successfully',
      bill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create bill',
      error: error.message,
    });
  }
};
exports.editBill = async (req, res) => {
  const requesterRole = req?.user?.role;
  if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin' && requesterRole !=='Executive Engineer' && requesterRole !=='Junior Engineer') { 
    return res.status(403).json({ message: "You don't have authority to edit bill" }); 
  }
  try {
    const billId = req.params.billId;
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      contactNumber,
      address,
      role,
      ward,
      meterNumber,
      totalConsumption,
      meterStatus,
      previousReadingDate,
      previousReading,
      currentReadingDate,
      currentReading,
      billDate,
      currentBillAmount,
      totalArrears,
      netBillAmount,
      roundedBillAmount,
      ifPaidByThisDate,
      earlyPaymentAmount,
      ifPaidBefore,
      dueDate,
      ifPaidAfter,
      overdueDate,
      paymentStatus,
      approvedStatus,
      paidAmount,
      pendingAmount,
      forwardForGeneration,
    } = req.body;
    if (!billId) {
      return res.status(400).json({ message: 'Please provide bill ID' });
    }
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    bill.firstName = firstName || bill.firstName;
    bill.lastName = lastName || bill.lastName;
    bill.username = username || bill.username;
    bill.email = email || bill.email;
    bill.password = password || bill.password;
    bill.contactNumber = contactNumber || bill.contactNumber;
    bill.address = address || bill.address;
    bill.role = role || bill.role;
    bill.ward = ward || bill.ward;
    bill.meterNumber = meterNumber || bill.meterNumber;
    bill.totalConsumption = totalConsumption || bill.totalConsumption;
    bill.meterStatus = meterStatus || bill.meterStatus;
    bill.previousReadingDate = previousReadingDate || bill.previousReadingDate;
    bill.previousReading = previousReading || bill.previousReading;
    bill.currentReadingDate = currentReadingDate || bill.currentReadingDate;
    bill.currentReading = currentReading || bill.currentReading;
    bill.billDate = billDate || bill.billDate;
    bill.currentBillAmount = currentBillAmount || bill.currentBillAmount;
    bill.totalArrears = totalArrears || bill.totalArrears;
    bill.netBillAmount = netBillAmount || bill.netBillAmount;
    bill.roundedBillAmount = roundedBillAmount || bill.roundedBillAmount;
    bill.ifPaidByThisDate = ifPaidByThisDate || bill.ifPaidByThisDate;
    bill.earlyPaymentAmount = earlyPaymentAmount || bill.earlyPaymentAmount;
    bill.ifPaidBefore = ifPaidBefore || bill.ifPaidBefore;
    bill.dueDate = dueDate || bill.dueDate;
    bill.ifPaidAfter = ifPaidAfter || bill.ifPaidAfter;
    bill.overdueDate = overdueDate || bill.overdueDate;
    bill.paymentStatus = paymentStatus || bill.paymentStatus;
    bill.approvedStatus = approvedStatus || bill.approvedStatus;
    bill.paidAmount = paidAmount || bill.paidAmount;
    bill.pendingAmount = pendingAmount || bill.pendingAmount;
    bill.forwardForGeneration = forwardForGeneration || bill.forwardForGeneration;
    if (paidAmount === roundedBillAmount && pendingAmount === 0 && requesterRole === 'Super Admin') {
      bill.paymentStatus = 'Paid';
      bill.approvedStatus = 'Done';
      bill.yesno='Yes';
    }
    if (req.body.password) {
      bill.password = req.body.password;
    } else {
      bill.password = bill.password;
    }
    if (paidAmount === roundedBillAmount && pendingAmount === 0) {
      bill.paymentStatus = 'Paid';
      switch (requesterRole) {
        case 'Junior Engineer':
          bill.approvedStatus = 'PendingForExecutiveEngineer';
          bill.paymentStatus = 'Paid';
          break;
        case 'Executive Engineer':
          bill.approvedStatus = 'PendingForAdmin';
          bill.paymentStatus = 'Paid';
          break;
        case 'Admin':
          bill.approvedStatus = 'PendingForSuperAdmin';
          bill.paymentStatus = 'Paid';
          break;
        case 'Super Admin':
          bill.approvedStatus = 'Done';
          bill.paymentStatus = 'Paid';
          break;
        default:
          console.error(`Unexpected role: ${requesterRole}`);
          break;
      }
    }else if (paidAmount > 0 && paidAmount < roundedBillAmount) {
      bill.paymentStatus = 'Partial';
      switch (requesterRole) {
        case 'Junior Engineer':
          bill.approvedStatus = 'PendingForExecutiveEngineer';
          bill.paymentStatus = 'Partial';
          break;
        case 'Executive Engineer':
          bill.approvedStatus = 'PendingForAdmin';
          bill.paymentStatus = 'Partial';

          break;
        case 'Admin':
          bill.approvedStatus = 'PendingForSuperAdmin';
          bill.paymentStatus = 'Partial';
          break;
        case 'Super Admin':
          bill.approvedStatus = 'PartialDone';
          bill.paymentStatus = 'Partial';
          break;
        default:
          console.error(`Unexpected role: ${requesterRole}`);
          break;
      }
    } else {
      if (pendingAmount === roundedBillAmount) {
        bill.paymentStatus = 'UnPaid';
      } else {
        bill.paymentStatus = 'Pending';
      }
    }
    await bill.save();
    res.status(200).json({ message: 'Bill updated successfully', bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update bill' });
  }
};

exports.getBills=async(req,res)=>{
    try{
      const bills=await Bill.find();
      res.status(200).json(bills);
    }catch(error){
      console.error(error);
      res.status(500).json({message:'Internal Server Error'});
    }
  }
exports.updateBillStatus = async (req, res) => {
  console.log("req.user.role", req.user.role)
  const { id, approvedStatus, paymentStatus, yesno } = req.body;
  console.log("yesnocheck in backend", id, approvedStatus, paymentStatus, yesno)
  let totalArrearsval;
  let netBillAmountval;
  let roundedBillAmountval;
  if (!id || !approvedStatus) {
    return res.status(400).json({ message: 'Bill ID and approved status are required' });
  }
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
     if (req?.user?.role === 'Super Admin'){
      if(approvedStatus === 'Done' && yesno === 'Yes' && paymentStatus==='Paid'){
          totalArrearsval=bill.totalArrears;
          netBillAmountval=bill.netBillAmount;
          roundedBillAmountval=bill.roundedBillAmount;
          console.log("testing reverse>>>>>",totalArrearsval,netBillAmountval,roundedBillAmountval)
        bill.paymentStatus = 'Paid';
        bill.approvedStatus = 'Done';
      }else if(approvedStatus === 'PendingForSuperAdmin' && yesno === 'No'&& paymentStatus==='Pending'){
        bill.paymentStatus = 'Pending';
        bill.approvedStatus = 'PendingForSuperAdmin';
      }else if(approvedStatus === 'PartialDone' && yesno === 'Yes'&& paymentStatus==='Partial'){
        bill.paymentStatus = 'Partial';
        bill.approvedStatus = 'PartialDone';
      }
     }
        else {
      bill.paymentStatus = paymentStatus;
      if (req?.user?.role === 'Executive Engineer' && approvedStatus === 'PendingForAdmin' && yesno === 'No') {
        bill.approvedStatus = 'PendingForExecutiveEngineer';
      } else if (req?.user?.role === 'Junior Engineer' && approvedStatus === 'PendingForExecutiveEngineer' && yesno === 'No') {
        bill.approvedStatus = 'Initial';
        bill.paymentStatus = 'UnPaid';
      } else if (req?.user?.role === 'Admin' && yesno === 'Yes') {
        console.log('Updating approvedStatus to PendingForSuperAdmin');
        bill.approvedStatus = 'PendingForSuperAdmin';
      } else if (req?.user?.role === 'Admin' && yesno === 'No' && approvedStatus === 'PendingForSuperAdmin') {
        bill.approvedStatus = 'PendingForAdmin';
        bill.paymentStatus = 'Pending';
      } else {
        bill.approvedStatus = approvedStatus;
      }
    }
    await bill.save();
    res.status(200).json({
      message: 'Bill status updated successfully',
      bill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update bill status',
      error: error.message,
    });
  }
};

exports.updateFlagStatus = async (req, res) => {
  const { billId, flagStatus } = req.body;
  try {
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    bill.flagStatus = flagStatus;
    await bill.save();
    res.status(200).json({ message: 'Bill flag status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update bill flag status' });
  }
};
  exports.deleteBill = async (req, res) => {
    const requesterRole = req?.user?.role;
    console.log("check role",req.user.role)
    if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin' && requesterRole !=='Executive Engineer' && requesterRole !=='Junior Engineer') { 
      return res.status(403).json({ message: "You don't have authority to add bill" }); 
    }
    try {
      const billId = req?.params?.billId;
      const bill = await Bill.findByIdAndDelete(billId);
      if (!bill) {
        return res.status(404).send({ message: 'Bill not found' });
      }
      res.send({ message: 'Bill deleted successfully' });
    } catch (error) {
      res.status(400).send({ message: 'Failed to delete bill' });
    }
  };

exports.massUpdateBillStatus = async (req, res) => {
  try {
    const requesterRole = req?.user?.role;
    if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin' && requesterRole !== 'Executive Engineer' && requesterRole !== 'Junior Engineer') {
      return res.status(403).json({ message: "You don't have authority to approve bills" });
    }
    const { bills } = req.body;
    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: 'No bills provided' });
    }
    const billsToUpdate = await Bill.find({ _id: { $in: bills.map(bill => bill._id) } });
    if (!billsToUpdate || billsToUpdate.length === 0) {
      return res.status(404).json({ message: 'No bills found' });
    }
    await Promise.all(bills.map(async (bill) => {
      let approvedStatus;
      let paymentStatus;
      if (requesterRole === 'Junior Engineer') {
        approvedStatus = 'PendingForExecutiveEngineer';
        paymentStatus = 'Pending';
      } else if (requesterRole === 'Executive Engineer') {
        approvedStatus = 'PendingForAdmin';
        paymentStatus = 'Pending';
      } else if (requesterRole === 'Admin') {
        approvedStatus = 'PendingForSuperAdmin';
        paymentStatus = 'Pending';
      } else if (requesterRole === 'Super Admin') {
        approvedStatus = 'Done';
        paymentStatus = 'Paid';
      }
      await Bill.findByIdAndUpdate(bill._id, {
        approvedStatus,
        paymentStatus,
        flagStatus: true 
      }, { new: true });
    }));
    res.status(200).json({
      message: 'Bills updated successfully',
    });

  } catch (error) {
    console.error("Error updating bills:", error);
    res.status(500).json({
      message: 'Error updating bills',
    });
  }
};


exports.reverseMassBillStatus = async (req, res) => {
  try {
    const requesterRole = req?.user?.role;
    if (requesterRole !== 'Super Admin' && requesterRole !== 'Admin' && requesterRole !== 'Executive Engineer' && requesterRole !== 'Junior Engineer') {
      return res.status(403).json({ message: "You don't have the authority to reverse approvals for bills" });
    }
    const { bills } = req.body;
    if (!bills || bills.length === 0) {
      return res.status(400).json({ message: 'No bills provided for reversal' });
    }
    const billsToUpdate = await Bill.find({ _id: { $in: bills.map(bill => bill._id) } });
    if (!billsToUpdate || billsToUpdate.length === 0) {
      return res.status(404).json({ message: 'No bills found for reversal' });
    }
    await Promise.all(bills.map(async (bill) => {
      let approvedStatus;
      let paymentStatus;
      if (requesterRole === 'Super Admin' && bill?.approvedStatus==='Done') {
        approvedStatus = 'PendingForSuperAdmin'; 
        paymentStatus = 'Pending';
      } else if (requesterRole === 'Admin' && bill?.approvedStatus==='PendingForSuperAdmin') {
        approvedStatus = 'PendingForAdmin'; 
        paymentStatus = 'Pending';
      } else if (requesterRole === 'Executive Engineer' && bill?.approvedStatus==='PendingForAdmin') {
        approvedStatus = 'PendingForExecutiveEngineer';
        paymentStatus = 'Pending';
      } else if (requesterRole === 'Junior Engineer' && bill?.approvedStatus==='PendingForExecutiveEngineer') {
        approvedStatus = 'PendingForJuniorEngineer';
        paymentStatus = 'Pending';
      }
      await Bill.findByIdAndUpdate(bill._id, {
        approvedStatus,
        paymentStatus,
        flagStatus: false 
      }, { new: true });
    }));
    res.status(200).json({
      message: 'Bills reversed successfully',
    });
  } catch (error) {
    console.error("Error reversing bill approvals:", error);
    res.status(500).json({
      message: 'Error reversing bill approvals',
    });
  }
};

