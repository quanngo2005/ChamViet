import { motion } from 'motion/react';
import { Package, ShieldCheck, Palette, CreditCard } from 'lucide-react';

const contents = [
    {
        id: 1,
        title: '02 Bộ Puzzle Gỗ 3D',
        description: 'Chế tác từ gỗ cao cấp, bề mặt nhẵn mịn, an toàn tuyệt đối cho trẻ.',
        icon: <Package size={24} />,
        tag: '01'
    },
    {
        id: 2,
        title: 'Thẻ Hướng Dẫn Nghệ Thuật',
        description: 'Tranh minh họa tuyệt đẹp kèm hướng dẫn chi tiết cách lắp ráp.',
        icon: <Palette size={24} />,
        tag: '02'
    },
    {
        id: 3,
        title: 'Mã Kích Hoạt Nội Dung Độc Quyền',
        description: 'Mở khóa thế giới nội dung số, AR và AI tương tác trên website.',
        icon: <CreditCard size={24} />,
        tag: '03'
    }
];

export default function Unboxing() {
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '80px',
                    alignItems: 'center'
                }}>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h2 style={{ fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text-h)' }}>
                                Có gì trong hộp <br />
                                <span style={{ color: 'var(--primary)' }}>Chạm Việt?</span>
                            </h2>
                            <p style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', color: 'var(--text)', lineHeight: '1.6', maxWidth: '480px' }}>
                                Khám phá trọn bộ sản phẩm được đóng gói tỉ mỉ, mang cả thế giới cổ tích về nhà.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {contents.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'rgba(139, 94, 60, 0.15)',
                                        color: 'var(--secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '18px',
                                        flexShrink: 0,
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {item.tag}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px' }}>{item.title}</h4>
                                        <p style={{ color: 'var(--text)', fontSize: '16px', lineHeight: '1.6' }}>{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(46, 125, 50, 0.1)',
                                color: '#2E7D32',
                                padding: '10px 20px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: 700,
                                border: '1px solid rgba(46, 125, 50, 0.2)'
                            }}>
                                <ShieldCheck size={18} />
                                <span>GỖ TỰ NHIÊN AN TOÀN</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(198, 40, 40, 0.1)',
                                color: 'var(--primary)',
                                padding: '10px 20px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: 700,
                                border: '1px solid rgba(198, 40, 40, 0.2)'
                            }}>
                                <Palette size={18} />
                                <span>CÔNG NGHỆ IN UV BỀN MÀU</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ position: 'relative' }}
                    >
                        {/* Organic background shadow/glow */}
                        <div style={{
                            position: 'absolute',
                            inset: '-24px',
                            background: 'radial-gradient(circle, rgba(139,94,60,0.15) 0%, rgba(212,175,55,0.05) 100%)',
                            borderRadius: '40% 60% 50% 50% / 50% 40% 60% 50%',
                            filter: 'blur(30px)',
                            zIndex: 0
                        }} />

                        <div style={{
                            position: 'relative',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-xl)',
                            border: '8px solid white',
                            zIndex: 10
                        }}>
                            <img
                                referrerPolicy="no-referrer"
                                src="https://images.unsplash.com/photo-1543163359-4828384da1f1?auto=format&fit=crop&q=80&w=1000"
                                alt="Product Contents"
                                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
