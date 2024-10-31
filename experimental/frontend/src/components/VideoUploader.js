import React, { useState } from 'react';

const VideoUpload = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!videoFile) {
            setUploadStatus('Please select a video file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);

        try {
            const response = await fetch('http://localhost:5001/upload', {

                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(data);
            if (data?.videoUrl) {
                setUploadStatus(`Upload successful! Video URL: ${data.videoUrl}`);
            }
             else {
                setUploadStatus('Upload failed: ' + data.error);

            }
        } catch (error) {
            console.error('Error during upload:', error);
            setUploadStatus('Upload failed: ' + error.message);
        }
      
    };

    return (
        <div>
            <h2>Upload Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{uploadStatus}</p>
        </div>
    );
};

export default VideoUpload;
