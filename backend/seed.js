const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const seedCourses = async ()=>{
  await Course.deleteMany();

  await Course.insertMany([
    { 
      title:"CCNA Routing and Switching", 
      description: "Master the fundamentals of networking with CCNA. Learn routing, switching, IP addressing, and more.",
      price:15000, 
      duration:"6 weeks", 
      level:"Beginner" 
    },
    { 
      title:"CCNP Enterprise", 
      description: "Advanced networking course covering enterprise routing, advanced switching, and network security.",
      price:15000, 
      duration:"8 weeks", 
      level:"Advanced" 
    },
    { 
      title:"Routing & Switching Fundamentals", 
      description: "Deep dive into routing protocols, switching concepts, and network design principles.",
      price:12000,
      duration:"4 weeks",
      level:"Beginner"
    },
    { 
      title:"SD-WAN Implementation", 
      description: "Learn Software-Defined WAN technology and transform your network infrastructure.",
      price:18000,
      duration:"5 weeks",
      level:"Intermediate"
    },
    { 
      title:"BGP and Advanced Routing", 
      description: "Master Border Gateway Protocol and prepare for professional-level routing deployments.",
      price:16000,
      duration:"6 weeks",
      level:"Advanced"
    },
    {
      title:"Network Security Essentials",
      description: "Comprehensive course on network security, firewalls, VPN, and threat mitigation.",
      price:14000,
      duration:"5 weeks",
      level:"Intermediate"
    },
    {
      title:"Cisco Troubleshooting Workshop",
      description: "Hands-on troubleshooting techniques for real-world networking problems.",
      price:5000,
      duration:"4 weeks",
      level:"Advanced"
    },
    {
      title:"Network Administration Basics",
      description: "Perfect for beginners looking to start their networking career journey.",
      price:10000,
      duration:"3 weeks",
      level:"Beginner"
    }
  ]);

  console.log('✅ Database seeded successfully with course data!');
  process.exit();
};

seedCourses().catch(err=>{
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});