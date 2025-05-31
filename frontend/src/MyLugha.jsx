import { useState, useEffect, useRef } from 'react';
import { Globe, Book, Users, Award, FileText, Mic, CheckCircle, Upload, Info, Home, User, UserPlus, LogIn, Menu, X, ChevronDown, ChevronRight, PlusCircle, ChevronLeft, Mail, MapPin, Phone, Play, Square, Pause, MicOff} from 'lucide-react';
import { languageService, contributionService, validationService, authService } from './services/api';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

// Kenya's languages - not exhaustive
const LANGUAGES = [
  { code: 'sw', name: 'Kiswahili' },
  { code: 'luo', name: 'Dholuo' },
  { code: 'kam', name: 'Kamba' },
  { code: 'kal', name: 'Kalenjin' },
  { code: 'luy', name: 'Luhya' },
  { code: 'mer', name: 'Kimeru' },
  { code: 'som', name: 'Somali' },
  { code: 'mas', name: 'Maasai' },
  { code: 'tec', name: 'Terik' }
];

// Dummy data for UI demonstration
const STATS = {
  contributions: 2457,
  languages: 10,
  activeUsers: 312,
  translations: 1834
};

const LEADERBOARD = [
  { name: 'Wangari M.', contributions: 145, language: 'Gikuyu' },
  { name: 'Otieno K.', contributions: 132, language: 'Dholuo' },
  { name: 'Amina H.', contributions: 128, language: 'Kiswahili' },
  { name: 'Kipchoge E.', contributions: 97, language: 'Kalenjin' },
  { name: 'Njeri W.', contributions: 89, language: 'Gikuyu' }
];

