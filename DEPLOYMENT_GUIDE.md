# Portfolio Website Deployment Guide

## 🚀 Quick Deploy to Render (Free)

### Step 1: Prepare Your Repository

1. **Create a GitHub Repository**:
   - Go to GitHub and create a new repository named `portfolio`
   - Make it public (required for free Render deployment)

2. **Push Your Code**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio website"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/portfolio.git
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. **Sign up for Render**:
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account (free)

2. **Create a New Static Site**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select your portfolio repository

3. **Configure Deployment Settings**:
   - **Name**: `your-name-portfolio`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: Leave empty (or `echo "Static site"`)
   - **Publish Directory**: Leave empty (or `./`)

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for deployment (usually 2-3 minutes)
   - Your site will be live at `https://your-name-portfolio.onrender.com`

## 🎨 Customization Checklist

### Before Deployment, Update These:

#### 1. Personal Information (index.html)

- [ ] **Line 23**: Change `<title>Trijeet Bhandula - Full Stack Developer</title>`
- [ ] **Line 62**: Update profile image URL: `https://github.com/YOURUSERNAME.png`
- [ ] **Lines 64-66**: Change your name and title
- [ ] **Lines 67-71**: Update your description
- [ ] **Lines 79-87**: Update social media links
- [ ] **Lines 118-130**: Update the "About Me" section
- [ ] **Lines 375-385**: Update contact information
- [ ] **Line 409**: Update footer text

#### 2. GitHub Integration (script.js)

- [ ] **Line 91**: Change `const username = 'trijeetbhandula';` to your GitHub username

#### 3. Skills Section (index.html)

Update the skills and percentages in lines 205-320:
- [ ] Update frontend skills and percentages
- [ ] Update backend skills and percentages  
- [ ] Update tools and database skills
- [ ] Add or remove skill categories as needed

#### 4. Social Media Links

Update all social media links throughout the file:
- [ ] GitHub: `https://github.com/YOURUSERNAME`
- [ ] LinkedIn: `https://linkedin.com/in/YOURPROFILE`
- [ ] Twitter: `https://twitter.com/YOURHANDLE`
- [ ] Email: `your.email@domain.com`

## 🔧 Advanced Customization

### Color Scheme

In `index.html` (lines 11-22), you can modify the color scheme:

```javascript
colors: {
    primary: '#0F172A',      // Dark background
    secondary: '#1E293B',    // Card background
    accent: '#3B82F6',       // Blue accent
    'accent-light': '#60A5FA', // Light blue
}
```

### Adding Your Own Projects

If you want to add manual projects instead of GitHub integration:

1. Replace the GitHub projects section with manual project cards
2. Use this template for each project:

```html
<div class="project-card">
    <div class="p-6">
        <h3 class="text-xl font-semibold text-white mb-4">Project Name</h3>
        <p class="text-gray-400 mb-4">Project description...</p>
        <div class="mb-4">
            <span class="project-tech">React</span>
            <span class="project-tech">Node.js</span>
        </div>
        <div class="flex space-x-4">
            <a href="#" class="btn-primary">Live Demo</a>
            <a href="#" class="btn-secondary">Source Code</a>
        </div>
    </div>
</div>
```

## 📧 Contact Form Integration

### Option 1: Formspree (Free)

1. Go to [formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form and get your form endpoint
4. Update the contact form in `index.html`:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: Netlify Forms (if using Netlify)

1. Add `data-netlify="true"` to your form tag
2. The form will automatically work on Netlify

## 🎯 SEO Optimization

### Meta Tags (Add to <head> section)

```html
<meta name="description" content="Full Stack Developer specializing in React, Node.js, and modern web technologies">
<meta name="keywords" content="full stack developer, web developer, react, node.js, javascript">
<meta name="author" content="Your Name">

<!-- Open Graph Meta Tags -->
<meta property="og:title" content="Your Name - Full Stack Developer">
<meta property="og:description" content="Passionate Full Stack Developer creating innovative web solutions">
<meta property="og:image" content="https://yourdomain.com/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com">

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@yourusername">
```

## 📱 Testing Checklist

Before deploying, test these:

- [ ] All navigation links work
- [ ] Mobile responsiveness (use Chrome DevTools)
- [ ] GitHub projects load correctly
- [ ] Contact form validation works
- [ ] All external links open in new tabs
- [ ] Page loads quickly
- [ ] Images display correctly
- [ ] Animations work smoothly

## 🔗 Custom Domain (Optional)

### Using Render:

1. Go to your site dashboard on Render
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update your domain's DNS settings

### Free Domain Options:

- `.tk`, `.ml`, `.ga`, `.cf` from Freenom (limited)
- GitHub Student Pack includes free `.me` domain
- Some hosting providers offer free subdomains

## 📊 Analytics (Optional)

### Google Analytics:

Add before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🚨 Troubleshooting

### Common Issues:

1. **GitHub projects not loading**:
   - Check your username in `script.js`
   - Ensure your repositories are public
   - Check browser console for errors

2. **Styles not applying**:
   - Verify Tailwind CDN link is working
   - Check for CSS syntax errors
   - Clear browser cache

3. **Site not updating on Render**:
   - Check deployment logs
   - Ensure you pushed changes to the correct branch
   - Try triggering a manual redeploy

### Performance Tips:

1. **Optimize images**: Use compressed, web-optimized images
2. **Minimize requests**: Combine CSS/JS files if needed
3. **Enable caching**: Add cache headers for static assets
4. **Use CDNs**: Keep using CDN versions of libraries

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Review Render deployment logs
3. Refer to the README.md file
4. Test locally first with `python3 -m http.server 8000`

---

**Your portfolio website is now ready to impress recruiters! 🎉**

Remember to:
- Keep your projects updated
- Add new skills as you learn them
- Update your contact information
- Monitor your site's performance
- Share the link on your resume and LinkedIn
