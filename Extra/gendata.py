import json
import random
import requests
from datetime import date, timedelta
from time import sleep

# --- Config ---
API_URL = "http://127.0.0.1:8000/api/students/"

# --- Sample data ---
first_names = [
    "Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Vo", "Dang", "Bui"
]
last_names = [
    "An", "Binh", "Chau", "Dung", "Hanh", "Hieu", "Khang", "Lan", "Minh", "Trang",
    "Tuan", "Phuong", "Linh", "Hoa", "Long", "Son", "Tam", "Thao", "Thien", "Van"
]
cities = [
    "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Nam Định", "Thanh Hóa",
]

# --- Helpers ---
def random_birth_date():
    start_date = date(2002, 1, 1)
    end_date = date(2005, 12, 31)
    delta_days = (end_date - start_date).days
    return (start_date + timedelta(days=random.randint(0, delta_days))).isoformat()

def maybe_missing_scores():
    scores = {
        "math_score": round(random.uniform(0, 10), 2),
        "literature_score": round(random.uniform(0, 10), 2),
        "english_score": round(random.uniform(0, 10), 2),
    }
    # Randomly drop 0–3 scores
    missing_count = random.choice([0, 1, 2, 3])
    if missing_count > 0:
        drop_keys = random.sample(list(scores.keys()), missing_count)
        for k in drop_keys:
            del scores[k]  # remove key entirely if missing
    return scores

# --- Generate data ---
students = []

for i in range(1, 101):
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    code = f"MSE_{i:03d}"
    email = f"{fn.lower()}.{ln.lower()}.{code.lower()}@example.com"

    if i <= 70:
        scores = {
            "math_score": round(random.uniform(0, 10), 2),
            "literature_score": round(random.uniform(0, 10), 2),
            "english_score": round(random.uniform(0, 10), 2),
        }
    else:
        scores = maybe_missing_scores()

    student = {
        "student_code": code,
        "first_name": fn,
        "last_name": ln,
        "email": email,
        "birth_date": random_birth_date(),
        "hometown": random.choice(cities),
        **scores,
    }

    students.append(student)

# --- Save to JSON file ---
with open("students.json", "w", encoding="utf-8") as f:
    json.dump(students, f, ensure_ascii=False, indent=2)

print("✅ Generated 100 students -> students.json")

# --- Post to server ---
headers = {"Content-Type": "application/json"}

success = 0
for s in students:
    try:
        res = requests.post(API_URL, json=s, headers=headers, timeout=5)
        if res.status_code in (200, 201):
            success += 1
            print(f"[{success:03d}] ✅ {s['student_code']} -> OK ({res.status_code})")
        else:
            print(f"❌ {s['student_code']} -> {res.status_code} {res.text}")
    except Exception as e:
        print(f"⚠️ {s['student_code']} -> Error: {e}")
    sleep(0.1)  # small delay to avoid overload

print(f"\n🎯 Done! {success}/100 students successfully posted.")
