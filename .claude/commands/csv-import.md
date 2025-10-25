---
description: Implement CSV portfolio import functionality
---

You are implementing manual portfolio import feature (Etap 1, Week 3).

**Context**: Users need to import their existing portfolios from CSV files or add positions manually.

**Requirements**:
- Manual form for adding positions (symbol, quantity, purchase price)
- CSV file import using PapaParse library
- Local data persistence (AsyncStorage for mobile, localStorage for web)
- Input validation and error handling

**CSV Format expected**:
```csv
Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,45.50,2024-01-15
JSW,50,32.00,2024-02-20
CDR,200,150.75,2024-03-10
```

**Your task**:
1. Create form component in `packages/ui/src/components/AddPositionForm.tsx`:
   - Input fields: symbol (text), quantity (number), purchase price (number), date (date picker)
   - Validation: all fields required, quantity > 0, price > 0
   - Submit handler

2. Implement CSV import in `packages/logic/src/utils/csvImport.ts`:
   - Use PapaParse to parse CSV
   - Validate data format
   - Return parsed positions array or errors

3. Create portfolio storage in `packages/logic/src/storage/portfolio.ts`:
   - `savePortfolio(positions)` - persist to storage
   - `loadPortfolio()` - retrieve from storage
   - `addPosition(position)` - add single position
   - `removePosition(symbol)` - remove position
   - `updatePosition(symbol, updates)` - update position

4. Add file picker for CSV upload:
   - Use `expo-document-picker` for mobile
   - Use HTML file input for web

5. Create import screen with:
   - Manual entry form
   - CSV upload button
   - Preview of imported data before saving
   - Success/error messages

**Expected deliverable**: Working import functionality allowing users to build their portfolio manually or via CSV
