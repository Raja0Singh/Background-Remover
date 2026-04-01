# Background Removal API with Authentication

A FastAPI-based web service that removes backgrounds from images using the `rembg` library, now with complete user authentication system.

## Features

- � **User Authentication** with JWT tokens
- �🖼️ Remove backgrounds from uploaded images (protected endpoint)
- 🚀 Fast and efficient image processing
- 🐳 Docker support for easy deployment
- 🌐 RESTful API with FastAPI
- 📱 Modern responsive frontend with login/register
- 💾 SQLite database for user management
- 🔒 Password hashing with bcrypt

## Quick Start

### Using Docker (Recommended)

1. **Build the Docker image:**

   ```bash
   docker build -t background-removal-api .
   ```

2. **Run the container:**

   ```bash
   docker run -d -p 8080:8080 --name bg-remover background-removal-api
   ```

3. **Access the application:**
   - Open your browser and go to `http://localhost:8080/login`
   - Register a new account or login
   - Upload images to remove backgrounds

### 🐳 Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- Neon PostgreSQL database URL

### Quick Start with Docker

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd background-removal
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your Neon database URL and secrets
   ```

3. **Build and run**:

   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d

   # Or using Docker directly
   docker build -t background-removal .
   docker run -p 8080:8080 --env-file .env background-removal
   ```

4. **Access the application**:
   - Frontend: http://localhost:8080
   - API Health: http://localhost:8080/health
   - API Docs: http://localhost:8080/docs

### Docker Compose Services

- **background-removal**: Main application container
- **Port**: 8080 (host) → 8080 (container)
- **Health Check**: Every 30 seconds
- **Restart Policy**: Unless stopped

### Production Considerations

- Use strong secrets in production
- Enable SSL/TLS termination
- Set up proper logging
- Configure resource limits
- Use environment-specific configurations

### Environment Variables

Required variables for Docker deployment:

- `DATABASE_URL`: Neon PostgreSQL connection string
- `SECRET_KEY`: JWT signing secret
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `DEBUG`: Set to False for production

## 🌐 Vercel Frontend Deployment

### Prerequisites

- Vercel account
- Deployed backend API URL

### Quick Start

1. **Navigate to frontend folder**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set environment variable**:

   ```bash
   vercel env add VITE_API_BASE_URL
   # Enter your backend URL: https://your-backend.vercel.app
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### Frontend Features

- **Modern UI/UX**: Beautiful design with animations
- **Responsive Design**: Works on all devices
- **Drag & Drop**: Easy file upload
- **Real-time Processing**: Live feedback during AI processing
- **Authentication**: Secure user management
- **Progress Tracking**: Visual progress indicators

### Vercel Configuration

- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

### Custom Domain

1. Go to Vercel dashboard
2. Navigate to project settings
3. Add custom domain
4. Update DNS records

## 🚀 Local Development

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize the database:**

   ```bash
   python database.py
   ```

3. **Run the application:**

   ```bash
   python app.py
   ```

4. **Access the application at:** `http://localhost:8080/login`

## API Endpoints

### Authentication Endpoints

#### POST `/register`

Register a new user account.

**Request Body:**

```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Response:**

```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00"
}
```

#### POST `/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

#### GET `/users/me`

Get current user information (requires authentication).

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00"
}
```

### Background Removal Endpoint

#### POST `/remove-bg` 🔒 **Protected**

Remove background from an uploaded image (requires authentication).

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Request:**

- File: Image file (any format supported by Pillow)

**Response:**

- Content-Type: `image/png`
- Returns the processed image with background removed

**Example using curl:**

```bash
# First login to get token
TOKEN=$(curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}' \
  http://localhost:8080/login | jq -r '.access_token')

# Use token to remove background
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -F "file=@your-image.jpg" \
  http://localhost:8080/remove-bg -o output.png
```

### Utility Endpoints

#### GET `/`

Health check endpoint that returns a welcome message.

#### GET `/login`

Serve the login/register frontend page.

## Frontend Features

The web interface includes:

- **Registration Form**: Create new user accounts
- **Login Form**: Secure authentication with JWT tokens
- **Background Removal Tool**: Upload and process images
- **User Dashboard**: Shows logged-in user information
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Clear error messages for all operations
- **Download Functionality**: Download processed images

## Project Structure

```
background-removal/
├── app.py              # Main FastAPI application with auth
├── database.py         # SQLite database setup and management
├── models.py           # Pydantic models for API
├── auth.py             # JWT authentication utilities
├── ai_model.py         # AI model configuration
├── requirements.txt    # Python dependencies
├── Dockerfile          # Docker configuration
├── .dockerignore       # Docker ignore file
├── static/             # Frontend assets
│   ├── login.html      # Login/register page
│   ├── login.css       # Styling
│   └── login.js        # Frontend JavaScript
├── frontend.html       # Legacy frontend (optional)
├── main.js            # Legacy frontend JS (optional)
├── style.css          # Legacy frontend styles (optional)
└── README.md          # This file
```

## Dependencies

### Backend

- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI applications
- **rembg**: Python library for removing backgrounds from images
- **Pillow**: Python Imaging Library for image processing
- **python-multipart**: Support for multipart form data
- **python-jose**: JWT token handling
- **passlib**: Password hashing with bcrypt
- **email-validator**: Email validation

### Database

- **SQLite**: Lightweight file-based database for user management

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic models for request validation
- **Protected Endpoints**: Background removal requires authentication
- **Token Expiration**: Configurable token lifetime (default: 30 minutes)

## Configuration

### Environment Variables

Currently using default configurations. For production:

```python
# In auth.py - Change these for production
SECRET_KEY = "your-very-secure-secret-key-here"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### Database

The application uses SQLite by default. The database file (`app.db`) is created automatically on first run.

## Error Handling

The API includes comprehensive error handling:

- **Authentication Errors**: 401 for invalid tokens/credentials
- **Authorization Errors**: 403 for insufficient permissions
- **Validation Errors**: 422 for invalid request data
- **File Type Validation**: 400 for non-image uploads
- **Processing Errors**: 500 for image processing failures

## Testing the Application

### 1. Test Registration

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}' \
  http://localhost:8080/register
```

### 2. Test Login

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  http://localhost:8080/login
```

### 3. Test Protected Endpoint

```bash
# Use the token from login response
curl -X POST -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@test-image.jpg" \
  http://localhost:8080/remove-bg -o result.png
```

## Production Considerations

- **Change Secret Key**: Use a strong, randomly generated secret key
- **HTTPS**: Use SSL/TLS in production
- **Database Security**: Consider PostgreSQL/MySQL for production
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Logging**: Add comprehensive logging for monitoring
- **Input Validation**: Additional validation for file uploads
- **CORS Configuration**: Restrict origins in production

## Performance Notes

- The `rembg` library with CPU support is used for background removal
- Processing time depends on image size and complexity
- Consider GPU support for production workloads with high volume
- Database queries are optimized for user authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source. Please check the license file for details.

## Support

For issues and questions:

1. Check the API documentation
2. Review the error logs
3. Create an issue in the repository

## Future Enhancements

- [ ] Add GPU support for faster processing
- [ ] Implement batch processing
- [ ] Add image format conversion options
- [ ] Include rate limiting
- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add user profile management
- [ ] Include usage statistics
- [ ] Add API key authentication
- [ ] Implement caching for processed images
