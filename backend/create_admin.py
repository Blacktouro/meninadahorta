from app import app, db, bcrypt
from models.user import User

with app.app_context():

    email = "admin@meninadahorta.pt"
    password = "Admin123!"

    existing = User.query.filter_by(email=email).first()

    if existing:
        print("Admin já existe")

    else:

        hashed = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(
            email=email,
            password=hashed
        )

        db.session.add(user)
        db.session.commit()

        print("Admin criado com sucesso")
