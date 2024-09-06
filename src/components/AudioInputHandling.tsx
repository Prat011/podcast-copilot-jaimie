import { convertBlobToBase64, ensureSingleValidAudioTrack, getAudioStream, getBrowserSupportedMimeType } from 'hume';
import { Hume, HumeClient } from 'hume';

// The recorder responsible for recording the audio stream to be prepared as the audio input
let recorder: MediaRecorder | null = null;
// The stream of audio captured from the user's microphone
let audioStream: MediaStream | null = null;
// MIME type supported by the browser the application is running in
const mimeType: string = (() => {
  const result = getBrowserSupportedMimeType();
  return result.success ? result.mimeType : 'audio/webm'; // Fallback to a default MIME type
})();

// Define function for capturing audio
async function captureAudio(socket: Hume.empathicVoice.chat.ChatSocket): Promise<void> {
  try {
    // Prompts user for permission to capture audio, obtains media stream upon approval
    audioStream = await getAudioStream();
    // Ensure there is only one audio track in the stream
    ensureSingleValidAudioTrack(audioStream);
    
    // Instantiate the media recorder with the correct MIME type
    recorder = new MediaRecorder(audioStream, { mimeType });

    // Callback for when recorded chunk is available to be processed
    recorder.ondataavailable = async ({ data }) => {
      // IF size of data is smaller than 1 byte then do nothing
      if (data.size < 1) return;

      // Base64 encode audio data
      const encodedAudioData = await convertBlobToBase64(data);
      
      // Define the audio_input message JSON
      const audioInput: Omit<Hume.empathicVoice.AudioInput, 'type'> = {
        data: encodedAudioData,
      };
      
      // Send audio_input message
      socket.sendAudioInput(audioInput);
    };

    // Capture audio input at a rate of 100ms (recommended for web)
    const timeSlice = 100;
    recorder.start(timeSlice);
  } catch (error) {
    console.error('Error capturing audio:', error);
  }
}

// Define a WebSocket open event handler to capture audio
async function handleWebSocketOpenEvent(socket: Hume.empathicVoice.chat.ChatSocket): Promise<void> {
  // Place logic here which you would like invoked when the socket opens
  console.log('Web socket connection opened');
  await captureAudio(socket);
}

export {
  handleWebSocketOpenEvent,
  captureAudio,
};
