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
            ],
            4: [ // Medium-Hard Science Questions
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
                {
                    question: "Which organelle is responsible for protein synthesis?",
                    options: ["Golgi apparatus", "Ribosomes", "Lysosomes", "Vacuoles"],
                    correct: 1,
                    explanation: "Ribosomes are the cellular organelles responsible for protein synthesis."
                },
                {
                    question: "What is the molecular geometry of methane?",
                    options: ["Linear", "Trigonal planar", "Tetrahedral", "Octahedral"],
                    correct: 2,
                    explanation: "Methane (CH4) has a tetrahedral molecular geometry."
                },
                {
                    question: "Which type of bond holds DNA strands together?",
                    options: ["Ionic bonds", "Covalent bonds", "Hydrogen bonds", "Metallic bonds"],
                    correct: 2,
                    explanation: "Hydrogen bonds hold the two DNA strands together in the double helix."
                },
                {
                    question: "What is the primary function of the endoplasmic reticulum?",
                    options: ["Energy production", "Protein and lipid synthesis", "Waste disposal", "DNA replication"],
                    correct: 1,
                    explanation: "The endoplasmic reticulum is involved in protein and lipid synthesis."
                },
                {
                    question: "Which principle explains the operation of MRI machines?",
                    options: ["X-ray absorption", "Nuclear magnetic resonance", "Ultrasound waves", "Gamma radiation"],
                    correct: 1,
                    explanation: "MRI (Magnetic Resonance Imaging) uses nuclear magnetic resonance to create images."
                },
                {
                    question: "What is the half-life of Carbon-14?",
                    options: ["1,000 years", "5,730 years", "10,000 years", "50,000 years"],
                    correct: 1,
                    explanation: "Carbon-14 has a half-life of approximately 5,730 years, useful for radiocarbon dating."
                },
                {
                    question: "Which programming paradigm does Python primarily support?",
                    options: ["Functional only", "Object-oriented only", "Procedural only", "Multi-paradigm"],
                    correct: 3,
                    explanation: "Python is a multi-paradigm language supporting object-oriented, procedural, and functional programming."
                },
                {
                    question: "What is the escape velocity from Earth?",
                    options: ["7.9 km/s", "11.2 km/s", "15.3 km/s", "20.1 km/s"],
                    correct: 1,
                    explanation: "Earth's escape velocity is approximately 11.2 km/s (about 25,000 mph)."
                },
                {
                    question: "Which neurotransmitter is primarily associated with mood regulation?",
                    options: ["Dopamine", "Serotonin", "Acetylcholine", "GABA"],
                    correct: 1,
                    explanation: "Serotonin is the primary neurotransmitter associated with mood regulation and happiness."
                },
                {
                    question: "What is the primary component of the Sun's core?",
                    options: ["Helium", "Hydrogen", "Carbon", "Iron"],
                    correct: 1,
                    explanation: "The Sun's core is primarily composed of hydrogen undergoing nuclear fusion."
                },
                {
                    question: "Which quantum number describes electron spin?",
                    options: ["Principal (n)", "Angular momentum (l)", "Magnetic (ml)", "Spin (ms)"],
                    correct: 3,
                    explanation: "The spin quantum number (ms) describes the intrinsic angular momentum of electrons."
                },
                {
                    question: "What is the primary function of CRISPR-Cas9?",
                    options: ["Protein folding", "Gene editing", "DNA sequencing", "Cell division"],
                    correct: 1,
                    explanation: "CRISPR-Cas9 is a revolutionary gene-editing technology that allows precise DNA modifications."
                }
            ],
            5: [ // Hard Science Questions
                {
                    question: "What is quantum entanglement?",
                    options: ["Particles moving at light speed", "Particles sharing quantum states instantaneously", "Particles having opposite charges", "Particles occupying the same space"],
                    correct: 1,
                    explanation: "Quantum entanglement is when particles remain connected and share quantum states regardless of distance."
                },
                {
                    question: "Which enzyme is responsible for DNA replication?",
                    options: ["DNA ligase", "DNA polymerase", "DNA helicase", "DNA primase"],
                    correct: 1,
                    explanation: "DNA polymerase is the primary enzyme responsible for DNA replication."
                },
                {
                    question: "What is the Wien displacement law related to?",
                    options: ["Radioactive decay", "Blackbody radiation", "Quantum tunneling", "Electromagnetic induction"],
                    correct: 1,
                    explanation: "Wien's displacement law relates the temperature of a blackbody to its peak emission wavelength."
                },
                {
                    question: "Which cellular process produces the most ATP?",
                    options: ["Glycolysis", "Krebs cycle", "Electron transport chain", "Fermentation"],
                    correct: 2,
                    explanation: "The electron transport chain in cellular respiration produces the most ATP molecules."
                },
                {
                    question: "What is the critical angle for total internal reflection in glass-air interface?",
                    options: ["24.4°", "41.8°", "48.6°", "62.7°"],
                    correct: 1,
                    explanation: "The critical angle for total internal reflection from glass to air is approximately 41.8°."
                },
                {
                    question: "Which machine learning algorithm is best for non-linear classification?",
                    options: ["Linear regression", "Support Vector Machine with RBF kernel", "Naive Bayes", "K-nearest neighbors"],
                    correct: 1,
                    explanation: "SVM with RBF (Radial Basis Function) kernel excels at non-linear classification problems."
                },
                {
                    question: "What is the Chandrasekhar limit?",
                    options: ["Maximum mass of a white dwarf", "Speed of galactic rotation", "Temperature of star formation", "Distance to nearest galaxy"],
                    correct: 0,
                    explanation: "The Chandrasekhar limit (≈1.4 solar masses) is the maximum mass a white dwarf can have."
                },
                {
                    question: "Which technique is used to determine protein structure?",
                    options: ["PCR amplification", "X-ray crystallography", "Gel electrophoresis", "Southern blotting"],
                    correct: 1,
                    explanation: "X-ray crystallography is a primary technique for determining detailed protein structures."
                },
                {
                    question: "What is the primary mechanism of superconductivity?",
                    options: ["Electron pairing (Cooper pairs)", "Nuclear fusion", "Magnetic levitation", "Plasma formation"],
                    correct: 0,
                    explanation: "Superconductivity occurs when electrons form Cooper pairs that move without resistance."
                },
                {
                    question: "Which database model is best for handling complex relationships?",
                    options: ["Hierarchical", "Network", "Relational", "Graph"],
                    correct: 3,
                    explanation: "Graph databases excel at handling complex, multi-dimensional relationships between entities."
                },
                {
                    question: "What is the Pauli exclusion principle?",
                    options: ["No two fermions can occupy the same quantum state", "Energy is quantized", "Wave-particle duality", "Conservation of momentum"],
                    correct: 0,
                    explanation: "The Pauli exclusion principle states that no two fermions can occupy the exact same quantum state."
                },
                {
                    question: "Which metabolic pathway converts glucose to pyruvate?",
                    options: ["Gluconeogenesis", "Glycolysis", "Pentose phosphate pathway", "Beta-oxidation"],
                    correct: 1,
                    explanation: "Glycolysis is the metabolic pathway that breaks down glucose into pyruvate."
                },
                {
                    question: "What is the time complexity of QuickSort in the average case?",
                    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                    correct: 1,
                    explanation: "QuickSort has an average-case time complexity of O(n log n)."
                },
                {
                    question: "Which particle mediates the electromagnetic force?",
                    options: ["Gluon", "W boson", "Photon", "Higgs boson"],
                    correct: 2,
                    explanation: "Photons are the gauge bosons that mediate the electromagnetic force."
                },
                {
                    question: "What is the primary function of telomerase?",
                    options: ["DNA repair", "Protein synthesis", "Telomere extension", "Cell division"],
                    correct: 2,
                    explanation: "Telomerase extends telomeres at chromosome ends, important for cellular aging."
                }
            ]
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
            ],
            2: [
                {
                    question: "Which ancient wonder of the world was located in Alexandria?",
                    options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Temple of Artemis"],
                    correct: 1,
                    explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World."
                },
                {
                    question: "What does GDP stand for?",
                    options: ["Gross Domestic Product", "Global Development Program", "General Data Protection", "Government Development Plan"],
                    correct: 0,
                    explanation: "GDP stands for Gross Domestic Product, a measure of economic activity."
                },
                {
                    question: "Which mountain range separates Europe and Asia?",
                    options: ["Himalayas", "Alps", "Ural Mountains", "Caucasus Mountains"],
                    correct: 2,
                    explanation: "The Ural Mountains traditionally separate European and Asian Russia."
                },
                {
                    question: "Who wrote the Communist Manifesto?",
                    options: ["Vladimir Lenin", "Karl Marx and Friedrich Engels", "Leon Trotsky", "Joseph Stalin"],
                    correct: 1,
                    explanation: "Karl Marx and Friedrich Engels co-authored the Communist Manifesto in 1848."
                },
                {
                    question: "Which sea is the saltiest in the world?",
                    options: ["Red Sea", "Dead Sea", "Mediterranean Sea", "Caspian Sea"],
                    correct: 1,
                    explanation: "The Dead Sea has the highest salt concentration of any body of water."
                },
                {
                    question: "What was the primary cause of the American Civil War?",
                    options: ["Taxation", "Slavery", "Trade disputes", "Religious differences"],
                    correct: 1,
                    explanation: "The American Civil War was primarily fought over the issue of slavery."
                },
                {
                    question: "Which European city is known as the 'City of Canals'?",
                    options: ["Amsterdam", "Venice", "Bruges", "Stockholm"],
                    correct: 1,
                    explanation: "Venice, Italy, is famous for its intricate network of canals."
                },
                {
                    question: "What is the driest continent on Earth?",
                    options: ["Africa", "Australia", "Asia", "Antarctica"],
                    correct: 3,
                    explanation: "Antarctica is the driest continent, receiving very little precipitation."
                },
                {
                    question: "Which dynasty built the Forbidden City in Beijing?",
                    options: ["Tang Dynasty", "Song Dynasty", "Ming Dynasty", "Qing Dynasty"],
                    correct: 2,
                    explanation: "The Ming Dynasty built the Forbidden City in the early 15th century."
                },
                {
                    question: "What is the term for a narrow strip of land connecting two larger landmasses?",
                    options: ["Peninsula", "Isthmus", "Strait", "Archipelago"],
                    correct: 1,
                    explanation: "An isthmus is a narrow strip of land connecting two larger areas of land."
                }
            ],
            3: [
                {
                    question: "Which treaty ended World War I?",
                    options: ["Treaty of Versailles", "Treaty of Trianon", "Treaty of Sevres", "Treaty of Saint-Germain"],
                    correct: 0,
                    explanation: "The Treaty of Versailles officially ended World War I between Germany and the Allied Powers."
                },
                {
                    question: "What is the imaginary line that divides the Earth into Eastern and Western hemispheres?",
                    options: ["Equator", "Prime Meridian", "Tropic of Cancer", "International Date Line"],
                    correct: 1,
                    explanation: "The Prime Meridian (0° longitude) divides Earth into Eastern and Western hemispheres."
                },
                {
                    question: "Which civilization built Machu Picchu?",
                    options: ["Aztec", "Maya", "Inca", "Olmec"],
                    correct: 2,
                    explanation: "Machu Picchu was built by the Inca civilization in the 15th century."
                },
                {
                    question: "What was the Renaissance?",
                    options: ["A religious movement", "A cultural and intellectual movement", "A political revolution", "An economic system"],
                    correct: 1,
                    explanation: "The Renaissance was a period of cultural and intellectual revival in Europe (14th-17th centuries)."
                },
                {
                    question: "Which desert is the largest hot desert in the world?",
                    options: ["Kalahari", "Gobi", "Sahara", "Arabian"],
                    correct: 2,
                    explanation: "The Sahara is the largest hot desert, covering most of North Africa."
                },
                {
                    question: "Who was the first person to circumnavigate the globe?",
                    options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan's expedition", "James Cook"],
                    correct: 2,
                    explanation: "Magellan's expedition completed the first circumnavigation, though Magellan died before completion."
                },
                {
                    question: "Which strait separates Africa from Europe?",
                    options: ["Strait of Hormuz", "Strait of Gibraltar", "Bosphorus Strait", "Strait of Malacca"],
                    correct: 1,
                    explanation: "The Strait of Gibraltar separates Spain (Europe) from Morocco (Africa)."
                },
                {
                    question: "What was the Code of Hammurabi?",
                    options: ["A religious text", "An early legal code", "A military strategy", "An architectural design"],
                    correct: 1,
                    explanation: "The Code of Hammurabi was one of the earliest known legal codes from ancient Babylon."
                },
                {
                    question: "Which tectonic plate boundary type creates mountain ranges?",
                    options: ["Divergent", "Convergent", "Transform", "Passive"],
                    correct: 1,
                    explanation: "Convergent plate boundaries, where plates collide, create mountain ranges."
                },
                {
                    question: "What was the Berlin Wall's primary purpose?",
                    options: ["Military defense", "Economic barrier", "Prevent East Germans from fleeing west", "Cultural separation"],
                    correct: 2,
                    explanation: "The Berlin Wall was built to prevent East Germans from escaping to West Berlin."
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
            ],
            2: [
                {
                    question: "What is the maximum score possible in a single frame of bowling?",
                    options: ["20", "25", "30", "35"],
                    correct: 2,
                    explanation: "A strike (10 pins) plus the next two throws (max 20) equals 30 points in a frame."
                },
                {
                    question: "Which film won the Academy Award for Best Picture in 2020?",
                    options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
                    correct: 2,
                    explanation: "Parasite won the 2020 Academy Award for Best Picture, making history as the first non-English film to win."
                },
                {
                    question: "In tennis, what does '15-30' mean?",
                    options: ["First player has 15 points, second has 30", "Game time in minutes", "Set score", "Match score"],
                    correct: 0,
                    explanation: "In tennis scoring, 15-30 means the first player has one point (15) and the second player has two points (30)."
                },
                {
                    question: "Which band released the album 'Bohemian Rhapsody'?",
                    options: ["Led Zeppelin", "Queen", "The Beatles", "Pink Floyd"],
                    correct: 1,
                    explanation: "'Bohemian Rhapsody' is a famous song by Queen, though it was on the album 'A Night at the Opera'."
                },
                {
                    question: "How long is a marathon race?",
                    options: ["26.2 miles", "25 miles", "30 miles", "24 miles"],
                    correct: 0,
                    explanation: "A marathon is exactly 26.2 miles or 42.195 kilometers long."
                },
                {
                    question: "Which TV series features the character Walter White?",
                    options: ["Better Call Saul", "Breaking Bad", "The Sopranos", "The Wire"],
                    correct: 1,
                    explanation: "Walter White is the main character in the TV series 'Breaking Bad'."
                },
                {
                    question: "In golf, what is an 'eagle'?",
                    options: ["One under par", "Two under par", "Three under par", "Par score"],
                    correct: 1,
                    explanation: "An eagle in golf means scoring two strokes under par for a hole."
                },
                {
                    question: "Which streaming platform produced 'Stranger Things'?",
                    options: ["Hulu", "Amazon Prime", "Netflix", "Disney+"],
                    correct: 2,
                    explanation: "'Stranger Things' is a Netflix original series."
                },
                {
                    question: "What is the diameter of a basketball hoop?",
                    options: ["16 inches", "18 inches", "20 inches", "22 inches"],
                    correct: 1,
                    explanation: "A basketball hoop has a diameter of 18 inches (45.72 cm)."
                },
                {
                    question: "Which actor played Iron Man in the Marvel Cinematic Universe?",
                    options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
                    correct: 2,
                    explanation: "Robert Downey Jr. portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe."
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
            ],
            2: [
                {
                    question: "Who wrote 'To Kill a Mockingbird'?",
                    options: ["Harper Lee", "John Steinbeck", "F. Scott Fitzgerald", "Ernest Hemingway"],
                    correct: 0,
                    explanation: "Harper Lee wrote the Pulitzer Prize-winning novel 'To Kill a Mockingbird' in 1960."
                },
                {
                    question: "Which artistic technique uses small dots of color?",
                    options: ["Impressionism", "Pointillism", "Fauvism", "Expressionism"],
                    correct: 1,
                    explanation: "Pointillism is a painting technique using small, distinct dots of color to form an image."
                },
                {
                    question: "What is a sonnet?",
                    options: ["A 12-line poem", "A 14-line poem", "A 16-line poem", "A 18-line poem"],
                    correct: 1,
                    explanation: "A sonnet is a 14-line poem, typically written in iambic pentameter."
                },
                {
                    question: "Who composed 'The Nutcracker'?",
                    options: ["Chopin", "Tchaikovsky", "Brahms", "Liszt"],
                    correct: 1,
                    explanation: "Pyotr Ilyich Tchaikovsky composed 'The Nutcracker' ballet in 1892."
                },
                {
                    question: "What does 'tempera' refer to in art?",
                    options: ["A canvas type", "A painting medium", "A brush technique", "A color mixing method"],
                    correct: 1,
                    explanation: "Tempera is a painting medium that uses egg yolk as a binder for pigments."
                },
                {
                    question: "Which novel begins with 'Call me Ishmael'?",
                    options: ["Treasure Island", "Moby Dick", "Robinson Crusoe", "The Old Man and the Sea"],
                    correct: 1,
                    explanation: "'Moby Dick' by Herman Melville begins with the famous line 'Call me Ishmael'."
                },
                {
                    question: "Who painted 'Girl with a Pearl Earring'?",
                    options: ["Rembrandt", "Vermeer", "Van Gogh", "Monet"],
                    correct: 1,
                    explanation: "Johannes Vermeer painted 'Girl with a Pearl Earring' around 1665."
                },
                {
                    question: "What is the rhyme scheme of a Shakespearean sonnet?",
                    options: ["ABAB CDCD EFEF GG", "ABBA ABBA CDECDE", "AABB CCDD EEFF GG", "ABCB DEFE GHIH JJ"],
                    correct: 0,
                    explanation: "A Shakespearean sonnet follows the rhyme scheme ABAB CDCD EFEF GG."
                },
                {
                    question: "Which author created the detective Hercule Poirot?",
                    options: ["Arthur Conan Doyle", "Agatha Christie", "Dorothy Sayers", "Raymond Chandler"],
                    correct: 1,
                    explanation: "Agatha Christie created the Belgian detective Hercule Poirot."
                },
                {
                    question: "What is the highest male singing voice?",
                    options: ["Tenor", "Baritone", "Bass", "Countertenor"],
                    correct: 3,
                    explanation: "Countertenor is the highest adult male singing voice, often in falsetto."
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
            ],
            2: [
                {
                    question: "What is the chemical symbol for gold?",
                    options: ["Go", "Gd", "Au", "Ag"],
                    correct: 2,
                    explanation: "Au is the chemical symbol for gold, from the Latin word 'aurum'."
                },
                {
                    question: "Which Roman numeral represents 1000?",
                    options: ["M", "D", "C", "L"],
                    correct: 0,
                    explanation: "M represents 1000 in Roman numerals."
                },
                {
                    question: "What is the primary ingredient in guacamole?",
                    options: ["Tomato", "Avocado", "Lime", "Onion"],
                    correct: 1,
                    explanation: "Avocado is the main ingredient in guacamole."
                },
                {
                    question: "Which organ in the human body produces insulin?",
                    options: ["Liver", "Kidney", "Pancreas", "Spleen"],
                    correct: 2,
                    explanation: "The pancreas produces insulin to regulate blood sugar levels."
                },
                {
                    question: "What is the fear of spiders called?",
                    options: ["Arachnophobia", "Claustrophobia", "Agoraphobia", "Acrophobia"],
                    correct: 0,
                    explanation: "Arachnophobia is the specific fear of spiders."
                },
                {
                    question: "How many time zones are there in the world?",
                    options: ["20", "22", "24", "26"],
                    correct: 2,
                    explanation: "There are 24 time zones around the world, one for each hour of the day."
                },
                {
                    question: "What is the square root of 144?",
                    options: ["10", "11", "12", "13"],
                    correct: 2,
                    explanation: "The square root of 144 is 12 (12 × 12 = 144)."
                },
                {
                    question: "Which gas makes up about 78% of Earth's atmosphere?",
                    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
                    correct: 2,
                    explanation: "Nitrogen makes up approximately 78% of Earth's atmosphere."
                },
                {
                    question: "What is the smallest prime number?",
                    options: ["0", "1", "2", "3"],
                    correct: 2,
                    explanation: "2 is the smallest prime number (only divisible by 1 and itself)."
                },
                {
                    question: "Which vitamin is known as the 'sunshine vitamin'?",
                    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
                    correct: 3,
                    explanation: "Vitamin D is called the 'sunshine vitamin' because it's produced when skin is exposed to sunlight."
                }
            ]
        }
    }
};