export default function MyLugha() {
  const [page, setPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [contributionType, setContributionType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login success
  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage('home');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setPage('home');
  };
  
  const renderPage = () => {
    switch(page) {
      case 'home':
        return <HomePage onContribute={() => setPage('contribute')} />;
      case 'contribute':
        return currentLanguage 
          ? <ContributionPage 
              language={currentLanguage} 
              contributionType={contributionType}
              onSelectType={setContributionType}
              onBackToLanguages={() => setCurrentLanguage(null)}
              onBackToTypes={() => setContributionType(null)}
            /> 
          : <LanguageSelectionPage onSelectLanguage={setCurrentLanguage} />;
      case 'languages':
        return <LanguagesPage onSelectLanguage={(lang) => {
          setCurrentLanguage(lang);
          setPage('contribute');
        }} />;
      case 'community':
        return <CommunityPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLogin} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={handleLogin} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8" />
            <h1 className="text-2xl font-bold">MyLugha</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink current={page} name="home" label="Home" onClick={() => setPage('home')} />
            <NavLink current={page} name="contribute" label="Contribute" onClick={() => setPage('contribute')} />
            <NavLink current={page} name="languages" label="Languages" onClick={() => setPage('languages')} />
            <NavLink current={page} name="community" label="Community" onClick={() => setPage('community')} />
            <NavLink current={page} name="about" label="About" onClick={() => setPage('about')} />
          </nav>
          
          <div className="hidden md:flex space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors flex items-center"
              >
                Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setPage('login')}
                  className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </button>
                <button 
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-600 transition-colors flex items-center"
                  onClick={() => setPage('register')}
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Register
                </button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-green-700 p-4">
            <nav className="flex flex-col space-y-2">
              <MobileNavLink label="Home" onClick={() => { setPage('home'); setMobileMenuOpen(false); }} />
              <MobileNavLink label="Contribute" onClick={() => { setPage('contribute'); setMobileMenuOpen(false); }} />
              <MobileNavLink label="Languages" onClick={() => { setPage('languages'); setMobileMenuOpen(false); }} />
              <MobileNavLink label="Community" onClick={() => { setPage('community'); setMobileMenuOpen(false); }} />
              <MobileNavLink label="About" onClick={() => { setPage('about'); setMobileMenuOpen(false); }} />
              <div className="pt-2 flex flex-col space-y-2">
                {isLoggedIn ? (
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => { setPage('login'); setMobileMenuOpen(false); }}
                      className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-50 transition-colors"
                    >
                      Login
                    </button>
                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-600 transition-colors"
                      onClick={() => { setPage('register'); setMobileMenuOpen(false); }}
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" /> MyLugha
              </h3>
              <p className="text-gray-300">
                Preserving Kenyan languages and heritage through community-driven data collection for AI.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white" onClick={(e) => { e.preventDefault(); setPage('home'); }}>Home</a></li>
                <li><a href="#" className="hover:text-white" onClick={(e) => { e.preventDefault(); setPage('contribute'); }}>Contribute</a></li>
                <li><a href="#" className="hover:text-white" onClick={(e) => { e.preventDefault(); setPage('languages'); }}>Languages</a></li>
                <li><a href="#" className="hover:text-white" onClick={(e) => { e.preventDefault(); setPage('community'); }}>Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <p className="text-gray-300 mb-2">Join our mission to preserve and promote Kenyan languages.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MyLugha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ current, name, label, onClick }) {
  return (
    <button 
      className={`font-medium ${current === name ? 'text-white' : 'text-green-100 hover:text-white'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function MobileNavLink({ label, onClick }) {
  return (
    <button 
      className="w-full text-left text-white py-2 px-3 rounded hover:bg-green-600 transition-colors"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function HomePage({ onContribute }) {
  // Add state for stats
  const [stats, setStats] = useState({
    contributions: 0,
    languages: 0,
    activeUsers: 0,
    translations: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stats when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint for stats
        const response = await fetch('/api/stats/');
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Fallback to default values if API fails
        setStats({
          contributions: 2457,
          languages: 10,
          activeUsers: 312,
          translations: 1834
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Preserve Our Languages, Empower Our Future</h1>
            <p className="text-xl mb-8">Join the movement to collect, preserve, and promote Kenyan languages for the next generation of AI technology.</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onContribute}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium text-lg flex items-center transition-colors"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Start Contributing
              </button>
              <button className="bg-white hover:bg-gray-100 text-green-600 px-6 py-3 rounded-lg font-medium text-lg flex items-center transition-colors">
                <Info className="mr-2 h-5 w-5" /> Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="/languageKenya.png" alt="Diverse Kenyan speakers contributing languages" className="rounded-lg shadow-xl" /> 
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading statistics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={<FileText />} value={stats.contributions} label="Contributions" />
              <StatCard icon={<Book />} value={stats.languages} label="Languages" />
              <StatCard icon={<Users />} value={stats.activeUsers} label="Contributors" />
              <StatCard icon={<CheckCircle />} value={stats.translations} label="Translations" />
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How MyLugha Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Contribute" 
              description="Share words, phrases, sentences, stories, or translations in your local language." 
              icon={<Upload className="h-10 w-10 text-green-500" />}
            />
            <FeatureCard 
              title="Validate" 
              description="Review and validate contributions from other users to ensure quality data." 
              icon={<CheckCircle className="h-10 w-10 text-blue-500" />}
            />
            <FeatureCard 
              title="Preserve" 
              description="Help build AI systems that truly understand and preserve Kenyan languages." 
              icon={<Globe className="h-10 w-10 text-purple-500" />}
            />
          </div>
        </div>
      </section>
      
      {/* Featured Languages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Languages</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            These languages need your contributions. Help us preserve the linguistic diversity of Kenya.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {LANGUAGES.slice(0, 5).map(lang => (
              <LanguageCard key={lang.code} name={lang.name} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => onContribute()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              View All Languages <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Preserve Your Language?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Every word, phrase, and story contributes to keeping our languages alive in the digital age.
          </p>
          <button 
            onClick={onContribute}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center transition-colors"
          >
            Start Contributing Now <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value.toLocaleString()}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function LanguageCard({ name }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-green-500 hover:shadow-md transition-all">
      <div className="font-medium text-lg">{name}</div>
      <div className="text-sm text-gray-500 mt-2">Join contributors</div>
    </div>
  );
}

function LanguageSelectionPage({ onSelectLanguage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // This function will fetch languages from the API
    const fetchLanguages = async () => {
      setIsLoading(true);
      try {
        const response = await languageService.getLanguages();
        setLanguages(response.data.results);
        setError(null);
      } catch (err) {
        console.error('Error fetching languages:', err);
        setError('Failed to load languages. Please try again later.');
        // Fallback to sample data if API call fails
        setLanguages(LANGUAGES);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Call the function when component mounts
    fetchLanguages();
  }, []); // Empty dependency array means this effect runs once when component mounts
  
  // Now use the fetched languages instead of the LANGUAGES constant
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Select a Language to Contribute</h2>
      
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading languages...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search for a language..."
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLanguages.map(lang => (
          <button
            key={lang.code}
            onClick={() => onSelectLanguage(lang)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500 text-center"
          >
            <h3 className="text-xl font-bold mb-2">{lang.name}</h3>
            <p className="text-gray-500 text-sm mb-4">Code: {lang.code}</p>
            <div className="mt-4 text-green-600 font-medium flex items-center justify-center">
              Select <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
      
      {!isLoading && filteredLanguages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No languages found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}

function ContributionPage({ language, contributionType, onSelectType, onBackToLanguages, onBackToTypes }) {
  if (!contributionType) {
    return <ContributionTypeSelection language={language} onSelectType={onSelectType} onBack={onBackToLanguages} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={onBackToTypes}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to contribution types
        </button>
      </div>
      
      <h2 className="text-3xl font-bold mb-2">
        {contributionType === 'text' && 'Contribute Text & Translation'}
        {contributionType === 'audio' && 'Contribute Audio Recording'}
        {contributionType === 'validation' && 'Validate Existing Content'}
        {contributionType === 'challenge' && 'Translation Challenge'}
      </h2>
      <p className="text-gray-600 mb-8">Language: {language.name}</p>
      
      {contributionType === 'text' && <TextContributionForm language={language} />}
      {contributionType === 'audio' && <AudioContributionForm language={language} />}
      {contributionType === 'validation' && <ValidationForm language={language} />}
      {contributionType === 'challenge' && <TranslationChallenge language={language} />}
    </div>
  );
}

function ContributionTypeSelection({ language, onSelectType, onBack }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to language selection
        </button>
      </div>
      
      <h2 className="text-3xl font-bold mb-2">How would you like to contribute?</h2>
      <p className="text-gray-600 mb-8">Selected Language: {language.name}</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <ContributionTypeCard 
          icon={<FileText className="h-12 w-12 text-green-500" />}
          title="Text & Translation"
          description="Submit words, phrases, sentences or stories with translations"
          onClick={() => onSelectType('text')}
        />
        
        <ContributionTypeCard 
          icon={<Mic className="h-12 w-12 text-blue-500" />}
          title="Audio Recording"
          description="Record spoken words or phrases in your language"
          onClick={() => onSelectType('audio')}
        />
        
        <ContributionTypeCard 
          icon={<CheckCircle className="h-12 w-12 text-purple-500" />}
          title="Validate Content"
          description="Review and validate contributions from others"
          onClick={() => onSelectType('validation')}
        />
        
        <ContributionTypeCard 
          icon={<Book className="h-12 w-12 text-orange-500" />}
          title="Translation Challenge"
          description="Test your skills by translating provided texts"
          onClick={() => onSelectType('challenge')}
        />
      </div>
    </div>
  );
}

function ContributionTypeCard({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500 text-left flex"
    >
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </button>
  );
}

function TextContributionForm({ language }) {
  const [contributionType, setContributionType] = useState('sentence');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [context, setContext] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Add new state variables for tracking API interactions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields before submitting
    if (!originalText.trim() || !translatedText.trim()) {
      setSubmitError('Please fill in both original text and translation fields.');
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the data to send to the API - match Django model fields exactly
      const data = {
        original_text: originalText.trim(),
        translated_text: translatedText.trim(), // Changed from 'translation' to match model
        context: context.trim(),
        content_type: contributionType, // Changed from 'type' to match model field
        language: language.id, // Use language ID instead of code (ForeignKey expects ID)
        type: 'text', // Set the type field explicitly
        anonymous: isAnonymous // Changed from 'is_anonymous' to match model field
      };
      
      console.log('Sending data:', data); // Debug log
      
      // Call the API to submit the contribution
      const response = await contributionService.createTextContribution(data);
      console.log('API Response:', response); // Debug log
      
      // Update state on success
      setSubmitSuccess(true);
      setOriginalText('');
      setTranslatedText('');
      setContext('');
      setIsAnonymous(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (err) {
      console.error('Error submitting contribution:', err);
      
      // Handle different types of errors
      if (err.response?.data) {
        // API returned error details
        const errorData = err.response.data;
        let errorMessage = 'Failed to submit contribution. ';
        
        if (typeof errorData === 'object') {
          // Handle field-specific errors
          const errors = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`);
            } else {
              errors.push(`${field}: ${messages}`);
            }
          }
          errorMessage += errors.join('; ');
        } else {
          errorMessage += errorData;
        }
        
        setSubmitError(errorMessage);
      } else if (err.response?.status === 400) {
        setSubmitError('Invalid data provided. Please check all fields and try again.');
      } else if (err.response?.status === 401) {
        setSubmitError('You need to be logged in to submit contributions.');
      } else if (err.response?.status === 403) {
        setSubmitError('You do not have permission to submit contributions.');
      } else {
        setSubmitError('Failed to submit contribution. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      {/* Show success message if submission succeeded */}
      {submitSuccess && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" /> 
          Thank you for your contribution! It has been submitted for review.
        </div>
      )}
      
      {/* Show error message if submission failed */}
      {submitError && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
          <div className="font-medium mb-1">Submission Error:</div>
          <div className="text-sm">{submitError}</div>
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Contribution Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <ContributionOption 
            active={contributionType === 'word'} 
            onClick={() => setContributionType('word')}
            label="Word/Phrase"
          />
          <ContributionOption 
            active={contributionType === 'sentence'} 
            onClick={() => setContributionType('sentence')}
            label="Sentence"
          />
          <ContributionOption 
            active={contributionType === 'paragraph'} 
            onClick={() => setContributionType('paragraph')}
            label="Paragraph"
          />
          <ContributionOption 
            active={contributionType === 'story'} 
            onClick={() => setContributionType('story')}
            label="Story/Song"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="original" className="block text-gray-700 font-medium mb-2">
          Original Text ({language.name}) <span className="text-red-500">*</span>
        </label>
        <textarea 
          id="original"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
          placeholder={`Enter your ${contributionType} in ${language.name}...`}
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          required
        ></textarea>
      </div>
      
      <div className="mb-6">
        <label htmlFor="translation" className="block text-gray-700 font-medium mb-2">
          English Translation <span className="text-red-500">*</span>
        </label>
        <textarea 
          id="translation"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
          placeholder="Enter the English translation..."
          value={translatedText}
          onChange={(e) => setTranslatedText(e.target.value)}
          required
        ></textarea>
      </div>
      
      <div className="mb-6">
        <label htmlFor="context" className="block text-gray-700 font-medium mb-2">
          Context Information (Optional)
        </label>
        <textarea 
          id="context"
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
          placeholder="Add cultural context, usage notes, or explanations..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">
          Providing context helps others understand the cultural nuances and proper usage.
        </p>
      </div>
      
      <div className="mb-6 flex items-center">
        <input 
          type="checkbox" 
          id="anonymous" 
          className="mr-2 h-4 w-4"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        <label htmlFor="anonymous" className="text-gray-700">
          Contribute anonymously (won't appear on leaderboards)
        </label>
      </div>
      
      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={isSubmitting || !originalText.trim() || !translatedText.trim()}
          className={`${
            isSubmitting || !originalText.trim() || !translatedText.trim()
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center`}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            'Submit Contribution'
          )}
        </button>
      </div>
    </form>
  );
}

