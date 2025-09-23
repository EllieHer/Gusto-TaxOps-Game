# 📋 Gusto Tax Pro Training - Professional Tax Form Mastery

A realistic and educational tax training game featuring authentic IRS Form 941 and state tax forms. Master professional tax preparation with real-world accuracy requirements under time pressure!

## 🎮 How to Play

### Game Objective
Train as a professional tax preparer by accurately completing authentic IRS and state tax forms. Progress through different jurisdictions and form types while maintaining accuracy under time pressure. Perfect for tax professionals, students, and anyone learning tax compliance!

### Game Controls
1. **Fill Form** - Click to start filling out the tax form
2. **Review Form** - Check your work before submitting
3. **Send to Mailbox** - Submit the completed form
4. **Keyboard Shortcuts**:
   - `1` - Fill Form
   - `2` - Review Form  
   - `3` or `Enter` - Submit Form
   - `Esc` - Return to Main Menu

### Gameplay Flow
1. **Start the Game** - Click "Start Game" on the main screen
2. **Read Requirements** - Check the required fields panel on the left
3. **Fill Form** - Click "Fill Form" and complete all required fields (marked with *)
4. **Review** - Click "Review Form" to validate your entries
5. **Submit** - Click "Send to Mailbox" or click the mailbox to submit
6. **Progress** - Complete forms to advance levels and earn points

### Scoring System
- **Base Score**: 100 points per form
- **Accuracy Bonus**: Up to 50 points based on correct answers
- **Speed Bonus**: Up to 2 points per second remaining
- **Level Progression**: Complete 2×level number of forms to advance

### Tax Forms by Level
| Level | Form | Jurisdiction | Description |
|-------|------|--------------|-------------|
| 1     | IRS 941 | Federal | Employer's Quarterly Federal Tax Return |
| 2     | CA DE 9 | California | Quarterly Contribution Return and Report |
| 3     | NYS-45 | New York | Quarterly Combined Withholding Return |
| 4     | C-3 | Texas | Employer's Quarterly Tax Report |
| 5     | UI-3/40 | Illinois | Quarterly Tax and Wage Report |
| 6     | RT-6 | Florida | Employer's Quarterly Report |
| 7+    | (Cycles) | Various | Returns to Form 941, then cycles through states |

### Professional Tax Field Types
- **EIN/ID Numbers**: Employer identification numbers with proper formatting
- **Wage Calculations**: Taxable wages, withholdings, and tax computations  
- **Tax Rates**: State-specific unemployment and disability rates
- **Compliance Data**: Employee counts, quarters, and filing periods
- **Multi-State Requirements**: Different validation rules per jurisdiction

### Tips for Success
- 🎯 **Accuracy First** - Correct forms give better scores than fast mistakes
- ⏰ **Watch the Timer** - It turns red when you have 10 seconds left
- 📋 **Check Requirements** - Required fields are marked with * 
- 🔍 **Use Review** - Always review before submitting to catch errors
- 📈 **Level Strategy** - Each level requires more forms but gives bonus time

### Character Messages
Ms. Anderson provides helpful guidance throughout the game:
- Encouragement when you're doing well
- Warnings when time is running out
- Tips on what to focus on next

## 🚀 Running the Game

### Option 1: Local Web Server
```bash
cd /path/to/game/directory
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Option 2: Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Direct File
Simply double-click `index.html` to open in your default browser.

## 🎯 Game Features

### Visual Design
- **Animated Character** - Ms. Anderson with blinking eyes and moving arms
- **Tax Office Environment** - Complete with desk, filing cabinets, certificates
- **Interactive Mailbox** - Animated flag and hover effects
- **Form Validation** - Real-time field validation with visual feedback
- **Responsive Design** - Works on desktop and mobile devices

### Progressive Difficulty
- **Dynamic Form Generation** - Each level has unique field combinations
- **Time Pressure** - Decreasing time limits as you progress
- **Complexity Scaling** - More fields and complex calculations at higher levels
- **Smart Validation** - Context-aware field validation (SSN, phone, email formats)

### User Experience
- **Smooth Animations** - Form transitions and character reactions
- **Audio-Visual Feedback** - Success/error animations and messages
- **Keyboard Support** - Full game playable with keyboard shortcuts
- **Progress Tracking** - Score, accuracy, and completion statistics

## 🏆 Ratings System

Final performance is rated based on score and accuracy:

- **⭐⭐⭐ TAX EXPERT!** - 90%+ accuracy, 1000+ points
- **⭐⭐ TAX PROFESSIONAL** - 70%+ accuracy, 500+ points  
- **⭐ TAX APPRENTICE** - 50%+ accuracy, 200+ points
- **📚 NEEDS PRACTICE** - Below thresholds

## 🔧 Technical Details

### Built With
- **HTML5** - Semantic structure and form elements
- **CSS3** - Modern styling with animations and transitions
- **Vanilla JavaScript** - No external dependencies
- **Responsive Design** - CSS Grid and Flexbox

### File Structure
```
├── index.html          # Main game interface
├── style.css           # All styling and animations  
├── script.js          # Game logic and mechanics
└── README.md          # This documentation
```

### Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🎈 Fun Facts

- The game includes 19 different field types with realistic tax form elements
- Form validation includes proper formats for SSN, phone numbers, and currency
- The character animation includes natural blinking every 3 seconds
- Each level can generate thousands of unique form combinations
- The difficulty curve is carefully balanced for 15-20 minutes of gameplay

---

**Have fun filing taxes!** 📊💼✨

*Created with ❤️ for tax preparation enthusiasts and game lovers alike.*
