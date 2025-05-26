# MyLugha


> A platform for contributing language and translation for creating datasets that can be used to build AI that understands local cultural context, framing and converse in indigenous languages.

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage Guide](#usage-guide)
  - [Contributing Translations](#contributing-translations)
  - [Reviewing Submissions](#reviewing-submissions)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Contact](#contact)

##  Overview

MyLugha is a community-driven platform designed to collect and curate linguistic datasets for indigenous and underrepresented languages. By leveraging crowdsourced translations and cultural context, we aim to create high-quality datasets that can train AI models to understand and communicate effectively in these languages, preserving linguistic diversity and providing technology access to more communities worldwide.

##  Features

- **User-friendly Translation Interface**: Simple web interface for contributing translations and language samples  
- **Cultural Context Annotations**: Ability to add cultural context to translations  
- **Quality Assurance System**: Community review system to ensure accurate translations  
- **Diverse Content Types**: Support for phrases, sentences, conversations, and cultural expressions  
- **Dataset Management**: Tools for creating, exporting, and managing language datasets  
- **User Dashboard**: Personal dashboard for tracking contributions and achievements  
- **Language Profiles**: Detailed information about supported languages and dialects  

##  Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (28.2%)  
- **Backend**: Python (24.7%)  
- **Web Framework**: Django/Flask  
- **Database**: MongoDB/PostgreSQL  
- **UI Framework**: Bootstrap/React.js  

##  Getting Started

### Prerequisites

- Python 3.8+  
- React and npm (for frontend development)  
- Database system (MongoDB or PostgreSQL)  
- Virtual environment (recommended)  

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GilbertAshivaka/MyLugha.git
   cd MyLugha
   ```

2. Set up the Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend dependencies:
   ```bash
   npm install
   ```

4. Configure the database and run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

6. Visit [http://localhost:8000](http://localhost:8000) in your browser to access the application.


##  Usage Guide

### Contributing Translations

- **Register/Login**: Create an account or log in to your existing account  
- **Select a Language**: Choose the language(s) you're fluent in  
- **Choose a Task**: Select from available translation tasks  
- **Submit Translations**: Provide translations and cultural context  
- **Review Process**: Your submissions will be reviewed by other community members  

### Reviewing Submissions

- **Access Review Dashboard**: Navigate to the review section  
- **Select Language**: Choose languages you're qualified to review  
- **Review Submissions**: Rate and provide feedback on others' translations  
- **Quality Badges**: Earn reviewer badges based on your contribution quality    

##  API Documentation

MyLugha provides a RESTful API for programmatic access to language datasets:

- `GET /api/languages` - List all available languages  
- `GET /api/languages/{id}/datasets` - Get datasets for a specific language  
- `POST /api/contributions` - Submit a new translation contribution  
- `GET /api/users/me/contributions` - Get your contributions  

## 🤝 Contributing

We welcome contributions from developers, linguists, translators, and cultural experts!

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

Please read CONTRIBUTING.md for detailed guidelines.

## 🗓 Roadmap

- Support for audio recordings of pronunciations  
- Mobile application for offline contributions  
- Sentiment analysis and emotion detection  
- Integration with popular NLP frameworks  
- AI-assisted translation suggestions  


## 📞 Contact

**Gilbert Ashivaka** - [@GilbertAshivaka](https://github.com/GilbertAshivaka)

Project Link: [https://github.com/GilbertAshivaka/MyLugha](https://github.com/GilbertAshivaka/MyLugha)
