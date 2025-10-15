from database import Base
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, func, Date, Float


class Students(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True)
    student_code = Column(String(50), unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(150), unique=True)
    birth_date = Column(Date)
    hometown = Column(String(100))
    math_score = Column(Float, nullable=True)
    literature_score = Column(Float, nullable=True)
    english_score = Column(Float, nullable=True)
    create_at = Column(TIMESTAMP, server_default=func.now())

    @property
    def full_name(self):
        return f"{self.last_name} {self.first_name}"
