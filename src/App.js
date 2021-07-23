import "./index.css";
import React, { useState, useEffect } from "react";

import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useSpeechSynthesis } from "react-speech-kit";
const axios = require("axios");
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
function App() {
  const onEnd = () => {
    setIsSpeaking((isSpeaking) => false);
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });
  const [statusText, setStatusText] = useState(
    "Your results will be shown here"
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [desiredIntent, setDesiredIntent] = useState("");

  const speechConfig = speechsdk.SpeechConfig.fromSubscription(
    "e4d43c65621641c3b4bcd80c978d9d58",
    "southeastasia"
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();

  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
  const descriptions = {
    GoActiveSG: "You can go to the ActiveSG Park",
    GoClusiaCove: "You can go to Clusia Cove",
    GoForestRamble: "You can go to Forest Ramble",
    GoNeramStreams: "You can go to Neram Streams",
    GoPassionWave: "You can go to Passion Wave",
    None: "I am sorry, but I could not understand your question.",
    GoRasauWalk: "You can go to Rasau Walk",
    IntroSelf: "Hello, I am here to guide you aroung Jurong Lake Gardens",
  };

  function speakDesiredIntent(desiredIntent) {
    console.log(desiredIntent);
    if (desiredIntent !== "") {
      setIsSpeaking((isSpeaking) => true);
      speak({
        text: descriptions[desiredIntent],
        voices: voices[0],
        rate: 0.9,
        pitch: 1.0,
      });
    }
    setIsSpeaking((isSpeaking) => false);
  }

  async function sttFromMic() {
    setUserIsSpeaking((userIsSpeaking) => true);
    setStatusText((statusText) => "Rosy is listening");
    recognizer.recognizeOnceAsync((result) => {
      console.log(result);
      if (result.reason !== ResultReason.RecognizedSpeech) {
        setUserIsSpeaking((userIsSpeaking) => false);

        setStatusText(
          (statusText) =>
            "The chatbot is unable to recognise what you have said."
        );
      }
    });

    recognizer.recognizing = (s, e) => {
      setStatusText((statusText) => "The chatbot is listening");
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    recognizer.recognized = (s, e) => {
      let topIntentFromSpeech;
      setUserIsSpeaking((userIsSpeaking) => false);

      setStatusText((statusText) => "The chatbot is thinking..");

      if (e.result.reason === ResultReason.RecognizedSpeech) {
        axios
          .post(
            "https://southeastasia.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/4a96bb39-9f6e-47dc-9b27-bab93d286617/slots/staging/predict",
            null,
            {
              params: {
                "subscription-key": "5b77dd952e04456cb7ca8fe65bf409b1",
                query: e.result.text,
              },
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((response) => {
            topIntentFromSpeech = response.data.prediction.topIntent;
            console.log(response.data);
            setStatusText("The chatbot has finished thinking");
            setDesiredIntent((desiredIntent) => topIntentFromSpeech);
            speakDesiredIntent(topIntentFromSpeech);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (e.result.reason === ResultReason.NoMatch) {
        setStatusText(
          (statusText) => "Rosy could not pick up what you just said"
        );
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);
      setStatusText((statusText) => "Chatbot has been cancelled");
      setUserIsSpeaking((userIsSpeaking) => false);

      recognizer.stopContinuousRecognitionAsync();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log("\n    Session stopped event.");
      setStatusText((statusText) => "Chatbot has been stopped");
      setUserIsSpeaking((userIsSpeaking) => false);

      recognizer.stopContinuousRecognitionAsync();
    };
  }
  return (
    <div className="h-screen w-screen bg-green-50">
      <div className="block py-5">
        <h1 className="text-center  text-9xl font-black ">
          Jurong Lake Gardens
        </h1>
      </div>
      <div className="block py-5">
        <p className="text-center  text-6xl font-semibold ">{statusText}</p>
      </div>

      <div className="block py-5">
        <p className="text-center  text-6xl font-semibold ">
          {desiredIntent && descriptions[desiredIntent]}
        </p>
      </div>

      <div className="block py-5">
        {desiredIntent && (
          <img
            src={require(`./images/${desiredIntent}.jpg`).default}
            alt="Icon for result"
            className="w-auto h-auto mx-auto"
          ></img>
        )}
      </div>
      <div className="flex items-center justify-center py-5 ">
        <button
          className={
            userIsSpeaking || isSpeaking
              ? "rounded-lg  p-8 m-8 bg-gray-300 text-black w-5/12"
              : "rounded-lg  p-8 m-8 bg-blue-300 text-black w-7/12"
          }
          type="button"
          onClick={() => sttFromMic()}
          disabled={userIsSpeaking || isSpeaking}
        >
          <p className="text-9xl text-black font-semibold">Start chatting</p>
        </button>
      </div>
    </div>
  );
}

export default App;
