STORY_TITLE = "Lạc Long Quân và Âu Cơ"
CHILD_AGE   = 6

STORY = """
Ngày xưa, ở miền đất Lạc Việt có một vị thần tên là Lạc Long Quân. Thần mình rồng, thường ở dưới nước, thỉnh thoảng lên sống trên cạn, sức khoẻ vô địch, có nhiều phép lạ. Bấy giờ, ở vùng núi cao có nàng Âu Cơ xinh đẹp tuyệt trần, nghe vùng đất Lạc Việt có nhiều hoa thơm cỏ lạ bèn tìm đến thăm. Hai người gặp nhau, kết thành vợ chồng.

Ít lâu sau, Âu Cơ có mang. Đến kì sinh, chuyện thật lạ, nàng sinh ra cái bọc trăm trứng. Trăm trứng nở ra một trăm người con hồng hào, đẹp đẽ lạ thường. Đàn con lớn nhanh như thổi, mặt mũi khôi ngô, khoẻ mạnh như thần.

Sống với nhau được ít lâu, Lạc Long Quân bàn với vợ:
– Ta vốn nòi rồng ở miền nước thẳm, nàng là dòng tiên ở chốn non cao. Kẻ trên cạn, người dưới nước, tập quán khác nhau, khó mà ở cùng nhau lâu dài được. Nay ta đem năm mươi con xuống biển, nàng đưa năm mươi con lên núi, chia nhau cai quản các phương, khi có việc thì giúp đỡ lẫn nhau, đừng quên lời hẹn.

Một trăm người con của Lạc Long Quân và Âu Cơ sau này trở thành tổ tiên của người Việt. Người con trưởng theo Âu Cơ được tôn lên làm vua, lấy hiệu là Hùng Vương, đóng đô ở đất Phong Châu, đặt tên nước là Văn Lang. Con trai vua gọi là Lang, con gái vua gọi là Mị Nương; khi cha mất thì ngôi được truyền cho con trưởng, mười mấy đời truyền nối ngôi vua đều lấy hiệu là Hùng Vương, không hề thay đổi.

Cũng bởi sự tích này mà về sau, người Việt ta thường tự hào xưng là con Rồng cháu Tiên và thân mật gọi nhau là đồng bào.
"""

# Danh sách câu hỏi tự luận
# - answer: câu trả lời chuẩn dùng để so sánh cosine với câu trả lời của bé
# - KHÔNG có explanation — LLM tự sinh từ nội dung STORY
QA_LIST = [
    {
        "question": "Lạc Long Quân là ai?",
        "answer"  : "Là một vị thần mình rồng, rất khỏe và có phép lạ.",
    },
    {
        "question": "Âu Cơ là ai?",
        "answer"  : "Là một nàng tiên rất xinh đẹp, sống trên núi.",
    },
    {
        "question": "Lạc Long Quân và Âu Cơ đã làm gì khi gặp nhau?",
        "answer"  : "Hai người yêu nhau và trở thành vợ chồng.",
    },
    {
        "question": "Âu Cơ sinh ra điều gì đặc biệt?",
        "answer"  : "Sinh ra một bọc trăm trứng.",
    },
    {
        "question": "Từ bọc trứng nở ra bao nhiêu người con?",
        "answer"  : "Nở ra một trăm người con.",
    },
    {
        "question": "Những người con đó như thế nào?",
        "answer"  : "Khỏe mạnh, đẹp đẽ và lớn nhanh.",
    },
    {
        "question": "Vì sao Lạc Long Quân và Âu Cơ phải chia tay?",
        "answer"  : "Vì một người ở nước, một người ở núi nên không sống cùng lâu được.",
    },
    {
        "question": "Hai người đã chia các con như thế nào?",
        "answer"  : "Năm mươi con theo cha xuống biển, năm mươi con theo mẹ lên núi.",
    },
    {
        "question": "Người con trưởng đã trở thành ai?",
        "answer"  : "Trở thành vua Hùng Vương.",
    },
    {
        "question": "Nước đầu tiên của người Việt tên là gì?",
        "answer"  : "Tên là Văn Lang.",
    },
    {
        "question": "Vì sao người Việt gọi nhau là đồng bào?",
        "answer"  : "Vì cùng sinh ra từ một bọc trăm trứng.",
    },
    {
        "question": "Người Việt tự hào gọi mình là gì?",
        "answer"  : "Là con Rồng cháu Tiên.",
    },
]
