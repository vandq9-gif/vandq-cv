/* Video nổi bật (TikTok) */
const VIDEOS = [
  {
    "id": "7601400343624240402",
    "title": "Nghỉ việc sau 9 năm khó hơn tôi nghĩ",
    "views": "130.8K",
    "tag": "Nghỉ việc",
    "pinned": true
  },
  {
    "id": "7710803177699872007",
    "title": "P7: Đôi khi mình chẳng còn lựa chọn nào khác – chỉ vì một tờ giấy",
    "views": "46.4K",
    "tag": "Kinh nghiệm làm việc"
  },
  {
    "id": "7710932747144957202",
    "title": "Thay đổi công việc, bạn đem được bao nhiêu thứ sang công ty mới?",
    "views": "3.2K",
    "tag": "Kinh nghiệm làm việc"
  },
  {
    "id": "7711339486709304594",
    "title": "P9: Sau 9 năm, lần đầu tôi đưa ra quyết định cho bản thân",
    "views": "521",
    "tag": "Nghỉ việc"
  },
  {
    "id": "7709153021829090578",
    "title": "Không cần học đại học vẫn thành công?",
    "views": "666",
    "tag": "Học tập"
  },
  {
    "id": "7706851282635590920",
    "title": "PR 10 km – 49:40",
    "views": "263",
    "tag": "Chạy bộ"
  },
  {
    "id": "7709839953856826642",
    "title": "Việc học có thực sự còn giá trị?",
    "views": "552",
    "tag": "Học tập"
  },
  {
    "id": "7708926537755528455",
    "title": "Chẳng cần thể hiện với ai, rèn luyện kỷ luật mỗi ngày",
    "views": "467",
    "tag": "Chạy bộ"
  },
  {
    "id": "7708425643930815751",
    "title": "Trăm ngày nắng, có một ngày mưa – hôm nay gãy bài long run",
    "views": "448",
    "tag": "Chạy bộ"
  },
  {
    "id": "7711712204197760308",
    "title": "P10: 30 tuổi được trọng dụng, 40 tuổi lớp lãnh đạo trẻ lên – vì mình đứng yên quá lâu",
    "views": "3.2K",
    "tag": "Kinh nghiệm làm việc"
  },
  {
    "id": "7707844987957923090",
    "title": "Tranh cãi mãi về tổ trưởng sản xuất – nói tổng quát cho anh em hiểu",
    "views": "13.2K",
    "tag": "Kinh nghiệm làm việc"
  },
  {
    "id": "7608578844013939986",
    "title": "Thất nghiệp có đáng sợ? Hành trình nghỉ việc còn 9 ngày nữa",
    "views": "83.5K",
    "tag": "Nghỉ việc",
    "pinned": true
  }
];

/* Hành trình chạy bộ */
const RUN_STATS = [
  {
    "v": "49:40",
    "l": "Kỷ lục cá nhân 10 km"
  },
  {
    "v": "150 km",
    "l": "Mục tiêu mỗi tháng"
  },
  {
    "v": "2:09:55",
    "l": "21 km đầu tiên (25/10/2026)"
  },
  {
    "v": "Sub 2",
    "l": "Mục tiêu bán marathon tiếp theo"
  }
];

const RUN_MILESTONES = [
  {
    "when": "Tiếp theo",
    "title": "Bán marathon 21 km dưới 2 giờ",
    "text": "Mục tiêu tiếp theo: duy trì 150 km mỗi tháng và hoàn thành 21 km dưới 2 giờ.",
    "post": ""
  },
  {
    "when": "11/11/2026",
    "title": "PR 10 km – 49:40",
    "text": "Kỷ lục cá nhân mới: 10,01 km, pace 4:58 – từ pace 7:04 của lần đầu chạy 10 km hồi tháng 5.",
    "post": "pr-10km-49-40-tu-500m-den-duoi-50-phut",
    "video": "7706851282635590920"
  },
  {
    "when": "25/10/2026",
    "title": "21 km đầu tiên – 2:09:55",
    "text": "Lần đầu chạy hết cự ly bán marathon: 21,2 km, pace 6:08, một mình trên cung đường Đồng Thái.",
    "post": "lan-dau-chay-21km-ban-marathon"
  },
  {
    "when": "04/2026",
    "title": "Leo Yên Tử bằng đường bộ",
    "text": "Xuất phát lúc 1 giờ sáng, khoảng 4 tiếng lên tới chùa Đồng – lần đầu sau nhiều năm không phải đi cáp treo.",
    "post": "chinh-phuc-yen-tu-1-thang-tap-luyen"
  },
  {
    "when": "03/04/2026",
    "title": "5 km không nghỉ – 31 phút",
    "text": "Sau hơn 20 ngày kiên trì, lần đầu tiên chạy hết 5 km liên tục, dù không dưới 10 lần muốn dừng.",
    "post": "khoanh-khac-dau-tien-toi-chay-5km-khong-nghi-mot-cot-moc-nho-nhung-day-y-nghia"
  },
  {
    "when": "03/2026",
    "title": "Bắt đầu tập chạy",
    "text": "Những ngày đầu chỉ chạy được 500–700 m là phải dừng lại đi bộ.",
    "post": ""
  }
];

