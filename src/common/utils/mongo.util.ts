import { Document, Types } from 'mongoose';

export type WithId<T> = T & { _id: Types.ObjectId };

/**
 * Convert a Mongoose document (or POJO) into a frontend-friendly shape.
 * - Renames `_id` to `id`
 * - Removes `__v`
 * - Removes empty internal arrays we do not want to expose
 */
export function toFrontend<T extends Record<string, unknown>>(doc: T | null): T | null {
  if (!doc) return doc;
  const result: Record<string, unknown> = { ...doc };
  if ('_id' in result) {
    result.id = String(result._id);
    delete result._id;
  }
  if ('__v' in result) {
    delete result.__v;
  }
  return result as T;
}

export function toFrontendMany<T extends Record<string, unknown>>(
  docs: T[],
): T[] {
  return docs.map((d) => toFrontend(d) as T);
}

/**
 * Convert an array of ObjectIds (or strings) to plain strings.
 */
export function idsToStrings(values: Array<Types.ObjectId | string>): string[] {
  return values.map((v) => (typeof v === 'string' ? v : v.toString()));
}

export function isMongooseDoc(doc: unknown): doc is Document {
  return !!doc && typeof doc === 'object' && 'toObject' in (doc as object);
}
