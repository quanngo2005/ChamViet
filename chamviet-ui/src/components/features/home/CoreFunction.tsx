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
    description: 'Hình ảnh 3D và Hologram sống động hiện lên từ chính bức tranh vừa hoàn thành qua Ứng dụng.',
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
    description: 'Trò chuyện trực tiếp cùng nhân vật qua AI, giải đáp thắc mắc và tìm hiểu sâu về tích truyện.',
    color: 'rgba(78, 52, 46, 0.1)',
    iconColor: 'var(--text-h)'
  }
];

export default function CoreFunctions() {
  const containerRef = useSmoothScrollStagger<HTMLDivElement>('.function-card', 150);

  return (
    <section style={{ 
      minHeight: '100vh', 
      padding: '80px 0', 
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>Hành trình 4 Giác Quan</h2>
          <p style={{ color: 'var(--text)', fontSize: 'clamp(16px, 1.5vw, 20px)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            Phát triển toàn diện qua phương pháp học tập tương tác đa chiều, kết nối truyền thống và tương lai.
          </p>
        </div>

        <div 
          ref={containerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px'
          }}
        >
          {functions.map((item) => (
            <div
              key={item.id}
              className="function-card scroll-reveal-child fade-up"
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'white',
                padding: '40px 32px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '140px',
                height: '140px',
                background: item.color,
                borderRadius: '0 0 0 100%',
                marginRight: '-70px',
                marginTop: '-70px',
                transition: 'transform 0.6s ease'
              }} className="card-bg-shape" />

              <div style={{
                width: '72px',
                height: '72px',
                background: item.color,
                color: item.iconColor,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                position: 'relative',
                zIndex: 10,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {item.icon}
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', position: 'relative', zIndex: 10, color: 'var(--text-h)' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text)', fontSize: '16px', lineHeight: '1.6', position: 'relative', zIndex: 10 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
