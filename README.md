# AI Gesture Controller

An optimized, real-time gesture control system that allows users to control their mouse and interact with their computer using hand gestures via a webcam. 

##  The Three Core Modes
The system intelligently switches between three operational states based on hand gestures:

### 1. Mouse Mode (Pro Engine)
* **Function:** Replaces the physical mouse with seamless "air gestures."
* **Tech Highlight:** Implements a specialized **Median Filter** and **Adaptive Low-Pass Smoothing** to eliminate the "jitter" common in basic Computer Vision projects. It also includes **Edge Boosting** logic, making it effortless to reach the far corners of the screen with minimal hand movement.

### 2. Annotation (Writing) Mode
* **Function:** Transforms the entire screen into a high-performance virtual whiteboard.
* **Interaction:** Use your **Index Finger** to draw or write in real-time. This mode features a specialized **Double-Pinch Eraser** gesture, allowing for natural and intuitive corrections without needing to click a button.

### 3. Presentation Mode
* **Function:** Optimized specifically for navigating PowerPoint, Keynote, or PDF slide decks.
* **Interaction:** Uses simple **flick/fist gestures** to trigger "Next Slide" or "Previous Slide." This allows speakers to control their presentation from a distance without ever touching the keyboard or a clicker.

## Prerequisites
- Python 3.8+
- Webcam

## Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
