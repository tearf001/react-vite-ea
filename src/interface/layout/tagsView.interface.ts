/**
 * {
    title: string;
    content: ReactNode;
    key: string;
    closable: boolean;
    path: string;
  };
 * 
 */
export type TagItem = {
  key: string;
  label?: {
    zh_CN: string;
    en_US: string;
  };

  /** tag's route path */
  path: string;
  pathname: string;
  /** can be closed ? */
  closable: boolean;
  // component?: RouteObject;
};

export interface TagState {
  /** tagsView list */
  tags: string[];

  /**current tagView id */
  activeTagId: TagItem['key'];

  status?: 'idle' | 'loading';
  reloadPath: string; // 需要刷新的tab路径
}
