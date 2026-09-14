import { type ReactNode, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { PagerDots } from "./PagerDots";

interface SwipePagerProps {
  pages: ReactNode[];
  labels: string[];
}

/**
 * Horizontal paging deck with labelled dots. Pages can differ a lot in
 * height, so the deck is pinned to the active page's measured height rather
 * than the tallest one.
 */
export function SwipePager({ pages, labels }: SwipePagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [heights, setHeights] = useState<number[]>([]);

  function goTo(nextIndex: number): void {
    const clamped = Math.max(0, Math.min(pages.length - 1, nextIndex));
    scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
    setIndex(clamped);
  }

  function handleScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void {
    if (width > 0) {
      setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
    }
  }

  function measurePage(pageIndex: number, event: LayoutChangeEvent): void {
    const { height } = event.nativeEvent.layout;
    setHeights((current) => {
      if (current[pageIndex] === height) {
        return current;
      }
      const next = current.slice();
      next[pageIndex] = height;
      return next;
    });
  }

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <ScrollView
        ref={scrollRef}
        decelerationRate="fast"
        horizontal
        onMomentumScrollEnd={handleScrollEnd}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={heights[index] ? { height: heights[index] } : undefined}
      >
        {pages.map((page, pageIndex) => (
          <View key={labels[pageIndex]} style={[styles.page, { width }]}>
            <View onLayout={(event) => measurePage(pageIndex, event)}>
              {page}
            </View>
          </View>
        ))}
      </ScrollView>
      <PagerDots
        count={pages.length}
        index={index}
        labels={labels}
        onSelect={goTo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
});
