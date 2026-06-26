from app.models import db
from app.models.categoria import Categoria
from flask import jsonify
from sqlalchemy.exc import IntegrityError

class CategoriaController:
    @staticmethod
    def get_all():
        categorias = db.session.execute(db.select(Categoria)).scalars().all()
        return jsonify([c.to_dict() for c in categorias]), 200

    @staticmethod
    def get_by_id(id):
        categoria = db.session.get(Categoria, id)
        if not categoria:
            return jsonify({'msg': 'Categoría no encontrada'}), 404
        
        return jsonify(categoria.to_dict()), 200

    @staticmethod
    def create(data):
        if not data.get('nombre'):
            return jsonify({'msg': 'El nombre es obligatorio'}), 400
        
        nueva_cat = Categoria(
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion')
        )
        db.session.add(nueva_cat)
        db.session.commit()
        return jsonify(nueva_cat.to_dict()), 201

    @staticmethod
    def update(id, data):
        categoria = db.session.get(Categoria, id)
        if not categoria:
            return jsonify({'msg': 'Categoría no encontrada'}), 404
        
        categoria.nombre = data.get('nombre', categoria.nombre)
        categoria.descripcion = data.get('descripcion', categoria.descripcion)
        db.session.commit()
        return jsonify(categoria.to_dict()), 200

    @staticmethod
    def delete(id):
        categoria = db.session.get(Categoria, id)
        if not categoria:
            return jsonify({'msg': 'Categoría no encontrada'}), 404
        
        try:
            db.session.delete(categoria)
            db.session.commit()
            return jsonify({'msg': 'Categoría eliminada con éxito'}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'No se puede eliminar: esta categoría tiene elementos asociados.'}), 409
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500