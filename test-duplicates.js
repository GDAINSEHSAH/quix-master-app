// Test script to check for duplicate questions
// Run this in browser console or node.js

console.log('🔍 Testing Quiz Database for Duplicates...');

// Check if we're in browser with QUIZ_DATABASE
if (typeof QUIZ_DATABASE === 'undefined') {
    console.log('❌ QUIZ_DATABASE not found. Please run this in browser with questions.js loaded.');
    // For testing, we'll define a minimal version
    var QUIZ_DATABASE = {
        science: {
            name: "Science & Technology",
            levels: {
                1: [
                    { question: "What is DNA?", options: ["A", "B", "C", "D"], correct: 0 },
                    { question: "Which scientist developed the theory of evolution?", options: ["A", "B", "C", "D"], correct: 1 }
                ],
                2: [
                    { question: "What is DNA?", options: ["A", "B", "C", "D"], correct: 0 }, // DUPLICATE!
                    { question: "Who developed the theory of relativity?", options: ["A", "B", "C", "D"], correct: 2 }
                ]
            }
        }
    };
}

function testForDuplicates() {
    console.log('\n📊 Starting Duplicate Analysis...');

    const allQuestions = new Map(); // question text -> array of locations
    const sections = Object.keys(QUIZ_DATABASE);
    let totalQuestions = 0;

    console.log(`🔍 Found ${sections.length} sections: ${sections.join(', ')}`);

    // Collect all questions
    for (const sectionId of sections) {
        const section = QUIZ_DATABASE[sectionId];
        console.log(`\n📖 Analyzing section: ${section.name || sectionId}`);

        if (!section.levels) {
            console.log(`⚠️ No levels found in ${sectionId}`);
            continue;
        }

        const levels = Object.keys(section.levels);
        console.log(`📊 Found ${levels.length} levels: ${levels.join(', ')}`);

        for (const levelId of levels) {
            const questions = section.levels[levelId];

            if (!Array.isArray(questions)) {
                console.log(`❌ Level ${levelId} is not an array`);
                continue;
            }

            console.log(`  Level ${levelId}: ${questions.length} questions`);

            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                const questionText = question.question.toLowerCase().trim();

                if (!allQuestions.has(questionText)) {
                    allQuestions.set(questionText, []);
                }

                allQuestions.get(questionText).push({
                    section: sectionId,
                    sectionName: section.name || sectionId,
                    level: levelId,
                    index: i,
                    originalText: question.question
                });

                totalQuestions++;
            }
        }
    }

    // Find duplicates
    const duplicates = [];
    for (const [questionText, locations] of allQuestions) {
        if (locations.length > 1) {
            duplicates.push({
                question: locations[0].originalText,
                count: locations.length,
                locations: locations
            });
        }
    }

    console.log('\n🎯 RESULTS:');
    console.log(`📊 Total questions analyzed: ${totalQuestions}`);
    console.log(`🔍 Unique question texts: ${allQuestions.size}`);
    console.log(`⚠️ Duplicate questions found: ${duplicates.length}`);

    if (duplicates.length === 0) {
        console.log('✅ SUCCESS: No duplicate questions found!');
        return { success: true, duplicates: [] };
    } else {
        console.log('\n❌ DUPLICATE QUESTIONS FOUND:');
        console.log('================================');

        duplicates.forEach((duplicate, index) => {
            console.log(`\n${index + 1}. "${duplicate.question}"`);
            console.log(`   Found in ${duplicate.count} locations:`);

            duplicate.locations.forEach(location => {
                console.log(`   - ${location.sectionName} → Level ${location.level} → Question #${location.index + 1}`);
            });
        });

        // Analyze patterns
        console.log('\n📈 DUPLICATE PATTERNS:');
        let sameSectionDupes = 0;
        let crossSectionDupes = 0;

        duplicates.forEach(duplicate => {
            const sections = [...new Set(duplicate.locations.map(loc => loc.section))];
            if (sections.length === 1) {
                sameSectionDupes++;
                console.log(`🔄 Same section duplicate: "${duplicate.question}" in ${duplicate.locations[0].sectionName}`);
            } else {
                crossSectionDupes++;
                console.log(`↔️ Cross-section duplicate: "${duplicate.question}"`);
            }
        });

        console.log(`\n📊 Pattern Summary:`);
        console.log(`   Same section duplicates: ${sameSectionDupes}`);
        console.log(`   Cross-section duplicates: ${crossSectionDupes}`);

        return {
            success: false,
            duplicates: duplicates,
            sameSectionDupes: sameSectionDupes,
            crossSectionDupes: crossSectionDupes
        };
    }
}

// Run the test
const result = testForDuplicates();

if (typeof window !== 'undefined') {
    // Browser environment
    window.testResult = result;
    console.log('\n💡 Test result saved to window.testResult');
} else {
    // Node.js environment
    module.exports = { testForDuplicates, result };
}