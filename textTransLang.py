import os
import sys
import speech_recognition as sr

from google.cloud import translate
from google.cloud import texttospeech

path = os.path.dirname(os.path.abspath(__file__))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path+'/credentials/translang-234304-576795a36648.json'

def main():
    inlang = "en"
    target = "es"
    inps = len(sys.argv)
    if (inps < 2):
        print("usage: python TransLang.py <text> [inp] [out]\n\n")
        print("Takes in a wav file in 'inp' language and spits out a translated\
              mp3 file in 'out'  language")
        print("positional arguments: \naud\tA wav file containing audio in\
               input language\n\n")
        print("optional arguments: \ninp\tinput language code (default is English (en))\n")
        print("out\toutput language code (default is Spanish (es))\n")
        return -1

    if inps == 4:
        inlang = sys.argv[2]
        target = sys.argv[3]
    elif inps == 3:
        inlang = sys.argv[2]

    text = sys.argv[1]

    #Initiate a translate client
    translate_client = translate.Client()

    translation = translate_client.translate(
        text,
        target_language=target
    )


    with open(path+'/public/translation.txt', 'w') as out:
        #Write the response to the output file.
        out.write(translation['translatedText'])
        print(u'{{text: {}, translation: {}, outputFile: {}}}'.format(text, translation['translatedText'], "translation.txt"))
        sys.stdout.flush()




if __name__ == "__main__":
    main()
