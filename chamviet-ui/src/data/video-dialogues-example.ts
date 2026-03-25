import type { VideoRegistry } from "../components/video/YouTubeStopOverlayPlayer";

export const VIDEO_REGISTRY: VideoRegistry = {
  // ========================================================================
  // Video 1: Giới thiệu dự án "Chạm Việt"
  // ========================================================================
  "Mb0RWyh3sqQ": {
    stopTime: 30,
    overlayType: "dialogue",
    startDialogueId: "intro_greeting",
    mascotAvatarUrl: "/assets/mascot/be-go-happy.png", 
    dialogues: {
      intro_greeting: {
        id: "intro_greeting",
        text: "Chào bạn! Mình là Bé Gỗ. 🪵\n\nBạn có cảm nhận được hơi thở của lịch sử qua những đường nét chạm khắc vừa rồi không?",
        options: [
          {
            id: "opt_1",
            label: "Rất ấn tượng và tinh xảo!",
            nextStep: "brand_story",
            isCta: false,
          },
          {
            id: "opt_2",
            label: "Tụi mình đang làm gì thế?",
            nextStep: "what_is_chamviet",
            isCta: false,
          },
        ],
      },
      brand_story: {
        id: "brand_story",
        text: "Cảm ơn bạn! Tụi mình tin rằng mỗi miếng gỗ đều có tâm hồn. Chạm Việt muốn 'chạm' vào ký ức của bạn bằng những câu chuyện sử Việt hào hùng.\n\nBạn muốn tìm hiểu về bộ sưu tập nào nhất?",
        options: [
          {
            id: "opt_3",
            label: "Các Vị Anh Hùng Dân Tộc",
            nextStep: "hero_collection",
            isCta: false,
          },
          {
            id: "opt_4",
            label: "Di Sản Văn Hóa Việt",
            nextStep: "heritage_collection",
            isCta: false,
          },
        ],
      },
      what_is_chamviet: {
        id: "what_is_chamviet",
        text: "Chạm Việt là dự án kể chuyện lịch sử trên những tấm thẻ gỗ. Tụi mình mong muốn biến những bài học khô khan thành những món quà cầm nắm được và đầy cảm xúc.",
        options: [
          {
            id: "opt_5",
            label: "Nghe thú vị quá, cho mình xem thử!",
            nextStep: "brand_story",
            isCta: false,
          },
          {
            id: "opt_6",
            label: "Để mình xem nốt video đã",
            nextStep: "end",
            isCta: false,
          },
        ],
      },
      hero_collection: {
        id: "hero_collection",
        text: "Từ Hai Bà Trưng cưỡi voi đến Ngô Quyền đóng cọc trên sông Bạch Đằng... tất cả đều được tái hiện tỉ mỉ. Bạn có muốn sở hữu một 'mảnh sử' này không?",
        options: [
          {
            id: "opt_7",
            label: "Xem cửa hàng ngay 🛒",
            nextStep: "end",
            isCta: true,
          },
          {
            id: "opt_8",
            label: "Quay lại video",
            nextStep: "end",
            isCta: false,
          },
        ],
      },
      heritage_collection: {
        id: "heritage_collection",
        text: "Những đóa sen, những mái đình cổ kính được khắc họa bằng công nghệ laser tiên tiến nhưng vẫn giữ nét mộc mạc của gỗ. Đây sẽ là món quà lưu niệm rất ý nghĩa đó!",
        options: [
          {
            id: "opt_9",
            label: "Khám phá bộ sưu tập Sen 🪷",
            nextStep: "end",
            isCta: true,
          },
          {
            id: "opt_10",
            label: "Xem tiếp câu chuyện",
            nextStep: "end",
            isCta: false,
          },
        ],
      },
    },
  },

  // ========================================================================
  // Video 2: Quy trình chế tác (How it's made)
  // ========================================================================
  "process_video_id": {
    stopTime: 45,
    overlayType: "dialogue",
    startDialogueId: "process_intro",
    mascotAvatarUrl: "/assets/mascot/be-go-working.png",
    dialogues: {
      process_intro: {
        id: "process_intro",
        text: "Bạn thấy không? Để có một tấm thẻ hoàn thiện, tụi mình phải xử lý gỗ qua 5 công đoạn và kiểm tra thủ công từng tấm một đó!",
        options: [
          {
            id: "p_1",
            label: "Kỹ lưỡng quá nhỉ!",
            nextStep: "material_info",
            isCta: false,
          },
          {
            id: "p_2",
            label: "Gỗ này là gỗ gì vậy?",
            nextStep: "wood_type",
            isCta: false,
          },
        ],
      },
      material_info: {
        id: "material_info",
        text: "Sự tỉ mỉ tạo nên giá trị bền vững mà! Chạm Việt cam kết sử dụng gỗ rừng trồng bền vững để bảo vệ môi trường nữa đó. 🌿",
        options: [
          {
            id: "p_3",
            label: "Rất hoan nghênh! Tiếp tục xem",
            nextStep: "end",
            isCta: false,
          },
        ],
      },
      wood_type: {
        id: "wood_type",
        text: "Tụi mình dùng gỗ dẻ tùng và gỗ thông cao cấp, đảm bảo vân gỗ đẹp và mùi thơm tự nhiên. Bạn có muốn đặt khắc tên riêng lên thẻ không?",
        options: [
          {
            id: "p_4",
            label: "Có, mình muốn đặt custom!",
            nextStep: "end",
            isCta: true,
          },
          {
            id: "p_5",
            label: "Để mình xem tiếp quy trình",
            nextStep: "end",
            isCta: false,
          },
        ],
      },
    },
  },
};