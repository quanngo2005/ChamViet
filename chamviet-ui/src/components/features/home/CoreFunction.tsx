import { Hand, Eye, Volume2, MessageSquareText } from 'lucide-react';
import { useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';

const functions = [
  {
    id: 'cham',
    title: 'CHẠM',
    icon: <Hand size={32} />,
    description: 'Lắp ráp thủ công các mảnh gỗ tinh xảo, rèn luyện vận động tinh và tư duy logic không gian.',
    color: 'rgba(139, 94, 60, 0.1)',
    iconColor: 'var(--secondary)'
  },
  {
    id: 'nhin',
    title: 'NHÌN',
    icon: <Eye size={32} />,
    description: 'Câu chuyện và nhân vật dân gian hiện lên sống động ngay trước mắt qua sân khấu phản chiếu.',
    color: 'rgba(198, 40, 40, 0.1)',
    iconColor: 'var(--primary)'
  },
  {
    id: 'nghe',
    title: 'NGHE',
    icon: <Volume2 size={32} />,
    description: 'Đắm chìm trong không gian âm nhạc dân gian và giọng kể chuyện truyền cảm ấm áp.',
    color: 'rgba(212, 175, 55, 0.1)',
    iconColor: 'var(--accent-color)'
  },
  {
    id: 'dap',
    title: 'ĐÁP',
    icon: <MessageSquareText size={32} />,
    description: 'Cùng gia đình thảo luận và trả lời các câu đố vui để hiểu sâu hơn về ý nghĩa của từng tích truyện.',
    color: 'rgba(78, 52, 46, 0.1)',
    iconColor: 'var(--text-h)'
  }
];

export default function CoreFunctions() {
  const containerRef = useSmoothScrollStagger<HTMLDivElement>('.function-card', 150);

  return (
    <section className="core-functions-section">
      <div className="container">
        <div className="core-functions-section__header">
          <p className="section-eyebrow">Hành trình 4 giác quan</p>
          <h2 className="core-functions-section__title">Hành trình 4 Giác Quan</h2>
          <p className="core-functions-section__sub">
            Phát triển toàn diện qua phương pháp học tập tương tác đa chiều, kết nối truyền thống và tương lai.
          </p>
        </div>

        <div ref={containerRef} className="core-functions-section__grid">
          {functions.map((item) => (
            <div
              key={item.id}
              className="function-card scroll-reveal-child fade-up"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
