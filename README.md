# Portfolio Website

A modern, responsive portfolio website showcasing skills, projects, and experience. Built with HTML, CSS, JavaScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-first approach
- 🚀 Fast loading and optimized performance
- 📊 GitHub integration to showcase repositories
- 💼 Professional layout for recruiters
- 🎯 SEO optimized
- 📧 Contact form
- ✨ Smooth animations and transitions

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript
- Font Awesome icons
- Google Fonts
- GitHub API integration

## Getting Started

### Prerequisites

- A modern web browser
- Git (for cloning the repository)
- A text editor (VS Code recommended)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have live-server installed)
npx live-server
```

3. Navigate to `http://localhost:8000` in your browser.

## Customization

### Personal Information

1. **Update the hero section** in `index.html`:
   - Change the name, title, and description
   - Update the profile image URL
   - Modify social media links

2. **Update the About section**:
   - Replace the description with your own
   - Update statistics (projects completed, years of experience)
   - Modify the "What I Do" section

3. **Skills section**:
   - Update skill categories and percentages
   - Add or remove technologies based on your expertise

4. **Contact information**:
   - Update email, phone, and location
   - Modify social media links

### GitHub Integration

1. In `script.js`, update the GitHub username:
```javascript
const username = 'yourusername'; // Replace with your GitHub username
```

2. The website will automatically fetch and display your repositories.

### Styling

- Colors and themes can be modified in the Tailwind config in `index.html`
- Additional custom styles are in `styles.css`
- Animations and interactions are in `script.js`

## Deployment

### Render (Recommended - Free)

1. Push your code to a GitHub repository
2. Connect your GitHub account to Render
3. Create a new static site
4. Select your repository
5. Set the build command (if needed): `npm run build`
6. Set the publish directory: `./` or leave empty
7. Deploy!

### Other Deployment Options

- **Netlify**: Drag and drop the files or connect via Git
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable GitHub Pages in repository settings
- **Firebase Hosting**: Use Firebase CLI to deploy

## File Structure

```
portfolio/
│
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
├── package.json        # Dependencies (Tailwind CSS)
├── README.md           # This file
└── .gitignore         # Git ignore file
```

## Performance Optimizations

- Lazy loading for images
- Minified CSS and JavaScript
- Optimized images
- Efficient GitHub API calls
- Smooth scrolling and animations

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- GitHub: [Your GitHub](https://github.com/yourusername)

## Acknowledgments

- Tailwind CSS for the utility-first CSS framework
- Font Awesome for the icons
- GitHub API for repository integration
- Render for free hosting

---

⭐ Don't forget to star this repository if you found it helpful!
