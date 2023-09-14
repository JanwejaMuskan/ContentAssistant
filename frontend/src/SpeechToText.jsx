import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-FXR9GaVklzHzMSzGxMfLvvEh",
  apiKey: "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",
});
configuration.baseOptions.headers = {
  Authorization: "Bearer " + "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",
};
const openai = new OpenAIApi(configuration);

function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognition = new window.webkitSpeechRecognition();

  recognition.continuous = true;

  recognition.onstart = () => {a
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const text = result[0].transcript;
    setTranscript(text);
    console.log("Transcript", text);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const startListening = () => {
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
  };

  const transcribeAudio = async () => {
    try {
      console.log("New Transcript:", transcript);
      console.log("New Text:", text);
      if (transcript) {
        const response = await openai.Audio.transcribe("whisper-1", { audio: transcript });
        console.log("Transcription:", response.data.transcription);
        setTranscript(response.data.transcription); // Set the transcript text
      } else {
        console.error("No audio transcript to transcribe.");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };
  

  // const transcribeAudio = async () => {
  //   try {
  //       console.log("New Transcipt:", transcript);
  //       console.log("New Text:", text);
  //     if (transcript) {
  //       const response = await openai.Audio.transcribe("whisper-1", { audio: transcript });
  //       console.log("Transcription:", response.data.transcription);
  //     } else {
  //       console.error("No audio transcript to transcribe.");
  //     }
  //   } catch (error) {
  //     console.error("Error transcribing audio:", error);
  //   }
  // };

  return (
    <div>
      <h1>Voice-to-Text</h1>
      <button onClick={startListening} disabled={isListening}>
        Start Recording
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Recording
      </button>
      <p>Transcript: {transcript}</p>
      <button onClick={transcribeAudio}>Transcribe Audio</button>
    </div>
  );
}

export default SpeechToText;
