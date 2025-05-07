import threading
import pyaudio
import wave
from pydub import AudioSegment
import os
from typing import Optional

class AudioPlayer:
    def __init__(self):
        self._lock = threading.Lock()
        self._is_playing = False
        self._is_paused = False
        self._stream = None
        self._audio = pyaudio.PyAudio()
        self._thread = None
        self._volume = 1.0
        self._file_path = None
        self._audio_segment = None
        self._frame_index = 0

    def play(self, file_path: str):
        with self._lock:
            self.stop()
            self._file_path = file_path
            self._audio_segment = AudioSegment.from_file(file_path)
            self._is_playing = True
            self._is_paused = False
            self._frame_index = 0
            self._thread = threading.Thread(target=self._playback)
            self._thread.start()

    def _playback(self):
        stream = self._audio.open(
            format=self._audio.get_format_from_width(self._audio_segment.sample_width),
            channels=self._audio_segment.channels,
            rate=self._audio_segment.frame_rate,
            output=True
        )
        self._stream = stream
        chunk_size = 1024
        raw_data = self._audio_segment.raw_data
        total_frames = len(raw_data) // (self._audio_segment.sample_width * self._audio_segment.channels)
        while self._is_playing and self._frame_index < total_frames:
            if self._is_paused:
                continue
            start = self._frame_index * self._audio_segment.sample_width * self._audio_segment.channels
            end = start + chunk_size * self._audio_segment.sample_width * self._audio_segment.channels
            chunk = raw_data[start:end]
            if self._volume != 1.0:
                chunk = AudioSegment(
                    chunk,
                    frame_rate=self._audio_segment.frame_rate,
                    sample_width=self._audio_segment.sample_width,
                    channels=self._audio_segment.channels
                ) - (1.0 - self._volume) * 60  # 简单音量调整
                chunk = chunk.raw_data
            stream.write(chunk)
            self._frame_index += chunk_size
        stream.stop_stream()
        stream.close()
        self._is_playing = False
        self._is_paused = False

    def pause(self):
        with self._lock:
            if self._is_playing and not self._is_paused:
                self._is_paused = True

    def resume(self):
        with self._lock:
            if self._is_playing and self._is_paused:
                self._is_paused = False

    def stop(self):
        with self._lock:
            self._is_playing = False
            self._is_paused = False
            if self._stream:
                self._stream.stop_stream()
                self._stream.close()
                self._stream = None

    def set_volume(self, volume: float):
        with self._lock:
            self._volume = max(0.0, min(1.0, volume))

    @property
    def is_playing(self) -> bool:
        return self._is_playing

    @property
    def is_paused(self) -> bool:
        return self._is_paused 