import { z } from "zod";
import { FieldType, Status } from "@prisma/client";

const zodFieldType = z.enum(
  Object.keys(FieldType) as [
    keyof typeof FieldType,
    ...Array<keyof typeof FieldType>
  ]
);

export const zodStatus = z.enum(
  Object.keys(Status) as [keyof typeof Status, ...Array<keyof typeof Status>]
);

export const templateSchema = z.object({
  name: z.string().trim().min(1, "Name is required and can't be left blank"),
  description: z.string().trim().optional(),
  fields: z
    .array(
      z.object({
        fieldId: z.string().trim().optional(),
        fieldName: z.string().trim().min(1, "Field Name is required"),
        fieldType: zodFieldType,
        fieldOptions: z.string().trim().optional(),
        orderIndex: z.number().int().nonnegative(), // Add this line
      })
    )
    .min(1),
  status: zodStatus.optional(),
});
export type TemplateFormInputType = z.infer<typeof templateSchema>;
