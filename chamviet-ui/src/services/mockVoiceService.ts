import type { VoiceService } from "./voiceService";
import type {
  VoiceSessionStartRequest,
  VoiceMeta,
  VoiceSessionResult,
} from "../types/voice";

export class MockVoiceService implements VoiceService {
  private questionIndex = 0;
  private totalQuestions = 0;
  private score = 0;
  private qaList: { question: string; answer: string }[] = [];

  async startSession(
    request: VoiceSessionStartRequest,
    _signal?: AbortSignal,
  ): Promise<VoiceSessionResult> {
    this.qaList = request.qa_list;
    this.totalQuestions = request.qa_list.length;
    this.questionIndex = 0;
    this.score = 0;

    const firstQuestion = this.qaList[0];
    const blob = createFakeWavBlob(600);

    const meta: VoiceMeta = {
      phase: "greeting",
      session_id: request.session_id,
      question_index: 0,
      total_questions: this.totalQuestions,
      text: "Chào bé! Chúng mình cùng khám phá câu chuyện nhé!",
      question: firstQuestion?.question,
      question_text: firstQuestion?.question,
      completed: this.totalQuestions === 0,
    };

    return { blob, meta };
  }

  async answerSession(
    _audioBlob: Blob,
    sessionId: string,
    _signal?: AbortSignal,
  ): Promise<VoiceSessionResult> {
    const qa = this.qaList[this.questionIndex];
    const isCorrect = Math.random() > 0.3;

    if (isCorrect) {
      this.score += 1;
    }

    this.questionIndex += 1;
    const completed = this.questionIndex >= this.totalQuestions;
    const nextQa = completed ? null : this.qaList[this.questionIndex];

    const feedback = isCorrect
      ? "Bé trả lời đúng rồi! Giỏi quá!"
      : "Câu trả lời của bé gần đúng rồi! Cùng nghe câu hỏi tiếp theo nhé!";

    const blob = createFakeWavBlob(800);

    const meta: VoiceMeta = {
      phase: "responding",
      session_id: sessionId,
      transcript: qa?.answer ? `Câu trả lời mô phỏng về: ${qa.answer}` : undefined,
      question_index: this.questionIndex,
      total_questions: this.totalQuestions,
      score: this.score,
      is_correct: isCorrect,
      question: qa?.question,
      completed,
      text: feedback,
      question_text: completed ? undefined : nextQa?.question,
    };

    return { blob, meta };
  }
}

function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function createFakeWavBlob(durationMs: number = 500): Blob {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const dataSize = numSamples * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  return new Blob([buffer], { type: "audio/wav" });
}
