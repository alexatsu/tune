# Interactions with music service

## Search

- User queries the music service for music suggestions or results.
- The music service retrieves the suggestions or results, including cover art, URL, title, duration, and an ID for each track.
- The music service checks if the music already exists in the database by comparing the track ID with the existing tracks.
- The music service sends the query results to the client.

## Playing Music:

- When a user clicks on the "play" button, the music service initiates the download and streaming of the music using yt-dlp.
- The music service cuts the audio into chunks and sends it back as an m3u8 playlist.
- The audio is deleted after 10 minutes + duration of the track.
- If the user pauses the audio for more than 10 minutes + track duration, an error message is sent to the client.

## Downloading and Saving Music:

- When a user clicks on the "download" button, the music service saves the file in the "audio" or "albums" folder under the user's directory.
- Before saving the file, the music service checks if the track already exists in the temporal folder. If it does, it moves it to the user's audio or albums folder.
