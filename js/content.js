/* Video nổi bật (TikTok @vandq96) – lượt xem ghi nhận tháng 11/2026 */
const VIDEOS = [
  { id: "7601400343624240402", title: "Nghỉ việc sau 9 năm khó hơn tôi nghĩ", views: "130.8K", tag: "Nghỉ việc", pinned: true },
  { id: "7608578844013939986", title: "Thất nghiệp có đáng sợ? Hành trình nghỉ việc còn 9 ngày nữa", views: "83.5K", tag: "Nghỉ việc", pinned: true },
  { id: "7710803177699872007", title: "P7: Đôi khi mình chẳng còn lựa chọn nào khác – chỉ vì một tờ giấy", views: "46.4K", tag: "Kinh nghiệm làm việc" },
  { id: "7707844987957923090", title: "Tranh cãi mãi về tổ trưởng sản xuất – nói tổng quát cho anh em hiểu", views: "13.2K", tag: "Kinh nghiệm làm việc" },
  { id: "7710932747144957202", title: "Thay đổi công việc, bạn đem được bao nhiêu thứ sang công ty mới?", views: "3.2K", tag: "Kinh nghiệm làm việc" },
  { id: "7711712204197760308", title: "P10: 30 tuổi được trọng dụng, 40 tuổi lớp lãnh đạo trẻ lên – vì mình đứng yên quá lâu", views: "3.2K", tag: "Kinh nghiệm làm việc" },
  { id: "7711339486709304594", title: "P9: Sau 9 năm, lần đầu tôi đưa ra quyết định cho bản thân", views: "521", tag: "Nghỉ việc" },
  { id: "7709153021829090578", title: "Không cần học đại học vẫn thành công?", views: "666", tag: "Học tập" },
  { id: "7709839953856826642", title: "Việc học có thực sự còn giá trị?", views: "552", tag: "Học tập" },
  { id: "7706851282635590920", title: "PR 10 km – 49:40", views: "263", tag: "Chạy bộ" },
  { id: "7708926537755528455", title: "Chẳng cần thể hiện với ai, rèn luyện kỷ luật mỗi ngày", views: "467", tag: "Chạy bộ" },
  { id: "7708425643930815751", title: "Trăm ngày nắng, có một ngày mưa – hôm nay gãy bài long run", views: "448", tag: "Chạy bộ" }
];

/* Hành trình chạy bộ */
const RUN_STATS = [
  { v: "49:40", l: "Kỷ lục cá nhân 10 km" },
  { v: "150 km", l: "Mục tiêu mỗi tháng" },
  { v: "2:09:55", l: "21 km đầu tiên (25/10/2026)" },
  { v: "Sub 2", l: "Mục tiêu bán marathon tiếp theo" }
];
const RUN_MILESTONES = [
  { when: "03/2026", title: "Bắt đầu tập chạy", text: "Những ngày đầu chỉ chạy được 500–700 m là phải dừng lại đi bộ.", post: "" },
  { when: "03/04/2026", title: "5 km không nghỉ – 31 phút", text: "Sau hơn 20 ngày kiên trì, lần đầu tiên chạy hết 5 km liên tục, dù không dưới 10 lần muốn dừng.", post: "khoanh-khac-dau-tien-toi-chay-5km-khong-nghi-mot-cot-moc-nho-nhung-day-y-nghia" },
  { when: "04/2026", title: "Leo Yên Tử bằng đường bộ", text: "Xuất phát lúc 1 giờ sáng, khoảng 4 tiếng lên tới chùa Đồng – lần đầu sau nhiều năm không phải đi cáp treo.", post: "chinh-phuc-yen-tu-1-thang-tap-luyen" },
  { when: "25/10/2026", title: "21 km đầu tiên – 2:09:55", text: "Lần đầu chạy hết cự ly bán marathon: 21,2 km, pace 6:08, một mình trên cung đường Đồng Thái.", post: "lan-dau-chay-21km-ban-marathon" },
  { when: "11/11/2026", title: "PR 10 km – 49:40", text: "Kỷ lục cá nhân mới: 10,01 km, pace 4:58 – từ pace 7:04 của lần đầu chạy 10 km hồi tháng 5.", post: "pr-10km-49-40-tu-500m-den-duoi-50-phut", video: "7706851282635590920" },
  { when: "Tiếp theo", title: "Bán marathon 21 km dưới 2 giờ", text: "Mục tiêu tiếp theo: duy trì 150 km mỗi tháng và hoàn thành 21 km dưới 2 giờ.", post: "" }
];
