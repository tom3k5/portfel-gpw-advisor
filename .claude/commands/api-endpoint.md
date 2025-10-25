---
description: Create a new REST API endpoint with validation and tests
---

You are creating a new API endpoint for the Portfel GPW Advisor backend.

**User will provide:**
- Endpoint path (e.g., `/api/portfolio/:id`)
- HTTP method (GET, POST, PUT, DELETE)
- Request/response schemas
- Business logic requirements

**Your task:**

1. Create route in `backend/src/routes/[resource].ts`:
   ```typescript
   router.get('/path', authMiddleware, controller.handler);
   ```

2. Create controller in `backend/src/controllers/[resource].ts`:
   - Input validation (using Joi or Zod)
   - Business logic
   - Error handling
   - Response formatting

3. Add database models if needed:
   - Update Prisma schema
   - Run migration: `npx prisma migrate dev`

4. Create validation schemas:
   ```typescript
   const schema = Joi.object({
     symbol: Joi.string().required().max(10),
     quantity: Joi.number().integer().positive().required(),
   });
   ```

5. Add middleware if needed:
   - Authentication check
   - Rate limiting
   - Request logging

6. Write tests in `backend/src/__tests__/[resource].test.ts`:
   - Test successful responses
   - Test validation errors
   - Test authentication/authorization
   - Test error cases
   - Use Supertest for HTTP testing

7. Update API documentation:
   - Add OpenAPI/Swagger spec
   - Include request/response examples

**Example test:**
```typescript
describe('GET /api/portfolio', () => {
  it('returns user portfolio', async () => {
    const res = await request(app)
      .get('/api/portfolio')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.positions).toHaveLength(3);
  });

  it('requires authentication', async () => {
    await request(app)
      .get('/api/portfolio')
      .expect(401);
  });
});
```

**Security checklist:**
- [ ] Input validation
- [ ] Authentication required (if needed)
- [ ] Authorization check (user can only access own data)
- [ ] SQL injection prevention (use Prisma parameterized queries)
- [ ] Rate limiting
- [ ] Error messages don't leak sensitive info

**Deliverable:**
- Working endpoint
- Comprehensive tests
- Updated API documentation
