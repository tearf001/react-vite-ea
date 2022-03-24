import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, RouteObject } from 'react-router-dom';
import { Tabs, Alert, Dropdown, Menu } from 'antd';
// import { getKeyName, isAuthorized } from '@/assets/js/publicFunc';
import { SyncOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/stores/redux-hooks';
//{ setActiveTag, addTag, removeTag, removeAllTag, removeOtherTag }
import { selectTabs, selectReloadPath, setTabs, setReloadPath } from '@/stores/tags-view.store';
// import style from './TabPanes.module.less';
// import { routeList } from '@/routes';
import NotFoundPage from '@/pages/404';
import { TagItem } from '@/interface/layout/tagsView.interface';
import DashBoardPage from '@/pages/dashboard';
// import { selectRouteMenuList } from '@/stores/user.store';
import { routeList } from '@/routes';
import { MenuItem, MenuList } from '@/interface/layout/menu.interface';

const { TabPane } = Tabs;

const convertRouteToMenu = (route: RouteObject, parentPath: string): MenuItem => {
  const { path, element, children } = route;

  return {
    key: path!,
    label: { zh_CN: path },
    path: parentPath + path,
    component: element,
    children: children as MenuItem[],
  };
};

export const flattenRoutes = (arr: RouteObject[], pp = ''): MenuList =>
  arr.reduce((prev, item) => {
    return prev.concat(
      Array.isArray(item.children) ? flattenRoutes(item.children, item.path) : convertRouteToMenu(item, pp),
    );
  }, [] as MenuList);

export const getKeyName = (path = '/403') => {
  debugger;

  const truePath = path.split('?')[0];
  const flatten_routes = flattenRoutes(routeList);
  const curRoute = flatten_routes.filter((item: { path: string | string[] }) => item.path.includes(truePath));

  if (!curRoute[0]) return { title: '暂无权限', key: '403', component: NotFoundPage };
  const { key: name, key, component } = curRoute[0];

  return { title: name, key, component };
};

export type TagNode = TagItem & {
  title: string;
  content: React.ReactNode;
};

interface Props {
  defaultActiveKey: string;
  panesItem: TagNode;
  tabActiveKey: string;
}

// 多页签组件
const TabPanes: FC<Props> = props => {
  const dispatch = useAppDispatch();
  const reloadPath = useAppSelector(selectReloadPath);
  const curTab = useAppSelector(selectTabs);
  const [activeKey, setActiveKey] = useState<string>('/');
  const [panes, setPanes] = useState<TagNode[]>([]);
  const [isReload, setIsReload] = useState<boolean>(false);

  const [selectedPanel, setSelectedPanel] = useState<any>({});
  const pathRef = useRef<string>('');

  const { defaultActiveKey, panesItem, tabActiveKey } = props;

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const fullPath = pathname + search;

  // 记录当前打开的tab
  const storeTabs = useCallback(
    (ps): void => {
      const pathArr = ps.map((item: any) => item.path);

      dispatch(setTabs(pathArr));
    },
    [dispatch],
  );

  // 从本地存储中恢复已打开的tab列表
  const resetTabs = useCallback((): void => {
    const initPanes = curTab.reduce<TagNode[]>((prev: any, next) => {
      const { title, key, component: Content } = getKeyName(next);

      return [
        ...prev,
        {
          title,
          key,
          content: Content,
          closable: key !== '/',
          path: next,
        },
      ];
    }, [] as TagNode[]);

    const { key } = getKeyName(pathname);

    setPanes(initPanes);
    setActiveKey(key);
  }, [curTab, pathname]);

  // 初始化页面
  useEffect(() => {
    resetTabs();
  }, [resetTabs]);

  // tab切换
  const onChange = (tabKey: string): void => {
    setActiveKey(tabKey);
  };

  // 移除tab
  const remove = (targetKey: string): void => {
    const delIndex = panes.findIndex((item: any) => item.key === targetKey);

    panes.splice(delIndex, 1);

    // 删除非当前tab
    if (targetKey !== activeKey) {
      const nextKey = activeKey;

      setPanes(panes);
      setActiveKey(nextKey);
      storeTabs(panes);

      return;
    }

    // 删除当前tab，地址往前推
    const nextPath = curTab[delIndex - 1];

    // 如果当前tab关闭后，上一个tab无权限，就一起关掉 !TODO!

    navigate(nextPath);

    setPanes(panes);
    storeTabs(panes);
  };

  // tab新增删除操作
  const onEdit = (targetKey: string | any, action: string) => action === 'remove' && remove(targetKey);

  // tab点击
  const onTabClick = (targetKey: string): void => {
    const { path } = panes.filter((item: any) => item.key === targetKey)[0];

    navigate({ pathname: path });
  };

  // 刷新当前 tab
  const refreshTab = (): void => {
    setIsReload(true);
    setTimeout(() => {
      setIsReload(false);
    }, 1000);

    dispatch(setReloadPath(pathname + search));
    setTimeout(() => {
      dispatch(setReloadPath('null'));
    }, 500);
  };

  // 关闭其他或关闭所有
  const removeAll = async (isCloseAll?: boolean) => {
    const { path, path: key } = selectedPanel;

    navigate(isCloseAll ? '/' : path);

    const homePanel = [
      {
        title: '首页',
        key: 'home',
        content: DashBoardPage,
        closable: false,
        path: '/',
      },
    ];

    const nowPanes = key !== 'home' && !isCloseAll ? [...homePanel, selectedPanel] : homePanel;

    setPanes(nowPanes);
    setActiveKey(isCloseAll ? 'home' : key);
    storeTabs(nowPanes);
  };

  useEffect(() => {
    const newPath = pathname + search;

    // 当前的路由和上一次的一样，return
    if (!panesItem.path || panesItem.path === pathRef.current) return;

    // 保存这次的路由地址
    pathRef.current = newPath;

    const index = panes.findIndex(_ => _.key === panesItem.key);
    // 无效的新tab，return

    if (!panesItem.key || (index > -1 && newPath === panes[index].path)) {
      setActiveKey(tabActiveKey);

      return;
    }

    // 新tab已存在，重新覆盖掉（解决带参数地址数据错乱问题）
    if (index > -1) {
      panes[index].path = newPath;
      setPanes(panes);
      setActiveKey(tabActiveKey);

      return;
    }

    // 添加新tab并保存起来
    panes.push(panesItem);
    setPanes(panes);
    setActiveKey(tabActiveKey);
    storeTabs(panes);
  }, [panes, panesItem, pathname, resetTabs, search, storeTabs, tabActiveKey]);

  const isDisabled = () => selectedPanel.key === 'home';
  // tab右击菜单
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => refreshTab()} disabled={selectedPanel.path !== fullPath}>
        刷新
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={e => {
          e.domEvent.stopPropagation();
          remove(selectedPanel.key);
        }}
        disabled={isDisabled()}
      >
        关闭
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={e => {
          e.domEvent.stopPropagation();
          removeAll();
        }}
      >
        关闭其他
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={e => {
          e.domEvent.stopPropagation();
          removeAll(true);
        }}
        disabled={isDisabled()}
      >
        全部关闭
      </Menu.Item>
    </Menu>
  );
  // 阻止右键默认事件
  const preventDefault = (e: any, panel: object) => {
    e.preventDefault();
    setSelectedPanel(panel);
  };

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        defaultActiveKey={defaultActiveKey}
        hideAdd
        onChange={onChange}
        onEdit={onEdit}
        onTabClick={onTabClick}
        type="editable-card"
        size="small"
      >
        {panes.map((pane: TagNode) => (
          <TabPane
            closable={pane.closable}
            key={pane.key}
            tab={
              <Dropdown overlay={menu} placement="bottomLeft" trigger={['contextMenu']}>
                <span onContextMenu={e => preventDefault(e, pane)}>
                  {isReload && pane.path === fullPath && pane.path !== '/403' && (
                    <SyncOutlined title="刷新" spin={isReload} />
                  )}
                  {pane.title}
                </span>
              </Dropdown>
            }
          >
            {reloadPath !== pane.path ? (
              pane.content
            ) : (
              <div style={{ height: '100vh' }}>
                <Alert message="刷新中..." type="info" />
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default TabPanes;
