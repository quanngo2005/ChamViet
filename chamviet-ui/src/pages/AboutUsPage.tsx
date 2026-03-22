import { Box, Container, Typography, Stack, Grid, Card } from '@mui/material';

// Image constants (from Figma)
const images = {
  heritageCrafts: 'https://www.figma.com/api/mcp/asset/fd2ef885-852f-42ca-b3d2-f79ca7ad1b40',
  cultureInHands: 'https://www.figma.com/api/mcp/asset/9f658c2c-17d2-4f9d-bbf7-dd9a3d463f29',
  founder: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  techLead: 'https://www.figma.com/api/mcp/asset/c9d45385-c870-4dc9-b74e-cba64e23a702',
  artisanManager: 'https://www.figma.com/api/mcp/asset/f03e2b28-bd67-421e-b660-478acacf22fa',
  founderAlt1: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  founderAlt2: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  founderAlt3: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  founderAlt4: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  founderAlt5: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  founderAlt6: 'https://www.figma.com/api/mcp/asset/5c45ff94-9574-4cac-be25-c900e942c624',
  iconPlay: 'https://www.figma.com/api/mcp/asset/a8d44e43-84c5-464e-8102-4c187306f1e1',
  iconWatch: 'https://www.figma.com/api/mcp/asset/ef5c49be-297a-4fbe-a25a-09299185fa3f',
  iconSustainable: 'https://www.figma.com/api/mcp/asset/219c60c5-c99a-43d7-af46-9bfda6eabe4a',
  iconHandmade: 'https://www.figma.com/api/mcp/asset/e75c5369-4924-42f9-93b1-8e2a2c0019cd',
  iconHeritage1: 'https://www.figma.com/api/mcp/asset/6aae7b54-13da-4b8f-8076-b8e663e4d8ab',
  iconHeritage2: 'https://www.figma.com/api/mcp/asset/d172aa10-4f56-47fe-a033-a44ca4503fb0',
  logoFooter: 'https://www.figma.com/api/mcp/asset/a8d44e43-84c5-464e-8102-4c187306f1e1',
  socialFacebook: 'https://www.figma.com/api/mcp/asset/6aae7b54-13da-4b8f-8076-b8e663e4d8ab',
  socialInstagram: 'https://www.figma.com/api/mcp/asset/d172aa10-4f56-47fe-a033-a44ca4503fb0',
  socialTwitter: 'https://www.figma.com/api/mcp/asset/219c60c5-c99a-43d7-af46-9bfda6eabe4a',
};

