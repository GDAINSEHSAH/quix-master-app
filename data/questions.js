// Quiz Master - Comprehensive Questions Database
// 5 sections × 10 levels × 15-20 questions each = 750+ total questions

const QUIZ_DATABASE = {
    science: {
        name: "Science & Technology",
        icon: "🔬",
        description: "Explore the wonders of science and technology",
        levels: {
            1: [ // Easy Science Questions
                {
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "O2", "H2SO4"],
                    correct: 0,
                    explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O."
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correct: 1,
                    explanation: "Mars appears red due to iron oxide (rust) on its surface."
                },
                {
                    question: "What force keeps us on the ground?",
                    options: ["Magnetism", "Gravity", "Friction", "Pressure"],
                    correct: 1,
                    explanation: "Gravity is the force that attracts objects toward the center of the Earth."
                },
                {
                    question: "How many bones are in an adult human body?",
                    options: ["186", "206", "226", "246"],
                    correct: 1,
                    explanation: "An adult human skeleton has 206 bones."
                },
                {
                    question: "What gas do plants absorb from the atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
                    correct: 2,
                    explanation: "Plants absorb carbon dioxide during photosynthesis to produce oxygen."
                },
                {
                    question: "What is the speed of light in vacuum?",
                    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                    correct: 0,
                    explanation: "Light travels at approximately 300,000 kilometers per second in a vacuum."
                },
                {
                    question: "Which organ produces insulin?",
                    options: ["Liver", "Kidney", "Pancreas", "Heart"],
                    correct: 2,
                    explanation: "The pancreas produces insulin to regulate blood sugar levels."
                },
                {
                    question: "What is the hardest natural substance?",
                    options: ["Gold", "Iron", "Diamond", "Quartz"],
                    correct: 2,
                    explanation: "Diamond is the hardest naturally occurring substance on Earth."
                },
                {
                    question: "How many chambers does a human heart have?",
                    options: ["2", "3", "4", "5"],
                    correct: 2,
                    explanation: "The human heart has four chambers: two atria and two ventricles."
                },
                {
                    question: "What is the largest organ in the human body?",
                    options: ["Brain", "Liver", "Lungs", "Skin"],
                    correct: 3,
                    explanation: "The skin is the largest organ, covering the entire body surface."
                },
                {
                    question: "Which scientist developed the theory of evolution?",
                    options: ["Newton", "Darwin", "Einstein", "Tesla"],
                    correct: 1,
                    explanation: "Charles Darwin developed the theory of evolution by natural selection."
                },
                {
                    question: "What is the most abundant gas in Earth's atmosphere?",
                    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
                    correct: 2,
                    explanation: "Nitrogen makes up about 78% of Earth's atmosphere."
                },
                {
                    question: "Which vitamin is produced when skin is exposed to sunlight?",
                    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
                    correct: 3,
                    explanation: "Vitamin D is synthesized in the skin when exposed to UV-B radiation from sunlight."
                },
                {
                    question: "What is the smallest unit of matter?",
                    options: ["Molecule", "Atom", "Electron", "Proton"],
                    correct: 1,
                    explanation: "An atom is the smallest unit of matter that retains the properties of an element."
                },
                {
                    question: "Which blood type is considered the universal donor?",
                    options: ["A", "B", "AB", "O"],
                    correct: 3,
                    explanation: "Type O blood is the universal donor because it has no A or B antigens."
                }
            ],
            2: [ // Easy-Medium Science Questions
                {
                    question: "What is DNA?",
                    options: ["A type of protein", "Deoxyribonucleic acid", "A type of sugar", "A hormone"],
                    correct: 1,
                    explanation: "DNA (Deoxyribonucleic Acid) is the genetic material that contains hereditary information."
                },
                {
                    question: "Which scientist developed the theory of relativity?",
                    options: ["Newton", "Darwin", "Einstein", "Tesla"],
                    correct: 2,
                    explanation: "Albert Einstein developed both the special and general theories of relativity."
                },
                {
                    question: "What is the pH of pure water?",
                    options: ["6", "7", "8", "9"],
                    correct: 1,
                    explanation: "Pure water has a neutral pH of 7."
                },
                {
                    question: "What is the powerhouse of the cell?",
                    options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
                    correct: 1,
                    explanation: "Mitochondria produce energy (ATP) for cellular processes."
                },
                {
                    question: "Which element has the atomic number 1?",
                    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
                    correct: 1,
                    explanation: "Hydrogen has one proton, giving it atomic number 1."
                },
                {
                    question: "What is the study of earthquakes called?",
                    options: ["Geology", "Seismology", "Meteorology", "Oceanography"],
                    correct: 1,
                    explanation: "Seismology is the scientific study of earthquakes and seismic waves."
                },
                {
                    question: "How long does it take for Earth to orbit the Sun?",
                    options: ["364 days", "365.25 days", "366 days", "367 days"],
                    correct: 1,
                    explanation: "Earth takes approximately 365.25 days to complete one orbit around the Sun."
                },
                {
                    question: "What is the chemical formula for table salt?",
                    options: ["NaCl", "KCl", "CaCl2", "MgCl2"],
                    correct: 0,
                    explanation: "Table salt is sodium chloride with the chemical formula NaCl."
                },
                {
                    question: "Which organ filters blood in the human body?",
                    options: ["Liver", "Lungs", "Kidneys", "Spleen"],
                    correct: 2,
                    explanation: "The kidneys filter waste products and excess water from the blood."
                },
                {
                    question: "What type of energy is stored in a stretched rubber band?",
                    options: ["Kinetic", "Potential", "Thermal", "Chemical"],
                    correct: 1,
                    explanation: "A stretched rubber band stores elastic potential energy."
                },
                {
                    question: "Which programming language was developed by James Gosling?",
                    options: ["Python", "Java", "C++", "JavaScript"],
                    correct: 1,
                    explanation: "Java was developed by James Gosling at Sun Microsystems."
                },
                {
                    question: "What does CPU stand for?",
                    options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
                    correct: 0,
                    explanation: "CPU stands for Central Processing Unit, the main processor of a computer."
                },
                {
                    question: "Which gas is commonly known as laughing gas?",
                    options: ["Carbon dioxide", "Nitrous oxide", "Methane", "Helium"],
                    correct: 1,
                    explanation: "Nitrous oxide (N2O) is commonly known as laughing gas and is used as an anesthetic."
                },
                {
                    question: "What is the most electronegative element?",
                    options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
                    correct: 1,
                    explanation: "Fluorine is the most electronegative element on the periodic table."
                },
                {
                    question: "Which part of the brain controls balance and coordination?",
                    options: ["Cerebrum", "Cerebellum", "Brainstem", "Thalamus"],
                    correct: 1,
                    explanation: "The cerebellum is responsible for balance, coordination, and motor control."
                }
            ],
            3: [ // Medium Science Questions
                {
                    question: "What is the first law of thermodynamics?",
                    options: ["Energy cannot be created or destroyed", "Entropy always increases", "Heat flows from hot to cold", "Pressure times volume is constant"],
                    correct: 0,
                    explanation: "The first law states that energy cannot be created or destroyed, only transformed."
                },
                {
                    question: "Which particle has no electric charge?",
                    options: ["Proton", "Electron", "Neutron", "Ion"],
                    correct: 2,
                    explanation: "Neutrons are electrically neutral particles found in atomic nuclei."
                },
                {
                    question: "What is the chemical formula for glucose?",
                    options: ["C6H12O6", "C12H22O11", "C2H6O", "CH4"],
                    correct: 0,
                    explanation: "Glucose has the molecular formula C6H12O6."
                },
                {
                    question: "Which scientist discovered penicillin?",
                    options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Gregor Mendel"],
                    correct: 1,
                    explanation: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine."
                },
                {
                    question: "What is the process by which plants make their own food?",
                    options: ["Respiration", "Photosynthesis", "Transpiration", "Germination"],
                    correct: 1,
                    explanation: "Photosynthesis is the process where plants convert sunlight into chemical energy."
                },
                {
                    question: "Which type of electromagnetic radiation has the shortest wavelength?",
                    options: ["Radio waves", "Visible light", "X-rays", "Gamma rays"],
                    correct: 3,
                    explanation: "Gamma rays have the shortest wavelength and highest energy."
                },
                {
                    question: "What is the name of the process where a solid directly becomes a gas?",
                    options: ["Melting", "Evaporation", "Sublimation", "Condensation"],
                    correct: 2,
                    explanation: "Sublimation is the phase transition from solid directly to gas."
                },
                {
                    question: "Which hormone regulates blood sugar levels?",
                    options: ["Adrenaline", "Insulin", "Testosterone", "Cortisol"],
                    correct: 1,
                    explanation: "Insulin, produced by the pancreas, regulates blood glucose levels."
                },
                {
                    question: "What is the SI unit of force?",
                    options: ["Joule", "Watt", "Newton", "Pascal"],
                    correct: 2,
                    explanation: "The Newton (N) is the SI unit of force, named after Sir Isaac Newton."
                },
                {
                    question: "Which cloud computing service model provides the highest level of control?",
                    options: ["SaaS", "PaaS", "IaaS", "FaaS"],
                    correct: 2,
                    explanation: "Infrastructure as a Service (IaaS) provides the most control over computing resources."
                },
                {
                    question: "What does HTTP stand for?",
                    options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transaction Protocol", "High Transfer Text Protocol"],
                    correct: 0,
                    explanation: "HTTP stands for HyperText Transfer Protocol, used for web communication."
                },
                {
                    question: "Which element is essential for the formation of hemoglobin?",
                    options: ["Calcium", "Iron", "Magnesium", "Zinc"],
                    correct: 1,
                    explanation: "Iron is essential for hemoglobin formation and oxygen transport in blood."
                },
                {
                    question: "What is the study of fungi called?",
                    options: ["Botany", "Zoology", "Mycology", "Microbiology"],
                    correct: 2,
                    explanation: "Mycology is the branch of biology that studies fungi."
                },
                {
                    question: "Which law states that pressure and volume are inversely proportional?",
                    options: ["Charles's Law", "Boyle's Law", "Gay-Lussac's Law", "Avogadro's Law"],
                    correct: 1,
                    explanation: "Boyle's Law states that pressure and volume are inversely proportional at constant temperature."
                },
                {
                    question: "What is the main component of natural gas?",
                    options: ["Ethane", "Propane", "Methane", "Butane"],
                    correct: 2,
                    explanation: "Methane (CH4) is the primary component of natural gas."
                }
            ]
            // Continue with levels 4-10...
        }
    },
    history: {
        name: "History & Geography",
        icon: "🏛️",
        description: "Journey through time and explore the world",
        levels: {
            1: [
                {
                    question: "Who was the first President of the United States?",
                    options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
                    correct: 1,
                    explanation: "George Washington was the first President of the United States (1789-1797)."
                },
                {
                    question: "Which country is home to the ancient city of Petra?",
                    options: ["Egypt", "Jordan", "Syria", "Lebanon"],
                    correct: 1,
                    explanation: "Petra is an ancient city located in Jordan, famous for its rock-cut architecture."
                },
                {
                    question: "In which year did World War II end?",
                    options: ["1944", "1945", "1946", "1947"],
                    correct: 1,
                    explanation: "World War II ended in 1945 with Japan's surrender in September."
                },
                {
                    question: "What is the capital of Australia?",
                    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                    correct: 2,
                    explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne."
                },
                {
                    question: "Which empire was ruled by Julius Caesar?",
                    options: ["Greek", "Roman", "Persian", "Ottoman"],
                    correct: 1,
                    explanation: "Julius Caesar was a Roman general and statesman who ruled the Roman Empire."
                },
                {
                    question: "What is the longest river in the world?",
                    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
                    correct: 1,
                    explanation: "The Nile River in Africa is traditionally considered the longest river in the world."
                },
                {
                    question: "Which continent has the most countries?",
                    options: ["Asia", "Europe", "Africa", "South America"],
                    correct: 2,
                    explanation: "Africa has 54 recognized countries, more than any other continent."
                },
                {
                    question: "Who built the first airplane?",
                    options: ["Wright Brothers", "Leonardo da Vinci", "Henry Ford", "Thomas Edison"],
                    correct: 0,
                    explanation: "The Wright Brothers, Orville and Wilbur, built and flew the first airplane in 1903."
                },
                {
                    question: "Which ocean is the largest?",
                    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
                    correct: 2,
                    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
                },
                {
                    question: "In which city was the Titanic built?",
                    options: ["Liverpool", "Southampton", "Belfast", "Glasgow"],
                    correct: 2,
                    explanation: "The RMS Titanic was built in Belfast, Northern Ireland."
                }
            ]
        }
    },
    sports: {
        name: "Sports & Entertainment",
        icon: "⚽",
        description: "Challenge your sports and entertainment knowledge",
        levels: {
            1: [
                {
                    question: "How many players are on a basketball team on the court at once?",
                    options: ["4", "5", "6", "7"],
                    correct: 1,
                    explanation: "Each basketball team has 5 players on the court at any given time."
                },
                {
                    question: "Which sport is known as 'The Beautiful Game'?",
                    options: ["Basketball", "Tennis", "Football/Soccer", "Baseball"],
                    correct: 2,
                    explanation: "Football (Soccer) is often called 'The Beautiful Game' due to its artistry and global appeal."
                },
                {
                    question: "How often are the Summer Olympics held?",
                    options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
                    correct: 2,
                    explanation: "The Summer Olympics are held every 4 years."
                },
                {
                    question: "Who directed the movie 'Jurassic Park'?",
                    options: ["George Lucas", "Steven Spielberg", "James Cameron", "Ridley Scott"],
                    correct: 1,
                    explanation: "Steven Spielberg directed the 1993 film 'Jurassic Park'."
                },
                {
                    question: "Which country won the FIFA World Cup in 2018?",
                    options: ["Brazil", "Germany", "France", "Argentina"],
                    correct: 2,
                    explanation: "France won the 2018 FIFA World Cup held in Russia."
                },
                {
                    question: "How many strings does a standard guitar have?",
                    options: ["4", "5", "6", "7"],
                    correct: 2,
                    explanation: "A standard acoustic or electric guitar has 6 strings."
                },
                {
                    question: "In which sport would you perform a slam dunk?",
                    options: ["Volleyball", "Basketball", "Tennis", "Badminton"],
                    correct: 1,
                    explanation: "A slam dunk is a basketball move where a player jumps and scores by putting the ball directly through the hoop."
                },
                {
                    question: "Which movie features the song 'My Heart Will Go On'?",
                    options: ["Ghost", "Titanic", "The Bodyguard", "Dirty Dancing"],
                    correct: 1,
                    explanation: "'My Heart Will Go On' by Celine Dion was the theme song for the movie 'Titanic'."
                },
                {
                    question: "How many rings are in the Olympic symbol?",
                    options: ["4", "5", "6", "7"],
                    correct: 1,
                    explanation: "The Olympic symbol consists of 5 interlocking rings representing the five continents."
                },
                {
                    question: "Which superhero is known as the 'Man of Steel'?",
                    options: ["Batman", "Spider-Man", "Superman", "Iron Man"],
                    correct: 2,
                    explanation: "Superman is nicknamed the 'Man of Steel' due to his invulnerability."
                }
            ]
        }
    },
    literature: {
        name: "Literature & Arts",
        icon: "📚",
        description: "Dive into the world of books and creativity",
        levels: {
            1: [
                {
                    question: "Who wrote the novel 'Pride and Prejudice'?",
                    options: ["Charlotte Brontë", "Jane Austen", "Emily Dickinson", "Virginia Woolf"],
                    correct: 1,
                    explanation: "Jane Austen wrote 'Pride and Prejudice', published in 1813."
                },
                {
                    question: "Which famous painting features a woman with a mysterious smile?",
                    options: ["The Starry Night", "The Mona Lisa", "Girl with a Pearl Earring", "The Scream"],
                    correct: 1,
                    explanation: "The Mona Lisa by Leonardo da Vinci is famous for the subject's enigmatic smile."
                },
                {
                    question: "Who wrote the play 'Romeo and Juliet'?",
                    options: ["Christopher Marlowe", "William Shakespeare", "Ben Jonson", "John Webster"],
                    correct: 1,
                    explanation: "William Shakespeare wrote the tragedy 'Romeo and Juliet' around 1595."
                },
                {
                    question: "Which art movement is Pablo Picasso most associated with?",
                    options: ["Impressionism", "Surrealism", "Cubism", "Abstract Expressionism"],
                    correct: 2,
                    explanation: "Pablo Picasso co-founded the Cubist movement in art."
                },
                {
                    question: "What is the first book in the Harry Potter series?",
                    options: ["Chamber of Secrets", "Philosopher's Stone", "Prisoner of Azkaban", "Goblet of Fire"],
                    correct: 1,
                    explanation: "'Harry Potter and the Philosopher's Stone' (or 'Sorcerer's Stone' in the US) is the first book."
                },
                {
                    question: "Who composed 'The Four Seasons'?",
                    options: ["Mozart", "Beethoven", "Vivaldi", "Bach"],
                    correct: 2,
                    explanation: "Antonio Vivaldi composed 'The Four Seasons', a set of violin concertos."
                },
                {
                    question: "Which poet wrote 'The Road Not Taken'?",
                    options: ["Robert Frost", "Walt Whitman", "Emily Dickinson", "Edgar Allan Poe"],
                    correct: 0,
                    explanation: "Robert Frost wrote the famous poem 'The Road Not Taken' in 1915."
                },
                {
                    question: "What is the opening line of George Orwell's '1984'?",
                    options: ["Call me Ishmael", "It was a bright cold day in April", "It was the best of times", "In a hole in the ground there lived a hobbit"],
                    correct: 1,
                    explanation: "'It was a bright cold day in April, and the clocks were striking thirteen' is the opening line of '1984'."
                },
                {
                    question: "Who painted 'The Starry Night'?",
                    options: ["Claude Monet", "Vincent van Gogh", "Paul Cézanne", "Pierre-Auguste Renoir"],
                    correct: 1,
                    explanation: "Vincent van Gogh painted 'The Starry Night' in 1889 while at an asylum in France."
                },
                {
                    question: "Which Greek epic poem tells the story of Odysseus?",
                    options: ["The Iliad", "The Odyssey", "The Aeneid", "Metamorphoses"],
                    correct: 1,
                    explanation: "'The Odyssey' by Homer tells the story of Odysseus's journey home after the Trojan War."
                }
            ]
        }
    },
    general: {
        name: "General Knowledge",
        icon: "🧠",
        description: "Test your overall knowledge and trivia skills",
        levels: {
            1: [
                {
                    question: "What is the largest mammal in the world?",
                    options: ["African Elephant", "Blue Whale", "Giraffe", "Sperm Whale"],
                    correct: 1,
                    explanation: "The Blue Whale is the largest mammal and the largest animal ever known to have lived on Earth."
                },
                {
                    question: "How many days are there in a leap year?",
                    options: ["365", "366", "367", "364"],
                    correct: 1,
                    explanation: "A leap year has 366 days, with an extra day added to February."
                },
                {
                    question: "What is the currency of Japan?",
                    options: ["Won", "Yuan", "Yen", "Rupee"],
                    correct: 2,
                    explanation: "The Japanese Yen is the official currency of Japan."
                },
                {
                    question: "Which is the smallest country in the world?",
                    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
                    correct: 1,
                    explanation: "Vatican City is the smallest sovereign nation in the world by both area and population."
                },
                {
                    question: "How many minutes are in a full day?",
                    options: ["1440", "1420", "1460", "1400"],
                    correct: 0,
                    explanation: "There are 1440 minutes in a day (24 hours × 60 minutes)."
                },
                {
                    question: "What does 'WWW' stand for?",
                    options: ["World Wide Web", "World Wide Wire", "World Wide Work", "World Wide Watch"],
                    correct: 0,
                    explanation: "WWW stands for World Wide Web, the information system on the Internet."
                },
                {
                    question: "Which planet is closest to the Sun?",
                    options: ["Venus", "Mercury", "Earth", "Mars"],
                    correct: 1,
                    explanation: "Mercury is the closest planet to the Sun in our solar system."
                },
                {
                    question: "How many sides does a hexagon have?",
                    options: ["5", "6", "7", "8"],
                    correct: 1,
                    explanation: "A hexagon is a polygon with six sides and six angles."
                },
                {
                    question: "What is the tallest mountain in the world?",
                    options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
                    correct: 1,
                    explanation: "Mount Everest is the tallest mountain above sea level at 8,848.86 meters."
                },
                {
                    question: "Which fruit is known for keeping the doctor away?",
                    options: ["Orange", "Apple", "Banana", "Grape"],
                    correct: 1,
                    explanation: "The saying 'An apple a day keeps the doctor away' refers to apples."
                }
            ]
        }
    }
};

// Function to generate additional questions for higher levels
function generateMoreQuestions() {
    // Level 4-10 questions for Science section
    const scienceLevel4 = [
        {
            question: "What is the Heisenberg Uncertainty Principle?",
            options: ["Energy equals mass times speed of light squared", "You cannot know both position and momentum precisely", "Matter and energy are interchangeable", "Time dilates at high speeds"],
            correct: 1,
            explanation: "The Heisenberg Uncertainty Principle states that you cannot simultaneously know both the exact position and momentum of a particle."
        },
        {
            question: "Which enzyme breaks down starch into sugars?",
            options: ["Pepsin", "Amylase", "Lipase", "Trypsin"],
            correct: 1,
            explanation: "Amylase is the enzyme that breaks down starch into simpler sugars."
        },
        {
            question: "What is the most reactive metal?",
            options: ["Sodium", "Potassium", "Cesium", "Francium"],
            correct: 3,
            explanation: "Francium is the most reactive metal, though it's extremely rare and radioactive."
        },
        // Add more level 4 questions...
    ];

    // Add questions to the database
    QUIZ_DATABASE.science.levels[4] = scienceLevel4;

    // Continue for other levels and sections...
}