# Test Suite Documentation

## Overview

Comprehensive test suite for Bright Draft application covering:
- Unit tests for all services
- Validator tests for Zod schemas
- Middleware and route tests
- Integration tests

## Test Structure

```
tests/
├── setup.ts                 # Global test setup and utilities
├── services/               # Service unit tests
│   ├── cliente.service.test.ts
│   ├── estoque.service.test.ts
│   ├── ordem.service.test.ts
│   ├── financeiro.service.test.ts
│   ├── utilities.service.test.ts
│   └── ...
├── validators/            # Zod validator tests
│   ├── cliente.validator.test.ts
│   └── ...
├── middleware/            # Middleware tests
│   └── withMiddleware.test.ts
└── integration/           # E2E and integration tests
    └── ... (future)
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run specific test file
```bash
npm test -- cliente.service.test.ts
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run tests with specific pattern
```bash
npm test -- --grep "criar"
```

## Test Coverage Targets

- **Lines**: 60%
- **Functions**: 60%
- **Branches**: 50%
- **Statements**: 60%

Current coverage targets all Priority 1 and Priority 2 services.

## Test Patterns

### Service Tests

Services follow a consistent test pattern:

```typescript
describe('ServiceName', () => {
  let service: ServiceName
  let mockUserId: string
  let mockTenantId: string

  beforeEach(() => {
    service = new ServiceName()
    mockUserId = 'user-123'
    mockTenantId = 'tenant-456'
  })

  describe('methodName', () => {
    it('should do something', async () => {
      const result = await service.methodName(mockUserId, mockTenantId, data)
      expect(result).toHaveProperty('id')
    })

    it('should validate input', async () => {
      expect(async () => {
        await service.methodName(mockUserId, mockTenantId, invalidData)
      }).rejects.toThrow()
    })
  })
})
```

### Validator Tests

Validators test Zod schemas:

```typescript
describe('validateClienteData', () => {
  it('should accept valid data', () => {
    const validData = { nome: 'Test', email: 'test@example.com' }
    const result = validateClienteData(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid data', () => {
    const invalidData = { nome: '', email: 'invalid-email' }
    const result = validateClienteData(invalidData)
    expect(result.success).toBe(false)
  })
})
```

## Test Utilities

### Mock User Context
```typescript
const mockUserId = 'user-123'
const mockTenantId = 'tenant-456'
```

### Error Testing
```typescript
expect(async () => {
  await service.someMethod()
}).rejects.toThrow('Expected error message')
```

### Async Testing
```typescript
it('should handle async operations', async () => {
  const result = await service.asyncMethod()
  expect(result).toBeDefined()
})
```

## CI/CD Integration

Tests run automatically on:
- Push to any branch
- Pull requests
- Pre-commit hook (configured in husky)

### GitHub Actions
Test results and coverage are reported in GitHub Actions.

## Adding New Tests

When adding a new service or validator:

1. Create corresponding test file in `tests/services/` or `tests/validators/`
2. Follow existing test patterns
3. Ensure 60%+ coverage for critical paths
4. Run `npm test -- --coverage` to verify
5. Update this README if needed

## Common Issues

### Tests timing out
- Increase timeout: `it('test', async () => { ... }, 10000)`
- Check for unresolved promises

### Mock not working
- Ensure mock is set up in `beforeEach`
- Use `vi.mock()` for module mocking
- Use `vi.spyOn()` for function spying

### Coverage not meeting targets
- Add tests for uncovered branches
- Use `--coverage` flag to identify gaps
- Focus on critical business logic first

## Performance

Tests typically run in < 5 seconds total. If tests are slow:
1. Check for unnecessary async operations
2. Use mock data instead of actual DB queries
3. Profile with `npm test -- --reporter=verbose`

## Future Improvements

- [ ] E2E tests with Playwright
- [ ] Performance benchmarks
- [ ] Contract tests for API
- [ ] Visual regression tests
- [ ] Load testing for scalability
