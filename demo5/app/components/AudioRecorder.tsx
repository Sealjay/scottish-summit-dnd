import React, { useState, useRef } from "react";

interface AudioRecorderProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  sendAudio: (audio: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  setIsRecording,
  sendAudio,
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioContext = useRef<AudioContext | null>(null);
  const audioStream = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioData = useRef<Float32Array[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
        },
      });

      audioContext.current = new AudioContext({ sampleRate: 16000 });
      audioStream.current =
        audioContext.current.createMediaStreamSource(stream);
      const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

      audioStream.current.connect(processor);
      processor.connect(audioContext.current.destination);

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        audioData.current.push(new Float32Array(channelData));
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (audioContext.current && audioStream.current) {
      audioStream.current.disconnect();
      audioContext.current.close();

      const flatAudioData = audioData.current.reduce(
        (acc, val) => acc.concat(Array.from(val)),
        [] as number[]
      );
      const int16Data = new Int16Array(flatAudioData.map((n) => n * 32767));

      const audioBlob = new Blob([int16Data], { type: "audio/pcm" });
      sendAudio(audioBlob);

      audioData.current = [];
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`btn-record rounded font-medieval ${
        isRecording ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default AudioRecorder;
