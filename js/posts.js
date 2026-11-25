/* Danh sách bài viết */
const POSTS = [
 {
  "slug": "ung-dung-ai-vao-cong-viec-thuc-te",
  "title": "Tôi đã ứng dụng AI vào công việc như thế nào? Câu chuyện của một người không biết code",
  "date": "2026-11-24",
  "desc": "Không biết lập trình, không học công nghệ – nhưng với sự hỗ trợ của AI, tôi đã tự xây dựng các ứng dụng quản lý nhân sự, dự án block tàu, kế toán nội bộ và cả website cá nhân. Chia sẻ thật từ công việc hằng ngày.",
  "short": "Không biết code, nhưng tôi đã dùng AI tự dựng ứng dụng quản lý nhân sự, dự án và kế toán cho công ty. Đây là những gì AI thực sự giúp được tôi.",
  "cat": "Quản lý & công việc",
  "emoji": "🤖",
  "color": "#1d2a44",
  "key": "quan-ly",
  "img": "images/posts/ai/ung-dung-noi-bo.jpg",
  "read": 4
 },
 {
  "slug": "pr-10km-49-40-tu-500m-den-duoi-50-phut",
  "title": "PR 10km – 49:40: Từ 500m đã phải dừng đến 10km dưới 50 phút",
  "date": "2026-11-11",
  "desc": "Hành trình 8 tháng chạy bộ của một ông bố U40: từ những ngày chạy 500m đã phải dừng lại, đến kỷ lục cá nhân 10km 49:40 với pace 4:58. Giáo án, những buổi tempo và bài học về kỷ luật.",
  "short": "10,01 km – pace 4:58 – 49 phút 40 giây. Con số mà 8 tháng trước tôi chưa bao giờ dám nghĩ tới.",
  "cat": "Sức khỏe & kỷ luật",
  "emoji": "🏃",
  "color": "#0a9d6c",
  "key": "suc-khoe",
  "img": "images/posts/pr-10km/pr-10km-49-40.jpg",
  "read": 5
 },
 {
  "slug": "lan-dau-chay-21km-ban-marathon",
  "title": "21km đầu tiên: Bán marathon của một người từng chạy 500m đã phải dừng",
  "date": "2026-10-25",
  "desc": "Chiều Chủ nhật 25/10/2026, tôi hoàn thành 21,2km đầu tiên trong đời – 2 giờ 09 phút 55 giây, pace 6:08. Câu chuyện về những km cuối, về việc chạy một mình và về mục tiêu bán marathon dưới 2 giờ.",
  "short": "21,2km – 2:09:55 – pace 6:08. Lần đầu tiên trong đời tôi chạy hết một cự ly bán marathon.",
  "cat": "Sức khỏe & kỷ luật",
  "emoji": "🏅",
  "color": "#14532d",
  "key": "suc-khoe",
  "img": "images/posts/hm-21km/long-run-first-hm.jpg",
  "read": 4
 },
 {
  "slug": "tuoi-30-moi-bat-dau-tich-luy-co-muon-khong",
  "title": "Tuổi 30 Mới Bắt Đầu Tích Lũy Có Muộn Không? 5 Bước Xây Dựng Tài Sản Từ Con Số 0",
  "date": "2026-06-20",
  "desc": "Tuổi 30 mới bắt đầu tích lũy có quá muộn? Tìm hiểu những sai lầm tài chính phổ biến, cách xây dựng quỹ dự phòng, quản lý chi tiêu và tích sản hiệu quả để hướng tới tự do tài chính.",
  "short": "Tuổi 30 mới bắt đầu tích lũy có quá muộn? Tìm hiểu những sai lầm tài chính phổ biến, cách xây dựng quỹ dự phòng, quản lý chi tiêu và tích sản hiệu quả để hướng tới tự do tài chính.",
  "cat": "Tài chính cá nhân",
  "emoji": "💰",
  "color": "#1f3a5f",
  "key": "tai-chinh",
  "read": 3
 },
 {
  "slug": "chinh-phuc-yen-tu-1-thang-tap-luyen",
  "title": "Hành trình chinh phục Yên Tử sau 1 tháng tập luyện: Bài học về kỷ luật và sức bền",
  "date": "2026-04-13",
  "desc": "Hành trình leo Yên Tử bằng đường bộ sau 1 tháng tập luyện. Chia sẻ kinh nghiệm thực tế, thời gian leo và bài học về kỷ luật, sức khỏe.",
  "short": "Sau 1 tháng tập luyện, tôi quay lại leo Yên Tử bằng đường bộ lúc 1 giờ sáng – và nhận ra kỷ luật sẽ trả lời tất cả.",
  "cat": "Sức khỏe & kỷ luật",
  "emoji": "⛰️",
  "color": "#0b5d45",
  "key": "suc-khoe",
  "read": 2
 },
 {
  "slug": "chay-bo-co-phai-phi-thoi-gian",
  "title": "Chạy bộ có phải phí thời gian không? Bài học sau nhiều năm chỉ biết kiếm tiền",
  "date": "2026-04-13",
  "desc": "Chạy bộ có phải phí thời gian? Sau nhiều năm chỉ tập trung kiếm tiền, tôi nhận ra sức khỏe mới là khoản đầu tư quan trọng nhất.",
  "short": "“Rảnh thì đi kiếm tiền đi…” – sau nhiều năm chỉ biết làm việc, tôi nhận ra sức khỏe mới là khoản đầu tư quan trọng nhất.",
  "cat": "Sức khỏe & kỷ luật",
  "emoji": "🏃",
  "color": "#0a9d6c",
  "key": "suc-khoe",
  "read": 2
 },
 {
  "slug": "bai-hoc-quan-ly-nhan-su-9-nam",
  "title": "Bài học sau 9 năm làm việc: Tử tế là chưa đủ trong quản lý con người",
  "date": "2026-04-04",
  "desc": "Sau 9 năm làm việc, tôi nhận ra một bài học quan trọng: tử tế thôi chưa đủ trong môi trường công việc. Cần có kỷ luật và ranh giới rõ ràng.",
  "short": "Sau 9 năm làm việc, tôi nhận ra một bài học quan trọng: tử tế thôi chưa đủ trong môi trường công việc. Cần có kỷ luật và ranh giới rõ ràng.",
  "cat": "Quản lý & công việc",
  "emoji": "🧭",
  "color": "#2c313b",
  "key": "quan-ly",
  "read": 2
 },
 {
  "slug": "khoanh-khac-dau-tien-toi-chay-5km-khong-nghi-mot-cot-moc-nho-nhung-day-y-nghia",
  "title": "Khoảnh khắc đầu tiên tôi chạy 5km không nghỉ – một cột mốc nhỏ nhưng đầy ý nghĩa",
  "date": "2026-04-04",
  "desc": "Từ chạy 500 m đã phải dừng, sau hơn 20 ngày kiên trì tôi chạy 5 km liên tục trong 31 phút.",
  "short": "Từ chạy 500 m đã phải dừng, sau hơn 20 ngày kiên trì tôi chạy 5 km liên tục trong 31 phút.",
  "cat": "Sức khỏe & kỷ luật",
  "emoji": "🏁",
  "color": "#127a5a",
  "key": "suc-khoe",
  "read": 2
 },
 {
  "slug": "cong-viec-ban-hay-sach-de-hay-kho-nang-hay-nhe-khong-phai-dieu-quan-trong-nhat",
  "title": "Công việc bẩn hay sạch, dễ hay khó, nặng hay nhẹ… không phải điều quan trọng nhất",
  "date": "2026-04-03",
  "desc": "Công việc không định nghĩa giá trị của bạn. Cách bạn phát triển từ công việc đó mới là điều quan trọng.",
  "short": "Công việc không định nghĩa giá trị của bạn. Cách bạn phát triển từ công việc đó mới là điều quan trọng.",
  "cat": "Quản lý & công việc",
  "emoji": "🔧",
  "color": "#4a3f35",
  "key": "quan-ly",
  "read": 2
 }
];
