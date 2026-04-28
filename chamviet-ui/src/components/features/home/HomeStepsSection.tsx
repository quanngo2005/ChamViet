import { motion } from 'motion/react';

const steps = [
  {
    id: 1,
    title: 'Lắp tranh',
    category: 'Vật lý',
    description: 'Bắt đầu hành trình bằng việc ghép những mảnh gỗ truyền thống.'
  },
  {
    id: 2,
    title: 'Quét tranh',
    category: 'Kết nối',
    description: 'Sử dụng App Chạm Việt để kích hoạt linh hồn cho bức tranh.'
  },
  {
    id: 3,
    title: 'Trải nghiệm',
    category: 'Kỹ thuật số',
    description: 'Đắm chìm trong không gian AR, Hologram và âm thanh kể chuyện.'
  },
  {
    id: 4,
    title: 'Nhận thưởng',
    category: 'Phát triển',
    description: 'Tương tác với AI để nhận những phần quà ý nghĩa và tri thức.'
  }
];

export default function Workflow() {
  return (
    <section style={{ 
      minHeight: '100vh', 
      padding: '80px 0', 
      background: 'var(--bg)', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.5px' }}>Hành trình Phygital</h2>
          <p style={{ color: 'var(--text)', fontSize: 'clamp(16px, 1.5vw, 20px)', marginTop: '16px' }}>Sự giao thoa hoàn hảo giữa thế giới thực và thế giới số</p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Connecting Line */}
          <div style={{
            position: 'absolute',
            top: '40px', // Center with the circle
            left: '10%',
            width: '80%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--primary) 50%, transparent)',
            opacity: 0.2,
            zIndex: 1
          }} className="hidden-mobile" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            position: 'relative',
            zIndex: 10
          }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: 'var(--shadow-xl)',
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                style={{
                  background: 'white',
                  padding: '40px 24px',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '24px'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--bg-surface)',
                  color: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '20px',
                  boxShadow: '0 0 0 8px rgba(198, 40, 40, 0.05)',
                  border: '2px solid var(--primary)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {step.id}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--secondary)' }}>
                    {step.category}
                  </p>
                  <h4 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-h)' }}>
                    {step.title}
                  </h4>
                  <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.6' }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
