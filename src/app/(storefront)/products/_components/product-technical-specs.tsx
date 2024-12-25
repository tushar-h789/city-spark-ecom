import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type Prisma } from "@prisma/client";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true;
              };
            };
            template: true;
          };
        };
      };
    };
  };
}>;

type TechnicalSpecsProps = {
  product: InventoryItemWithRelation["product"];
};

export default function TechnicalSpecs({ product }: TechnicalSpecsProps) {
  const details = [
    { label: "Brand Name", value: product.brand?.name },
    { label: "Model", value: product.model },
    ...(product.productTemplate?.fields?.map((field) => ({
      label: field.templateField.fieldName,
      value: field.fieldValue,
    })) || []),
    { label: "Guarantee", value: product.guarantee },
    { label: "Warranty", value: product.warranty },
    { label: "Unit", value: product.unit },
    { label: "Weight", value: product.weight?.toString() },
    { label: "Color", value: product.color },
    { label: "Length", value: product.length?.toString() },
    { label: "Width", value: product.width?.toString() },
    { label: "Height", value: product.height?.toString() },
    { label: "Material", value: product.material },
    { label: "Volume", value: product.volume },
    { label: "Type", value: product.type },
    { label: "Shape", value: product.shape },
    { label: "Supplier Part Number", value: product.productCode },
  ].filter((detail) => detail.value && detail.value.trim() !== "");

  if (details.length === 0) return null;

  const pairedDetails = [];
  for (let i = 0; i < details.length; i += 2) {
    pairedDetails.push(details.slice(i, i + 2));
  }

  return (
    <div className="mt-6 lg:mt-8 overflow-x-auto">
      <h4 className="font-semibold text-lg lg:text-xl mb-3 lg:mb-4">
        Technical Specification
      </h4>

      {/* Mobile Layout (single column) */}
      <div className="lg:hidden">
        <Table className="border-collapse border border-gray-300 w-full">
          <TableBody>
            {details.map((detail, index) => (
              <TableRow key={index} className="border-b border-gray-300">
                <TableCell className="font-medium bg-gray-200 border-r border-gray-300 p-2 w-1/2 text-sm">
                  {detail.label}
                </TableCell>
                <TableCell className="bg-white p-2 text-center text-sm w-1/2">
                  {detail.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Desktop Layout (two columns) */}
      <div className="hidden lg:block ">
        <Table className="border-collapse border border-gray-300 w-full">
          <TableBody>
            {pairedDetails.map((pair, index) => (
              <TableRow key={index} className="border-b border-gray-300">
                {pair.map((detail, detailIndex) => (
                  <React.Fragment key={detailIndex}>
                    <TableCell className="font-medium bg-gray-200 border-r border-gray-300 p-2 w-1/4 text-base">
                      {detail.label}
                    </TableCell>
                    <TableCell className="bg-white border-r border-gray-300 p-2 text-center w-1/4 text-base">
                      {detail.value}
                    </TableCell>
                  </React.Fragment>
                ))}
                {pair.length === 1 && (
                  <>
                    <TableCell className="bg-gray-200 border-r border-gray-300 p-2 w-1/4" />
                    <TableCell className="bg-white p-2 w-1/4" />
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
