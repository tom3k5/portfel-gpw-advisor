---
description: Implement LSTM neural network for price predictions
---

You are implementing AI-powered price predictions (Etap 3, Week 1-4).

**Context**: Use LSTM neural networks to predict stock price movements and provide probability-based recommendations.

**Requirements from spec**:
- LSTM model for price forecasting
- Consider historical prices AND sentiment data
- Provide probability estimates (e.g., "70% chance of 15% increase")
- Model training in Python, inference in TypeScript (Torch.js)

**Your task**:

## Phase 1: Model Training (Python)
1. Create training pipeline in `ml-models/lstm/train.py`:
   ```python
   # Features:
   # - Historical prices (60 days)
   # - Volume
   # - Sentiment scores
   # - Technical indicators (RSI, MACD)

   # Target:
   # - Price change % in next 14 days
   ```

2. Model architecture:
   - Input: 60 timesteps × 5 features
   - LSTM layers: 128 → 64 → 32 units
   - Dropout: 0.2 (prevent overfitting)
   - Output: Price prediction + confidence interval

3. Training data preparation:
   - Fetch historical data from Polygon.io
   - Normalize features (MinMaxScaler)
   - Create sliding windows
   - 80/20 train/validation split

4. Model evaluation:
   - RMSE (Root Mean Square Error)
   - Directional accuracy (% correct up/down predictions)
   - Backtesting on historical data

5. Export model to ONNX format for Torch.js

## Phase 2: Model Inference (TypeScript)
1. Create inference service in `packages/logic/src/ml/lstm.ts`:
   - Load ONNX model using Torch.js
   - `predictPrice(symbol, historicalData, sentiment)` function
   - Return prediction + confidence score

2. Implement prediction caching:
   - Cache predictions for 24 hours
   - Invalidate on significant price changes
   - Store in database

3. Create prediction display component:
   - Show predicted price range
   - Display confidence interval
   - Visual chart with prediction overlay

## Phase 3: Integration
1. Add predictions to reports:
   ```
   JSW: Aktualna cena: 32.50 PLN
   Prognoza (14 dni): 37.40 PLN (+15.1%)
   Pewność: 70%
   Rekomendacja: KUP
   ```

2. Update recommendation engine:
   - Combine prediction, sentiment, and technical analysis
   - Generate action: STRONG BUY, BUY, HOLD, SELL, STRONG SELL
   - Include risk assessment

3. Add explanation for predictions:
   - "Model widzi wzrostowy trend w cenach"
   - "Pozytywny sentyment wspiera prognozę"
   - "Wysoka pewność dzięki stabilnym wzorcom"

## Phase 4: Continuous Improvement
1. Implement model retraining pipeline:
   - Retrain weekly with new data
   - A/B test new model versions
   - Track prediction accuracy over time

2. Add model monitoring:
   - Log all predictions
   - Compare predictions vs actual outcomes
   - Alert if accuracy drops below 60%

**Tech stack**:
- Python: PyTorch, pandas, numpy, scikit-learn
- TypeScript: Torch.js (ONNX runtime)
- Storage: PostgreSQL for predictions and model metrics

**Required data**:
- Minimum 2 years historical price data
- Daily sentiment scores
- Volume data

**Expected deliverable**:
- Trained LSTM model with >60% directional accuracy
- TypeScript inference engine
- Dashboard showing AI predictions with confidence scores
