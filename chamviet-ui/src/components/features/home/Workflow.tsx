import { Package, Puzzle, Smartphone, PlayCircle } from 'lucide-react';
import { useSmoothScroll, useSmoothScrollStagger } from '../../../hooks/useSmoothScroll';

const steps = [
  {
    id: 1,
    title: 'Mở hộp',
    category: 'Sẵn sàng',
    description: 'Lấy tranh lắp ghép, thẻ nội dung và hộp phản chiếu từ bộ sản phẩm.',
    icon: <Package size={28} />,
    color: 'rgba(139, 94, 60, 0.12)',
    iconColor: 'var(--secondary)'
  },
  {
    id: 2,
    title: 'Lắp tranh',
    category: 'Tương tác',
    description: 'Tự tay ghép các mảnh gỗ tinh xảo để hoàn thành sản phẩm vật lý.',
    icon: <Puzzle size={28} />,
    color: 'rgba(198, 40, 40, 0.1)',
    iconColor: 'var(--primary)'
  },
  {
    id: 3,
    title: 'Đặt điện thoại',
    category: 'Kết nối',
    description: 'Mở video câu chuyện trên điện thoại và đặt úp vào hộp Pepper\'s Ghost.',
    icon: <Smartphone size={28} />,
    color: 'rgba(212, 175, 55, 0.12)',
    iconColor: 'var(--accent-color)'
  },
  {
    id: 4,
    title: 'Xem sân khấu nhỏ',
    category: 'Trải nghiệm',
    description: 'Nhân vật và câu chuyện dân gian hiện lên sống động qua mặt phản chiếu.',
    icon: <PlayCircle size={28} />,
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
            Cách xem câu chuyện<br />trong hộp Pepper's Ghost
          </h2>
          <p className="workflow-section__sub">
            Chỉ với vài thao tác đơn giản để biến hộp gỗ thành sân khấu nhỏ
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
