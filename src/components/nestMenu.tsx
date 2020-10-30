import { computed, defineComponent, ref, watch } from 'vue';

import { MenuType } from '../types';

interface IProps {
  data: MenuType[];
  depth: number;
  activeIds?: number[];
}

export default defineComponent({
  name: 'nestMenu',
  props: ['data', 'depth', 'activeIds'],
  emits: ['change'],
  setup(props, context) {
    const { depth = 0, activeIds, data } = props;
    const activeId = ref<number | null | undefined>(null);
    watch(
      () => activeIds,
      (newActiveIds) => {
        if (newActiveIds) {
          const newActiveId = newActiveIds[depth];
          if (newActiveId) {
            activeId.value = newActiveId;
          }
        }
      },
      {
        immediate: true,
        flush: 'sync',
      },
    );
    watch(
      () => props.data,
      (newData) => {
        if (!activeId.value) {
          if (newData && newData.length) {
            activeId.value = newData[0].id;
          }
        }
        if (
          !props.data.find(
            (menuItem: MenuType) => menuItem.id === activeId.value,
          )
        ) {
          activeId.value = props.data?.[0].id;
        }
      },
      {
        immediate: true,
        flush: 'sync',
      },
    );
    const onMenuItemClick = (menuItem: MenuType) => {
      const newActiveId = menuItem.id;
      if (newActiveId !== activeId.value) {
        activeId.value = newActiveId;
        const child = getActiveSubMenu();
        const subIds = getSubIds(child);
        context.emit('change', [newActiveId, ...subIds]);
      }
    };

    const onSubActiveIdChange = (ids: number[]) => {
      context.emit('change', [activeId.value].concat(ids));
    };
    const getActiveSubMenu = () => {
      return props.data?.find(
        (menuItem: MenuType) => menuItem.id === activeId.value,
      )._child;
    };
    const subMenu = computed(getActiveSubMenu);
    const getActiveClass = (id: number) => {
      if (id === activeId.value) {
        return 'menu-active';
      }
      return '';
    };

    const getSubIds = (child: MenuType[]) => {
      const subIds: number[] = [];
      // tslint:disable-next-line:no-shadowed-variable
      const traverse = (data: MenuType[]) => {
        if (data && data.length) {
          const first: MenuType = data[0];
          subIds.push(first.id);
          traverse(first._child!);
        }
      };
      traverse(child);
      return subIds;
    };

    return () => (
      <div class='wrap'>
        <div class={`menu-wrap menu-wrap-${depth}`}>
          {data.map((item: MenuType) => {
            return (
              <div
                class={`menu-item ${getActiveClass(item.id)}`}
                key={item.id}
                onClick={() => onMenuItemClick(item)}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        {subMenu.value && subMenu.value.length && (
          <nestMenu
            key={activeId.value}
            data={subMenu.value}
            depth={depth + 1}
            activeIds={activeIds}
            onChange={onSubActiveIdChange}
          ></nestMenu>
        )}
      </div>
    );
  },
});
