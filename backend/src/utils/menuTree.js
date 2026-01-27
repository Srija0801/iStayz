const menuTree = {
  start: {
    message: "Hi! How can I help you today?",
    options: ["Payments", "Bookings", "Account"],
  },
  Payments: {
    message: "Choose your payment issue:",
    options: ["Payment Failed", "Refund Status", "Go Back"],
  },
  Bookings: {
    message: "Choose booking issue:",
    options: ["Cancel Booking", "Modify Booking", "Go Back"],
  },
  Account: {
    message: "Account related issues:",
    options: ["Change Password", "Update Profile", "Go Back"],
  },
  "Payment Failed": {
    message:
      "If your payment failed, check your bank statement. Refund in 3–5 days.",
    options: ["Back to Payments", "End Chat"],
  },
  "Refund Status": {
    message: "Check refund status in 'My Transactions' under Payments.",
    options: ["Back to Payments", "End Chat"],
  },
  "Cancel Booking": {
    message: "Go to 'My Bookings' and select 'Cancel'.",
    options: ["Back to Bookings", "End Chat"],
  },
  "Modify Booking": {
    message: "To modify your booking, contact support directly.",
    options: ["Back to Bookings", "End Chat"],
  },
  "Change Password": {
    message: "Change password in Profile → Account Settings.",
    options: ["Back to Account", "End Chat"],
  },
  "Update Profile": {
    message: "Update profile info in Profile section.",
    options: ["Back to Account", "End Chat"],
  },
  "Go Back": {
    message: "Returning to main menu.",
    options: ["Payments", "Bookings", "Account"],
  },
  "End Chat": { message: "Thank you! Have a nice day!", options: [] },
};

module.exports = menuTree;
