// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  DollarOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  DollarOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Expense',
      type: 'item',
      url:'/typography',
      icon: icons.DollarOutlined
    },
    {
      id: 'util-income',
      title: 'Income',
      url:'/income',
      type: 'item',
      
      icon: icons.DollarOutlined
    },
  ]
};

export default utilities;
