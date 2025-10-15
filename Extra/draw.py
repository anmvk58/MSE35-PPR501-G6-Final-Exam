import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load cleaned data from Excel
xlsx_path = 'students_cleaned.xlsx'
df = pd.read_excel(xlsx_path)

# 1. Side-by-side scatter plots for subject pairs
fig, axes = plt.subplots(1, 3, figsize=(18, 6))
# English vs Math
axes[0].scatter(df['Điểm Toán'], df['Điểm Anh'], alpha=0.7, color='b')
axes[0].set_xlabel('Math Score')
axes[0].set_ylabel('English Score')
axes[0].set_title('English vs Math')
# Math vs Literature
axes[1].scatter(df['Điểm Toán'], df['Điểm Văn'], alpha=0.7, color='g')
axes[1].set_xlabel('Math Score')
axes[1].set_ylabel('Literature Score')
axes[1].set_title('Math vs Literature')
# Literature vs English
axes[2].scatter(df['Điểm Văn'], df['Điểm Anh'], alpha=0.7, color='r')
axes[2].set_xlabel('Literature Score')
axes[2].set_ylabel('English Score')
axes[2].set_title('Literature vs English')
plt.tight_layout()
plt.savefig('diagram_1_subject_pairs_side_by_side.png')
plt.close()

# 2. Side-by-side boxplots for subject scores by hometown
score_cols = ['Điểm Anh', 'Điểm Toán', 'Điểm Văn']
titles = ['English Score by Hometown', 'Math Score by Hometown', 'Literature Score by Hometown']
fig, axes = plt.subplots(1, 3, figsize=(24, 6))
for i, col in enumerate(score_cols):
	sns.boxplot(x=df['Quê quán'], y=df[col], ax=axes[i])
	axes[i].set_xlabel('Hometown')
	axes[i].set_ylabel(col)
	axes[i].set_title(titles[i])
	axes[i].tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.savefig('diagram_2_subjects_by_hometown_side_by_side.png')
plt.close()

# 3. Average score by hometown (bar chart)
avg_scores = df.groupby('Quê quán')[['Điểm Toán','Điểm Văn','Điểm Anh']].mean().round(2)
ax = avg_scores.plot(kind='bar', figsize=(12,6))
plt.xlabel('Hometown')
plt.ylabel('Average Score')
plt.title('Average Scores by Hometown')
plt.xticks(rotation=45)
plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))
plt.tight_layout(rect=[0,0,0.85,1])
plt.savefig('diagram_3_avg_scores_by_hometown.png', bbox_inches='tight')
plt.close()

# 4. Distribution of Literature scores (histogram)

score_cols = ['Điểm Toán', 'Điểm Văn', 'Điểm Anh']
titles = ['Distribution of Math Scores', 'Distribution of Literature Scores', 'Distribution of English Scores']
bins = range(0, 11)  # Assuming scores are from 0 to 10
fig, axes = plt.subplots(1, 3, figsize=(18, 6))
for i, col in enumerate(score_cols):
	scores = df[col].dropna()
	min_score = scores.min()
	max_score = scores.max()
	sns.histplot(scores, bins=bins, kde=True, ax=axes[i], color='skyblue')
	axes[i].set_xlim(min_score, max_score)
	axes[i].set_xlabel('Score')
	axes[i].set_ylabel('Count')
	axes[i].set_title(titles[i])
plt.tight_layout()
plt.savefig('diagram_4_subjects_score_side_by_side.png')
plt.close()

# 5. Distribution of students by year of birth (histogram)
if 'Ngày sinh' in df.columns:
	# Extract year from 'Ngày sinh' (assume format YYYY-MM-DD or DD/MM/YYYY or similar)
	def extract_year(date_str):
		if pd.isna(date_str):
			return None
		date_str = str(date_str)
		# Try YYYY-MM-DD
		if '-' in date_str:
			parts = date_str.split('-')
			if len(parts[0]) == 4:
				return int(parts[0])
			elif len(parts[-1]) == 4:
				return int(parts[-1])
		# Try DD/MM/YYYY
		if '/' in date_str:
			parts = date_str.split('/')
			for part in parts:
				if len(part) == 4:
					return int(part)
		# Fallback: try to find a 4-digit year
		import re
		match = re.search(r'(19|20)\d{2}', date_str)
		if match:
			return int(match.group(0))
		return None
	years = df['Ngày sinh'].apply(extract_year).dropna().astype(int)
	year_counts = years.value_counts().sort_index()
	plt.figure(figsize=(8,6))
	sns.barplot(x=year_counts.index.astype(str), y=year_counts.values, color='skyblue')
	plt.xlabel('Year of Birth')
	plt.ylabel('Number of Students')
	plt.title('Distribution of Students by Year of Birth')
	plt.tight_layout()
	plt.savefig('diagram_5_year_of_birth_distribution.png')
	plt.close()
else:
	print('Column "Ngày sinh" not found in data. Skipping 5th diagram.')

print('All diagrams saved as PNG files.')
