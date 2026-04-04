/**
 * ============================================================================
 * TRANSACTION MODEL (The Database Blueprint)
 * ============================================================================
 * Purpose: This file defines the exact structure (schema) for how a 
 * Transaction document will look when saved into MongoDB. It translates 
 * your visual Entity-Relationship (ER) diagram into Mongoose code.
 * * Mapping your ER Diagram to Mongoose:
 * - _id: Automatically generated and handled by MongoDB.
 * - userId -> user: A relational reference pointing to the 'User' collection.
 * - type: The kind of transaction (String).
 * - amount: The financial value (Number).
 * - status: The current state of the transaction (String).
 * * CRITICAL RULE: Models should only contain the Schema definition and basic 
 * database-level validation rules (like Enums or Min/Max values). Keep complex 
 * business logic OUT of here and in the Billing Service!
 */

//handles wallet deposits and subscription payments.

// {
//   userId: { type: ObjectId, ref: "User" },

//   type: { type: String, enum: ["deposit", "subscription"] },

//   amount: { type: Number },

//   status: { type: String, enum: ["pending", "completed", "failed"] },

//   createdAt: { type: Date }
// }