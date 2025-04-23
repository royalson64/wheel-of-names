# Wheel of Names

A modern, interactive web application for randomly selecting names from a list, featuring a visually appealing spinning wheel animation. Available as a Progressive Web App for desktop installation.

## Features

- **Dynamic Name Input**
  - Two-column layout for efficient name entry
  - Support for up to 30 name entries
  - Count multiplier (1-10) for each name to adjust probability
  - Real-time input validation and state management

- **Flexible Layout**
  - Toggle between portrait and landscape modes
  - Portrait: Traditional vertical layout
  - Landscape: Two-column view with names on left, wheel on right
  - Sticky wheel position in landscape mode
  - Responsive design for all screen sizes

- **Interactive Wheel**
  - Smooth spinning animation with natural deceleration
  - Visual feedback during spin and selection
  - Consistent 5-7 full rotations before landing
  - Precise pointer alignment with selected section

- **Winner Display**
  - Prominent winner announcement with animation
  - History tracking of previous winners
  - Gradient-styled history cards showing last 2 winners

- **Progressive Web App**
  - Install as a desktop application
  - Offline functionality
  - Fast loading and smooth performance
  - Automatic updates

## Technical Implementation

### Core Components

1. **App.tsx**
   - Main application container
   - State management for names, winners, and spinning status
   - Layout toggle and responsive design
   - Input handling and validation
   - Layout and styling using Emotion (CSS-in-JS)

2. **Wheel Component**
   - Custom wheel rendering and animation
   - Canvas-based drawing for smooth rotation
   - Physics-based spinning mechanics

### Layout Modes

1. **Portrait Mode**
   - Traditional vertical layout
   - Names input at the top
   - Wheel in the center
   - Winner display and history below

2. **Landscape Mode**
   - Two-column layout for efficient space usage
   - Names input section on the left
   - Wheel and results on the right
   - Sticky wheel position while scrolling
   - Optimized for widescreen displays

### Random Selection Process

The random selection process is implemented with multiple layers to ensure fairness and proper visual feedback:

1. **Name Pool Generation**
   ```typescript
   const getValidNames = () => {
     return entries
       .filter(entry => entry.name.trim() !== '')
       .flatMap(entry => Array(entry.count).fill(entry.name));
   };
   ```
   - Filters out empty entries
   - Expands entries based on their count (1-10)
   - Creates a flat array where names appear multiple times based on their count

2. **Random Selection**
   - Uses JavaScript's built-in Math.random() for initial randomization
   - The wheel spins for 5-7 complete rotations (randomized)
   - Final position is calculated using:
     ```javascript
     const finalAngle = (
       360 * completeRotations + 
       (selectedIndex * (360 / totalNames))
     );
     ```

3. **Probability Distribution**
   - Each name's probability is proportional to its count
   - Example: If "Alice" has count=3 and "Bob" has count=1
     - Alice appears 3 times in the pool
     - Bob appears 1 time in the pool
     - P(Alice) = 3/4, P(Bob) = 1/4

### Styling and UX

1. **Modern UI Elements**
   - Gradient backgrounds for visual depth
   - Smooth transitions and hover effects
   - Responsive layout with mobile optimization
   - Subtle shadows and rounded corners
   - Layout toggle with intuitive icons

2. **Interactive Elements**
   - Input fields with focus states
   - Disabled states during spinning
   - Hover animations on cards and buttons
   - Visual separator between input columns
   - Smooth layout transitions

3. **Winner Display**
   - Fade-in animation for winner announcement
   - Color-coded history cards
   - Gradient backgrounds for visual hierarchy
   - Optimized positioning in both layouts

## Installation

### As a Web App
1. Visit the application URL in Chrome or Edge
2. Click the install icon in the address bar
3. Follow the installation prompts
4. Launch from your Applications folder or dock

### For Development
1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Choose your preferred layout (portrait/landscape)
2. Enter names in the input fields
3. Optionally adjust the count (1-10) for each name
4. Click "Spin the Wheel!" to start
5. Watch the wheel spin and gradually slow down
6. The winner is displayed with a celebration animation
7. Previous winners are shown in the history section

## Technical Requirements

- React 18+
- Emotion for styled components
- Modern browser with CSS Grid support
- JavaScript enabled
- Service Workers for PWA functionality

## Implementation Notes

- The wheel's spinning animation uses requestAnimationFrame for smooth performance
- State updates are batched for efficiency
- The UI is fully responsive and works on both desktop and mobile devices
- Input validation prevents empty names and ensures count stays within 1-10
- The history feature maintains the last 3 winners (current + 2 previous)
- PWA implementation with service worker for offline capability
- Smooth layout transitions using CSS Grid and Flexbox

## Future Enhancements

- Export/import name lists
- Custom wheel colors and themes
- Sound effects and additional animations
- Statistics tracking for winners
- Multiple wheel configurations
- Additional layout options
- Touch gesture support for mobile
- Cloud sync for name lists
