import Link from "next/link";
import React from "react";

const CategoryLink: React.FC<{ href: string; name: string }> = ({
  href,
  name,
}) => (
  <Link href={href} className="block py-4">
    <div className="text-base">{name}</div>
  </Link>
);

export default CategoryLink;