// Hero Section
function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '614px',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      data-node-id="62:902"
    >
      {/* Background Image */}
      <Box
        component="img"
        src={images.heritageCrafts}
        alt="Heritage Crafts"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(168, 50, 50, 0.4), rgba(0, 0, 0, 0.6))',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={2} alignItems="center">
          {/* Badge */}
          <Box
            sx={{
              backgroundColor: '#a83232',
              borderRadius: '12px',
              px: 2,
              py: 0.5,
              display: 'inline-block',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
              }}
            >
              Ghép Kí Ức
            </Typography>
          </Box>

          {/* Heading */}
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: '60px',
              lineHeight: '60px',
              textAlign: 'center',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            Tìm Hiểu Văn Hóa Thông Qua Đồ Chơi
          </Typography>

          {/* Subheading */}
          <Typography
            sx={{
              color: '#f1f5f9',
              fontSize: '20px',
              textAlign: 'center',
              fontWeight: 300,
              maxWidth: '672px',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            Kết nối thế hệ kỹ thuật số với di sản văn hóa phong phú, đầy cảm xúc của Việt Nam.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

// Mission Section
function MissionSection() {
  return (
    <Box sx={{ backgroundColor: 'white', py: 10, px: 10 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={8}>
          {/* Left Column - Text Content */}
          <Box sx={{ flex: { xs: 1, md: 0.5 } }}>
            <Stack spacing={3}>
              {/* Label */}
              <Typography
                variant="caption"
                sx={{
                  color: '#a83232',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  letterSpacing: '2.8px',
                  textTransform: 'uppercase',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                Sứ Mệnh
              </Typography>

              {/* Main Heading */}
              <Typography
                variant="h3"
                sx={{
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '36px',
                  lineHeight: '40px',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                Cầu nối thời gian
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  color: '#475569',
                  fontSize: '18px',
                  lineHeight: '1.625',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                Tại Chạm Việt, chúng tôi tin rằng văn hóa không chỉ được tìm thấy trong bảo
                tàng—mà còn được cảm nhận qua từng bàn tay. Sứ mệnh của chúng tôi là xây dựng
                cầu nối giữa thế hệ kỹ thuật số và những truyền thống vượt thời gian của Việt
                Nam thông qua các hoạt động tương tác, trải nghiệm thực tế.
              </Typography>

              {/* Key Features */}
              <Stack spacing={2} sx={{ pt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Box
                    component="img"
                    src={images.iconHeritage1}
                    alt="Heritage"
                    sx={{ width: 38, height: 35.5, flexShrink: 0 }}
                  />
                  <Stack spacing={1}>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#0f172a',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      Di sản kể chuyện
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#475569',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      Kể những câu chuyện về Việt Nam thông qua những hiện vật bằng gỗ được chế
                      tác tinh xảo.
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Box
                    component="img"
                    src={images.iconHeritage2}
                    alt="Connection"
                    sx={{ width: 35.25, height: 37, flexShrink: 0 }}
                  />
                  <Stack spacing={1}>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#0f172a',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      Kết nối giữa các thế hệ
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#475569',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      Khuyến khích cha mẹ và con cái cùng nhau khám phá cội nguồn thông qua các
                      hoạt động chung.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Right Column - Image */}
          <Box sx={{ flex: { xs: 1, md: 0.5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '546px',
                aspect: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Blur Effect */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '256px',
                  height: '256px',
                  backgroundColor: 'rgba(168, 50, 50, 0.05)',
                  borderRadius: '12px',
                  filter: 'blur(32px)',
                  top: '-31px',
                  right: '-40px',
                  zIndex: 0,
                }}
              />

              {/* Image Container */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  transform: 'rotate(2deg)',
                  width: '528px',
                  height: '528px',
                }}
              >
                <Box
                  component="img"
                  src={images.cultureInHands}
                  alt="Culture in Hands"
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

// Story Section
function StorySection() {
  const features = [
    { title: 'Chơi Giỏi', description: 'Tiếp xúc với puzzle', icon: images.iconPlay },
    { title: 'Xem Vui', description: 'Hologram video', icon: images.iconWatch },
    { title: 'Bền Vững', description: 'Chất liệu Gỗ', icon: images.iconSustainable },
    { title: 'Handmade', description: 'Làm thủ công', icon: images.iconHandmade },
  ];

  return (
    <Box id="story" sx={{ backgroundColor: '#f8f6f6', py: 10, px: 10 }}>
      <Container maxWidth="lg">
        <Stack spacing={8}>
          {/* Header */}
          <Stack spacing={2} alignItems="center">
            <Typography
              variant="caption"
              sx={{
                color: '#a83232',
                fontWeight: 'bold',
                fontSize: '14px',
                letterSpacing: '2.8px',
                textTransform: 'uppercase',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              Câu Chuyện
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '36px',
                textAlign: 'center',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              Khởi nguồn của Chạm Việt
            </Typography>
          </Stack>

          {/* Story Card */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={0}>
            <Box sx={{ flex: { xs: 1, md: 0.5 } }}>
              <Card
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(168, 50, 50, 0.1)',
                  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  p: 6,
                  height: '100%',
                }}
              >
                <Stack spacing={3}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      color: '#334155',
                      lineHeight: '1.625',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                  >
                    Chạm Việt ra đời từ một nhận ra rất giản dị: trẻ em đang dần mất kết nối với
                    cội nguồn của mình trong một thế giới ngày càng số hóa. Dù các thiết bị màn
                    hình mang lại nguồn giải trí vô tận, chúng lại thiếu đi chiều sâu và sự ấm
                    áp mà các chất liệu truyền thống mang lại.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      color: '#334155',
                      lineHeight: '1.625',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                  >
                    Chúng tôi quyết định kết hợp sự ấm áp của chất liệu gỗ truyền thống với sức
                    hấp dẫn của công nghệ hiện đại. Bằng cách tích hợp mã QR và các tương tác 3D
                    vào những món đồ chơi vật lý, chúng tôi mang lịch sử Việt Nam trở nên sống
                    động theo một cách mà trẻ em ngày nay có thể dễ dàng tiếp cận và thấu hiểu.
                  </Typography>
                </Stack>
              </Card>
            </Box>

            {/* Features Grid */}
            <Box sx={{ flex: { xs: 1, md: 0.5 } }}>
              <Box
                sx={{
                  backgroundColor: 'rgba(168, 50, 50, 0.05)',
                  borderRadius: '8px',
                  p: 6,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Grid container spacing={2}>
                  {features.map((feature) => (
                    <Grid key={feature.title} size={6}>
                      <Card
                        sx={{
                          backgroundColor: 'white',
                          border: '1px solid rgba(168, 50, 50, 0.05)',
                          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                          borderRadius: '8px',
                          p: 3,
                          textAlign: 'center',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="img"
                          src={feature.icon}
                          alt={feature.title}
                          sx={{ width: 30, height: 30, mb: 1 }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#0f172a',
                            mb: 0.5,
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: '#64748b',
                            fontFamily: "'Be Vietnam Pro', sans-serif",
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

// Team Section
function TeamSection() {
  const team = [
    { name: 'Nguyễn Phương Huyền', role: 'CEO', image: images.founder },
    { name: 'Nguyễn Thị Huyền Anh', role: 'CTO', image: images.techLead },
    { name: 'Trần Văn Bảo', role: 'Lead Designer', image: images.artisanManager },
    { name: 'Ngô Thái Giang', role: 'Product Lead', image: images.founderAlt4 },
    { name: 'Nguyễn Thanh Hoan', role: 'Marketing Lead', image: images.founderAlt5 },
    { name: 'Nguyễn Xuân Thành', role: 'Operations Lead', image: images.founderAlt6 },
  ];

  return (
    <Box sx={{ backgroundColor: 'white', py: 12, px: 10 }}>
      <Container maxWidth="lg">
        <Stack spacing={8}>
          {/* Header */}
          <Stack spacing={2} alignItems="center">
            <Typography
              variant="caption"
              sx={{
                color: '#a83232',
                fontWeight: 'bold',
                fontSize: '14px',
                letterSpacing: '2.8px',
                textTransform: 'uppercase',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              The Team
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '36px',
                textAlign: 'center',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              Creators of Culture
            </Typography>
          </Stack>

          {/* Team Grid */}
          <Grid container spacing={6}>
            {team.map((member) => (
              <Grid key={member.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack spacing={2} alignItems="center">
                  {/* Image */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '192px',
                      height: '192px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(168, 50, 50, 0.2)',
                    }}
                  >
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  {/* Info */}
                  <Stack spacing={0.5} alignItems="center">
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        color: '#0f172a',
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#a83232',
                      }}
                    >
                      {member.role}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default function AboutUsPage() {
  return (
    <Box sx={{ backgroundColor: '#f8f6f6', width: '100%' }}>
      <HeroSection />
      <MissionSection />
      <StorySection />
      <TeamSection />
    </Box>
  );
}
