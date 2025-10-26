# Etap 3, Week 13-15: LSTM Neural Network for Price Predictions

**Goal**: Implement LSTM model for stock price predictions with confidence intervals

**Duration**: 3 weeks

**Assigned Agents**: @ml-expert, @backend-expert, @frontend-expert

---

## Technical Requirements

### ML Architecture (@ml-expert)

1. **LSTM Model** (`packages/logic/src/ml/lstm-predictor.ts`)

   ```typescript
   interface PredictionModel {
     symbol: string;
     trainedAt: Date;
     accuracy: number; // validation accuracy
     features: string[]; // input features used
     hyperparameters: {
       lookbackDays: number;
       hiddenLayers: number;
       epochs: number;
       batchSize: number;
     };
   }

   interface PricePrediction {
     symbol: string;
     predictedDate: Date;
     predictedPrice: number;
     confidence: number; // 0-1
     confidenceInterval: {
       lower: number; // 95% CI lower bound
       upper: number; // 95% CI upper bound
     };
     features: {
       technical: TechnicalIndicators;
       sentiment?: number;
       volume?: number;
     };
   }
   ```

2. **Model Architecture**
   - **Input Features** (time series):
     - Historical prices (OHLCV)
     - Technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
     - Volume patterns
     - Sentiment scores (from Etap 2)
     - Market-wide indicators (WIG20 index)

   - **LSTM Layers**:

     ```
     Input → LSTM(64) → Dropout(0.2) → LSTM(32) → Dropout(0.2) → Dense(16) → Output
     ```

   - **Prediction Horizon**: 1 day, 3 days, 7 days, 30 days

3. **Training Pipeline** (`packages/logic/src/ml/training.ts`)
   - Data collection (historical prices + features)
   - Feature engineering (normalization, scaling)
   - Train/validation/test split (70/15/15)
   - Model training with early stopping
   - Hyperparameter tuning
   - Model evaluation (RMSE, MAE, R²)
   - Model persistence (save/load)

4. **Technology Stack**
   - **TensorFlow.js**: Run models in JavaScript (client-side or Node.js)
   - **Python backend** (optional): Train models with PyTorch/TensorFlow, export to TFJS
   - **Model storage**: Save trained models to files, version control

### Backend (@backend-expert)

1. **Prediction Service** (`packages/logic/src/services/prediction.ts`)
   - Load trained models
   - Fetch latest data for prediction
   - Run inference (generate predictions)
   - Cache predictions (refresh daily)
   - Batch predictions for entire portfolio

2. **Training Service** (`packages/logic/src/services/model-training.ts`)
   - Automated model retraining (weekly)
   - Data preparation and feature engineering
   - Model versioning and A/B testing
   - Performance monitoring (drift detection)

3. **API Endpoints**
   - `GET /api/predictions/:symbol` - Get prediction for symbol
   - `GET /api/predictions/portfolio` - Predictions for all positions
   - `POST /api/predictions/train` - Trigger model retraining (admin)
   - `GET /api/models/:symbol/performance` - Model accuracy metrics

### Frontend (@frontend-expert)

1. **Prediction Components** (`packages/ui/src/components/predictions/`)

   ```typescript
   // PredictionChart.tsx - Visual price prediction
   interface PredictionChartProps {
     symbol: string;
     historicalData: DataPoint[];
     predictions: PricePrediction[];
     showConfidenceInterval: boolean;
   }

   // PredictionCard.tsx - Summary card
   interface PredictionCardProps {
     prediction: PricePrediction;
     onDetailsPress: () => void;
   }

   // ModelAccuracy.tsx - Shows model performance
   interface ModelAccuracyProps {
     symbol: string;
     accuracy: number;
     lastTrainedAt: Date;
   }
   ```

2. **Visualizations**
   - Line chart: Historical prices + predicted prices
   - Shaded area: Confidence interval (95% CI)
   - Color coding: Green (bullish), Red (bearish)
   - Accuracy badge: Model confidence indicator

3. **Integration Points**
   - Dashboard: Prediction overview for portfolio
   - Stock detail page: Detailed prediction chart
   - Notification: Alert on significant prediction change

---

## Implementation Tasks

### Week 13: ML Foundation & Data Preparation

**Day 1-2**: Research & Setup

