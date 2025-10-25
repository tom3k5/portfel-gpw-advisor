---
description: Create and apply a database migration
---

You are creating a database schema change for Portfel GPW Advisor.

**Context:** Using Prisma ORM with PostgreSQL.

**User will provide:**
- Schema changes needed (new table, add column, index, etc.)
- Reason for the change

**Your task:**

1. **Update Prisma Schema** (`backend/prisma/schema.prisma`):
   ```prisma
   model NewModel {
     id        Int      @id @default(autoincrement())
     field     String   @db.VarChar(255)
     createdAt DateTime @default(now())

     @@index([field])
   }
   ```

2. **Create Migration:**
   ```bash
   npx prisma migrate dev --name descriptive_migration_name
   ```

3. **Review Generated SQL:**
   - Check `prisma/migrations/[timestamp]_migration_name/migration.sql`
   - Verify no data loss
   - Check indexes are created

4. **Update TypeScript Types:**
   ```bash
   npx prisma generate
   ```

5. **Update Related Code:**
   - Update models/repositories
   - Update API responses
   - Update tests

6. **Write Data Migration (if needed):**
   - Create seed script for initial data
   - Create migration script for existing data

7. **Test Migration:**
   ```bash
   # Test on clean database
   npx prisma migrate reset
   npx prisma migrate deploy

   # Verify schema
   npx prisma db pull
   ```

8. **Document Changes:**
   - Update schema documentation
   - Add migration notes to CHANGELOG
   - Document any manual steps needed

**Common Migration Patterns:**

### Add Column
```prisma
model User {
  id       Int     @id
  // Add new column
  verified Boolean @default(false)
}
```

### Add Relation
```prisma
model Portfolio {
  id     Int    @id
  userId Int
  user   User   @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

### Add Unique Constraint
```prisma
model Position {
  symbol String
  userId Int

  @@unique([userId, symbol])
}
```

### Rename Column (Careful!)
```prisma
// Use @map to avoid data migration
model User {
  email String @map("email_address")
}
```

**Safety Checklist:**
- [ ] Backup database before applying (production)
- [ ] Test migration on dev database first
- [ ] Consider backwards compatibility
- [ ] Check for data loss risk
- [ ] Update dependent queries/code
- [ ] Run tests after migration
- [ ] Document breaking changes

**Rollback Plan:**
```bash
# If something goes wrong
npx prisma migrate resolve --rolled-back [migration_name]
```

**Deliverable:**
- Updated schema
- Applied migration
- Updated TypeScript types
- Updated code using the schema
- Migration documentation
