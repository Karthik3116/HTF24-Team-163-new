


from flask import Flask, request, jsonify
import yt_dlp
import whisper
from pydub import AudioSegment
import os
import uuid
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

API_KEY = "AIzaSyBBe7ywT7emE1MOC_fg5NUClAk4Y6jvTmo" 

mock_db = {}

@app.route('/save_chat', methods=['POST'])
def save_chat():
    data = request.json
    chat_id = data.get("chat_id")
    question = data.get("question")
    answer = data.get("answer")

    if not chat_id or not question or not answer:
        return jsonify({"error": "Chat ID, question or answer not provided."}), 400

    # Store in mock database
    if chat_id not in mock_db:
        mock_db[chat_id] = []
    
    mock_db[chat_id].append({"question": question, "answer": answer})

    return jsonify({"message": "Chat saved successfully."}), 200

@app.route('/get_chats/<chat_id>', methods=['GET'])
def get_chats(chat_id):
    
    chats = mock_db.get(chat_id, [])
    return jsonify(chats), 200



def download_audio_from_youtube(url):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': 'video.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return 'video.mp3'


def split_audio_in_memory(file_path, chunk_length_ms=180000):
    audio = AudioSegment.from_file(file_path)
    chunks = [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]
    return chunks


def transcribe_chunks(chunks, model):
    transcriptions = []
    for chunk in chunks:
        temp_filename = f"temp_chunk_{uuid.uuid4()}.mp3" 
        chunk.export(temp_filename, format="mp3")  
        result = model.transcribe(temp_filename)  
        transcriptions.append(result["text"])
        os.remove(temp_filename)  
    return " ".join(transcriptions)

def summarize_text(text):
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [{
                "text": (
                    "Summarize the following content in about one-third of its original length. Focus on key points and simplify for clarity, keeping the explanation concise and easy to understand"
                    "The content has already been explained by someone in the video, and now I will explain it again "
                    "with more clarity and detail for a better understanding. The video is discussing the following key points:\n\n"
                    "Generate the output context length which is 1.5/3rd of the original text length"
                    f"Content to summarize: {text}\n\n"
                    "As I re-explain this, I'll break it down in a simple and clear way for you to grasp the main ideas easily.\n\n"
                    "Teacher: "
                )
            }]
        }]
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        json_response = response.json()
        return json_response.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
    else:
        return f"Error: {response.status_code} - {response.text}"

@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    data = request.json
    video_url = data.get("url")

    if not video_url:
        return jsonify({"error": "No URL provided."}), 400


    audio_path = download_audio_from_youtube(video_url)


    chunks = split_audio_in_memory(audio_path)


    model = whisper.load_model("small")
    transcribed_text = transcribe_chunks(chunks, model)


    summary = summarize_text(transcribed_text)


    os.remove(audio_path)

    return jsonify({"summary": summary})


@app.route('/chat_with_summary', methods=['POST'])
def chat_with_summary():
    data = request.json
    question = data.get("question")
    summary = data.get("summary")

    if not question or not summary:
        return jsonify({"error": "Question or summary not provided."}), 400


    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'
    
    headers = {'Content-Type': 'application/json'}
    request_data = {
        "contents": [{
            "parts": [{
                "text": (
                    f'''You are an AI summarizer for YouTube video transcripts. Your task is to create a concise summary that effectively captures the main points of the content. Follow these guidelines:

                    Summarization:

                    - Condense the provided transcript to 1.5 to 3 times shorter while retaining key information.
                    - Use clear and simple language for easy understanding.

                    User Questions:

                    - If the user asks a question related to the summary, answer based on the summary content.
                    - If the question is unrelated, respond: "The provided question doesn't belong to the video provided."

                    Summary: {summary}. User question: {question}. 
                    Provide an answer based on the summary; if the question is not related to the summary, 
                    respond with 'the provided question doesn't belong to the video provided.'
                    '''
                )

            }]
        }]
    }

    try:
        response = requests.post(url, headers=headers, json=request_data)


        print("Response Status Code:", response.status_code)
        print("Response Content:", response.text)


        if response.status_code == 200:
            json_response = response.json()

            print("JSON Response:", json_response)


            answer = json_response.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            if not answer:
                return jsonify({"error": "No answer returned from the AI."}), 500

            return jsonify({"answer": answer})

        else:
            return jsonify({"error": f"Error: {response.status_code} - {response.text}"}), response.status_code

    except requests.exceptions.SSLError as ssl_err:
        return jsonify({"error": "SSL Error: " + str(ssl_err)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500


    # return jsonify({"answer": ai_response})




if __name__ == '__main__':
    app.run(debug=True)