- [ ] Research LSTM architectures for stock prediction
- [ ] Review academic papers (time series forecasting)
- [ ] Set up TensorFlow.js environment
- [ ] Decide: Client-side vs server-side inference
- [ ] Create project structure for ML code

**Day 3-4**: Data Pipeline

- [ ] Create `packages/logic/src/ml/data-loader.ts`
- [ ] Implement historical data fetching (Polygon.io)
- [ ] Build feature engineering pipeline:
  - [ ] Calculate technical indicators (RSI, MACD, SMA, EMA)
  - [ ] Normalize price data (MinMaxScaler)
  - [ ] Create time series windows (lookback)
  - [ ] Integrate sentiment scores
- [ ] Write data pipeline tests
- [ ] Generate training dataset for sample stocks

**Day 5**: Initial Model

- [ ] Create `packages/logic/src/ml/lstm-predictor.ts`
- [ ] Implement basic LSTM architecture
- [ ] Train model on sample stock (PKN Orlen)
- [ ] Evaluate baseline performance
- [ ] Document results and learnings

### Week 14: Model Training & Optimization

**Day 1-2**: Model Development

- [ ] Experiment with architectures:
  - [ ] Vary LSTM units (32, 64, 128)
  - [ ] Add/remove layers
  - [ ] Tune dropout rates
  - [ ] Test different lookback windows
- [ ] Implement early stopping
- [ ] Add learning rate scheduling
- [ ] Compare model variants

**Day 3**: Hyperparameter Tuning

- [ ] Implement grid search or random search
- [ ] Test different optimizers (Adam, RMSprop)
- [ ] Optimize batch size and epochs
- [ ] Cross-validation for robustness
- [ ] Select best model configuration

**Day 4**: Multi-Stock Training

- [ ] Train models for top 20 GPW stocks
- [ ] Implement model versioning
- [ ] Create model registry (metadata storage)
- [ ] Build automated training pipeline
- [ ] Set up model performance monitoring

**Day 5**: Confidence Intervals & Validation

- [ ] Implement prediction confidence scoring
- [ ] Calculate 95% confidence intervals
- [ ] Validate predictions against hold-out test set
- [ ] Document model accuracy metrics
- [ ] Create model performance report

### Week 15: Backend Integration & Frontend

**Day 1-2**: Backend Services

- [ ] Create `packages/logic/src/services/prediction.ts`
- [ ] Implement model loading and caching
- [ ] Build prediction API endpoints
- [ ] Add batch prediction for portfolio
- [ ] Implement prediction caching (24-hour refresh)
- [ ] Write service tests

**Day 3**: Frontend Components

- [ ] Create `PredictionChart` component
- [ ] Create `PredictionCard` component
- [ ] Create `ModelAccuracy` badge
- [ ] Add platform-specific variants (.web.tsx)
- [ ] Implement loading states and error handling

**Day 4**: Dashboard Integration

- [ ] Add predictions tab to dashboard
- [ ] Show predictions for all positions
- [ ] Add prediction detail view per stock
- [ ] Integrate with portfolio table
- [ ] Add prediction-based sorting/filtering

**Day 5**: Testing & Polish

- [ ] End-to-end testing (train → predict → display)
- [ ] Cross-platform testing
- [ ] Performance optimization (lazy loading)
- [ ] Add disclaimers ("not financial advice")
- [ ] User documentation and help text

---

## Testing Checklist

### ML Model

- [ ] Data pipeline unit tests
- [ ] Feature engineering correctness
- [ ] Model training reproducibility
- [ ] Prediction accuracy (RMSE < threshold)
- [ ] Confidence interval coverage (95%)
- [ ] Overfitting checks (validation vs training loss)

### Backend

- [ ] Prediction service unit tests
- [ ] API endpoint integration tests
- [ ] Model loading performance
- [ ] Caching behavior
- [ ] Error handling (missing data, model errors)

### Frontend

