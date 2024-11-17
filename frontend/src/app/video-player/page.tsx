
"use client";
import React from 'react'
const params = { cloudName: "dcdlxeu52", publicId: "mk5baauljkpshyqunwov" };
import VideoPlayer from './vo';
import 'cloudinary-video-player/cld-video-player.min.css';
import VideoScreen from '@/components/video-screen';
function App() {
  return (
    <div>
      <h2>Basic Example</h2>
      <VideoPlayer
        id="player2"
        publicId="courses/course_1731860592247/promo/pdaghb8har5govvqpxpa"
        playerConfig={{
          muted: true,
          posterOptions: {
            transformation: { effect: 'blur' },
          },
          playbackRates: [0.25,0.5, 1, 1.5, 2], // Playback speed options
        }}
        sourceConfig={{
          sourceTypes: ['hls'], // Specify HLS as the only source type
        }}
      />
      <VideoScreen/>
    </div>
  );
}

export default App;
