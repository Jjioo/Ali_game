document.addEventListener('DOMContentLoaded', (event) => {
    const player = document.getElementById('youtube-player');
    const lyricsElement = document.getElementById('song-lyrics');
    let currentLine = -1;
    let lines = [];

    // Parse the transcript file
    fetch('/songs/transcript/video1.txt')
        .then(response => response.text())
        .then(text => {
            console.log('Transcript fetched successfully');
            lines = text.split('\n').filter(line => line[0] !== '#').map(line => {
                const parts = line.split(' ', 2);
                if (parts.length < 2) {
                    console.warn('Skipping malformed line:', line);
                    return null;
                }
                const [time, text] = parts;
                return { time: parseTime(time), text: text.trim() };
            }).filter(line => line !== null);

            console.log('Parsed lines:', lines);

            if (lines.length > 0) {
                lyricsElement.innerText = lines[0].text;
            }
        })
        .catch(error => console.error('Error fetching transcript:', error));

    // Function to parse time from string format to seconds
    function parseTime(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    // Initialize YouTube player
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let ytPlayer;

    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtube-player', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            window.requestAnimationFrame(updateLyrics);
        }
    }

    function updateLyrics() {
        const currentTime = ytPlayer.getCurrentTime();
        let newLine = currentLine;

        // Find the correct line for the current time
        while (newLine < lines.length - 1 && currentTime >= lines[newLine + 1].time) {
            newLine++;
        }
        while (newLine > 0 && currentTime < lines[newLine].time) {
            newLine--;
        }

        // Update the lyrics if the line has changed
        if (newLine !== currentLine) {
            currentLine = newLine;
            lyricsElement.innerText = lines[currentLine].text;
        }

        // Continue updating if the video is still playing
        if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
            window.requestAnimationFrame(updateLyrics);
        }
    }
});