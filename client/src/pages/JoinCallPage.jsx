import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JoinCallPage = () => {
    const { roomId } = useParams();
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const audioUrlRef = useRef(null);
    const [transcription, setTranscription] = useState("");
    const recognitionRef = useRef(null);
    const fullTranscriptionRef = useRef("");
    const [isTranscribing, setIsTranscribing] = useState(false);

    const myMeeting = async (element) => {
        if (!element) return; // Exit if element is not available yet

        const appID = 187800675;
        const serverSecret = "7c79e967314a3bb1c3dabb5ebebafbb2";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            Date.now().toString(),
            'Your name'
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });
    };

    // Use a callback ref to ensure async function is triggered after DOM is ready
    const meetingRef = useRef(null);
    useEffect(() => {
        if (meetingRef.current) {
            myMeeting(meetingRef.current);
        }
    }, [roomId]);

    return (
        <div className='flex flex-col justify-center items-center h-screen gap-8'>
            <div ref={meetingRef} className='h-full w-full rounded-xl'></div>
            {transcription && <div className="transcription">Transcription: {transcription}</div>}
        </div>
    );
};

export default JoinCallPage;