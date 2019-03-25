Test Server: https://trans-lang.herokuapp.com/


To get it to run locally, you'll need to do 2 things:
1. Run npm install
2. Run pip install -r requirements.txt

Then you can npm start and test it out.

As for the code, there are 2 important files:
- TransLang.py - a python program that takes in english text and outputs an mp3 file of spanish audio. Usage: python Translan.py "text to translate"
- api/controllers/TransLang.js - Javascript program that handles the api call to /api/translate. It takes the text as a query then calls the python program and then serves the mp3 file created. 
