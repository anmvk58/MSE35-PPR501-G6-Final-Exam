import pandas as pd
import os
from typing import List, Optional
from models import StudentCreate, StudentUpdate, StudentResponse

class StudentDatabase:
    """Class quản lý database sinh viên sử dụng Pandas"""
    
    def __init__(self, csv_path: str = "data/students.csv"):
        self.csv_path = csv_path
        self._ensure_data_directory()
        self._load_or_create_csv()
    
    def _ensure_data_directory(self):
        """Tạo thư mục data nếu chưa tồn tại"""
        os.makedirs(os.path.dirname(self.csv_path), exist_ok=True)
    
    def _load_or_create_csv(self):
        """Load CSV hoặc tạo mới nếu chưa có"""
        if os.path.exists(self.csv_path):
            self.df = pd.read_csv(self.csv_path)
            # Đảm bảo các cột số được chuyển đúng kiểu
            for col in ['diem_toan', 'diem_van', 'diem_anh', 'diem_trung_binh']:
                if col in self.df.columns:
                    self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
        else:
            # Tạo DataFrame trống với các cột cần thiết
            self.df = pd.DataFrame(columns=[
                'id', 'ma_so_sv', 'ho', 'ten', 'email', 'ngay_sinh',
                'que_quan', 'diem_toan', 'diem_van', 'diem_anh', 'diem_trung_binh'
            ])
            self._save()
    
    def _save(self):
        """Lưu DataFrame vào CSV"""
        self.df.to_csv(self.csv_path, index=False)
    
    def _calculate_average(self, diem_toan: Optional[float], 
                          diem_van: Optional[float], 
                          diem_anh: Optional[float]) -> Optional[float]:
        """Tính điểm trung bình"""
        diem_list = [d for d in [diem_toan, diem_van, diem_anh] if d is not None]
        if not diem_list:
            return None
        return round(sum(diem_list) / len(diem_list), 2)
    
    def _row_to_response(self, row) -> StudentResponse:
        """Chuyển đổi row DataFrame sang StudentResponse"""
        return StudentResponse(
            id=int(row['id']),
            ma_so_sv=str(row['ma_so_sv']),
            ho=str(row['ho']) if pd.notna(row['ho']) else "",
            ten=str(row['ten']) if pd.notna(row['ten']) else "",
            email=str(row['email']) if pd.notna(row['email']) else None,
            ngay_sinh=str(row['ngay_sinh']) if pd.notna(row['ngay_sinh']) else None,
            que_quan=str(row['que_quan']) if pd.notna(row['que_quan']) else None,
            diem_toan=float(row['diem_toan']) if pd.notna(row['diem_toan']) else None,
            diem_van=float(row['diem_van']) if pd.notna(row['diem_van']) else None,
            diem_anh=float(row['diem_anh']) if pd.notna(row['diem_anh']) else None,
            diem_trung_binh=float(row['diem_trung_binh']) if pd.notna(row['diem_trung_binh']) else None
        )
    
    def get_all_students(self, skip: int = 0, limit: int = 100) -> List[StudentResponse]:
        """Lấy danh sách tất cả sinh viên"""
        students = []
        for _, row in self.df.iloc[skip:skip+limit].iterrows():
            students.append(self._row_to_response(row))
        return students
    
    def get_student_by_id(self, student_id: int) -> Optional[StudentResponse]:
        """Lấy thông tin sinh viên theo ID"""
        result = self.df[self.df['id'] == student_id]
        if result.empty:
            return None
        return self._row_to_response(result.iloc[0])
    
    def get_student_by_ma_so(self, ma_so_sv: str) -> Optional[StudentResponse]:
        """Lấy thông tin sinh viên theo mã số"""
        result = self.df[self.df['ma_so_sv'] == ma_so_sv]
        if result.empty:
            return None
        return self._row_to_response(result.iloc[0])
    
    def create_student(self, student: StudentCreate) -> StudentResponse:
        """Tạo mới sinh viên"""
        # Tạo ID mới
        new_id = 1 if self.df.empty else int(self.df['id'].max()) + 1
        
        # Tính điểm trung bình
        diem_tb = self._calculate_average(
            student.diem_toan, 
            student.diem_van, 
            student.diem_anh
        )
        
        # Tạo record mới
        new_record = {
            'id': new_id,
            'ma_so_sv': student.ma_so_sv,
            'ho': student.ho,
            'ten': student.ten,
            'email': student.email,
            'ngay_sinh': student.ngay_sinh,
            'que_quan': student.que_quan,
            'diem_toan': student.diem_toan,
            'diem_van': student.diem_van,
            'diem_anh': student.diem_anh,
            'diem_trung_binh': diem_tb
        }
        
        # Thêm vào DataFrame
        self.df = pd.concat([self.df, pd.DataFrame([new_record])], ignore_index=True)
        self._save()
        
        return self.get_student_by_id(new_id)
    
    def update_student(self, student_id: int, student_update: StudentUpdate) -> Optional[StudentResponse]:
        """Cập nhật thông tin sinh viên"""
        if student_id not in self.df['id'].values:
            return None
        
        # Lấy index của sinh viên
        idx = self.df[self.df['id'] == student_id].index[0]
        
        # Cập nhật các trường
        update_data = student_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key in self.df.columns:
                self.df.at[idx, key] = value
        
        # Tính lại điểm trung bình
        row = self.df.loc[idx]
        diem_tb = self._calculate_average(
            row['diem_toan'] if pd.notna(row['diem_toan']) else None,
            row['diem_van'] if pd.notna(row['diem_van']) else None,
            row['diem_anh'] if pd.notna(row['diem_anh']) else None
        )
        self.df.at[idx, 'diem_trung_binh'] = diem_tb
        
        self._save()
        return self.get_student_by_id(student_id)
    
    def delete_student(self, student_id: int) -> bool:
        """Xóa sinh viên"""
        if student_id not in self.df['id'].values:
            return False
        
        self.df = self.df[self.df['id'] != student_id]
        self._save()
        return True
    
    def search_students(self, keyword: str) -> List[StudentResponse]:
        """Tìm kiếm sinh viên theo từ khóa"""
        if not keyword:
            return self.get_all_students()
        
        # Tìm kiếm trong các cột text
        mask = (
            self.df['ma_so_sv'].str.contains(keyword, case=False, na=False) |
            self.df['ho'].str.contains(keyword, case=False, na=False) |
            self.df['ten'].str.contains(keyword, case=False, na=False) |
            self.df['email'].str.contains(keyword, case=False, na=False) |
            self.df['que_quan'].str.contains(keyword, case=False, na=False)
        )
        
        result_df = self.df[mask]
        students = []
        for _, row in result_df.iterrows():
            students.append(self._row_to_response(row))
        return students
    
    def get_statistics(self) -> dict:
        """Lấy thống kê"""
        return {
            "total_students": len(self.df),
            "avg_diem_toan": float(self.df['diem_toan'].mean()) if not self.df['diem_toan'].isna().all() else None,
            "avg_diem_van": float(self.df['diem_van'].mean()) if not self.df['diem_van'].isna().all() else None,
            "avg_diem_anh": float(self.df['diem_anh'].mean()) if not self.df['diem_anh'].isna().all() else None,
            "avg_diem_trung_binh": float(self.df['diem_trung_binh'].mean()) if not self.df['diem_trung_binh'].isna().all() else None
        }

# Khởi tạo database instance
db = StudentDatabase()