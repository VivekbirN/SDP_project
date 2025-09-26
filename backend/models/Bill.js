const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  // User association (will be implemented later)
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  
  // Bill details
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  
  // Utility consumption and cost
  unitsConsumed: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Utility type
  utilityType: {
    type: String,
    required: true,
    enum: ['electricity', 'water', 'gas'],
    lowercase: true
  },
  
  // Cost per unit (calculated automatically)
  costPerUnit: {
    type: Number,
    default: function() {
      return this.unitsConsumed > 0 ? this.amount / this.unitsConsumed : 0;
    }
  },
  
  // Additional fields
  billNumber: {
    type: String,
    default: ''
  },
  
  // Status and tracking
  isPaid: {
    type: Boolean,
    default: false
  },
  
  paymentDate: {
    type: Date,
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Pre-save middleware to update costPerUnit
billSchema.pre('save', function(next) {
  this.costPerUnit = this.unitsConsumed > 0 ? this.amount / this.unitsConsumed : 0;
  next();
});

// Pre-update middleware to update costPerUnit
billSchema.pre('findOneAndUpdate', function(next) {
  if (this._update.unitsConsumed || this._update.amount) {
    const units = this._update.unitsConsumed || this.get('unitsConsumed');
    const amount = this._update.amount || this.get('amount');
    this._update.costPerUnit = units > 0 ? amount / units : 0;
  }
  next();
});

// Static methods
billSchema.statics.findByUtilityType = function(utilityType) {
  return this.find({ utilityType: utilityType.toLowerCase() });
};

billSchema.statics.findByMonthAndYear = function(month, year) {
  return this.find({ month, year });
};

billSchema.statics.getMonthlySummary = function(month, year) {
  return this.aggregate([
    { $match: { month, year } },
    {
      $group: {
        _id: '$utilityType',
        totalUnits: { $sum: '$unitsConsumed' },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        averageUnits: { $avg: '$unitsConsumed' },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);
};

billSchema.statics.getYearlySummary = function(year) {
  return this.aggregate([
    { $match: { year } },
    {
      $group: {
        _id: '$month',
        totalUnits: { $sum: '$unitsConsumed' },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

billSchema.statics.getHighConsumptionAlerts = function(threshold) {
  return this.find({ unitsConsumed: { $gt: threshold } });
};

// Instance methods
billSchema.methods.getFormattedCostPerUnit = function() {
  return `₹${this.costPerUnit.toFixed(3)}`;
};

billSchema.methods.getPeriod = function() {
  return `${this.month} ${this.year}`;
};

billSchema.methods.markAsPaid = function(paymentDate = new Date()) {
  this.isPaid = true;
  this.paymentDate = paymentDate;
  return this.save();
};

// Virtual for period display
billSchema.virtual('period').get(function() {
  return `${this.month} ${this.year}`;
});

// Ensure virtual fields are serialized
billSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Create and export the model
const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;