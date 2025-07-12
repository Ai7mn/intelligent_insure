import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, mean_squared_error

print("🚀 Starting Advanced Model Training Pipeline...")

# --- 1. Load Data ---
data_path = os.path.join(os.path.dirname(__file__), 'training_data.json')
print(f"Loading data from {data_path}...")
try:
    df = pd.read_json(data_path)
except FileNotFoundError:
    print(f"❌ ERROR: training_data.json not found. Please create it first.")
    exit()

print("Data loaded successfully. Shape:", df.shape)

# --- 2. Feature Engineering & Preprocessing ---
print("\nDefining features and targets...")
# Define input features for the models
FEATURES = ['age', 'income', 'dependents', 'risk_tolerance']

# Define categorical and numerical features for the preprocessor
CATEGORICAL_FEATURES = ['risk_tolerance']
NUMERICAL_FEATURES = ['age', 'income', 'dependents']

# Create a preprocessor for input features
# This will one-hot encode categorical variables and pass numerical ones through
preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', NUMERICAL_FEATURES),
        ('cat', OneHotEncoder(handle_unknown='ignore'), CATEGORICAL_FEATURES)
    ],
    remainder='passthrough' # Keep other columns if any
)

# --- 3. Model Training ---

# --- Model 1: Policy Type (Classifier) ---
print("\n--- Training Model 1: Policy Type ---")
TARGET_POLICY = 'policy_type'
X = df[FEATURES]
y_policy = df[TARGET_POLICY]

# Split data for evaluation
X_train, X_test, y_policy_train, y_policy_test = train_test_split(X, y_policy, test_size=0.2, random_state=42, stratify=y_policy)

# Create the pipeline
policy_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42, n_estimators=150, class_weight='balanced'))
])

# Train the model
policy_pipeline.fit(X_train, y_policy_train)
print("Policy Type Model training complete.")

# Evaluate the model
y_policy_pred = policy_pipeline.predict(X_test)
print("Policy Type Model Evaluation Report:")
print(classification_report(y_policy_test, y_policy_pred, zero_division=0))


# --- Model 2: Coverage Amount (Regressor) ---
print("\n--- Training Model 2: Coverage Amount ---")
TARGET_COVERAGE = 'coverage_amount'
y_coverage = df[TARGET_COVERAGE]

# Split data for evaluation
X_train, X_test, y_coverage_train, y_coverage_test = train_test_split(X, y_coverage, test_size=0.2, random_state=42)

# Create the pipeline
coverage_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(random_state=42, n_estimators=150))
])

# Train the model
coverage_pipeline.fit(X_train, y_coverage_train)
print("Coverage Amount Model training complete.")

# Evaluate the model
y_coverage_pred = coverage_pipeline.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_coverage_test, y_coverage_pred))
print("Coverage Amount Model Evaluation:")
print(f"Root Mean Squared Error (RMSE): ${rmse:,.2f}")


# --- Model 3: Term Length (Classifier) ---
print("\n--- Training Model 3: Term Length ---")
TARGET_TERM = 'term_length'
# Fill NaN with 0 for classification purposes (permanent policies)
df[TARGET_TERM] = df[TARGET_TERM].fillna(0).astype(int)
y_term = df[TARGET_TERM]

# Split data for evaluation
X_train, X_test, y_term_train, y_term_test = train_test_split(X, y_term, test_size=0.2, random_state=42, stratify=y_term)

# Create the pipeline
term_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42, n_estimators=150, class_weight='balanced'))
])

# Train the model
term_pipeline.fit(X_train, y_term_train)
print("Term Length Model training complete.")

# Evaluate the model
y_term_pred = term_pipeline.predict(X_test)
print("Term Length Model Evaluation Report:")
# Use zero_division=0 to handle cases where a class has no predictions
print(classification_report(y_term_test, y_term_pred, zero_division=0))

# --- Model 4: Explanation (Classifier) ---
print("\n--- Training Model 4: Explanation ---")
TARGET_EXPLANATION = 'explanation'
y_explanation = df[TARGET_EXPLANATION]

# Split data for evaluation
X_train, X_test, y_explanation_train, y_explanation_test = train_test_split(X, y_explanation, test_size=0.2, random_state=42)

# Create the pipeline
explanation_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42, n_estimators=150, class_weight='balanced'))
])

# Train the model
explanation_pipeline.fit(X_train, y_explanation_train)
print("Explanation Model training complete.")

# Evaluate the model
y_explanation_pred = explanation_pipeline.predict(X_test)
print("Explanation Model Evaluation Report:")
print(classification_report(y_explanation_test, y_explanation_pred, zero_division=0))


# --- 4. Save All Models ---
print("\nSaving all trained models into a single file...")
models = {
    'policy_type': policy_pipeline,
    'coverage_amount': coverage_pipeline,
    'term_length': term_pipeline,
    'explanation': explanation_pipeline
}

model_filename = 'insurance_models.pkl'
joblib.dump(models, model_filename)

print(f"✅ All models saved successfully to '{model_filename}'")
