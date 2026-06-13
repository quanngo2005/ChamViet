import { Reveal } from "../../common/MotionReveal";

export default function CulturalValue() {
  return (
    <section style={{ 
      minHeight: '100svh', 
      padding: '120px 0', 
      background: 'linear-gradient(180deg, var(--bg), #F0E6D8)', 
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(var(--secondary) 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }} />

      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <Reveal
          className="cultural-value__content"
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '2px', background: 'var(--primary)' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--primary)' }}>Triết lý thương hiệu</span>
          </div>

          <h2 style={{ fontSize: 'clamp(42px, 5vw, 68px)', fontStyle: 'italic', color: 'var(--text-h)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-2px', textWrap: 'balance', marginLeft: '0', maxWidth: '800px' }}>
            "Công nghệ không thay thế văn hóa, <br /> nó đánh thức tâm hồn di sản."
          </h2>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--text)', lineHeight: 1.7, fontWeight: 400, maxWidth: '500px', textAlign: 'left', borderLeft: '1px solid rgba(139, 94, 60, 0.3)', paddingLeft: '32px' }}>
              Sứ mệnh của <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Chạm Việt</span> là kết nối trẻ em với cội nguồn văn hóa dân tộc thông qua ngôn ngữ của công nghệ hiện đại. Chúng tôi tin rằng mỗi mảnh ghép gỗ là một nhịp cầu đưa các em trở về với những câu chuyện cổ tích nghìn năm.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
