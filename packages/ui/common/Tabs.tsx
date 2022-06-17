import { Item } from '@react-stately/collections';
import { useTab, useTabList, useTabPanel } from '@react-aria/tabs';
import { useTabListState } from '@react-stately/tabs';
import { RefObject, useRef } from 'react';
import type { TabListProps } from '@react-types/tabs';

export function Tabs(props: TabListProps<object>) {
  let state = useTabListState(props);
  let ref = useRef();
  // @ts-ignore
  let { tabListProps } = useTabList(props, state, ref);
  return (
    <div className=''>
      <div
        className='flex gap-1'
        {...tabListProps}
        // @ts-ignore
        ref={ref}
      >

        {/* @ts-ignore */}
        {[...state.collection].map((item) => (
          <Tab key={item.key} item={item} state={state} />
        ))}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
}

// @ts-ignore
function Tab({ item, state }) {
  let { key, rendered } = item;
  let ref = useRef();
  // @ts-ignore
  let { tabProps } = useTab({ key }, state, ref);
  let isSelected = state.selectedKey === key;
  let isDisabled = state.disabledKeys.has(key);
  return (
    <div
      {...tabProps}
      // @ts-ignore
      ref={ref}
      className={`px-2 select-none cursor-pointer 
        border-b border-cyan-500
        text-black 	
        w-[100%]
        ${isSelected ? 'border-cyan-500 border-b-4' : ''}`}
      style={{
        opacity: isDisabled ? '0.5' : undefined
      }}
    >
      {rendered}
    </div>
  );
}

// @ts-ignore
function TabPanel({ state, ...props }) {
  let ref = useRef();
  // @ts-ignore
  let { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    // @ts-ignore
    <div {...tabPanelProps} ref={ref}>
      {state.selectedItem?.props.children}
    </div>
  );
}

export const TabItem = Item;