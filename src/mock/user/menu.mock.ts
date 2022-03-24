import { MenuList } from '@/interface/layout/menu.interface';
import { mock, intercepter } from '../config';

const mockMenuList: MenuList = [
  {
    key: 'dashboard',
    label: {
      zh_CN: '首页',
      en_US: 'Dashboard',
    },
    icon: 'dashboard',
    path: '/dashboard',
  },
  {
    key: 'documentation',
    label: {
      zh_CN: '文档',
      en_US: 'Documentation',
    },
    icon: 'documentation',
    path: '/documentation',
  },
  {
    key: 'guide',
    label: {
      zh_CN: '引导',
      en_US: 'Guide',
    },
    icon: 'guide',
    path: '/guide',
  },
  {
    key: 'permission',
    label: {
      zh_CN: '权限',
      en_US: 'Permission',
    },
    icon: 'permission',
    path: '/permission',
    children: [
      {
        key: 'routePermission',
        label: {
          zh_CN: '路由权限',
          en_US: 'Route Permission',
        },
        path: '/permission/route',
      },
      {
        key: 'notFound',
        label: {
          zh_CN: '404',
          en_US: '404',
        },
        path: '/permission/404',
      },
    ],
  },
  {
    key: 'component',
    label: {
      zh_CN: '组件',
      en_US: 'Component',
    },
    icon: 'permission',
    path: '/component',
    children: [
      {
        key: 'componentForm',
        label: {
          zh_CN: '表单',
          en_US: 'Form',
        },
        path: '/component/form',
      },
      {
        key: 'componentTable',
        label: {
          zh_CN: '表格',
          en_US: 'Table',
        },
        path: '/component/table',
      },
      {
        key: 'componentSearch',
        label: {
          zh_CN: '查询',
          en_US: 'Search',
        },
        path: '/component/search',
      },
      {
        key: 'componentAside',
        label: {
          zh_CN: '侧边栏',
          en_US: 'Aside',
        },
        path: '/component/aside',
      },
      {
        key: 'componentTabs',
        label: {
          zh_CN: '选项卡',
          en_US: 'Tabs',
        },
        path: '/component/tabs',
      },
      {
        key: 'componentRadioCards',
        label: {
          zh_CN: '单选卡片',
          en_US: 'Radio Cards',
        },
        path: '/component/radio-cards',
      },
    ],
  },

  {
    key: 'business',
    label: {
      zh_CN: '业务',
      en_US: 'Business',
    },
    icon: 'permission',
    path: '/business',
    children: [
      {
        key: 'basic',
        label: {
          zh_CN: '基本',
          en_US: 'Basic',
        },
        path: '/business/basic',
      },
      {
        key: 'withSearch',
        label: {
          zh_CN: '带查询',
          en_US: 'WithSearch',
        },
        path: '/business/with-search',
      },
      {
        key: 'withAside',
        label: {
          zh_CN: '带侧边栏',
          en_US: 'WithAside',
        },
        path: '/business/with-aside',
      },
      {
        key: 'withRadioCard',
        label: {
          zh_CN: '带单选卡片',
          en_US: 'With Nav Tabs',
        },
        path: '/business/with-radio-cards',
      },
      {
        key: 'withTabs',
        label: {
          zh_CN: '带选项卡',
          en_US: 'With Tabs',
        },
        path: '/business/with-tabs',
      },
    ],
  },
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
