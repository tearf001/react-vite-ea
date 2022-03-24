import React from 'react';

export interface MenuItem {
  /** menu item code */
  key: string;
  /** menu labels */
  label: {
    zh_CN?: string;
    en_US?: string;
  };
  /** 图标名称
   *
   * 子子菜单不需要图标
   */
  icon?: string;
  /** 菜单路由 */
  path: string;
  /** 子菜单 */
  children?: MenuItem[];
  component?: React.ReactNode;
}

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
