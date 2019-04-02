import os
import sys
from google.cloud import translate
from google.cloud import texttospeech

path = os.path.dirname(__file__)

def main():
    if(len(sys.argv) != 2):
        print("usage: python TransLang.py <text>")
        return -1
    text = sys.argv[1]

    #Initiate a translate client
    translate_client = translate.Client()

    target = 'es'

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
    with open('public/output.mp3', 'wb') as out:
        #Write the response to the output file.
        out.write(response.audio_content)
        print(u'{{text: {}, translation: {}, outputFile: {}}}'.format(text, translation['translatedText'], "output.mp3"))
        sys.stdout.flush()


if __name__ == "__main__":
    main()
