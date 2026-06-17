export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/orders/index',
    'pages/workshop/index',
    'pages/ledger/index',
    'pages/products/index',
    'pages/customers/index',
    'pages/sales/index',
    'pages/income/index',
    'pages/customer-detail/index',
    'pages/order-detail/index',
    'pages/new-order/index',
    'pages/workshop-detail/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#B87333',
    navigationBarTitleText: '铜器锻打作坊',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#9C8B7E',
    selectedColor: '#B87333',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '款式库'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单'
      },
      {
        pagePath: 'pages/workshop/index',
        text: '工坊'
      },
      {
        pagePath: 'pages/ledger/index',
        text: '台账'
      }
    ]
  }
})
