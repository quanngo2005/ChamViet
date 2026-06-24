import { BookOpenCheck, Brain, HeartHandshake, Users } from 'lucide-react';
import { Reveal, RevealItem, StaggerReveal } from "../../common/MotionReveal";

const outcomes = [
  {
    icon: <Brain size={24} />,
    title: 'Trẻ hiểu thay vì chỉ xem',
    description: 'Tự tay lắp ghép rồi nhìn câu chuyện hiện lên giúp trẻ nhớ mạch truyện và biểu tượng văn hóa lâu hơn.',
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Gia đình có một giờ chơi chung',
    description: 'Phụ huynh có thể cùng con lắp, kể, hỏi đáp và mở rộng câu chuyện mà không cần chuẩn bị giáo án.',
  },
  {
    icon: <BookOpenCheck size={24} />,
    title: 'Văn hóa thành trải nghiệm gần gũi',
    description: 'Những tích truyện quen thuộc được chuyển thành sản phẩm hữu hình, dễ tiếp cận với trẻ trong thời đại số.',
  },
  {
    icon: <Users size={24} />,
    title: 'Dễ dùng trong lớp học nhỏ',
    description: 'Luồng bốn bước rõ ràng giúp giáo viên tổ chức hoạt động nhóm, thảo luận và kể lại câu chuyện.',
  },
];

export default function OutcomeSection() {
  return (
    <section className="outcome-section">
      <div className="container">
        <Reveal className="outcome-section__header">
          <p className="section-eyebrow">Kết quả mang lại</p>
          <h2 className="outcome-section__title">Sau một lần mở hộp, trẻ có thể kể lại câu chuyện</h2>
          <p className="outcome-section__sub">
            Landing không chỉ giới thiệu món đồ chơi. Nó cho phụ huynh thấy điều con nhận được sau khi chơi cùng Chạm\u00A0Việt.
          </p>
        </Reveal>

        <StaggerReveal className="outcome-section__grid">
          {outcomes.map((item) => (
            <RevealItem key={item.title} as="article" className="outcome-card">
              <div className="outcome-card__icon">{item.icon}</div>
              <div>
                <h3 className="outcome-card__title">{item.title}</h3>
                <p className="outcome-card__desc">{item.description}</p>
              </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
