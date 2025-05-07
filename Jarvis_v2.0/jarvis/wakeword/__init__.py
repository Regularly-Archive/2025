from typing import Optional
import pvporcupine
import pyaudio
import struct

class WakeWordEngine:
    def detect(self) -> Optional[int]:
        raise NotImplementedError

class PicovoiceWakeWord(WakeWordEngine):
    def __init__(self, access_key: str, keyword_path: str, input_device_index: int = 0):
        self.porcupine = pvporcupine.create(
            access_key=access_key,
            keyword_paths=[keyword_path]
        )
        self.myaudio = pyaudio.PyAudio()
        self.stream = self.myaudio.open(
            input_device_index=input_device_index,
            rate=self.porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=self.porcupine.frame_length
        )

    def detect(self) -> Optional[int]:
        audio_obj = self.stream.read(self.porcupine.frame_length, exception_on_overflow=False)
        audio_obj_unpacked = struct.unpack_from("h" * self.porcupine.frame_length, audio_obj)
        keyword_idx = self.porcupine.process(audio_obj_unpacked)
        return keyword_idx 
    
if __name__ == '__main__':
    wakeword = PicovoiceWakeWord(settings.PICOVOICE_API_KEY, 'Jarvis_en_windows_v2_1_0.ppn')