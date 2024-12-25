import slugify from "slugify";

export function convertToTitleCase(input: string): string {
  return input
    .split("-") // Split the string by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back with spaces
}

export function customSlugify(str?: string): string {
  if (!str || str.trim() === "") {
    console.error(
      "Invalid input for customSlugify: The string is empty or undefined."
    );
    return "";
  }

  return slugify(str, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "vi",
    trim: true,
  });
}