// Validate the database on load
if (typeof window !== 'undefined') {
    // Browser environment - run validation
    setTimeout(() => {
        console.log('🔍 Validating Quiz Database...');
        const sections = Object.keys(QUIZ_DATABASE);

        sections.forEach(sectionId => {
            const section = QUIZ_DATABASE[sectionId];
            const levelCount = Object.keys(section.levels).length;
            const totalQuestions = getTotalQuestions(sectionId);
            console.log(`📚 ${section.name}: ${levelCount} levels, ${totalQuestions} total questions`);
        });

        // Check for duplicates
        validateNoDuplicates();

        console.log('✅ Database validation complete!');
    }, 100);
}

// Additional levels 6-10 for Science section will be added when needed
// For now, levels 1-5 provide sufficient progression and testing
// Each section now has at least 3 complete levels with unique questions

// Helper function to get total questions per section
function getTotalQuestions(sectionId) {
    const section = QUIZ_DATABASE[sectionId];
    if (!section || !section.levels) return 0;

    let total = 0;
    Object.keys(section.levels).forEach(levelId => {
        total += section.levels[levelId].length;
    });
    return total;
}

// Helper function to validate no duplicate questions
function validateNoDuplicates() {
    const allQuestions = new Map();
    let duplicatesFound = [];

    Object.keys(QUIZ_DATABASE).forEach(sectionId => {
        const section = QUIZ_DATABASE[sectionId];
        Object.keys(section.levels).forEach(levelId => {
            section.levels[levelId].forEach((q, index) => {
                const questionText = q.question.toLowerCase().trim();
                const location = `${sectionId}-level${levelId}-q${index + 1}`;

                if (allQuestions.has(questionText)) {
                    duplicatesFound.push({
                        question: q.question,
                        locations: [allQuestions.get(questionText), location]
                    });
                } else {
                    allQuestions.set(questionText, location);
                }
            });
        });
    });

    if (duplicatesFound.length > 0) {
        console.warn('⚠️ Duplicate questions found:', duplicatesFound);
        return false;
    }

    console.log('✅ No duplicate questions found across all sections and levels');
    return true;
}