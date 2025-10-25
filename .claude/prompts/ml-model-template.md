# ML Model Development Template

Use this template when developing machine learning models for price prediction and optimization.

## Model Development Checklist

### 1. Problem Definition
- [ ] Clear objective defined (e.g., predict 14-day price change)
- [ ] Success metrics identified (RMSE, directional accuracy)
- [ ] Baseline established (naive prediction to beat)

### 2. Data Collection
```python
# data/scripts/fetch_data.py
import pandas as pd
from datetime import datetime, timedelta

def fetch_training_data(symbol: str, years: int = 2):
    """
    Fetch historical data for model training

    Args:
        symbol: Stock symbol (e.g., 'PKN')
        years: Years of historical data

    Returns:
        DataFrame with OHLCV + sentiment
    """
    # Implementation
    pass
```

Required data:
- [ ] Historical prices (min 2 years)
- [ ] Volume data
- [ ] Sentiment scores
- [ ] Technical indicators
- [ ] Metadata (sector, market cap)

### 3. Data Preprocessing
```python
# ml-models/preprocessing/prepare.py
from sklearn.preprocessing import MinMaxScaler

def preprocess_data(df: pd.DataFrame):
    """
    Preprocess data for LSTM model

    Steps:
    1. Handle missing values
    2. Normalize features (0-1 range)
    3. Create sequences (60 timesteps)
    4. Train/validation split (80/20)
    """
    # Normalization
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[['close', 'volume', 'sentiment']])

    # Create sequences
    sequences = create_sequences(scaled_data, timesteps=60)

    return sequences, scaler
```

### 4. Model Architecture
```python
# ml-models/lstm/model.py
import torch
import torch.nn as nn

class LSTMPricePredictor(nn.Module):
    def __init__(self, input_size=5, hidden_sizes=[128, 64, 32], dropout=0.2):
        super(LSTMPricePredictor, self).__init__()

        self.lstm1 = nn.LSTM(input_size, hidden_sizes[0], batch_first=True)
        self.dropout1 = nn.Dropout(dropout)

        self.lstm2 = nn.LSTM(hidden_sizes[0], hidden_sizes[1], batch_first=True)
        self.dropout2 = nn.Dropout(dropout)

        self.lstm3 = nn.LSTM(hidden_sizes[1], hidden_sizes[2], batch_first=True)
        self.dropout3 = nn.Dropout(dropout)

        self.fc = nn.Linear(hidden_sizes[2], 1)

    def forward(self, x):
        # LSTM layers
        out, _ = self.lstm1(x)
        out = self.dropout1(out)

        out, _ = self.lstm2(out)
        out = self.dropout2(out)

        out, _ = self.lstm3(out)
        out = self.dropout3(out)

        # Final prediction
        out = self.fc(out[:, -1, :])
        return out
```

### 5. Training
```python
# ml-models/lstm/train.py
def train_model(model, train_loader, val_loader, epochs=100):
    """
    Train LSTM model with early stopping
    """
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer)

    best_val_loss = float('inf')
    patience_counter = 0

    for epoch in range(epochs):
        # Training loop
        model.train()
        train_loss = 0
        for batch_x, batch_y in train_loader:
            optimizer.zero_grad()
            predictions = model(batch_x)
            loss = criterion(predictions, batch_y)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()

        # Validation
        model.eval()
        val_loss = validate(model, val_loader, criterion)

        # Early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pth')
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= 10:
                print("Early stopping triggered")
                break

        scheduler.step(val_loss)
```

### 6. Evaluation
```python
# ml-models/lstm/evaluate.py
def evaluate_model(model, test_data):
    """
    Evaluate model performance

    Metrics:
    - RMSE (Root Mean Square Error)
    - MAE (Mean Absolute Error)
    - Directional Accuracy (% correct up/down)
    - Profit factor (if used for trading)
    """
    predictions = model.predict(test_data)

    rmse = calculate_rmse(predictions, actual)
    mae = calculate_mae(predictions, actual)
    directional_accuracy = calculate_directional_accuracy(predictions, actual)

    return {
        'rmse': rmse,
        'mae': mae,
        'directional_accuracy': directional_accuracy
    }
```

### 7. Model Export
```python
# Export to ONNX for Torch.js
import torch.onnx

dummy_input = torch.randn(1, 60, 5)  # (batch, timesteps, features)
torch.onnx.export(
    model,
    dummy_input,
    "lstm_model.onnx",
    export_params=True,
    opset_version=11,
    input_names=['input'],
    output_names=['output']
)
```

### 8. Inference (TypeScript)
```typescript
// packages/logic/src/ml/lstm.ts
import * as ort from 'onnxruntime-web';

async function predictPrice(historicalData: number[][]) {
  const session = await ort.InferenceSession.create('lstm_model.onnx');

  const inputTensor = new ort.Tensor('float32', historicalData.flat(), [1, 60, 5]);
  const results = await session.run({ input: inputTensor });

  return results.output.data[0];
}
```

## Model Documentation Requirements
- [ ] Model architecture diagram
- [ ] Hyperparameters documented
- [ ] Training data sources
- [ ] Performance metrics on test set
- [ ] Known limitations
- [ ] Retraining schedule
- [ ] Deployment instructions

## Success Criteria
- RMSE < 5% of average price
- Directional accuracy > 60%
- Beats naive baseline by >10%
- Inference time < 100ms
