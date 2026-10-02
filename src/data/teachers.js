const teachers = [
    {
        id: "TCH-001",
        name: "Mr. Bidemi",
        subject: "Mathematics",
        department: "Science & Mathematics",
        description:
            "Helps students develop strong mathematical understanding, logical thinking, and problem-solving skills.",
        email: "bidemi@greenfieldschool.com",
        phone: "+234 801 000 0001",
    },
    {
        id: "TCH-002",
        name: "Mrs. Ahmad",
        subject: "English Language",
        department: "Arts & Humanities",
        description:
            "Supports students in developing strong communication, writing, reading, and presentation skills.",
        email: "ahmad@greenfieldschool.com",
        phone: "+234 801 000 0002",
    },
    {
        id: "TCH-003",
        name: "Mr. AbulRahman",
        subject: "Computer Science",
        department: "Science & Technology",
        description:
            "Guides students in developing digital skills, programming knowledge, and practical technology skills.",
        email: "abulrahman@greenfieldschool.com",
        phone: "+234 801 000 0003",
    },
    {
        id: "TCH-004",
        name: "Mr. Kamaldeen",
        subject: "Business Studies",
        department: "Commercial Studies",
        description:
            "Helps students understand business concepts while developing practical and entrepreneurial thinking.",
        email: "kamaldeen@greenfieldschool.com",
        phone: "+234 801 000 0004",
    },
    {
        id: "TCH-005",
        name: "Mrs. Adeleke",
        subject: "General Studies",
        department: "Arts & Humanities",
        description:
            "Encourages students to build confidence, communicate effectively, and develop a broad understanding of important subjects.",
        email: "adeleke@greenfieldschool.com",
        phone: "+234 801 000 0005",
    },
    {
        id: "TCH-006",
        name: "Mr. Ibrahim",
        subject: "Physics",
        department: "Science & Technology",
        description:
            "Helps students understand physical concepts through explanations, experiments, and practical activities.",
        email: "ibrahim@greenfieldschool.com",
        phone: "+234 801 000 0006",
    },
    {
        id: "TCH-007",
        name: "Mrs. Fatima",
        subject: "Chemistry",
        department: "Science & Technology",
        description:
            "Guides students through chemistry concepts and practical activities that connect theory with real-world applications.",
        email: "fatima@greenfieldschool.com",
        phone: "+234 801 000 0007",
    },
    {
        id: "TCH-008",
        name: "Mr. Yusuf",
        subject: "Biology",
        department: "Science & Technology",
        description:
            "Helps students explore living systems and understand important biological concepts.",
        email: "yusuf@greenfieldschool.com",
        phone: "+234 801 000 0008",
    },
    {
        id: "TCH-009",
        name: "Mrs. Maryam",
        subject: "Literature",
        department: "Arts & Humanities",
        description:
            "Encourages students to explore literature, creativity, reading, and thoughtful interpretation.",
        email: "maryam@greenfieldschool.com",
        phone: "+234 801 000 0009",
    },
    {
        id: "TCH-010",
        name: "Mr. Hassan",
        subject: "Economics",
        department: "Commercial Studies",
        description:
            "Helps students understand economic concepts and how they relate to everyday life and society.",
        email: "hassan@greenfieldschool.com",
        phone: "+234 801 000 0010",
    },
    {
        id: "TCH-011",
        name: "Mrs. Zainab",
        subject: "Government",
        department: "Arts & Humanities",
        description:
            "Introduces students to government, civic responsibilities, and important concepts about society.",
        email: "zainab@greenfieldschool.com",
        phone: "+234 801 000 0011",
    },
    {
        id: "TCH-012",
        name: "Mr. Suleiman",
        subject: "Geography",
        department: "Arts & Humanities",
        description:
            "Helps students understand people, places, environments, and the relationship between communities and their surroundings.",
        email: "suleiman@greenfieldschool.com",
        phone: "+234 801 000 0012",
    },
    {
        id: "TCH-013",
        name: "Mrs. Aisha",
        subject: "Basic Science",
        department: "Science & Technology",
        description:
            "Introduces students to scientific ideas through engaging lessons and practical classroom activities.",
        email: "aisha@greenfieldschool.com",
        phone: "+234 801 000 0013",
    },
    {
        id: "TCH-014",
        name: "Mr. Abdullahi",
        subject: "Basic Technology",
        department: "Science & Technology",
        description:
            "Helps students develop practical knowledge of technology, tools, design, and problem-solving.",
        email: "abdullahi.tech@greenfieldschool.com",
        phone: "+234 801 000 0014",
    },
    {
        id: "TCH-015",
        name: "Mrs. Halima",
        subject: "Home Economics",
        department: "Arts & Humanities",
        description:
            "Guides students in developing useful practical skills related to home management, nutrition, and everyday life.",
        email: "halima@greenfieldschool.com",
        phone: "+234 801 000 0015",
    },
    {
        id: "TCH-016",
        name: "Mr. Musa",
        subject: "Agricultural Science",
        department: "Science & Technology",
        description:
            "Helps students understand agriculture, farming practices, natural resources, and sustainable development.",
        email: "musa@greenfieldschool.com",
        phone: "+234 801 000 0016",
    },
    {
        id: "TCH-017",
        name: "Mrs. Khadijah",
        subject: "Social Studies",
        department: "Arts & Humanities",
        description:
            "Helps students understand society, relationships, culture, and responsible participation in their communities.",
        email: "khadijah@greenfieldschool.com",
        phone: "+234 801 000 0017",
    },
    {
        id: "TCH-018",
        name: "Mr. Ismail",
        subject: "Accounting",
        department: "Commercial Studies",
        description:
            "Guides students in understanding financial records, accounting principles, and practical financial skills.",
        email: "ismail@greenfieldschool.com",
        phone: "+234 801 000 0018",
    },
    {
        id: "TCH-019",
        name: "Mrs. Raheemah",
        subject: "Commerce",
        department: "Commercial Studies",
        description:
            "Introduces students to commercial activities, trade, business practices, and the world of commerce.",
        email: "raheemah@greenfieldschool.com",
        phone: "+234 801 000 0019",
    },
    {
        id: "TCH-020",
        name: "Mr. Umar",
        subject: "Further Mathematics",
        department: "Science & Mathematics",
        description:
            "Supports students in developing advanced mathematical reasoning and problem-solving skills.",
        email: "umar@greenfieldschool.com",
        phone: "+234 801 000 0020",
    },
    {
        id: "TCH-021",
        name: "Mrs. Safiya",
        subject: "French",
        department: "Arts & Humanities",
        description:
            "Helps students develop basic communication skills and cultural awareness through French language learning.",
        email: "safiya@greenfieldschool.com",
        phone: "+234 801 000 0021",
    },
    {
        id: "TCH-022",
        name: "Mr. Haruna",
        subject: "Physical Education",
        department: "Sports & Physical Development",
        description:
            "Encourages students to develop teamwork, discipline, coordination, and healthy physical habits.",
        email: "haruna@greenfieldschool.com",
        phone: "+234 801 000 0022",
    },
    {
        id: "TCH-023",
        name: "Mrs. Sadiya",
        subject: "Creative Arts",
        department: "Arts & Humanities",
        description:
            "Encourages students to express their ideas through creative activities, design, and artistic projects.",
        email: "sadiya@greenfieldschool.com",
        phone: "+234 801 000 0023",
    },
    {
        id: "TCH-024",
        name: "Mr. Kareem",
        subject: "Computer Studies",
        department: "Science & Technology",
        description:
            "Helps students build practical computer skills and understand how technology can support learning.",
        email: "kareem@greenfieldschool.com",
        phone: "+234 801 000 0024",
    },
    {
        id: "TCH-025",
        name: "Mrs. Rukayat",
        subject: "Civic Education",
        department: "Arts & Humanities",
        description:
            "Helps students understand citizenship, responsibilities, values, and positive participation in society.",
        email: "rukayat@greenfieldschool.com",
        phone: "+234 801 000 0025",
    },
    {
        id: "TCH-026",
        name: "Mr. Bashir",
        subject: "Data Processing",
        department: "Science & Technology",
        description:
            "Guides students in understanding data, computer applications, and practical digital information skills.",
        email: "bashir@greenfieldschool.com",
        phone: "+234 801 000 0026",
    },
    {
        id: "TCH-027",
        name: "Mrs. Hafsat",
        subject: "Islamic Religious Studies",
        department: "Religious & Moral Studies",
        description:
            "Supports students in learning about religious teachings, moral values, and responsible behaviour.",
        email: "hafsat@greenfieldschool.com",
        phone: "+234 801 000 0027",
    },
    {
        id: "TCH-028",
        name: "Mrs. Nurah",
        subject: "Islamic Religious Studies",
        department: "Religious & Moral Studies",
        description:
            "Guides students in learning Islamic teachings, values, good character, and responsible conduct.",
        email: "nurah@greenfieldschool.com",
        phone: "+234 801 000 0028",
    },
    {
        id: "TCH-029",
        name: "Mrs. Hannan",
        subject: "Integrated Science",
        department: "Science & Technology",
        description:
            "Helps students connect different areas of science through practical and engaging learning activities.",
        email: "hannan@greenfieldschool.com",
        phone: "+234 801 000 0029",
    },
    {
        id: "TCH-030",
        name: "Mr. Abdullahi",
        subject: "Entrepreneurship",
        department: "Commercial Studies",
        description:
            "Encourages students to develop creative ideas, business awareness, initiative, and entrepreneurial thinking.",
        email: "abdullahi.business@greenfieldschool.com",
        phone: "+234 801 000 0030",
    },
];

export default teachers;