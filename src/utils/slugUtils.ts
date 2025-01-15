import crypto from "crypto";

const generateSlug = (str: string) => {
  // Replace spaces with hyphens
  const slug = str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, ""); // Remove non-word characters

  return slug;
};

const generateRandomSlug = (str: string) => {
  // generate slug
  let slug = generateSlug(str);

  // Generate random characters
  const randomChars = crypto.randomBytes(3).toString("hex");

  // Append random characters to the slug
  slug += `-${randomChars}`;

  return slug;
};

export { generateRandomSlug, generateSlug };
