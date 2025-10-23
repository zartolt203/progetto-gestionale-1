"""
Models module: define the SQLAlchemy models for the application.
"""

from app import db
from datetime import date

class Item(db.Model):

    """Item model for the application."""

    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    collo = db.Column(db.String(50), nullable=False)
    codice = db.Column(db.String(50), nullable=False)
    descrizione = db.Column(db.String(200), nullable=True)
    quantita = db.Column(db.Integer, nullable=True)
    locazione = db.Column(db.Enum('magazzino-1', 'magazzino-2'), nullable=True)
    matricola = db.Column(db.String(50), nullable=False)
    note = db.Column(db.String(200), nullable=True)

    pictures = db.relationship("ItemPictures", back_populates="item", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Item {self.collo} {self.codice} {self.matricola}>'
    

class ItemPictures(db.Model):

    """ItemPictures model for the application."""

    __tablename__ = 'item_pictures'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id', ondelete='CASCADE'), nullable=False)
    file_path = db.Column(db.String(200), nullable=False)
    upload_data = db.Column(db.Date, nullable=False, default=date.today)

    item = db.relationship("Item", back_populates="pictures")

    def __repr__(self):
        return f'<Item {self.item_id} pictures saved in {self.file_path}'