- [ ] Component rendering tests
- [ ] Chart visualization tests
- [ ] Mobile prediction display
- [ ] Web prediction display
- [ ] Loading and error states
- [ ] Accessibility (screen readers)

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.11.0",
    "@tensorflow/tfjs-node": "^4.11.0",
    "technicalindicators": "^3.1.0",
    "ml-matrix": "^6.10.4",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/technicalindicators": "^3.1.0"
  }
}
```

---

## Model Evaluation Metrics

```typescript
interface ModelPerformance {
  symbol: string;
  evaluatedAt: Date;
  metrics: {
    rmse: number; // Root Mean Squared Error (lower is better)
    mae: number; // Mean Absolute Error (lower is better)
    r2: number; // R-squared (closer to 1 is better)
    mape: number; // Mean Absolute Percentage Error
    directionAccuracy: number; // % of correct up/down predictions
  };
  testPeriod: {
    start: Date;
    end: Date;
  };
}
```

**Target Metrics**:

- RMSE: < 5% of average price
- Direction Accuracy: > 55% (better than random)
- R²: > 0.3 (some predictive power)

---

## Technical Indicators for Features

```typescript
// Calculate for lookback window (e.g., 60 days)
interface TechnicalIndicators {
  sma_20: number; // Simple Moving Average (20 days)
  sma_50: number; // Simple Moving Average (50 days)
  ema_12: number; // Exponential Moving Average (12 days)
  ema_26: number; // Exponential Moving Average (26 days)
  rsi_14: number; // Relative Strength Index (14 days)
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  volume_ratio: number; // Current volume / average volume
}
```

---

## Success Criteria

- ✅ LSTM models trained for top 20 GPW stocks
- ✅ Prediction accuracy > 55% direction accuracy
- ✅ Confidence intervals calibrated (95% coverage)
- ✅ Visual prediction charts with CI bands
- ✅ Daily prediction updates
- ✅ Model performance monitoring
- ✅ Automated weekly retraining
- ✅ Cross-platform support (mobile + web)
- ✅ Clear disclaimers and risk warnings
- ✅ Test coverage >80%

---

## Risks & Mitigations

**Risk 1**: Stock market unpredictability (low model accuracy)

- _Mitigation_: Set realistic expectations (55%+ direction accuracy), show confidence intervals, add disclaimers

**Risk 2**: Overfitting to historical data

- _Mitigation_: Strict train/validation/test split, cross-validation, regularization (dropout), monitor validation loss

**Risk 3**: Model training time and resources

- _Mitigation_: Start with small models, use GPU acceleration, consider cloud training (Google Colab)

**Risk 4**: TensorFlow.js bundle size (mobile app)

- _Mitigation_: Server-side inference, lazy loading, model quantization

**Risk 5**: Data quality and availability

- _Mitigation_: Data validation, handle missing values, fallback to simpler models

**Risk 6**: Legal/regulatory (providing investment advice)

- _Mitigation_: Clear disclaimers, "for educational purposes only", not financial advice

---

## Future Enhancements

- **Ensemble models**: Combine LSTM with other ML models (Random Forest, XGBoost)
- **Attention mechanisms**: Transformer-based models for better accuracy
- **Multi-asset correlations**: Learn from related stocks
- **News integration**: Factor in breaking news events
- **User feedback loop**: Learn from user trades
- **Explainable AI**: SHAP values to explain predictions
- **Real-time updates**: Update predictions intraday
- **Custom horizons**: Let users choose prediction timeframe

---

## Disclaimers & Risk Warnings

**Required in UI**:

```
⚠️ Prediction Disclaimer

These predictions are generated by a machine learning model based on historical data.

• Not financial advice
• Past performance ≠ future results
• Models can be wrong
• Use at your own risk
• Consult a financial advisor

This tool is for educational purposes only.
```

---

## Resources & References

### Academic Papers

- "Stock Price Prediction Using LSTM, RNN and CNN-sliding window model" (2020)
- "Deep Learning for Stock Market Prediction" (2019)
- "A Hybrid ARIMA-LSTM Model for Stock Price Prediction" (2021)

### Tutorials

- TensorFlow.js Time Series Forecasting: https://www.tensorflow.org/js/tutorials
- LSTM Stock Prediction: https://www.kaggle.com/code/taronzakaryan/stock-prediction-lstm-using-tensorflow

### Libraries

- TensorFlow.js: https://www.tensorflow.org/js
- Technical Indicators: https://github.com/anandanand84/technicalindicators
- TA-Lib (alternative): https://github.com/TA-Lib/ta-lib-python
