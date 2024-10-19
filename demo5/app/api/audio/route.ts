import { NextRequest, NextResponse } from 'next/server';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY!,
    process.env.AZURE_SPEECH_REGION!
);

export async function POST(req: NextRequest) {
    if (!req.body) {
        return NextResponse.json({ error: 'No body provided' }, { status: 400 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const messagesJson = formData.get('messages') as string;

    if (!audioFile || !messagesJson) {
        return NextResponse.json({ error: 'Missing audio file or messages' }, { status: 400 });
    }

    try {
        console.log("Starting audio processing");
        // Convert File to ArrayBuffer
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioData = new Int16Array(arrayBuffer);

        // Create the push stream
        const pushStream = sdk.AudioInputStream.createPushStream();

        // Push the audio data to the stream
        pushStream.write(audioData.buffer);
        pushStream.close();

        // Create the audio config
        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

        // Create the speech recognizer
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        // Start the recognition
        const result = await new Promise<sdk.SpeechRecognitionResult>((resolve, reject) => {
            recognizer.recognizeOnceAsync(
                (result) => {
                    recognizer.close();
                    resolve(result);
                },
                (error) => {
                    recognizer.close();
                    reject(error);
                    console.log("Recognition error:", error);
                }
            );
        });

        // Get the transcription
        const transcription = result.text;
        console.log("Transcription:", transcription);

        return NextResponse.json({
            transcription: transcription
        });
    } catch (error) {
        console.error('Error processing audio:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: `Error processing audio: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: 'Unknown error processing audio' }, { status: 500 });
    }
}
