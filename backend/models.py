from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class StudentBase(BaseModel):
    """Model cơ bản cho Student"""
    ma_so_sv: str = Field(..., description="Mã số sinh viên")
    ho: str = Field(..., description="Họ và tên đệm")
    ten: str = Field(..., description="Tên")
    email: Optional[EmailStr] = Field(None, description="Email sinh viên")
    ngay_sinh: Optional[str] = Field(None, description="Ngày sinh (YYYY-MM-DD)")
    que_quan: Optional[str] = Field(None, description="Quê quán")
    diem_toan: Optional[float] = Field(None, ge=0, le=10, description="Điểm Toán")
    diem_van: Optional[float] = Field(None, ge=0, le=10, description="Điểm Văn")
    diem_anh: Optional[float] = Field(None, ge=0, le=10, description="Điểm Tiếng Anh")

    class Config:
        json_schema_extra = {
            "example": {
                "ma_so_sv": "SV001",
                "ho": "Nguyễn Văn",
                "ten": "An",
                "email": "an.nv@example.com",
                "ngay_sinh": "2000-01-15",
                "que_quan": "Hà Nội",
                "diem_toan": 8.5,
                "diem_van": 7.0,
                "diem_anh": 9.0
            }
        }

class StudentCreate(StudentBase):
    """Model tạo mới Student"""
    pass

class StudentUpdate(BaseModel):
    """Model cập nhật Student - tất cả fields đều optional"""
    ma_so_sv: Optional[str] = None
    ho: Optional[str] = None
    ten: Optional[str] = None
    email: Optional[EmailStr] = None
    ngay_sinh: Optional[str] = None
    que_quan: Optional[str] = None
    diem_toan: Optional[float] = Field(None, ge=0, le=10)
    diem_van: Optional[float] = Field(None, ge=0, le=10)
    diem_anh: Optional[float] = Field(None, ge=0, le=10)

class StudentResponse(StudentBase):
    """Model response Student"""
    id: int = Field(..., description="ID tự động tăng")
    diem_trung_binh: Optional[float] = Field(None, description="Điểm trung bình")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "ma_so_sv": "SV001",
                "ho": "Nguyễn Văn",
                "ten": "An",
                "email": "an.nv@example.com",
                "ngay_sinh": "2000-01-15",
                "que_quan": "Hà Nội",
                "diem_toan": 8.5,
                "diem_van": 7.0,
                "diem_anh": 9.0,
                "diem_trung_binh": 8.17
            }
        }