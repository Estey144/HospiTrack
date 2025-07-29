// Test file to check doctor user data format
// Copy this user object to localStorage to test the dashboard

const testDoctorUser = {
  id: "doc002", // This doctor has data in the database
  name: "dr. fatema khatun",
  email: "fatema.khatun@labaid.com",
  role: "doctor",
  phone: "+8801710000002",
  availableHours: "8:00 AM - 4:00 PM",
  experienceYears: 12,
  licensenumber: "MD12346",
  departmentName: "Neurology",
  branchName: "Dhaka Medical Branch"
};

// To set this user in localStorage, open browser console and run:
// localStorage.setItem("user", JSON.stringify(testDoctorUser));
// Then refresh the DoctorDashboard page

console.log("Test Doctor User Object:");
console.log(JSON.stringify(testDoctorUser, null, 2));

export default testDoctorUser;
