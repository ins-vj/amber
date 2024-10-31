import React, { useEffect, useState } from 'react';

const VideoPlayer = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await fetch('/api/videos');
            const data = await response.json();
            setVideos(data.videos);
        };

        fetchVideos();
    }, []);

    return (
        <div>
            {videos.map((video, index) => (
                <video key={index} controls width="600">
                    <source src={video.url} type="video/mp4" />
                </video>
            ))}
        </div>
    );
};

export default VideoPlayer;
