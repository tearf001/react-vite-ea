import { FC, useEffect, useCallback, useState, useRef } from 'react';
import { Layout, Drawer } from 'antd';
import './index.less';
import MenuComponent from './menu';
import HeaderComponent from './header';
import { getGlobalState } from '@/utils/getGloabal';
// import TagsView from './tagView';
import TagsView, { TagNode, getKeyName } from './tagView/persisted';
import { getMenuList } from '@/api/layout.api';
import { MenuList, MenuChild } from '@/interface/layout/menu.interface';
import { useGuide } from '../guide/useGuide';
import { useLocation } from 'react-router';
import { setUserItem } from '@/stores/user.store';
import { useDispatch, useSelector } from 'react-redux';

const { Sider } = Layout;
const WIDTH = 992;
const noNewTab = ['/login']; // 不需要新建 tab的页面
// const noCheckAuth = ['/', '/403', '/test-api', '/workspace']; // 不需要检查权限的页面
// 检查权限
// const checkAuth = (newPathname: string, isAuthorized: boolean): boolean => {
//   // 不需要检查权限的
//   if (noCheckAuth.includes(newPathname)) {
//     return true;
//   }

//   return isAuthorized;
// };

const LayoutPage: FC = () => {
  const { pathname, search } = useLocation();
  const [openKey, setOpenkey] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [menuList, setMenuList] = useState<MenuList>([]);
  const { device, collapsed, newUser } = useSelector(state => state.user);
  const isMobile = device === 'MOBILE';
  const dispatch = useDispatch();
  const { driverStart } = useGuide();
  const [tabActiveKey, setTabActiveKey] = useState<string>('home');
  const [panesItem, setPanesItem] = useState<TagNode>({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: '',
    pathname: '',
  });
  const pathRef = useRef<string>('');

  useEffect(() => {
    const newPath = search ? pathname + search : pathname;
    const { key, title, component: Content } = getKeyName(pathname);
    // 新tab已存在或不需要新建tab，return

    if (pathname === pathRef.current || noNewTab.includes(pathname)) {
      setTabActiveKey(key);

      return;
    }
    pathRef.current = newPath;
    setPanesItem({
      title,
      content: Content,
      key: pathname,
      pathname,
      closable: key !== 'home',
      path: newPath,
    });
    setTabActiveKey(key);
    setOpenkey(key);
  }, [pathname]);

  const toggle = () => {
    dispatch(
      setUserItem({
        collapsed: !collapsed,
      }),
    );
  };

  const initMenuListAll = (menu: MenuList) => {
    const MenuListAll: MenuChild[] = [];

    menu.forEach(m => {
      if (!m?.children?.length) {
        MenuListAll.push(m);
      } else {
        m?.children.forEach(mu => {
          MenuListAll.push(mu);
        });
      }
    });

    return MenuListAll;
  };

  const fetchMenuList = useCallback(async () => {
    const { status, result } = await getMenuList();

    if (status) {
      setMenuList(result);
      dispatch(
        setUserItem({
          menuList: initMenuListAll(result),
        }),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMenuList();
  }, [fetchMenuList]);

  useEffect(() => {
    window.onresize = () => {
      const { device } = getGlobalState();
      const rect = document.body.getBoundingClientRect();
      const needCollapse = rect.width < WIDTH;

      dispatch(
        setUserItem({
          device,
          collapsed: needCollapse,
        }),
      );
    };
  }, [dispatch]);

  useEffect(() => {
    newUser && driverStart();
  }, [newUser]);

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={toggle} />
      <Layout>
        {!isMobile ? (
          <Sider
            className="layout-page-sider"
            trigger={null}
            collapsible
            collapsedWidth={isMobile ? 0 : 80}
            collapsed={collapsed}
            breakpoint="md"
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenkey(k)}
              selectedKey={selectedKey}
              onChangeSelectedKey={k => setSelectedKey(k)}
            />
          </Sider>
        ) : (
          <Drawer
            width="200"
            placement="left"
            bodyStyle={{ padding: 0, height: '100%' }}
            closable={false}
            onClose={toggle}
            visible={!collapsed}
          >
            <MenuComponent
              menuList={menuList}
              openKey={openKey}
              onChangeOpenKey={k => setOpenkey(k)}
              selectedKey={selectedKey}
              onChangeSelectedKey={k => setSelectedKey(k)}
            />
          </Drawer>
        )}
        <TagsView defaultActiveKey="home" panesItem={panesItem} tabActiveKey={tabActiveKey} />
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
