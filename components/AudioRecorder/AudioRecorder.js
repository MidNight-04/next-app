import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop, FaPlay, FaDownload } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const AudioRecorder = ({ onAudioRecorded }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);

      onAudioRecorded({ blob: audioBlob, url: url });
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <div className="flex justify-center items-center space-x-4">
        {recording ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white p-4  rounded-full flex items-center"
          >
            <FaStop />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-secondary text-primary p-4 rounded-full flex items-center"
          >
            <FaMicrophone />
          </button>
        )}
      </div>

      {/* {audioURL && (
        <div className="flex flex-row items-center justify-center gap-2">
          <audio controls src={audioURL} />
          <div className="flex justify-center items-center">
            <a
              href={audioURL}
              download="recording.wav"
              className="bg-secondary text-primary p-4 rounded-full flex items-center"
            >
              <FaDownload />
            </a>
            <button
              onClick={() => setAudioURL("")}
              className="bg-secondary text-primary p-4 rounded-full flex items-center"
            >
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AudioRecorder;
