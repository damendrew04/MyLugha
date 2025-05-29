# MyLugha Language Management

This document provides instructions on how to manage languages in the MyLugha application.

## Adding Kenyan Languages

The application includes a Django management command to add a comprehensive list of Kenyan languages to the database.

### To run the command:

```bash
# Navigate to the server directory
cd C:\Users\Admin\MyLugha\server

# Activate your virtual environment (if using one)
# Example: 
# venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Unix/MacOS

# Run the management command
python manage.py add_kenyan_languages
```

This will add 30 Kenyan languages to the database, including:
- The 10 original languages (Kiswahili, Gikuyu, Dholuo, etc.)
- 20 additional languages covering all major language families in Kenya

### Language Categories

Languages are categorized into four main linguistic groups:
- **Bantu**: Languages in the Bantu family (e.g., Kiswahili, Kikuyu, Kamba)
- **Nilotic**: Languages in the Nilotic family (e.g., Dholuo, Kalenjin, Maasai)
- **Cushitic**: Languages in the Cushitic family (e.g., Somali, Rendille, Oromo)
- **Other**: Languages that don't fit into the above categories

### Custom Language Addition

If you need to add more languages or customize the existing ones, you can modify the `add_kenyan_languages.py` file. Each language entry should include:

- `code`: ISO 639 language code (or custom code if official code doesn't exist)
- `name`: The name of the language
- `category`: One of 'bantu', 'nilotic', 'cushitic', or 'other'
- `description`: A brief description of the language

Example of adding a new language:

```python
# Add to the languages list in add_kenyan_languages.py
{'code': 'new_code', 'name': 'New Language Name', 'category': 'category_name', 'description': 'Description of the language.'}
```

## Language Model Structure

The Language model includes the following fields:
- `name`: Name of the language
- `code`: Unique code for the language
- `category`: Language family category
- `description`: Brief description of the language
- `contributors_count`: Number of contributors for this language
- `words_count`: Number of words added for this language
- `sentences_count`: Number of sentences added for this language
- `audio_count`: Number of audio recordings for this language
- `created_at`: When the language was added
- `updated_at`: When the language was last updated
