# Credit Card Fraud Detector
A machine learning project which aim is to develop a model to predict fraudulent transactions.
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

## About the Model Used
Several models was trained including Linear Regression, Decision Tree, and XGBoost. But XGBoost achieved highly accurate metrics.

## Background
The model was trained on a dataset with a severe class imbalance, where only 0.17% of transactions were fraudulent. The features (V1, V2, etc.) are the result of a PCA transformation on the original transaction data and are all numerical. The model was optimized to have high sensitivity (recall) for the fraudulent class, meaning it's crucial to identify fraud even if it leads to some false positives. The most important features for prediction have been identified as V10, V12, V14, and V17. Strongly negative values in these features are highly indicative of fraud.

## Run Locally
This contains everything you need to run the app locally.

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 👨‍💻 Author
**Oluwaseun E. Olubunmi**
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin)](https://www.linkedin.com/in/ooluwaseun/)
- [![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/emmyt1)
