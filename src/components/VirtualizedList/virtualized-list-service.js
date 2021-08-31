const LAST_ITEM_ID = "~~~lastItem~~~";

export const getNormalizedItems = (items, idGetter, heightGetter) => {
  const normalizedItems = {};
  let offsetTop = 0;

  const lastIndex = items.length - 1;
  items.forEach((item, index) => {
    const height = heightGetter(item);
    const uniqueId = idGetter(item);
    normalizedItems[uniqueId] = { item, index, height, offsetTop };
    if (lastIndex === index) {
      normalizedItems[LAST_ITEM_ID] = normalizedItems[uniqueId];
    }
    offsetTop += height;
  });

  return normalizedItems;
};

export const isItemInView = (item, scrollTop, offsetHeight) => {
  const isItemUnderTheViewableArea = item.offsetTop > scrollTop + offsetHeight;
  const isItemAboveTheViewableArea = item.offsetTop < scrollTop;

  return !isItemUnderTheViewableArea && !isItemAboveTheViewableArea;
};

export const getMaxOffset = (offsetHeight, normalizedItems) => {
  const lastItem = normalizedItems[LAST_ITEM_ID];
  if (!lastItem) return 0;
  const { height, offsetTop } = lastItem;
  const maxOffset = offsetTop + height - offsetHeight;
  return maxOffset;
};

export const easeInOutQuint = time => {
  let t = time;
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
};

function findItemAtOffset(items, normalizedItems, idGetter, fromIndex, offset) {
  for (let i = fromIndex; i < items.length; i++) {
    const itemId = idGetter(items[i]);
    const normailzedItem = normalizedItems[itemId];
    const { height, offsetTop } = normailzedItem;
    if (height + offsetTop > offset) {
      return itemId;
    }
  }
  return null;
}

export const getOnItemsRenderedData = (
  items,
  normalizedItems,
  idGetter,
  visibleStartIndex,
  visibleStopIndex,
  listHeight,
  currentOffsetTop
) => {
  const firstVisibleItem = items[visibleStartIndex];
  const lastVisibleItem = items[visibleStopIndex];
  const firstItemId = idGetter(firstVisibleItem);
  const lastItemId = idGetter(lastVisibleItem);
  const centerOffset = currentOffsetTop + listHeight / 2;
  const centerItemId = findItemAtOffset(items, normalizedItems, idGetter, visibleStartIndex, centerOffset);

  return { firstItemId, lastItemId, centerItemId };
};