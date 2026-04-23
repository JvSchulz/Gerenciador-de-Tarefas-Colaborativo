/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (
    knex.schema.createTable("users", (table) => {
        table.increments("id").primary(); 
        table.string("name", 255).notNullable(); 
        table.string("email", 255).unique().notNullable(); 
        table.timestamp("created_at").defaultTo(knex.fn.now());
      })

      .createTable("categories", (table) => {
        table.increments("id").primary();
        table.string("name", 255).notNullable();
      })

      .createTable("registers", (table) => {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.text("description");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.date("due_date");
        table.string("status", 50).defaultTo("pendente");

        table
          .integer("creator_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("category_id")
          .references("id")
          .inTable("categories")
          .onDelete("SET NULL");
      })

      .createTable("sharing", (table) => {
        table
          .integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("register_id")
          .references("id")
          .inTable("registers")
          .onDelete("CASCADE");

        table.enu("permission", ["read", "write"]).notNullable();

        table.timestamp("shared_at").defaultTo(knex.fn.now());

        table.primary(["user_id", "register_id"]);
      })

      .createTable("executions", (table) => {
        table.increments("id").primary();
        table
          .integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("register_id")
          .references("id")
          .inTable("registers")
          .onDelete("CASCADE");
        table.string("action_type", 50).notNullable();
        table.timestamp("executed_at").defaultTo(knex.fn.now());
      })
  );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists("executions")
    .dropTableIfExists("sharing")
    .dropTableIfExists("registers")
    .dropTableIfExists("categories")
    .dropTableIfExists("users");
}
