import os
import sys
import speech_recognition as sr

from google.cloud import translate
from google.cloud import texttospeech

path = os.path.dirname(os.path.abspath(__file__))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'credentials/translang-234304-576795a36648.json'


#available codess
#https://developers.google.com/admin-sdk/directory/v1/languages
def main():
    inlang = "en"
    target = "es"
    inps = len(sys.argv)
    if (inps < 1):
        print("usage: python TransLang.py <aud> [inp] [out]\n\n")
        print("Takes in audio in 'inp' language and spits out a translated\
              mp3 file in 'out'  language")
        print("positional arguments: \naud\tA wav file containing audio in\
               input language\n\n")
        print("optional arguments: \ninp\tinput language code (default is English (en))\n")
        print("out\toutput language code (default is Spanish (es))\n")
        return -1

    if inps == 3:
        inlang = sys.argv[1]
        target = sys.argv[2]
    elif inps == 2:
        inlang = sys.argv[1]

    r = sr.Recognizer()
    mic = sr.Microphone()
    with mic as source:
        #r.adjust_for_ambient_noise(source)
        audio = r.listen(source)
    text = r.recognize_google(audio, language=inlang)

    #Initiate a translate client
    translate_client = translate.Client()

    translation = translate_client.translate(
        text,
        target_language=target)


    #Initiate tts client
    speech_client = texttospeech.TextToSpeechClient()

    #Set the text input to be synthesized
    synthesis_input = texttospeech.types.SynthesisInput(text=translation['translatedText'])

    #Build the voice request,, select language code and the ssml voice gender ("neutral")
    voice = texttospeech.types.VoiceSelectionParams(
            language_code='es-US',
            ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

    #Select the type of audio file
    audio_config = texttospeech.types.AudioConfig(
            audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    #Perform the text-to-speech request on the text input with
    #the selected voice parameters and audio file type
    response = speech_client.synthesize_speech(synthesis_input, voice, audio_config)

    #The response's audio_content is binary
    with open(path+'/public/output.mp3', 'wb') as out:
        #Write the response to the output file.
        out.write(response.audio_content)
        print(u'{{text: {}, translation: {}, outputFile: {}}}'.format(text, translation['translatedText'], "output.mp3"))
        sys.stdout.flush()


if __name__ == "__main__":
    main()
