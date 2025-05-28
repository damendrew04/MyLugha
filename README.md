# MyLugha

![MyLugha Logo](public/languageKenya.png)

> A community-driven platform for collecting, preserving, and digitizing Kenyan languages through crowdsourced contributions to build AI-ready datasets

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌍 Overview

MyLugha (literally "My Language" in Kiswahili) is a comprehensive web platform dedicated to preserving Kenya's rich linguistic heritage. The platform enables communities to contribute text, audio, and translations in their native languages, creating high-quality datasets that can power AI systems, educational tools, and research initiatives.

**Mission**: To preserve, promote, and digitize Kenya's diverse linguistic heritage through community-driven data collection, ensuring these languages remain vibrant and accessible in the digital age.

## ✨ Key Features

### For Contributors
- **Multi-Modal Contributions**: Submit text, audio recordings, and translations
- **Cultural Context**: Add contextual information to preserve cultural nuances
- **Flexible Content Types**: Support for words, phrases, sentences, paragraphs, and stories
- **Anonymous Contributions**: Option to contribute without appearing on leaderboards
- **Language Selection**: Choose from 30+ Kenyan languages across different families

### For Validators
- **Peer Review System**: Community-driven validation of contributions
- **Quality Assurance**: Multi-level validation to ensure accuracy
- **Feedback Mechanism**: Provide constructive feedback on submissions
- **Translation Challenges**: Gamified validation through translation exercises

### For Researchers & Developers
- **RESTful API**: Programmatic access to language datasets
- **Export Functions**: Download validated datasets in various formats
- **Language Statistics**: Comprehensive analytics on language contributions
- **Real-time Updates**: Live statistics and contribution tracking

### Community Features
- **Leaderboards**: Recognition for top contributors
- **User Profiles**: Track personal contributions and achievements
- **Community Events**: Virtual workshops and language meetups
- **Social Features**: Connect with fellow language enthusiasts

## 🏗️ System Architecture

### Frontend (React Application)
```
src/
├── MyLugha.jsx              # Main application component
├── LoginPage.jsx            # Authentication pages
├── RegisterPage.jsx         
├── services/
│   └── api.js              # API service layer
├── components/              # Reusable UI components
└── utils/                  # Helper functions
```

### Backend (Django REST Framework)
```
server/mylugha/
├── accounts/               # User management
├── languages/              # Language models and management
├── contributions/          # Contribution handling
├── validations/            # Validation system
└── config/                # Django configuration
```

### Database Schema

