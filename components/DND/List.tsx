"use client";
import React, { FC, useState, useCallback, useEffect, act } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import api from "../../lib/api";
import SortableItem from "./SortableItem";

const SortableList: FC = () => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState<number | string>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);
        setItems(items => arrayMove(items, oldIndex, newIndex));
      }

      setActiveId(null);
    },
    [items]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(
          `/constructionstep/getSteps`
        );
        const data = response.data.data.sort((a, b) => a.priority - b.priority);
        setItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, []);

  const arrangeHandler = async () => {
    const data = items.map(item => ({
      index: item.priority,
      step: item._id,
    }));

    try {
      const response = await api.post(
        `/constructionstep/arrangeSteps`,
        { steps: data }
      );
    } catch (error) {
      console.error(error);
    }
  };
  // arrangeHandler();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={e => {
        handleDragEnd(e);
        arrangeHandler();
      }}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map(item => (
          <SortableItem key={item._id} id={item._id} item={item} />
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <SortableItem
            id={activeId}
            item={items.find(item => item._id === activeId)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableList;
