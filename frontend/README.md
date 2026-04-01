# Background Remover Frontend

Modern, responsive frontend for the AI-powered background removal application.

## 🚀 Features

- **Modern Design**: Beautiful UI with animations and gradients
- **Responsive**: Works perfectly on desktop and mobile devices
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **Real-time Processing**: Live feedback during background removal
- **Authentication**: Secure user login and registration
- **Progress Tracking**: Visual progress indicators

## 🛠️ Tech Stack

- **Vite**: Fast build tool and development server
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern CSS with animations and transitions
- **Font Awesome**: Beautiful icons
- **Axios**: HTTP client for API requests

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   - Go to Vercel dashboard
   - Navigate to your project settings
   - Add environment variable: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.vercel.app`

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Your backend API URL (required for production)

### API Integration

The frontend connects to a FastAPI backend. Make sure your backend is deployed and accessible before deploying the frontend.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Customization

### Colors

Main colors are defined in CSS variables at the top of `main.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10b981;
  --error-color: #ef4444;
}
```

### Fonts

The app uses Inter font from Google Fonts. You can change it in `index.html`.

## 🐛 Troubleshooting

### CORS Issues

Make sure your backend has CORS configured to allow requests from your frontend domain.

### API Connection

Verify that `VITE_API_BASE_URL` is correctly set in your Vercel environment variables.

### Build Errors

Ensure all dependencies are installed and Node.js version is 18+.

## 📄 License

MIT License - see LICENSE file for details.
