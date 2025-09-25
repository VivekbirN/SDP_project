const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let bills = [];

app.post('/bill', (req, res) => {
  try {
    const { month, year, unitsConsumed, amount, utilityType } = req.body;
    
    if (!month || !year || !unitsConsumed || !amount || !utilityType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const validUtilityTypes = ['electricity', 'water', 'gas'];
    if (!validUtilityTypes.includes(utilityType)) {
      return res.status(400).json({ error: 'Invalid utility type. Must be electricity, water, or gas' });
    }

    const newBill = {
      id: Date.now().toString(),
      month,
      year: parseInt(year),
      unitsConsumed: parseFloat(unitsConsumed),
      amount: parseFloat(amount),
      utilityType,
      createdAt: new Date()
    };

    bills.push(newBill);
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save bill' });
  }
});

app.get('/bills', (req, res) => {
  try {
    const sortedBills = bills.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return new Date(`${a.month} 1, 2000`) - new Date(`${b.month} 1, 2000`);
    });
    res.json(sortedBills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bills' });
  }
});

app.put('/bill/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, unitsConsumed, amount, utilityType } = req.body;
    
    if (!month || !year || !unitsConsumed || !amount || !utilityType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const validUtilityTypes = ['electricity', 'water', 'gas'];
    if (!validUtilityTypes.includes(utilityType)) {
      return res.status(400).json({ error: 'Invalid utility type. Must be electricity, water, or gas' });
    }

    const billIndex = bills.findIndex(bill => bill.id === id);
    if (billIndex === -1) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    bills[billIndex] = {
      ...bills[billIndex],
      month,
      year: parseInt(year),
      unitsConsumed: parseFloat(unitsConsumed),
      amount: parseFloat(amount),
      utilityType,
      updatedAt: new Date()
    };

    res.json(bills[billIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bill' });
  }
});

app.delete('/bill/:id', (req, res) => {
  try {
    const { id } = req.params;
    const billIndex = bills.findIndex(bill => bill.id === id);
    
    if (billIndex === -1) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    bills.splice(billIndex, 1);
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});

app.get('/trends', (req, res) => {
  try {
    const { utilityType } = req.query;
    let filteredBills = bills;
    
    if (utilityType) {
      const validUtilityTypes = ['electricity', 'water', 'gas'];
      if (!validUtilityTypes.includes(utilityType)) {
        return res.status(400).json({ error: 'Invalid utility type' });
      }
      filteredBills = bills.filter(bill => bill.utilityType === utilityType);
    }

    const monthlyData = {};
    
    filteredBills.forEach(bill => {
      const key = `${bill.year}-${bill.month}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: bill.month,
          year: bill.year,
          totalUnits: 0,
          totalAmount: 0,
          count: 0,
          utilityTypes: []
        };
      }
      monthlyData[key].totalUnits += bill.unitsConsumed;
      monthlyData[key].totalAmount += bill.amount;
      monthlyData[key].count += 1;
      if (!monthlyData[key].utilityTypes.includes(bill.utilityType)) {
        monthlyData[key].utilityTypes.push(bill.utilityType);
      }
    });

    const trends = Object.values(monthlyData)
      .map(data => ({
        month: data.month,
        year: data.year,
        unitsConsumed: data.totalUnits,
        amount: data.totalAmount,
        period: `${data.month} ${data.year}`,
        utilityTypes: data.utilityTypes
      }))
      .sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return new Date(`${a.month} 1, 2000`) - new Date(`${b.month} 1, 2000`);
      });

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trends' });
  }
});

app.post('/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const latestBill = bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const messageLower = message.toLowerCase();
    
    let botReply = '';
    
    // Greeting responses
    if (messageLower.includes('hi') || messageLower.includes('hello') || messageLower.includes('hey')) {
      botReply = 'Hello! How can I help with your utility bills today? 💡';
    }
    // Energy saving tips requests
    else if (messageLower.includes('tip') || messageLower.includes('save') || messageLower.includes('reduce')) {
      if (latestBill && latestBill.unitsConsumed > 500) {
        botReply = `I notice your latest bill shows ${latestBill.unitsConsumed} units consumed, which is quite high! Here are some energy-saving tips:\n\n` +
          `🔌 Unplug devices when not in use\n` +
          `💡 Switch to LED bulbs\n` +
          `🌡️ Set AC to 24°C or higher\n` +
          `🧺 Use cold water for washing\n` +
          `📱 Consider energy-efficient appliances`;
      } else {
        botReply = `Great job keeping your energy consumption efficient! 🌱\n\n` +
          `Keep up the good work with these habits:\n` +
          `✅ Turn off lights when leaving rooms\n` +
          `✅ Use natural light during daytime\n` +
          `✅ Regular maintenance of appliances`;
      }
    }
    // Bill-related questions
    else if (messageLower.includes('bill') || messageLower.includes('usage')) {
      if (latestBill) {
        const utilitySpecific = messageLower.includes('electricity') || messageLower.includes('water') || messageLower.includes('gas');
        let billsToShow = bills;
        
        if (utilitySpecific) {
          if (messageLower.includes('electricity')) {
            billsToShow = bills.filter(bill => bill.utilityType === 'electricity');
          } else if (messageLower.includes('water')) {
            billsToShow = bills.filter(bill => bill.utilityType === 'water');
          } else if (messageLower.includes('gas')) {
            billsToShow = bills.filter(bill => bill.utilityType === 'gas');
          }
        }

        if (billsToShow.length > 0) {
          const latestOfType = billsToShow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          const avgUnits = billsToShow.reduce((sum, bill) => sum + bill.unitsConsumed, 0) / billsToShow.length;
          const avgAmount = billsToShow.reduce((sum, bill) => sum + bill.amount, 0) / billsToShow.length;
          
          botReply = `Your latest ${utilitySpecific ? latestOfType.utilityType : ''} bill shows ${latestOfType.unitsConsumed} units consumed in ${latestOfType.month} ${latestOfType.year} for ₹${latestOfType.amount}.\n\n` +
            `Average consumption: ${avgUnits.toFixed(1)} units\n` +
            `Average amount: ₹${avgAmount.toFixed(2)}\n` +
            `Cost per unit: ₹${(latestOfType.amount / latestOfType.unitsConsumed).toFixed(3)}`;
        } else {
          botReply = utilitySpecific ? `No bills found for that utility type.` : `I don't see any bills in your account yet. Add your first bill to get started! 📊`;
        }
      } else {
        botReply = 'I don\'t see any bills in your account yet. Add your first bill to get started! 📊';
      }
    }
    // Electricity-specific tips
    else if (messageLower.includes('electricity')) {
      botReply = `💡 Electricity saving tips:\n\n` +
        `• Use power strips to easily turn off multiple devices\n` +
        `• Replace old appliances with Energy Star models\n` +
        `• Use ceiling fans instead of AC when possible\n` +
        `• Run dishwasher and washing machine with full loads`;
    }
    // Water-specific tips
    else if (messageLower.includes('water')) {
      botReply = `💧 Water saving tips:\n\n` +
        `• Fix leaky faucets immediately\n` +
        `• Install low-flow showerheads\n` +
        `• Turn off tap while brushing teeth\n` +
        `• Use dishwasher instead of hand washing`;
    }
    // Gas-specific tips
    else if (messageLower.includes('gas')) {
      botReply = `🔥 Gas saving tips:\n\n` +
        `• Lower water heater temperature to 120°F\n` +
        `• Use cold water for laundry when possible\n` +
        `• Seal windows and doors to prevent heat loss\n` +
        `• Maintain your heating system regularly`;
    }
    // Thank you responses
    else if (messageLower.includes('thank')) {
      botReply = 'You\'re welcome! Happy to help you save energy and money! 🌟';
    }
    // Default response
    else {
      botReply = 'I can help you with utility bills and energy-saving tips! Ask me about electricity, water, or gas bills, or request energy-saving advice. 💡';
    }

    res.json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.get('/analytics', (req, res) => {
  try {
    const { utilityType, threshold } = req.query;
    let filteredBills = bills;
    
    if (utilityType) {
      const validUtilityTypes = ['electricity', 'water', 'gas'];
      if (!validUtilityTypes.includes(utilityType)) {
        return res.status(400).json({ error: 'Invalid utility type' });
      }
      filteredBills = bills.filter(bill => bill.utilityType === utilityType);
    }

    if (filteredBills.length === 0) {
      return res.json({
        averageConsumption: 0,
        averageAmount: 0,
        totalBills: 0,
        highConsumptionAlerts: [],
        utilityBreakdown: {}
      });
    }

    // Calculate average consumption and amount
    const totalUnits = filteredBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0);
    const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
    const averageConsumption = totalUnits / filteredBills.length;
    const averageAmount = totalAmount / filteredBills.length;

    // High consumption alerts
    const highConsumptionThreshold = threshold ? parseFloat(threshold) : averageConsumption * 1.5;
    const highConsumptionAlerts = filteredBills
      .filter(bill => bill.unitsConsumed > highConsumptionThreshold)
      .map(bill => ({
        id: bill.id,
        month: bill.month,
        year: bill.year,
        utilityType: bill.utilityType,
        unitsConsumed: bill.unitsConsumed,
        amount: bill.amount,
        threshold: highConsumptionThreshold,
        percentageAboveThreshold: ((bill.unitsConsumed - highConsumptionThreshold) / highConsumptionThreshold * 100).toFixed(1)
      }));

    // Utility breakdown
    const utilityBreakdown = {};
    filteredBills.forEach(bill => {
      if (!utilityBreakdown[bill.utilityType]) {
        utilityBreakdown[bill.utilityType] = {
          totalUnits: 0,
          totalAmount: 0,
          count: 0,
          averageUnits: 0,
          averageAmount: 0
        };
      }
      utilityBreakdown[bill.utilityType].totalUnits += bill.unitsConsumed;
      utilityBreakdown[bill.utilityType].totalAmount += bill.amount;
      utilityBreakdown[bill.utilityType].count += 1;
    });

    Object.keys(utilityBreakdown).forEach(utility => {
      const data = utilityBreakdown[utility];
      data.averageUnits = data.totalUnits / data.count;
      data.averageAmount = data.totalAmount / data.count;
    });

    res.json({
      averageConsumption: averageConsumption.toFixed(2),
      averageAmount: averageAmount.toFixed(2),
      totalBills: filteredBills.length,
      highConsumptionAlerts,
      utilityBreakdown,
      thresholdUsed: highConsumptionThreshold
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

app.get('/cost-summary', (req, res) => {
  try {
    const costSummary = {};
    const utilityTypes = ['electricity', 'water', 'gas'];
    
    utilityTypes.forEach(utility => {
      const utilityBills = bills.filter(bill => bill.utilityType === utility);
      costSummary[utility] = {
        totalAmount: utilityBills.reduce((sum, bill) => sum + bill.amount, 0),
        totalUnits: utilityBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0),
        count: utilityBills.length,
        averageAmount: utilityBills.length > 0 ? utilityBills.reduce((sum, bill) => sum + bill.amount, 0) / utilityBills.length : 0,
        averageUnits: utilityBills.length > 0 ? utilityBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0) / utilityBills.length : 0
      };
    });

    res.json(costSummary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cost summary' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});