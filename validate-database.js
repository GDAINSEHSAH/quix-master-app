#!/usr/bin/env node

// Node.js script to validate the question database
const fs = require('fs');
const path = require('path');

// Read and evaluate the questions.js file
const questionsPath = path.join(__dirname, 'data', 'questions.js');
const questionsContent = fs.readFileSync(questionsPath, 'utf8');

// Extract QUIZ_DATABASE from the file content
const match = questionsContent.match(/const QUIZ_DATABASE = ({[\s\S]*?});/);
if (!match) {
    console.error('❌ Could not find QUIZ_DATABASE in questions.js');
    process.exit(1);
}

// Safely evaluate just the database object
const QUIZ_DATABASE = eval(`(${match[1]})`);

console.log('🔍 Validating Quiz Database for Duplicates...');
console.log('================================================');

const allQuestions = new Map(); // question text -> array of locations
const sections = Object.keys(QUIZ_DATABASE);
let totalQuestions = 0;
let duplicatesFound = [];

console.log(`📖 Found ${sections.length} sections: ${sections.join(', ')}`);

// Collect all questions and their locations
for (const sectionId of sections) {
    const section = QUIZ_DATABASE[sectionId];
    console.log(`\n📚 Analyzing section: ${section.name || sectionId}`);

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
for (const [questionText, locations] of allQuestions) {
    if (locations.length > 1) {
        duplicatesFound.push({
            question: locations[0].originalText,
            count: locations.length,
            locations: locations
        });
    }
}

console.log('\n🎯 VALIDATION RESULTS:');
console.log('======================');
console.log(`📊 Total questions analyzed: ${totalQuestions}`);
console.log(`🔍 Unique question texts: ${allQuestions.size}`);
console.log(`⚠️ Duplicate questions found: ${duplicatesFound.length}`);

if (duplicatesFound.length === 0) {
    console.log('\n✅ SUCCESS: No duplicate questions found!');
    console.log('🎉 The database is ready for deployment!');

    // Show database statistics
    console.log('\n📈 DATABASE STATISTICS:');
    console.log('=======================');

    sections.forEach(sectionId => {
        const section = QUIZ_DATABASE[sectionId];
        const levels = Object.keys(section.levels);
        let sectionTotal = 0;

        levels.forEach(levelId => {
            sectionTotal += section.levels[levelId].length;
        });

        console.log(`${section.name}: ${levels.length} levels, ${sectionTotal} questions`);
    });

    process.exit(0);
} else {
    console.log('\n❌ DUPLICATE QUESTIONS FOUND:');
    console.log('==============================');

    duplicatesFound.forEach((duplicate, index) => {
        console.log(`\n${index + 1}. "${duplicate.question}"`);
        console.log(`   Found in ${duplicate.count} locations:`);

        duplicate.locations.forEach(location => {
            console.log(`   - ${location.sectionName} → Level ${location.level} → Question #${location.index + 1}`);
        });
    });

    console.log('\n🚨 CRITICAL: Duplicates must be fixed before deployment!');
    process.exit(1);
}