"use client";

import {
  Fragment,
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DragHandleButton } from "@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import {
  Control,
  UseFormWatch,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { TemplateFormInputType } from "../schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types
type ItemEntry = { itemId: string; element: HTMLElement };

type ListContextValue = {
  registerItem: (entry: ItemEntry) => () => void;
  reorderItem: (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget: Edge | null;
  }) => void;
  instanceId: symbol;
  getListLength: () => number;
};

type FieldItemProps = {
  id: string;
  index: number;
  control: Control<TemplateFormInputType>;
  watch: UseFormWatch<TemplateFormInputType>;
  onRemove: (index: number) => void;
};

// Field data type
const itemKey = Symbol("item");
type ItemData = {
  [itemKey]: true;
  index: number;
  instanceId: symbol;
  itemId: string;
};

function getItemData({
  itemId,
  index,
  instanceId,
}: {
  itemId: string;
  index: number;
  instanceId: symbol;
}): ItemData {
  return {
    [itemKey]: true,
    itemId,
    index,
    instanceId,
  };
}

function isItemData(data: Record<string | symbol, unknown>): data is ItemData {
  return data[itemKey] === true;
}

// Context
const ListContext = createContext<ListContextValue | null>(null);

function useListContext() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useListContext must be used within a ListContextProvider");
  }
  return context;
}

// Registry
function getItemRegistry() {
  const registry = new Map<string, HTMLElement>();

  function register({ itemId, element }: ItemEntry) {
    registry.set(itemId, element);
    return function unregister() {
      registry.delete(itemId);
    };
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null;
  }

  return { register, getElement };
}

// Field Item Component
function FieldItem({ id, index, control, watch, onRemove }: FieldItemProps) {
  const { registerItem, instanceId } = useListContext();
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const dragHandle = dragHandleRef.current;
    if (!element || !dragHandle) return;

    const data = getItemData({ itemId: id, index, instanceId });

    const cleanup = combine(
      registerItem({ itemId: id, element }),
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrag({ self, source }) {
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );

    return cleanup;
  }, [id, index, instanceId, registerItem]);

  return (
    <Fragment>
      <div
        ref={ref}
        className={cn(
          "relative border border-gray-200 rounded-lg p-6 bg-white mb-4",
          isDragging && "opacity-50"
        )}
      >
        <div className="grid gap-6 sm:grid-cols-12 items-start">
          <DragHandleButton
            ref={dragHandleRef}
            label={`Reorder field ${index + 1}`}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </DragHandleButton>

          <div className="sm:col-span-5">
            <FormField
              name={`fields.${index}.fieldName`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Enter Field Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-4">
            <FormField
              name={`fields.${index}.fieldType`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Field Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="SELECT">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Trash2 className="w-5 h-5" />
              <span className="sr-only">Remove field</span>
            </Button>
          </div>

          {watch(`fields.${index}.fieldType`) === "SELECT" && (
            <div className="sm:col-span-10 sm:col-start-2 mt-4">
              <FormField
                name={`fields.${index}.fieldOptions`}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter options (separated by commas)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
      </div>
    </Fragment>
  );
}

// Main Export Component
export function FieldsSection() {
  const form = useFormContext<TemplateFormInputType>();
  const { control, watch } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const [registry] = useState(getItemRegistry);
  const [instanceId] = useState(() => Symbol("instance-id"));

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number;
      indexOfTarget: number;
      closestEdgeOfTarget: Edge | null;
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
        axis: "vertical",
      });

      if (finishIndex !== startIndex) {
        // Then perform the move operation
        move(startIndex, finishIndex);

        const element = registry.getElement(fields[startIndex].id);
        if (element) {
          triggerPostMoveFlash(element);
        }
      }
    },
    [fields, move, registry]
  );

  const getListLength = useCallback(() => fields.length, [fields.length]);

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;
        if (!isItemData(sourceData) || !isItemData(targetData)) return;

        const indexOfTarget = fields.findIndex(
          (field) => field.id === targetData.itemId
        );
        if (indexOfTarget < 0) return;

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        });
      },
    });
  }, [fields, instanceId, reorderItem]);

  const contextValue = useMemo(
    () => ({
      registerItem: registry.register,
      reorderItem,
      instanceId,
      getListLength,
    }),
    [registry.register, reorderItem, instanceId, getListLength]
  );

  return (
    <ListContext.Provider value={contextValue}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Fields & Values</CardTitle>
          <CardDescription>
            Drag and drop to reorder fields. Add, edit, or remove fields as
            needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <FieldItem
                key={field.id}
                id={field.id}
                index={index}
                control={control}
                watch={watch}
                onRemove={remove}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  fieldName: "",
                  fieldType: "TEXT",
                  fieldOptions: "",
                  orderIndex: fields.length,
                })
              }
              className="mt-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add new field
            </Button>
          </div>
        </CardContent>
      </Card>
    </ListContext.Provider>
  );
}
