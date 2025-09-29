# 🎯 Quiz Master - Ultimate Knowledge Challenge

A comprehensive cross-platform quiz game with 5000+ questions across multiple categories and progressive difficulty levels.

## ✨ Features

- **5 Knowledge Categories**: Science & Technology, History & Geography, Sports & Entertainment, Literature & Arts, General Knowledge
- **Progressive Difficulty**: 10 levels per category (Easy to Expert)
- **1000+ Questions** per category (5000+ total)
- **Cross-Platform**: Works on desktop, mobile, and tablets
- **Progressive Web App (PWA)**: Can be installed on mobile devices
- **Achievement System**: Unlock achievements as you progress
- **User Progress Tracking**: Save progress locally
- **Sound Effects**: Optional audio feedback
- **Responsive Design**: Beautiful UI that adapts to any screen size
- **Keyboard Navigation**: Full keyboard support for accessibility

## 🚀 Quick Start

### Option 1: Local Development
```bash
# Clone the repository
git clone [your-repo-url]
cd quiz-master-app

# Start local server (Python 3)
python3 -m http.server 8000

# Or with Python 2
python -m SimpleHTTPServer 8000

# Open in browser
http://localhost:8000
```

### Option 2: Live Demo
Visit the live demo at: [Your GitHub Pages URL]

## 🎮 How to Play

1. **Choose a Category**: Select from 5 different knowledge areas
2. **Start with Level 1**: Each category has 10 progressive difficulty levels
3. **Answer Questions**: You have 15-45 seconds per question (varies by level)
4. **Score Points**: Earn points based on accuracy and speed
5. **Unlock Levels**: Get 60% accuracy to unlock the next level
6. **Earn Achievements**: Complete challenges to unlock special achievements

## 📱 Installation as PWA

On mobile devices, you can install Quiz Master as a native app:

1. Open the app in your browser
2. Tap the "Add to Home Screen" option
3. Enjoy the native app experience!

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Storage**: localStorage for user progress
- **PWA**: Service Worker ready
- **Cross-Platform**: Web-based (works everywhere)

## 📁 Project Structure

```
quiz-master-app/
├── index.html          # Main application entry point
├── test.html           # Testing and debugging page
├── manifest.json       # PWA manifest
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   ├── app.js          # Main application logic
│   ├── data-manager.js # Data management and user progress
│   ├── game-logic.js   # Quiz game mechanics
│   └── ui-manager.js   # User interface management
├── data/
│   └── questions.js    # Questions database
└── assets/
    ├── images/         # App icons and images
    └── sounds/         # Sound effects (optional)
```

## 🔧 Development

### Adding New Questions

Edit `data/questions.js` to add more questions to any category:

```javascript
// Add to existing level
QUIZ_DATABASE.science.levels[1].push({
    question: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: 1, // Index of correct answer (0-3)
    explanation: "Explanation of the correct answer"
});
```

### Customizing Themes

Modify CSS custom properties in `css/style.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #your-color1, #your-color2);
    --secondary-gradient: linear-gradient(135deg, #your-color3, #your-color4);
    /* ... other variables */
}
```

### Testing

Open `test.html` to run diagnostic tests and verify all components are working correctly.

## 🏆 Achievements

- **Getting Started**: Complete your first level
- **Perfect!**: Get 100% accuracy on a level
- **Warming Up**: Complete 5 levels
- **Getting Serious**: Complete 10 levels
- **High Scorer**: Reach 1000 total points
- **Section Master**: Complete all levels in a section

## 📊 Progress Tracking

Your progress is automatically saved in your browser's local storage, including:
- Total score across all categories
- Levels completed in each category
- Unlocked achievements
- Individual question performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Add your changes
4. Commit: `git commit -am 'Add new feature'`
5. Push: `git push origin new-feature`
6. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Questions sourced from various educational materials
- Icons and emojis for enhanced user experience
- Modern web technologies for cross-platform compatibility

---

**Enjoy testing your knowledge with Quiz Master!** 🧠✨