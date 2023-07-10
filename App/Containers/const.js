export default {
  status(num) {
    switch (num) {
      case 0:
        return 'Đã hủy';
      case 1:
        return 'Đơn hàng mới';
      case 2:
        return 'Đã duyệt';
      case 3:
        return 'Đã đặt cọc';
      case 4:
        return 'Đã mua hàng';
      case 5:
        return 'Đã phát hàng';
      case 6:
        return 'Đã phát hàng';
      case 7:
        return 'Đã về kho';
      case 8:
        return 'Đã nhận';
    }
  },
  transaction_type(num) {
    switch (num) {
      case 1:
        return 'Cập nhật';
      case 2:
        return 'Hoàn lại';
      case 3:
        return 'Đặt cọc';
      case 4:
        return 'Thanh toán hóa đơn';
    }
  },
  statusPackOrder(num) {
    switch (num) {
      case 0:
        return 'Đã hủy';
      case 1:
        return 'Chờ xử lý';
      case 5:
        return 'Chờ xử lý';
      case 6:
        return 'Đã về kho';
      case 8:
        return 'Đã nhận';
    }
  },
};
