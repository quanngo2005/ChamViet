import { Puzzle, Scan, Glasses, Trophy } from 'lucide-react';
import { useSmoothScroll, useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';

const steps = [
  {
    id: 1,
    title: 'Lắp tranh',
    category: 'Vật lý',
    description: 'Ghép những mảnh gỗ tinh xảo — rèn luyện vận động tinh và tư duy logic không gian.',
    icon: <Puzzle size={28} />,
    color: 'rgba(139, 94, 60, 0.12)',
    iconColor: 'var(--secondary)'
  },
  {
    id: 2,
    title: 'Quét tranh',
    category: 'Kết nối',
    description: 'Mở ứng dụng Chạm Việt, hướng camera vào tranh để kích hoạt linh hồn cho tác phẩm.',
    icon: <Scan size={28} />,
    color: 'rgba(198, 40, 40, 0.1)',
    iconColor: 'var(--primary)'
  },
  {
    id: 3,
    title: 'Trải nghiệm AR',
    category: 'Kỹ thuật số',
    description: 'Đắm chìm trong không gian AR — nhân vật 3D, Hologram và âm nhạc dân gian sống động.',
    icon: <Glasses size={28} />,
    color: 'rgba(212, 175, 55, 0.12)',
    iconColor: 'var(--accent-color)'
  },
  {
    id: 4,
    title: 'Nhận thưởng',
    category: 'Phát triển',
    description: 'Tương tác với AI để trả lời câu hỏi, nhận phần thưởng và khám phá tri thức văn hóa.',
    icon: <Trophy size={28} />,
    color: 'rgba(78, 52, 46, 0.1)',
    iconColor: 'var(--text-h)'
  }
];

export default function Workflow() {
  const headRef = useSmoothScroll<HTMLDivElement>();
  const listRef = useSmoothScrollStagger<HTMLDivElement>('.step-card', 150);

  return (
    <section className="workflow-section">
      <div className="container">
        {/* Header */}
        <div ref={headRef} className="workflow-section__header scroll-reveal fade-up">
          <p className="section-eyebrow">Hành trình 4 bước</p>
          <h2 className="workflow-section__title">
            Hành trình Phygital
          </h2>
          <p className="workflow-section__sub">
            Sự giao thoa hoàn hảo giữa thế giới thực và ảo
          </p>
        </div>

        {/* Steps grid */}
        <div className="workflow-section__track">
          {/* Connector line */}
          <div className="workflow-section__connector" aria-hidden="true" />

          <div ref={listRef} className="workflow-section__cards">
            {steps.map((step) => (
              <div
                key={step.id}
                className="step-card scroll-reveal-child scale-in"
                style={{ '--step-color': step.color } as React.CSSProperties}
              >
                {/* Step number */}
                <div className="step-card__num">{String(step.id).padStart(2, '0')}</div>

                {/* Icon */}
                <div className="step-card__icon" style={{ background: step.color, color: step.iconColor }}>
                  {step.icon}
                </div>

                {/* Category badge */}
                <span className="step-card__category">{step.category}</span>

                {/* Content */}
                <h4 className="step-card__title">{step.title}</h4>
                <p className="step-card__desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
