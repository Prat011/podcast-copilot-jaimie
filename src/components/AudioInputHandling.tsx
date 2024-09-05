import { convertBlobToBase64, ensureSingleValidAudioTrack, getAudioStream, getBrowserSupportedMimeType } from 'hume';
import { Hume, HumeClient } from 'hume';

// the recorder responsible for recording the audio stream to be prepared as the audio input
let recorder: MediaRecorder | null = null;
// the stream of audio captured from the user's microphone
let audioStream: MediaStream | null = null;
// mime type supported by the browser the application is running in
const mimeType: MimeType = (() => {
  const result = getBrowserSupportedMimeType();
  return result.success ? result.mimeType : MimeType.WEBM;
})();

// define function for capturing audio
async function captureAudio(socket: HumeClient.empathicVoice.chat.Socket): Promise<void> {
  // prompts user for permission to capture audio, obtains media stream upon approval
  audioStream = await getAudioStream();
  // ensure there is only one audio track in the stream
  ensureSingleValidAudioTrack(audioStream);
  // instantiate the media recorder
  recorder = new MediaRecorder(audioStream, { mimeType });
  // callback for when recorded chunk is available to be processed
  recorder.ondataavailable = async ({ data }) => {
    // IF size of data is smaller than 1 byte then do nothing
    if (data.size < 1) return;
    // base64 encode audio data
    const encodedAudioData = await convertBlobToBase64(data);
    // define the audio_input message JSON
    const audioInput: Omit<Hume.empathicVoice.AudioInput, 'type'> = {
      data: encodedAudioData,
    };
    // send audio_input message
    socket.sendAudioInput(audioInput);
  };
  // capture audio input at a rate of 100ms (recommended for web)
  const timeSlice = 100;
  recorder.start(timeSlice);
}

// define a WebSocket open event handler to capture audio
async function handleWebSocketOpenEvent(socket: HumeClient.empathicVoice.chat.Socket): Promise<void> {
  // place logic here which you would like invoked when the socket opens
  console.log('Web socket connection opened');
  await captureAudio(socket);
}

export {
  handleWebSocketOpenEvent,
  captureAudio,
};