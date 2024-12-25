import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import EditUserForm from "./_components/user-form";
import { Role } from "@prisma/client";

type PageParams = Promise<{
  user_id: string;
}>;

// Create dummy user data based on the Prisma schema
const dummyUserDetails = {
  id: "user_123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+44 7700 900123",
  role: Role.USER,
  avatar: "/avatar-placeholder.jpg",
  emailVerified: new Date("2024-01-01"),
  createdAt: new Date("2023-12-01"),
  updatedAt: new Date("2024-01-15"),
};

// Create dummy address data based on the Prisma schema
const dummyAddresses = [
  {
    id: "addr_1",
    userId: "user_123",
    addressLine1: "123 High Street",
    addressLine2: "Flat 4B",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
    country: "United Kingdom",
    isBilling: true,
    isShipping: true,
    isDefaultBilling: true,
    isDefaultShipping: true,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "addr_2",
    userId: "user_123",
    addressLine1: "456 Church Lane",
    addressLine2: null,
    city: "Manchester",
    county: "Greater Manchester",
    postcode: "M1 1AD",
    country: "United Kingdom",
    isBilling: false,
    isShipping: true,
    isDefaultBilling: false,
    isDefaultShipping: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  {
    label: dummyUserDetails?.firstName || "",
    href: "/admin/users/new",
    isCurrentPage: true,
  },
];

export default async function AdminEditUserPage(props: { params: PageParams }) {
  const params = await props.params;

  // In a real application, we would fetch the user data using the user_id
  // For now, we'll use our dummy data
  return (
    <ContentLayout title="Edit User" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      {/* <EditUserForm userDetails={dummyUserDetails} addresses={dummyAddresses} /> */}
    </ContentLayout>
  );
}
