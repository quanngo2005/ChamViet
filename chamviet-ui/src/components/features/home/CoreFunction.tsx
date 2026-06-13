import { Hand, Eye, Volume2, MessageSquareText } from "lucide-react";

import { RevealItem, StaggerReveal } from "../../common/MotionReveal";

const functions = [
  {
    id: 'cham',
    title: 'CHẠM',
    icon: <Hand size={32} />,
    description: 'Bé tự tay lắp tranh gỗ trước khi xem truyện, nên không chỉ nhìn màn hình thụ động.',
    outcome: 'Ngồi chơi tập trung 15-20 phút',
    color: 'rgba(139, 94, 60, 0.1)',
    iconColor: 'var(--secondary)'
  },
  {
    id: 'nhin',
    title: 'NHÌN',
    icon: <Eye size={32} />,
    description: 'Đặt điện thoại lên hộp để nhân vật hiện lên như sân khấu nhỏ ngay trên bàn.',
    outcome: 'Hiểu hiệu ứng phản chiếu bằng mắt thấy',
    color: 'rgba(198, 40, 40, 0.1)',
    iconColor: 'var(--primary)'
  },
  {
    id: 'nghe',
    title: 'NGHE',
    icon: <Volume2 size={32} />,
    description: 'Con nghe truyện theo từng cảnh, dễ bắt được nhân vật chính và bài học của câu chuyện.',
    outcome: 'Kể lại được ý chính',
    color: 'rgba(212, 175, 55, 0.1)',
    iconColor: 'var(--accent-color)'
  },
  {
    id: 'dap',
    title: 'ĐÁP',
    icon: <MessageSquareText size={32} />,
    description: 'Sau khi xem, bé hỏi AI những điều còn tò mò thay vì dừng lại ở một video xem xong là hết.',
    outcome: 'Có câu hỏi để nói chuyện cùng bố mẹ',
    color: 'rgba(78, 52, 46, 0.1)',
    iconColor: 'var(--text-h)'
  }
];

export default function CoreFunctions() {
  return (
    <section className="core-functions-section">
      <div className="container">
        <div className="core-functions-section__header">
          <p className="section-eyebrow">Cốt lõi sản phẩm</p>
          <h2 className="core-functions-section__title">Một hộp chơi, bốn cách trẻ học văn hóa</h2>
          <p className="core-functions-section__sub">
            Mỗi bước được thiết kế để phụ huynh thấy con đang làm gì, hiểu gì và có thể kể lại điều gì sau buổi chơi.
          </p>
        </div>

        <StaggerReveal className="core-functions-section__grid">
          {functions.map((item) => (
            <RevealItem
              key={item.id}
              className="function-card"
            >
              <div className="function-card__shape" style={{ background: item.color }} />

              <div
                className="function-card__icon"
                style={{ background: item.color, color: item.iconColor }}
              >
                {item.icon}
              </div>

              <h3 className="function-card__title">{item.title}</h3>
              <p className="function-card__desc">{item.description}</p>
              <p className="function-card__outcome">{item.outcome}</p>
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