/* Dự án / sản phẩm tự xây dựng – demo chạy bằng DỮ LIỆU ẢO */
const PROJECTS = [
  {
    "id": "hr-portal",
    "name": "HR Portal",
    "icon": "👥",
    "tag": "Nhân sự – Tiền lương",
    "status": "Đang dùng thực tế",
    "problem": "Hồ sơ nhân viên, chấm công, bảng lương, BHXH và hợp đồng nằm rải rác trong Excel, Word và giấy tờ – cuối tháng mất nhiều ngày để tính lương.",
    "features": [
      "Hồ sơ nhân viên, hợp đồng, phụ lục tự sinh theo mẫu",
      "Chấm công, tăng ca, đánh giá hiệu suất theo tháng",
      "Bảng lương tự tính BHXH, giảm trừ gia cảnh, thuế TNCN",
      "Người nhận khoán, biên bản nghiệm thu, xuất Excel/PowerPoint"
    ],
    "tech": [
      "HTML/JS",
      "Chạy offline",
      "Lưu OneDrive",
      "Xuất .xlsx/.pptx"
    ],
    "demo": "du-an/hr-portal/index.html"
  },
  {
    "id": "project-block",
    "name": "Project Block",
    "icon": "🏗️",
    "tag": "Quản lý dự án gia công",
    "status": "Đang dùng thực tế",
    "problem": "Mỗi block tàu có khối lượng, đơn giá, tạm ứng, khoán hàn và hàng chục biên bản – theo dõi bằng Excel dễ sót và khó biết lãi lỗ từng block.",
    "features": [
      "Dashboard doanh thu – chi phí – lợi nhuận từng block",
      "Theo dõi trạng thái: giao khoán → thi công → hàn → nghiệm thu → thanh toán",
      "Sổ tạm ứng, phạt, công nợ khách hàng và tổ hàn",
      "Tự sinh biên bản, nhắc hồ sơ còn thiếu, xuất Excel"
    ],
    "tech": [
      "HTML/JS",
      "Kho dữ liệu đám mây",
      "Biểu đồ",
      "Xuất .xlsx/PDF"
    ],
    "demo": "du-an/project-block/index.html"
  },
  {
    "id": "ke-toan",
    "name": "Kế toán nội bộ",
    "icon": "📒",
    "tag": "Kế toán – Tài chính",
    "status": "Đang dùng thực tế",
    "problem": "Doanh nghiệp nhỏ cần sổ sách theo Thông tư 133 nhưng phần mềm thương mại nặng và không nối được với dữ liệu nhân sự, dự án.",
    "features": [
      "Phiếu thu/chi, ủy nhiệm chi, chứng từ mua hàng, quyết toán block",
      "Hệ thống tài khoản TT133, sổ cái, nhật ký chung, cân đối phát sinh",
      "Báo cáo kết quả kinh doanh, chỉ số tài chính trực quan",
      "Đồng bộ danh mục từ HR Portal và Project Block"
    ],
    "tech": [
      "HTML/JS",
      "Thông tư 133",
      "Chạy trên máy văn phòng",
      "Báo cáo tài chính"
    ],
    "demo": "du-an/ke-toan/index.html"
  },
  {
    "id": "hoc-tieng-anh",
    "name": "Game học tiếng Anh",
    "icon": "🎮",
    "tag": "Học tập",
    "status": "Đang phát triển",
    "problem": "Học từ vựng một mình rất dễ bỏ cuộc. Biến việc học mỗi ngày thành một trò chơi: đi quanh thành phố 3D, gặp nhân vật để luyện từ vựng, nghe và nói.",
    "features": [
      "Thế giới 3D với 9 nhân vật có hoạt ảnh, 3 góc nhìn (POV, sau lưng, trên đầu)",
      "Điều khiển bằng bàn phím hoặc joystick cảm ứng, bản đồ mini",
      "Mỗi ngày một đoạn văn, có phiên âm và mẹo nối âm",
      "Luyện nói với nhận diện giọng nói, chấm điểm",
      "Tích điểm kinh nghiệm, lên cấp, nhiệm vụ hằng ngày"
    ],
    "tech": [
      "Three.js",
      "GLTF 3D",
      "Web Speech",
      "Game hóa",
      "Mobile"
    ],
    "demo": "du-an/hoc-tieng-anh/index.html"
  },
  {
    "id": "van-phong-ao",
    "name": "Văn phòng ảo",
    "icon": "🏢",
    "tag": "Nhân viên AI",
    "status": "Thử nghiệm",
    "problem": "Một người phải làm việc của nhiều phòng ban. Ý tưởng: dựng một văn phòng với các “nhân viên AI”, mỗi người một vai trò, nhận việc – làm – nộp kết quả để Giám đốc duyệt.",
    "features": [
      "Sơ đồ văn phòng 3D, mỗi phòng ban một nhóm nhân viên AI",
      "Giao việc, theo dõi trạng thái, duyệt hoặc yêu cầu sửa",
      "Bản tin sáng, nhắc lịch, sổ tay công ty dùng chung",
      "Bản demo tắt AI – chỉ minh họa luồng làm việc"
    ],
    "tech": [
      "HTML/JS",
      "Claude AI",
      "Isometric 3D",
      "Đọc to (TTS)"
    ],
    "demo": "du-an/van-phong-ao/index.html"
  }
];
