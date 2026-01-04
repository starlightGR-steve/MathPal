# MathPal - Math Flashcard Learning App

A React-based interactive math flashcard application designed for elementary students learning basic arithmetic. Features visual learning aids, text-to-speech support, and engaging animations.

## Features

### Four Math Modes
- **Addition Only**: Practice addition facts (1-10 range)
- **Addition + Subtraction Mix**: Combined addition and subtraction practice
- **Multiplication Only**: Times tables practice (1-10)
- **Multiplication + Division Mix**: Combined multiplication and division facts

### Two View Modes
- **Flashcard Mode**: Focus on one card at a time with tap-to-reveal functionality
- **Grid View**: Overview of all facts in the current deck for quick selection

### Visual Learning
- Interactive pictorial representations using apples and baskets
- Toggle between number mode and picture mode
- Responsive scaling that adapts to different quantities
- Visual representations for all operations:
  - **Addition**: Groups of apples combining into larger groups
  - **Subtraction**: Apples being crossed out/removed
  - **Multiplication**: Equal groups showing repeated addition
  - **Division**: Total items divided into equal groups

### Audio Features
- Text-to-speech for questions and answers
- Audio toggle control
- Auto-play on card navigation
- Visual descriptions narrated in picture mode

### UI/UX Highlights
- Clean, modern design with Tailwind CSS
- Mobile-responsive (works on phones, tablets, desktops)
- Persistent navigation bar with mode selection
- Progress bar showing position in deck
- Smooth animations and transitions
- Large, child-friendly fonts and touch targets
- Color-coded modes for easy identification

## Tech Stack

- **React 18** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Web Speech API** for text-to-speech

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Navigation
- **Top Navigation Bar**: Select between the four math modes
- **View Toggle**: Switch between card and grid views
- **Audio Toggle**: Enable/disable text-to-speech
- **Progress Bar**: Track your position in the current deck

### Flashcard Mode
1. **View Question**: The question is displayed in large, easy-to-read text
2. **Reveal Answer**: Tap the card to flip and see the answer
3. **Show Pictures**: Click the "Show Pictures" button to see visual representation
4. **Navigate**: Use "Next" to move forward or "Restart" to go back to the beginning

### Grid View
- See all facts in the current mode at once
- Click any fact to jump directly to it
- Current card is highlighted
- Quick way to select specific problems to practice

### Visual Mode
- Apples represent individual units
- Baskets group the apples
- For subtraction: crossed-out apples show what's being removed
- For multiplication: multiple baskets show equal groups
- For division: apples distributed into equal groups

## Project Structure

```
MathPal/
├── src/
│   ├── FlashcardApp.jsx    # Main component with all functionality
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind imports and global styles
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Key Components

### `FlashcardApp`
The main component that manages:
- Mode selection (addition, add/sub, multiplication, mult/div)
- View mode (card vs grid)
- State management for current card, flipped state, visual mode
- Audio controls

### `useSpeech` Hook
Custom hook for text-to-speech functionality:
- Speaks questions and answers
- Narrates visual representations
- Manages speech synthesis state

### `generateDeck` Function
Generates complete fact families for each mode:
- Addition: 100 facts (1-10 × 1-10)
- Add/Sub Mix: 200 facts (addition + related subtraction)
- Multiplication: 100 facts (1-10 × 1-10)
- Mult/Div Mix: 200 facts (multiplication + related division)

### `VisualRepresentation` Component
Renders visual aids:
- Responsive apple sizing based on quantity
- Basket grouping for organization
- Operation-specific visualizations
- Smooth animations and transitions

## Customization

### Changing Number Ranges
Edit the loops in the `generateDeck` function in [FlashcardApp.jsx](src/FlashcardApp.jsx):

```javascript
// Example: Change to 1-12 range
for (let a = 1; a <= 12; a++) {
  for (let b = 1; b <= 12; b++) {
    // ... fact generation
  }
}
```

### Modifying Colors
Color schemes are defined in Tailwind classes. Update the mode configurations:

```javascript
const modes = [
  { id: 'addition', name: 'Addition', icon: Plus, color: 'blue' },
  // ... change 'blue' to any Tailwind color
];
```

### Adjusting Speech Rate
Modify the speech settings in the `useSpeech` hook:

```javascript
utterance.rate = 0.9;  // 0.1 to 2.0
utterance.pitch = 1.1; // 0 to 2
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Safari**: Full support
- **Firefox**: Full support
- **Mobile browsers**: Full support (iOS Safari, Chrome Mobile)

Note: Text-to-speech availability depends on browser support for the Web Speech API.

## Accessibility Features

- Large touch targets (minimum 44px)
- High contrast text
- Audio support for visual learners
- Keyboard navigation support
- Responsive design for all screen sizes
- Clear visual feedback for interactions

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

For questions or issues, please create an issue in the project repository.
