from database import Base
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, func, Date, Float


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True)
    username = Column(String(50), unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    hashed_password = Column(String(150))
    role = Column(String(50))
    department = Column(String(100))
    phone_number = Column(String(15), unique=True)
    is_active = Column(Boolean, default=True)
    create_at = Column(TIMESTAMP, server_default=func.now())

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Students(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True)
    student_code = Column(String(50), unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(150), unique=True)
    birth_date = Column(Date)
    hometown = Column(String(100))
    math_score = Column(Float)
    literature_score = Column(Float)
    english_score = Column(Float)
    create_at = Column(TIMESTAMP, server_default=func.now())

    @property
    def full_name(self):
        return f"{self.last_name} {self.first_name}"