function ContributionOption({ active, onClick, label }) {
  return (
    <button
      type="button"
      className={`p-3 rounded-md text-center ${
        active 
          ? 'bg-green-100 border-2 border-green-500 text-green-700' 
          : 'bg-gray-100 border-2 border-gray-200 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}


function AudioContributionForm({ language = { name: 'Swahili', code: 'sw' } }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [context, setContext] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Audio recording states
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [permissionError, setPermissionError] = useState(null);
  
  // Refs for audio recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio stream when component mounts
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setPermissionError(null);
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        setRecordingComplete(true);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionError('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateAudioDuration = (blob) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
    });
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Calculate audio duration and file size
      const duration = await calculateAudioDuration(audioBlob);
      const fileSizeKB = Math.round(audioBlob.size / 1024);
      
      // Create FormData object for multipart/form-data request
      const formData = new FormData();
      formData.append('audio_file', audioBlob, `recording_${Date.now()}.webm`);
      formData.append('original_text', transcriptText);
      formData.append('translated_text', translationText);
      formData.append('context', context);
      formData.append('language_code', language.code);
      formData.append('anonymous', isAnonymous);
      formData.append('type', 'audio');
      formData.append('content_type', 'sentence'); // Default to sentence
      formData.append('duration', duration.toString());
      formData.append('file_size', fileSizeKB.toString());
      
      // Simulate API call (replace with actual API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update state on success
      setSubmitSuccess(true);
      resetForm();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (err) {
      console.error('Error submitting audio contribution:', err);
      setSubmitError('Failed to submit audio contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRecordingComplete(false);
    setTranscriptText('');
    setTranslationText('');
    setContext('');
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const discardRecording = () => {
    resetForm();
    setPermissionError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Success message */}
      {submitSuccess && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" /> 
          Thank you for your audio contribution! It has been submitted for review.
        </div>
      )}
      
      {/* Error messages */}
      {(submitError || permissionError) && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
          {submitError || permissionError}
        </div>
      )}
      
      <div className="mb-8 text-center">
        <div className="mb-4">
          {!recordingComplete ? (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={toggleRecording}
                disabled={!!permissionError}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse shadow-lg' 
                    : 'bg-green-500 hover:bg-green-600 hover:shadow-lg'
                } ${permissionError ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRecording ? (
                  <Square className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-10 w-10 text-white" />
                )}
              </button>
              {isRecording && (
                <div className="mt-4 text-lg font-mono text-red-600">
                  {formatTime(recordingTime)}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg inline-flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" /> Recording complete! ({formatTime(recordingTime)})
            </div>
          )}
        </div>
        
        <p className="text-gray-600">
          {isRecording 
            ? 'Recording... Press square to stop' 
            : !recordingComplete 
              ? `Press to start recording in ${language.name}`
              : 'Recording saved. You can play it back and add transcript below.'
          }
        </p>
      </div>
      
      {/* Audio playback controls */}
      {recordingComplete && audioUrl && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={playAudio}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <span className="text-gray-600">
              {isPlaying ? 'Playing...' : 'Click to play recording'}
            </span>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        </div>
      )}
      
      {recordingComplete && (
        <>
          <div className="mb-6">
            <label htmlFor="transcript" className="block text-gray-700 font-medium mb-2">
              Transcript ({language.name}) *
            </label>
            <textarea 
              id="transcript"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
              placeholder={`Enter what was said in ${language.name}...`}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="translation" className="block text-gray-700 font-medium mb-2">
              English Translation *
            </label>
            <textarea 
              id="translation"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
              placeholder="Enter the English translation..."
              value={translationText}
              onChange={(e) => setTranslationText(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="context" className="block text-gray-700 font-medium mb-2">
              Context Information (Optional)
            </label>
            <textarea 
              id="context"
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
              placeholder="Add cultural context, usage notes, or explanations..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-6 flex items-center">
            <input 
              type="checkbox" 
              id="anonymous" 
              className="mr-2 h-4 w-4"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous" className="text-gray-700">
              Contribute anonymously (won't appear on leaderboards)
            </label>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={discardRecording}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Discard & Re-record
            </button>
            
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !transcriptText.trim() || !translationText.trim()}
              className={`${
                isSubmitting || !transcriptText.trim() || !translationText.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center`}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Submit Recording'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}



function ValidationForm({ language }) {
  const [validationItems, setValidationItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
    // Use useEffect to fetch validation items when component mounts
  useEffect(() => {
    const fetchValidationItems = async () => {
      setIsLoading(true);
      try {
        // Get contributions that need validation for the current language
        const response = await contributionService.getPendingValidations();
        
        // Check if response has the expected structure
        console.log('API Response:', response.data);
        
        // Get results from response - handle different response structures
        const contributions = response.data.results || response.data || [];
        
        // Filter to only include items for the current language
        // Check for both language_code and language fields
        const languageItems = contributions.filter(item => 
          item.language_code === language.code || 
          item.language === language.code ||
          (item.language_name && item.language_name.toLowerCase() === language.name.toLowerCase())
        );
        
        // Transform the data to match expected format
        const formattedItems = languageItems.map(item => ({
          id: item.id,
          original: item.original_text || item.original,
          translation: item.translated_text || item.translation,
          type: item.content_type === 'audio' ? 'audio' : 'text',
          submittedBy: item.user_name || item.submittedBy || 'Anonymous'
        }));
        
        setValidationItems(formattedItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching validation items:', err);
        setError('Failed to load items for validation. Please try again later.');
        // Don't use fallback data in production - show error instead
        setValidationItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchValidationItems();
  }, [language.code]); // Re-fetch when language changes
    const handleValidate = async (isValid) => {
    if (validationItems.length === 0) return;
    
    const item = validationItems[currentItem];
    setIsSubmitting(true);
    
    try {
      // Submit validation to the API
      await validationService.createValidation({
        contribution: item.id, // Use 'contribution' not 'contribution_id' based on API schema
        is_valid: isValid,
        feedback: isValid ? '' : feedback
      });
      
      // Update local state after successful API call
      const newItems = validationItems.filter((_, idx) => idx !== currentItem);
      setValidationItems(newItems);
      
      // Move to the next item or reset
      if (currentItem >= newItems.length) {
        setCurrentItem(0);
      }
      
      setFeedback('');
      
    } catch (err) {
      console.error('Error submitting validation:', err);
      alert('Error submitting validation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading validation items...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (validationItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">All caught up!</h3>
        <p className="text-gray-600 mb-6">
          You've validated all available content for {language.name}. Check back later for more.
        </p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }
  
  const item = validationItems[currentItem];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full mr-2">
              {item.type === 'text' ? 'Text' : 'Audio'}
            </span>
            <span className="text-gray-500 text-sm">Submitted by: {item.submittedBy || 'Anonymous'}</span>
          </div>
          <div className="text-gray-500 text-sm">
            {currentItem + 1} of {validationItems.length}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-5 mb-4">
          <h4 className="font-medium text-gray-700 mb-2">{language.name}:</h4>
          <p className="text-lg mb-4">{item.original}</p>
          
          {item.type === 'audio' && (
            <div className="mb-4">
              <button 
                className="flex items-center text-blue-600 hover:text-blue-800"
                onClick={() => {
                  // In a real app, this would play the audio from the URL
                  alert('Audio playback would happen here in a real app');
                }}
              >
                <Play className="h-5 w-5 mr-2" /> Play audio
              </button>
            </div>
          )}
          
          <h4 className="font-medium text-gray-700 mb-2">English Translation:</h4>
          <p className="text-lg">{item.translation}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">
          Feedback (required for invalid items)
        </label>
        <textarea 
          id="feedback"
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
          placeholder="Provide feedback on why this content is incorrect or needs improvement..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex justify-between">
        <button 
          className={`bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
            feedback.trim() === '' || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => handleValidate(false)}
          disabled={feedback.trim() === '' || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <X className="h-5 w-5 mr-2" /> Mark as Invalid
            </>
          )}
        </button>
        
        <button
          className={`bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => handleValidate(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" /> Mark as Valid
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function TranslationChallenge({ language }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challenges] = useState([
    {
      id: 1,
      english: "The sun rises in the east and sets in the west",
      difficulty: "medium"
    },
    {
      id: 2,
      english: "Education is the key to success in life",
      difficulty: "medium"
    },
    {
      id: 3,
      english: "Clean water is essential for good health",
      difficulty: "easy"
    }
  ]);
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [translation, setTranslation] = useState('');
  const [completed, setCompleted] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (translation.trim() === '') return;
    
    setIsSubmitting(true);
    
    try {
      // Submit translation to the API
      await contributionService.createTextContribution({
        original_text: challenge.english,
        translation: translation,
        type: 'challenge',
        difficulty: challenge.difficulty,
        language_code: language.code,
      });
      
      // Update local state
      setCompleted([...completed, challenges[currentChallenge].id]);
      
      // Move to next challenge or show completion
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setTranslation('');
      } else {
        // All challenges complete
        alert('All translation challenges completed! Thank you for your contributions.');
      }
    } catch (err) {
      console.error('Error submitting translation:', err);
      alert('Error submitting translation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const challenge = challenges[currentChallenge];
  const allComplete = completed.length === challenges.length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {allComplete ? (
        <div className="text-center py-8">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">All Challenges Complete!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your valuable translations in {language.name}. Your contributions help preserve the language.
          </p>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            onClick={() => window.location.reload()}
          >
            Try More Challenges
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-xs ${
                challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              Challenge {currentChallenge + 1} of {challenges.length}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Translate to {language.name}:
            </label>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-lg">{challenge.english}</p>
            </div>
            
            <label htmlFor="translation" className="block text-gray-700 font-medium mb-2">
              Your Translation:
            </label>
            <textarea 
              id="translation"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
              placeholder={`Enter your translation in ${language.name}...`}
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-gray-600 text-sm">
              Your translations help build quality language data
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              Submit & Continue <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function LanguagesPage({ onSelectLanguage }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [languages, setLanguages] = useState([]);
  const [languageStats, setLanguageStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fallback data in case API fails
  const FALLBACK_LANGUAGES = [
    { code: 'sw', name: 'Kiswahili' },
    { code: 'kik', name: 'Kikuyu' },
    { code: 'luo', name: 'Dholuo' },
    { code: 'kam', name: 'Kikamba' },
    { code: 'luy', name: 'Luhya' },
    { code: 'kal', name: 'Kalenjin' },
    { code: 'mer', name: 'Kimeru' },
    { code: 'som', name: 'Somali' },
    { code: 'mas', name: 'Maasai' },
    { code: 'tec', name: 'Teso' }
  ];
  
  useEffect(() => {
    const fetchLanguagesAndStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch languages with better error handling and debugging
        console.log('Fetching languages...');
        const langResponse = await languageService.getLanguages();
        
        // Debug: Log the full response
        console.log('Raw response:', langResponse);
        console.log('Response type:', typeof langResponse);
        console.log('Response data:', langResponse?.data);
        
        // Handle different response formats - prioritize paginated response first
        let languagesData;
        
        // Case 1: Response has .data property with paginated results (axios + Django REST)
        if (langResponse && langResponse.data && langResponse.data.results && Array.isArray(langResponse.data.results)) {
          languagesData = langResponse.data.results;
        }
        // Case 2: Direct paginated response (Django REST without axios wrapper)
        else if (langResponse && langResponse.results && Array.isArray(langResponse.results)) {
          languagesData = langResponse.results;
        }
        // Case 3: Response has .data property (axios format)
        else if (langResponse && langResponse.data && Array.isArray(langResponse.data)) {
          languagesData = langResponse.data;
        }
        // Case 4: Response is direct array (fetch API format)
        else if (Array.isArray(langResponse)) {
          languagesData = langResponse;
        }
        // Case 5: Response is an object with languages array
        else if (langResponse && Array.isArray(langResponse.languages)) {
          languagesData = langResponse.languages;
        }
        else {
          console.error('Unexpected response structure:', langResponse);
          throw new Error('Invalid response format from languages API - expected array or paginated results');
        }
        
        // Ensure we have an array
        if (!Array.isArray(languagesData)) {
          console.error('Languages data is not an array:', languagesData);
          throw new Error('Languages data is not an array');
        }
        
        console.log('Processed languages data:', languagesData);
        setLanguages(languagesData);
        
        // Fetch stats for each language
        const statsObj = {};
        for (const lang of languagesData) {
          try {
            console.log(`Fetching stats for ${lang.code}...`);
            const statResponse = await languageService.getLanguageStats(lang.code);
            
            console.log(`Stats response for ${lang.code}:`, statResponse);
            
            // Handle different response formats for stats
            let statsData;
            if (statResponse && statResponse.data) {
              statsData = statResponse.data;
            } else if (statResponse && typeof statResponse === 'object') {
              statsData = statResponse;
            } else {
              throw new Error('Invalid stats response format');
            }
            
            // Validate stats response and ensure numeric values
            if (statsData && typeof statsData === 'object') {
              statsObj[lang.code] = {
                contributors: Number(statsData.contributors) || 0,
                words: Number(statsData.words) || 0,
                sentences: Number(statsData.sentences) || 0
              };
            } else {
              // Use fallback stats if response is invalid
              statsObj[lang.code] = { 
                contributors: Math.floor(Math.random() * 150) + 10,
                words: Math.floor(Math.random() * 10000) + 1000,
                sentences: Math.floor(Math.random() * 6000) + 500
              };
            }
          } catch (err) {
            console.error(`Error fetching stats for ${lang.code}:`, err);
            // Fallback stats
            statsObj[lang.code] = { 
              contributors: Math.floor(Math.random() * 150) + 10,
              words: Math.floor(Math.random() * 10000) + 1000,
              sentences: Math.floor(Math.random() * 6000) + 500
            };
          }
        }
        
        setLanguageStats(statsObj);
        setError(null);
      } catch (err) {
        console.error('Error fetching languages:', err);
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack,
          cause: err.cause
        });
        
        // Determine error message based on error type
        let errorMessage = 'Failed to load language data. Please try again later.';
        
        // Check for common CORS indicators
        if (err.name === 'TypeError' && 
            (err.message.includes('fetch') || 
             err.message.includes('Failed to fetch') ||
             err.message.includes('Network request failed'))) {
          errorMessage = '🚫 CORS ERROR: Backend CORS settings are blocking the request. Check your Django CORS configuration.';
        } else if (err.message && err.message.toLowerCase().includes('cors')) {
          errorMessage = '🚫 CORS ERROR: Cross-origin request blocked. Update your backend CORS_ALLOWED_ORIGINS.';
        } else if (err.message && err.message.includes('JSON')) {
          errorMessage = 'Server returned invalid JSON data. Check your API response format.';
        } else if (err.name === 'SyntaxError' && err.message.includes('Unexpected token')) {
          errorMessage = '🚫 LIKELY CORS ERROR: Server returned HTML instead of JSON (probably a CORS preflight failure).';
        }
        
        // Log specific debugging info for CORS
        console.log('🔍 DEBUGGING INFO:');
        console.log('Frontend URL:', window.location.origin);
        console.log('API URL:', process.env.REACT_APP_API_URL || 'Not set');
        console.log('Error suggests CORS issue if it\'s a TypeError with "fetch" or "Failed to fetch"');
        
        setError(errorMessage);
        
        // Always use fallback data to prevent crashes
        setLanguages(FALLBACK_LANGUAGES);
        
        // Generate fallback stats for fallback languages
        const fallbackStats = {};
        FALLBACK_LANGUAGES.forEach(lang => {
          fallbackStats[lang.code] = {
            contributors: Math.floor(Math.random() * 150) + 10,
            words: Math.floor(Math.random() * 10000) + 1000,
            sentences: Math.floor(Math.random() * 6000) + 500
          };
        });
        setLanguageStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLanguagesAndStats();
  }, []);
  
  const categories = [
    { id: 'all', name: 'All Languages' },
    { id: 'bantu', name: 'Bantu' },
    { id: 'nilotic', name: 'Nilotic' },
    { id: 'cushitic', name: 'Cushitic' },
    { id: 'other', name: 'Other' }
  ];
  
  const getFilteredLanguages = () => {
    // Ensure languages is always an array
    const safeLanguages = Array.isArray(languages) ? languages : [];
    let filteredLangs = safeLanguages;
    
    if (selectedCategory !== 'all') {
      // In a real app, your API might provide language family information
      // For now, we'll simulate this based on language codes like before
      const languagesByCategory = {
        bantu: safeLanguages.filter(lang => ['sw', 'kik', 'kam', 'luy', 'mer'].includes(lang.code)),
        nilotic: safeLanguages.filter(lang => ['luo', 'kal', 'tec'].includes(lang.code)),
        cushitic: safeLanguages.filter(lang => ['som'].includes(lang.code)),
        other: safeLanguages.filter(lang => ['mas'].includes(lang.code))
      };
      
      filteredLangs = languagesByCategory[selectedCategory] || [];
    }
    
    if (searchTerm) {
      filteredLangs = filteredLangs.filter(lang => 
        lang.name && lang.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredLangs;
  };
  
  const filteredLanguages = getFilteredLanguages();
  
  // Get language stats from API or use fallback - with safe defaults
  const getLanguageStats = (code) => {
    const stats = languageStats[code] || { contributors: 0, words: 0, sentences: 0 };
    
    // Ensure all stats are numbers to prevent toLocaleString errors
    return {
      contributors: Number(stats.contributors) || 0,
      words: Number(stats.words) || 0,
      sentences: Number(stats.sentences) || 0
    };
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Explore Languages</h2>
      
      {isLoading && (
        <div className="text-center py-4 mb-8">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading languages...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
          <div className="mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <div className="relative mb-4 md:mb-0 md:mr-6 md:flex-grow">
            <input
              type="text"
              placeholder="Search languages..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLanguages.map(lang => {
          const stats = getLanguageStats(lang.code);
          
          return (
            <div key={lang.code} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{lang.name}</h3>
                <p className="text-gray-500 mb-4">Language code: {lang.code}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{stats.contributors}</div>
                    <div className="text-sm text-gray-500">Contributors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{stats.words.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{stats.sentences.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Sentences</div>
                  </div>
                </div>
                
                <button
                  onClick={() => onSelectLanguage(lang)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Contribute to {lang.name} <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {!isLoading && filteredLanguages.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg mb-4">No languages found matching "{searchTerm}"</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setIsLoading(true);
      try {
        // Fetch leaderboard data
        try {
          // Replace this endpoint with your actual API endpoint
          const leaderboardResponse = await fetch('/api/leaderboard/');
          const leaderboardData = await leaderboardResponse.json();
          setLeaderboard(leaderboardData);
        } catch (err) {
          console.error('Error fetching leaderboard:', err);
          // Fallback to dummy data
          setLeaderboard(LEADERBOARD);
        }
        
        // Fetch recent activity
        try {
          // Replace this endpoint with your actual API endpoint
          const activityResponse = await fetch('/api/activity/');
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        } catch (err) {
          console.error('Error fetching activity:', err);
          // Fallback to dummy data
          setRecentActivity([
            { name: "John K.", action: "added 15 new phrases", language: "Kiswahili", time: "2 hours ago" },
            { name: "Mary W.", action: "recorded 8 audio samples", language: "Gikuyu", time: "3 hours ago" },
            { name: "Abdi M.", action: "translated 12 sentences", language: "Somali", time: "5 hours ago" },
            { name: "Emily N.", action: "validated 25 contributions", language: "Dholuo", time: "yesterday" },
            { name: "Samuel O.", action: "completed 3 challenges", language: "Luhya", time: "yesterday" }
          ]);
        }
        
        // Fetch events
        try {
          // Replace this endpoint with your actual API endpoint
          const eventsResponse = await fetch('/api/events/');
          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        } catch (err) {
          console.error('Error fetching events:', err);
          // Fallback to dummy data
          setEvents([
            { title: "Virtual Language Workshop", date: "August 15, 2023", description: "Learn how to effectively contribute translations and recordings" },
            { title: "Nairobi Language Meetup", date: "August 23, 2023", description: "In-person gathering of language enthusiasts and contributors" },
            { title: "Kalenjin Focus Group", date: "September 3, 2023", description: "Special session to improve Kalenjin language resources" },
            { title: "Translation Sprint", date: "September 10, 2023", description: "24-hour online event to translate as many sentences as possible" }
          ]);
        }
        
      } catch (err) {
        console.error('Error fetching community data:', err);
        setError('Failed to load community data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunityData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Our Community</h2>
      
      {isLoading ? (
        <div className="text-center py-4 mb-8">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
          {error}
          <button 
            className="ml-4 bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Leaderboard Section */}
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Award className="h-6 w-6 text-yellow-500 mr-2" /> Top Contributors
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Rank</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Name</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Language</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500">Contributions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {leaderboard.map((contributor, idx) => (
                        <tr key={idx} className={idx < 3 ? 'bg-yellow-50' : ''}>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className={`flex h-8 w-8 rounded-full items-center justify-center font-bold ${
                              idx === 0 ? 'bg-yellow-400 text-white' :
                              idx === 1 ? 'bg-gray-300 text-gray-800' :
                              idx === 2 ? 'bg-amber-700 text-white' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {idx + 1}
                            </div>
                          </td>
                          <td className="py-3 px-4">{contributor.name}</td>
                          <td className="py-3 px-4">{contributor.language}</td>
                          <td className="py-3 px-4">{contributor.contributions.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          
          {/* Recent Activity */}
          <section className="mb-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" /> Recent Contributions
              </h3>
              
              <ul className="divide-y">
                {recentActivity.map((activity, idx) => (
                  <ActivityItem 
                    key={idx}
                    name={activity.name} 
                    action={activity.action} 
                    language={activity.language} 
                    time={activity.time} 
                  />
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" /> Community Events
              </h3>
              
              <ul className="divide-y">
                {events.map((event, idx) => (
                  <EventItem 
                    key={idx}
                    title={event.title} 
                    date={event.date} 
                    description={event.description} 
                  />
                ))}
              </ul>
            </div>
          </section>
          
          {/* Join Community */}
          <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <div className="md:flex items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-3">Join Our Community</h3>
                <p className="text-purple-100">
                  Connect with fellow language enthusiasts, participate in events, and help shape the future of language preservation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Join Discord
                </button>
                <button className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-400 transition-colors border border-purple-400">
                  Join Telegram Group
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function ActivityItem({ name, action, language, time }) {
  return (
    <li className="py-3">
      <div className="flex items-center">
        <div className="mr-3 flex-shrink-0">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <p className="text-sm">
            <span className="font-medium">{name}</span> {action} in <span className="font-medium">{language}</span>
          </p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    </li>
  );
}

function EventItem({ title, date, description }) {
  return (
    <li className="py-3">
      <div className="mb-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </li>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">About MyLugha</h2>
      
      {/* Mission Section */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-700 mb-6">
            MyLugha is dedicated to the preservation, promotion, and digitization of Kenya's diverse linguistic heritage. 
            We believe that language is not just a means of communication but a carrier of culture, 
            identity, and knowledge that should be preserved for future generations.
          </p>
          <p className="text-gray-700 mb-6">
            Through community-driven data collection, we aim to build comprehensive linguistic resources 
            for Kenyan languages that can be used to develop AI systems, educational tools, and 
            documentation that will ensure these languages remain vibrant and accessible in the digital age.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <MissionCard 
              title="Preserve" 
              description="Document and digitize Kenya's languages before they are lost to time" 
              icon={<Book className="h-8 w-8 text-green-500" />}
            />
            <MissionCard 
              title="Empower" 
              description="Enable communities to use technology in their native languages" 
              icon={<Users className="h-8 w-8 text-blue-500" />}
            />
            <MissionCard 
              title="Innovate" 
              description="Build AI systems that understand and generate Kenyan languages" 
              icon={<Globe className="h-8 w-8 text-purple-500" />}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6">How MyLugha Works</h3>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h4 className="text-xl font-bold mb-4">Community-Driven Data Collection</h4>
              <p className="text-gray-700 mb-4">
                MyLugha relies on the contributions of native speakers and language enthusiasts 
                who provide words, phrases, sentences, and translations in their language.
              </p>
              <p className="text-gray-700 mb-4">
                This crowdsourced approach allows us to gather authentic, diverse language data 
                that represents how people actually speak and write these languages in real life.
              </p>
              <p className="text-gray-700">
                All contributions are validated by multiple community members to ensure accuracy 
                before being added to our language datasets.
              </p>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-xl font-bold mb-4">Our Process</h4>
                <ul className="space-y-4">
                  <ProcessStep 
                    number="1" 
                    title="Contribute" 
                    description="Community members submit words, phrases, and recordings in their language"
                  />
                  <ProcessStep 
                    number="2" 
                    title="Validate" 
                    description="Native speakers verify the accuracy of contributions"
                  />
                  <ProcessStep 
                    number="3" 
                    title="Build" 
                    description="We use validated data to create language datasets"
                  />
                  <ProcessStep 
                    number="4" 
                    title="Share" 
                    description="Datasets power AI systems, apps, and research for language preservation"
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Our Team</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamMember 
            name="Wangari Muthoni" 
            role="Founder & Director" 
            bio="Computational linguist with 10+ years experience in NLP for African languages"
          />
          <TeamMember 
            name="James Odhiambo" 
            role="Technology Lead" 
            bio="AI engineer specializing in low-resource language model development"
          />
          <TeamMember 
            name="Amina Hassan" 
            role="Community Manager" 
            bio="Multilingual advocate for language preservation across East Africa"
          />
          <TeamMember 
            name="David Kiprop" 
            role="Research Lead" 
            bio="PhD in linguistics with focus on Nilotic and Bantu language families"
          />
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Our Partners</h3>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="bg-gray-200 h-16 rounded-lg mb-2 flex items-center justify-center">
                Partner Logo
              </div>
              <p className="text-sm font-medium">Kenya National Archives</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-16 rounded-lg mb-2 flex items-center justify-center">
                Partner Logo
              </div>
              <p className="text-sm font-medium">Mozilla Foundation</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-16 rounded-lg mb-2 flex items-center justify-center">
                Partner Logo
              </div>
              <p className="text-sm font-medium">University of Nairobi</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-16 rounded-lg mb-2 flex items-center justify-center">
                Partner Logo
              </div>
              <p className="text-sm font-medium">Digital Africa Initiative</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Get in Touch</h4>
              <p className="text-gray-700 mb-4">
                Have questions about MyLugha? Want to partner with us or support our mission?
                We'd love to hear from you!
              </p>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@mylugha.org</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-gray-600">Nairobi Innovation Hub, Westlands, Nairobi</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+254 712 345 678</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Send Us a Message</h4>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Your email"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea 
                    id="message"
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-y"
                    placeholder="Your message"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MissionCard({ icon, title, description }) {
  return (
    <div className="text-center p-4">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <li className="flex">
      <div className="mr-4 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center">
          {number}
        </div>
      </div>
      <div>
        <h5 className="font-bold text-gray-800">{title}</h5>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </li>
  );
}

function TeamMember({ name, role, bio }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <User className="h-16 w-16 text-gray-400" />
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold mb-1">{name}</h4>
        <p className="text-green-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </div>
    </div>
  );
}

// Add missing imports
// import { ChevronLeft, Mail, MapPin, Phone, Play } from 'lucide-react';