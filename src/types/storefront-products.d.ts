import { Prisma } from "@prisma/client";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    primaryChildCategories?: true;
    parentPrimaryCategory?: true;
    parentSecondaryCategory?: true;
    parentTertiaryCategory?: true;
    primaryProducts?: true;
    secondaryChildCategories?: true;
    secondaryProducts?: true;
    tertiaryChildCategories?: true;
    tertiaryProducts?: true;
    quaternaryProducts?: true;
  };
}>;

export type CategoryWithChildParent = Prisma.CategoryGetPayload<{
  include: {
    primaryChildCategories: {
      include: {
        parentPrimaryCategory: true;
        secondaryChildCategories: {
          include: {
            parentPrimaryCategory: true;
            parentSecondaryCategory: true;
            tertiaryChildCategories: true;
          };
        };
      };
    };
    secondaryChildCategories: {
      include: {
        parentPrimaryCategory: true;
        parentSecondaryCategory: true;
        tertiaryChildCategories: true;
      };
    };

    tertiaryChildCategories: true;
    parentPrimaryCategory: true;
    parentSecondaryCategory: {
      include: {
        parentPrimaryCategory: true;
      };
    };
    parentTertiaryCategory: true;

    primaryProducts: {
      orderBy: {
        createdAt: "desc";
      };
    };
    secondaryProducts: {
      orderBy: {
        createdAt: "desc";
      };
    };
    tertiaryProducts: {
      orderBy: {
        createdAt: "desc";
      };
    };
    quaternaryProducts: {
      orderBy: {
        createdAt: "desc";
      };
    };
  };
}>;
