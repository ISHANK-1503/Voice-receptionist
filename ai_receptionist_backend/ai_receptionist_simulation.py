import assemblyai as aai
from openai import OpenAI
from elevenlabs import ElevenLabs, play
from dotenv import load_dotenv
import os

# ====== CONFIGURATION ======
load_dotenv()

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# ====== INITIALIZATION ======
aai.settings.api_key = ASSEMBLYAI_API_KEY
openai_client = OpenAI(api_key=OPENAI_API_KEY)
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# ====== STEP 1: TRANSCRIBE AUDIO ======
def transcribe_audio(file_path):
    print("🎤 Transcribing audio...")
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(file_path)
    print("🗣️ Customer said:", transcript.text)
    return transcript.text

# ====== STEP 2: GENERATE RESPONSE USING OPENAI ======
def generate_response(user_input):
    print("🧠 Generating AI receptionist response...")
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI receptionist for a small business. Greet politely, confirm details, and assist with appointment booking."},
            {"role": "user", "content": user_input}
        ]
    )
    ai_reply = response.choices[0].message.content.strip()
    print("💬 Receptionist:", ai_reply)
    return ai_reply

# ====== STEP 3: CONVERT TEXT TO SPEECH ======
text = "Hello! This is your AI receptionist speaking. How can I help you today?"

# Convert text to speech
audio = client.text_to_speech.convert(
    voice_id="XrExE9yKIg1WjnnlVkGX",   # 'Rachel' or 'Bella' voice ID
    model_id="eleven_turbo_v2",
    text=text
)

# Write the audio content to an MP3 file
with open("output.mp3", "wb") as f:
    for chunk in audio:
        if chunk:
            f.write(chunk)


# Optionally play the generated audio
#play(audio)

print("✅ Audio saved as 'ai_response.mp3' and played successfully.")



# ====== MAIN FLOW ======
def main():
    file_path = input("Enter the path to your audio file: ")

    customer_text = transcribe_audio(file_path)
    ai_reply = generate_response(customer_text)
    speak_text(ai_reply)

if __name__ == "__main__":
    main()
