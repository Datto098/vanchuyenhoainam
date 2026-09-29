import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Chính sách quyền riêng tư | Vận Chuyển Hoài Nam',
  description: 'Chính sách quyền riêng tư của tiện ích Vận Chuyển Hoài Nam.',
};

export default function ExtensionPrivacyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <p className={styles.eyebrow}>Tiện ích Chrome</p>
        <h1>Chính sách quyền riêng tư</h1>
        <p className={styles.updated}>Cập nhật lần cuối: 29/09/2026</p>

        <p className={styles.intro}>
          Tiện ích Vận Chuyển Hoài Nam hỗ trợ người dùng gửi thông tin sản phẩm từ
          Taobao, Tmall và 1688 tới hệ thống đặt hàng của Vận Chuyển Hoài Nam. Chính
          sách này giải thích dữ liệu được xử lý khi bạn sử dụng tiện ích.
        </p>

        <section className={styles.section}>
          <h2>1. Dữ liệu chúng tôi thu thập</h2>
          <ul>
            <li>ID tài khoản Vận Chuyển Hoài Nam để liên kết yêu cầu với đúng người dùng.</li>
            <li>URL, tiêu đề, nội dung sản phẩm, thông tin cửa hàng, giá và lựa chọn SKU.</li>
            <li>Đường dẫn hình ảnh và thông tin mô tả hình ảnh của sản phẩm.</li>
            <li>Ghi chú mà người dùng chủ động nhập trước khi gửi yêu cầu đặt hàng.</li>
            <li>
              Thông tin kỹ thuật của task như mã yêu cầu, trạng thái xử lý và thông tin lỗi.
            </li>
          </ul>
          <p>
            Tiện ích chỉ gửi dữ liệu sản phẩm khi người dùng tích chọn đồng ý và bấm
            “Đặt hàng”. Tiện ích không thu thập mật khẩu, thông tin thanh toán hoặc nội
            dung từ các trang không được khai báo trong phạm vi hoạt động.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Mục đích sử dụng</h2>
          <p>
            Dữ liệu được dùng để nhận diện tài khoản, đọc và chuẩn hóa thông tin sản
            phẩm, hỗ trợ AI phân tích sản phẩm/SKU, tạo yêu cầu đặt hàng và hiển thị tiến
            trình xử lý. Chúng tôi không bán dữ liệu và không sử dụng dữ liệu này cho
            quảng cáo hoặc chấm điểm tín dụng.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Chia sẻ và bên xử lý dữ liệu</h2>
          <p>Dữ liệu có thể được truyền qua kết nối HTTPS tới:</p>
          <ul>
            <li>Máy chủ Vận Chuyển Hoài Nam và AI Order Dashboard để xử lý task.</li>
            <li>
              Nhà cung cấp dịch vụ AI được cấu hình cho hệ thống để trích xuất và chuẩn
              hóa thông tin sản phẩm.
            </li>
            <li>Hệ thống giỏ hàng/đặt hàng Vận Chuyển Hoài Nam để hoàn tất yêu cầu.</li>
          </ul>
          <p>
            Các bên xử lý chỉ nhận dữ liệu cần thiết để cung cấp chức năng nêu trên và
            phải tuân theo các nghĩa vụ bảo mật áp dụng. Chúng tôi có thể cung cấp dữ liệu
            khi pháp luật yêu cầu hoặc để bảo vệ an toàn của hệ thống và người dùng.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Lưu trữ và bảo mật</h2>
          <p>
            ID đăng nhập do tiện ích lưu trong bộ nhớ phiên của trình duyệt và được xóa
            khi phiên trình duyệt kết thúc. Sự đồng ý với chính sách được lưu cục bộ trong
            trình duyệt. Dữ liệu task được lưu trên hệ thống trong thời gian cần thiết để
            xử lý đơn, hỗ trợ người dùng, phòng chống lạm dụng và đáp ứng nghĩa vụ pháp
            lý. Chúng tôi sử dụng HTTPS, kiểm soát truy cập và các biện pháp kỹ thuật phù
            hợp để bảo vệ dữ liệu.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Quyền và lựa chọn của người dùng</h2>
          <p>
            Bạn có thể không gửi yêu cầu, bỏ chọn ô đồng ý, gỡ tiện ích hoặc xóa dữ liệu
            của tiện ích trong phần cài đặt Chrome. Để yêu cầu xem, sửa hoặc xóa dữ liệu
            task gắn với tài khoản, hãy liên hệ qua website Vận Chuyển Hoài Nam. Chúng tôi
            sẽ xác minh danh tính trước khi thực hiện yêu cầu.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Phạm vi và thay đổi chính sách</h2>
          <p>
            Chính sách này áp dụng cho tiện ích Chrome “Vận Chuyển Hoài Nam”. Khi có thay
            đổi quan trọng về dữ liệu hoặc mục đích xử lý, ngày cập nhật ở đầu trang sẽ
            được điều chỉnh và người dùng có thể được yêu cầu đồng ý lại.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Liên hệ</h2>
          <p>
            Nếu có câu hỏi hoặc yêu cầu liên quan đến quyền riêng tư, vui lòng liên hệ
            qua <a href="https://vanchuyenhoainam.vn/">vanchuyenhoainam.vn</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
