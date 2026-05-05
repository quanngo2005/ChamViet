import { motion } from 'motion/react';

export default function CulturalValue() {
  return (
    <section style={{ 
      minHeight: '100vh', 
      padding: '80px 0', 
      background: 'var(--bg)', 
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--secondary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="container" style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
        >
          <div style={{ width: '120px', height: '4px', background: 'var(--primary)', margin: '0 auto 16px auto', opacity: 0.5, borderRadius: '4px' }} />

          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', fontStyle: 'italic', color: 'var(--text-h)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-1px' }}>
            "Công nghệ không thay thế văn hóa, <br /> nó đánh thức tâm hồn di sản."
          </h2>

          <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: 'var(--text)', lineHeight: 1.6, fontWeight: 400 }}>
            Sứ mệnh của <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Chạm Việt</span> là kết nối trẻ em với cội nguồn văn hóa dân tộc thông qua ngôn ngữ của công nghệ hiện đại. Chúng tôi tin rằng mỗi mảnh ghép gỗ là một nhịp cầu đưa các em trở về với những câu chuyện cổ tích nghìn năm.
          </p>

          <div style={{ paddingTop: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '80px', height: '1px', background: 'var(--secondary)', opacity: 0.3 }} />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--secondary)' }}>Di sản hiện đại</span>
            <div style={{ width: '80px', height: '1px', background: 'var(--secondary)', opacity: 0.3 }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
