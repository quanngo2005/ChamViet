import { MessageCircleQuestion, Sparkles } from "lucide-react";

import { Reveal } from "../../common/MotionReveal";

export default function AIQADemo() {
  return (
    <section className="ai-qa-section">
      <div className="container">
        <Reveal className="ai-qa-section__inner">
          <div className="ai-qa-section__copy">
            <p className="section-eyebrow">AI hỏi đáp</p>
            <h2 className="ai-qa-section__title">Bé hỏi, AI trả lời ngay</h2>
            <p className="ai-qa-section__sub">
              Sau khi xem truyện, bé có thể đặt câu hỏi để hiểu thêm về nhân vật, bài học và văn hóa Việt.
            </p>
          </div>

          <div className="ai-qa-section__chat" aria-label="Ví dụ hỏi đáp AI">
            <div className="ai-qa-section__chat-head">
              <span className="ai-qa-section__chat-icon">
                <Sparkles size={18} />
              </span>
              <div>
                <strong>Chạm Việt AI</strong>
                <span>Hướng dẫn sau câu chuyện</span>
              </div>
            </div>
            <div className="ai-qa-section__bubble ai-qa-section__bubble--user">
              Vì sao Thánh Gióng lớn nhanh như vậy?
            </div>
            <div className="ai-qa-section__bubble ai-qa-section__bubble--bot">
              Chi tiết này thể hiện sức mạnh đoàn kết của nhân dân khi quê hương cần được bảo vệ.
            </div>
            <div className="ai-qa-section__prompt">
              <MessageCircleQuestion size={16} />
              <span>Hỏi tiếp sau khi xem truyện</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
