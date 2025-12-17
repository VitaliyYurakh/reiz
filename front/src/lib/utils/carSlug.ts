import type { Car } from "@/types/cars";

/**
 * Convert a string to a URL-friendly slug
 * - lowercase
 * - spaces/underscores -> "-"
 * - remove special characters
 * - keep only latin letters, numbers, and hyphens
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Generate a slug from car data
 */
export function generateCarSlug(car: Pick<Car, "brand" | "model" | "yearOfManufacture">): string {
    const parts = [car.brand, car.model, car.yearOfManufacture?.toString()].filter(Boolean);
    if (parts.length === 0) return "car";
    return slugify(parts.join(" ")) || "car";
}

/**
 * Create full idSlug parameter from car id and slug
 */
export function createCarIdSlug(car: Pick<Car, "id" | "brand" | "model" | "yearOfManufacture">): string {
    const slug = generateCarSlug(car);
    return `${car.id}-${slug}`;
}

/**
 * Parse car id from idSlug parameter
 * Returns the id as number, or null if invalid
 */
export function parseCarIdFromSlug(idSlug: string): number | null {
    const firstDash = idSlug.indexOf("-");
    const idPart = firstDash === -1 ? idSlug : idSlug.substring(0, firstDash);
    const id = Number.parseInt(idPart, 10);
    return Number.isNaN(id) ? null : id;
}