#### Core Models
- **Language**: Stores language information with categories (Bantu, Nilotic, Cushitic, Other)
- **Contribution**: Handles text/audio contributions with validation status
- **Validation**: Peer review system for quality assurance
- **User**: Extended user model with language preferences

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 16+** and **npm**
- **Git**
- **Virtual environment** (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GilbertAshivaka/MyLugha.git
   cd MyLugha
   ```

2. **Backend Setup**
   ```bash
   # Navigate to server directory
   cd server

   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

   # Run database migrations
   cd mylugha
   python manage.py migrate

   # Add Kenyan languages to database
   python manage.py add_kenyan_languages

   # Create superuser (optional)
   python manage.py createsuperuser

   # Start Django development server
   python manage.py runserver
   ```

3. **Frontend Setup** (New terminal)
   ```bash
   # Navigate to project root
   cd MyLugha

   # Install dependencies
   npm install

   # Start React development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

## 🎯 How to Use MyLugha

### For Contributors

1. **Registration & Language Selection**
   - Create an account or log in
   - Select languages you're fluent in
   - Choose your preferred contribution types

2. **Making Contributions**
   - **Text Contributions**: Submit words, phrases, sentences, or stories with English translations
   - **Audio Contributions**: Record pronunciations and provide transcripts
   - **Context Information**: Add cultural context, usage notes, and explanations
   - **Translation Challenges**: Participate in gamified translation exercises

3. **Contribution Types**
   - **Word/Phrase**: Single words or short phrases
   - **Sentence**: Complete sentences with translations
   - **Paragraph**: Longer text blocks
   - **Story/Song**: Cultural narratives, proverbs, or songs

### For Validators

1. **Access Validation Dashboard**
   - Navigate to the validation section
   - Filter by languages you're qualified to review

2. **Review Process**
   - Evaluate accuracy of translations
   - Check cultural appropriateness
   - Provide constructive feedback
   - Approve or suggest improvements

### For Researchers

1. **API Access**
   ```bash
   # Get all languages
   GET /api/languages/

   # Get language statistics
   GET /api/languages/{code}/stats/

   # Access contributions
   GET /api/contributions/
   ```

2. **Dataset Export**
   - Download validated contributions
   - Access metadata and statistics
   - Export in JSON, CSV formats

## 🌐 Supported Languages

MyLugha supports 30+ Kenyan languages across four major linguistic families:

### Bantu Languages
- Kiswahili (National language)
- Gikuyu (Kikuyu)
- Kamba
- Luhya
- Kimeru
- Ekegusii (Kisii)
- Taita
- Kiembu
- And more...

### Nilotic Languages
- Dholuo
- Kalenjin
- Maasai
- Turkana
- Samburu
- Ateso
- Nandi
- And more...

### Cushitic Languages
- Somali
- Rendille
- Oromo
- Gabra
- Daasanach
- And more...

### Other Languages
- Arabic (Kenyan dialect)
- Hindi (Kenyan community)
- Various creole languages

## 📊 Platform Statistics

As of the latest update:
- **2,457+** Community contributions
- **30+** Kenyan languages
- **312+** Active contributors
- **1,834+** Validated translations

## 🛠️ Technology Stack

### Frontend
- **React 18.0** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client for API communication

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL/SQLite** - Database systems
- **Django JWT** - Authentication system
- **Django CORS** - Cross-origin resource sharing

### Infrastructure
- **Digital Ocean/AWS** - Cloud hosting
- **Nginx** - Web server
- **Gunicorn** - Python WSGI server
- **Redis** - Caching and session storage

### Development Tools
- **Git** - Version control
- **ESLint & Prettier** - Code formatting
- **Django Debug Toolbar** - Backend debugging
- **React DevTools** - Frontend debugging

## 🔧 API Documentation

### Authentication Endpoints
```bash
POST /api/auth/register/        # User registration
POST /api/token/               # Login and get JWT token
POST /api/token/refresh/       # Refresh JWT token
GET  /api/auth/profile/        # Get user profile
```

### Language Endpoints
```bash
GET  /api/languages/           # List all languages
GET  /api/languages/{code}/    # Get language details
GET  /api/languages/{code}/stats/ # Get language statistics
```

### Contribution Endpoints
```bash
GET  /api/contributions/       # List contributions
POST /api/contributions/text/  # Submit text contribution
POST /api/contributions/audio/ # Submit audio contribution
GET  /api/contributions/{id}/  # Get contribution details
```

### Validation Endpoints
```bash
GET  /api/validations/         # List validations
POST /api/validations/create/  # Create validation
GET  /api/validations/pending/ # Get pending validations
```

## 🤝 Contributing to MyLugha

We welcome contributions from developers, linguists, translators, and community members!

### For Developers
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### For Language Contributors
1. Register on the platform
2. Select your native language(s)
3. Start contributing translations and audio
4. Help validate others' contributions

### For Language Experts
- Review and validate contributions
- Provide cultural context and explanations
- Help improve translation quality
- Participate in community events

## 🗺️ Project Roadmap

### Phase 1 (Current)
- ✅ Core platform functionality
- ✅ Text and audio contributions
- ✅ Validation system
- ✅ 30+ Kenyan languages support

### Phase 2 (In Progress)
- 🔄 Mobile application development
- 🔄 Enhanced audio processing
- 🔄 Improved analytics dashboard
- 🔄 Community features expansion

### Phase 3 (Planned)
- 📅 AI-assisted translation suggestions
- 📅 Integration with educational platforms
- 📅 Dialect support within languages
- 📅 Offline contribution capabilities

### Phase 4 (Future)
- 📅 Machine learning model training
- 📅 Language learning modules
- 📅 Government and NGO partnerships
- 📅 Pan-African language support

## 🏢 Team & Partners

### Core Team
- **Wangari Muthoni** - Founder & Director (Computational Linguistics)
- **James Odhiambo** - Technology Lead (AI Engineering)
- **Amina Hassan** - Community Manager (Language Advocacy)
- **David Kiprop** - Research Lead (Linguistics PhD)

### Partners
- Kenya National Archives
- Mozilla Foundation
- University of Nairobi
- Digital Africa Initiative

## 📞 Contact & Support

### General Information
- **Email**: info@mylugha.org
- **Website**: https://mylugha.org
- **GitHub**: https://github.com/GilbertAshivaka/MyLugha

### Office Location
Nairobi Innovation Hub  
Westlands, Nairobi, Kenya  
Phone: +254 712 345 678

### Social Media
- Twitter: [@MyLughaKE](https://twitter.com/MyLughaKE)
- Facebook: [MyLugha Kenya](https://facebook.com/MyLughaKenya)
- Instagram: [@mylugha_ke](https://instagram.com/mylugha_ke)

### Developer Contact
**Gilbert Ashivaka** - Project Creator  
GitHub: [@GilbertAshivaka](https://github.com/GilbertAshivaka)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The vibrant Kenyan linguistic communities
- Mozilla Foundation for open-source advocacy
- University of Nairobi Linguistics Department
- All contributors and validators on the platform
- Open-source community for tools and libraries

---

**"Lugha ni utajiri wa jamii"** - *Language is the wealth of a community*

Join us in preserving Kenya's linguistic heritage for future generations! 🇰🇪
