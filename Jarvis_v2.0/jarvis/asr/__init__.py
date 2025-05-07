from typing import Optional
import importlib
import speech_recognition as sr
import os, time
import numpy as np
from pathlib import Path

class ASREngine:
    def recognize(self, keep_audio_file: bool = False, timeout: int = 60) -> Optional[str]:
        raise NotImplementedError

class BaiduASR(ASREngine):
    def __init__(self, app_id, api_key, secret_key):
        aip = importlib.import_module('aip')
        self.client = aip.AipSpeech(app_id, api_key, secret_key)
        self.recognizer = sr.Recognizer()

    def recognize(self, keep_audio_file: bool = False, timeout: int = 120) -> Optional[str]:
        with sr.Microphone(sample_rate=16000) as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = self.recognizer.listen(source, timeout=timeout)
            timestamp = time.strftime('%Y-%m-%d-%H_%M_%S', time.localtime(time.time()))
            file_name = os.path.join(Path.home(), f"{timestamp}.wav")
            if keep_audio_file and audio:
                with open(file_name, "wb") as f:
                    f.write(audio.get_wav_data())
            if audio:
                audio_data = audio.get_wav_data()
                result = self.client.asr(audio_data, 'wav', 16000, {'dev_pid': 1537})
                if result.get('err_msg') == 'success.':
                    return result['result'][0]
        return None

class PaddleSpeechASR(ASREngine):
    def __init__(self):
        paddlespeech = importlib.import_module('paddlespeech.cli.asr.infer')
        self.executor = paddlespeech.ASRExecutor()
        self.recognizer = sr.Recognizer()

    def recognize(self, keep_audio_file: bool = True, timeout: int = 60) -> Optional[str]:
        with sr.Microphone(sample_rate=16000) as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = self.recognizer.listen(source, timeout=timeout)
            timestamp = time.strftime('%Y-%m-%d-%H_%M_%S', time.localtime(time.time()))
            file_name = os.path.join(Path.home(), f"{timestamp}.wav")
            if keep_audio_file and audio:
                with open(file_name, "wb") as f:
                    f.write(audio.get_wav_data())
            if audio:
                return self.executor(audio_file=file_name)
        return None

class WhisperASR(ASREngine):
    def __init__(self, model_name="base"):
        whisper = importlib.import_module('whisper')
        self.model = whisper.load_model(model_name)
        self.recognizer = sr.Recognizer()

    def recognize(self, keep_audio_file: bool = True, timeout: int = 120) -> Optional[str]:
        with sr.Microphone(sample_rate=16000) as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = self.recognizer.listen(source, timeout=timeout)
            timestamp = time.strftime('%Y-%m-%d-%H_%M_%S', time.localtime(time.time()))
            file_name = os.path.join(Path.home(), f"{timestamp}.wav")
            if keep_audio_file and audio:
                with open(file_name, "wb") as f:
                    f.write(audio.get_wav_data())
            if audio:
                result = self.model.transcribe(file_name, fp16=False)
                return result["text"]
        return None

class SherpaASR(ASREngine):
    def __init__(self, model_path):
        self.model_path = model_path
        self.recognizer = sr.Recognizer()

    def _create_recognizer(self):
        sherpa_ncnn = importlib.import_module('sherpa_ncnn')
        return sherpa_ncnn.Recognizer(
            tokens=f"{self.model_path}/tokens.txt",
            encoder_param=f"{self.model_path}/encoder_jit_trace-pnnx.ncnn.param",
            encoder_bin=f"{self.model_path}/encoder_jit_trace-pnnx.ncnn.bin",
            decoder_param=f"{self.model_path}/decoder_jit_trace-pnnx.ncnn.param",
            decoder_bin=f"{self.model_path}/decoder_jit_trace-pnnx.ncnn.bin",
            joiner_param=f"{self.model_path}/joiner_jit_trace-pnnx.ncnn.param",
            joiner_bin=f"{self.model_path}/joiner_jit_trace-pnnx.ncnn.bin",
            num_threads=4,
        )

    def recognize(self, keep_audio_file: bool = True, timeout: int = 60) -> Optional[str]:
        with sr.Microphone(sample_rate=16000) as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            audio = self.recognizer.listen(source, timeout=timeout)
            timestamp = time.strftime('%Y-%m-%d-%H_%M_%S', time.localtime(time.time()))
            file_name = os.path.join(Path.home(), f"{timestamp}.wav")
            if keep_audio_file and audio:
                with open(file_name, "wb") as f:
                    f.write(audio.get_wav_data())
            if audio:
                sherpa_recognizer = self._create_recognizer()
                import wave
                with wave.open(file_name) as f:
                    num_samples = f.getnframes()
                    samples = f.readframes(num_samples)
                    samples_int16 = np.frombuffer(samples, dtype=np.int16)
                    samples_float32 = samples_int16.astype(np.float32) / 32768
                    sherpa_recognizer.accept_waveform(sherpa_recognizer.sample_rate, samples_float32)
                    tail_paddings = np.zeros(int(sherpa_recognizer.sample_rate * 0.5), dtype=np.float32)
                    sherpa_recognizer.accept_waveform(sherpa_recognizer.sample_rate, tail_paddings)
                    sherpa_recognizer.input_finished()
                    return sherpa_recognizer.text
        return None 