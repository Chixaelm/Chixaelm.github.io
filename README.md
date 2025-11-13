# Teacher Helper

A collection of educational tools for teachers, hosted on GitHub Pages.

## Features

- **Equation Builder**: Visualize simple addition and subtraction equations using isometric cube stacks
  - Yellow cubes represent tens (stacks of 10)
  - Red cubes represent ones
  - Interactive number inputs with real-time visualization
  - Checkboxes to show/hide numbers and cube stacks
  - White text by default with option to reveal

## Setup for GitHub Pages

1. Push this repository to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select the branch you want to deploy (usually `main` or `master`)
5. Click "Save"
6. Your site will be available at `https://[your-username].github.io/TeacherHelper/`

## Local Development

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Pages

- **Home** (`index.html`): Landing page with navigation
- **Equation Builder** (`equation-builder.html`): Interactive equation builder with visual cube representations

## Technologies

- HTML5
- CSS3 (with CSS Variables and Flexbox)
- Vanilla JavaScript

