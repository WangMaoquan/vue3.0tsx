import { defineComponent, ref } from 'vue';
import nestMenu from './components/nestMenu';
import data from './data';
import { MenuType } from './types';

export default defineComponent({
  name: 'App',
  components: {
    nestMenu,
  },
  setup() {
    const activeId = 7;

    const findPath = (menus: MenuType[], targetId: number) => {
      // tslint:disable-next-line:no-shadowed-variable
      let ids: number[] = [];

      const traverse = (subMenus: MenuType[] | undefined, prev: number[]) => {
        // tslint:disable-next-line:no-debugger
        // debugger;
        if (ids.length > 0) {
          return;
        }
        if (!subMenus) {
          return;
        }
        subMenus.forEach((subMenu) => {
          if (subMenu.id === activeId) {
            ids = [...prev, activeId];
            return;
          }
          traverse(subMenu._child, [...prev, subMenu.id]);
        });
      };

      traverse(menus, []);

      return ids;
    };

    const ids = ref(findPath(data, activeId));
    // tslint:disable-next-line:no-console
    console.log(ids.value);

    const activeIdsChange = (newIds: number[]) => {
      ids.value = newIds;
      // tslint:disable-next-line:no-console
      console.log('当前选中的id路径', newIds);
    };
    return () => <nestMenu data={data} activeIds={ids.value} onChange={activeIdsChange}></nestMenu>;
  },
});
