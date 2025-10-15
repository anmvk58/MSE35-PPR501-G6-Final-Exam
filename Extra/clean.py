import pandas as pd
import numpy as np

# Load the CSV
input_path = 'students_crawled.csv'
df = pd.read_csv(input_path, encoding='utf-8')

score_cols = ['Điểm Toán', 'Điểm Văn', 'Điểm Anh']

# Remove rows where all 3 scores are missing or '-'
def all_scores_missing(row):
    return all(str(row[col]).strip() in ['', '-', 'NaN', 'nan'] for col in score_cols)
df = df[~df.apply(all_scores_missing, axis=1)].copy()

# Convert scores to numeric, treat '-' and empty as NaN
def to_num(val):
    try:
        return float(val)
    except:
        return np.nan
for col in score_cols:
    df[col] = df[col].replace('-', np.nan).apply(to_num)

# Fill missing scores with average for that subject in the same hometown
def fill_missing_scores(row):
    for col in score_cols:
        if pd.isna(row[col]):
            hometown = row['Quê quán']
            avg = df.loc[(df['Quê quán'] == hometown) & (~df[col].isna()), col].mean()
            row[col] = round(avg, 2) if not np.isnan(avg) else np.nan
    return row
df = df.apply(fill_missing_scores, axis=1)

# Export to Excel
output_path = 'students_cleaned.xlsx'
df.to_excel(output_path, index=False)
print(f"Cleaned data exported to {output_path}")

