enum ACTION {
  DELETEALL = 'delete-all',
  STATUS = 'status',
  DELETEALLFOREVER = 'delete-all-forever',
  RESTOREALL = 'restore-all'
}

enum STATUS {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out-of-stock',
  DISCONTINUED = 'discontinued'
}

export default {
  ACTION,
  STATUS
}
