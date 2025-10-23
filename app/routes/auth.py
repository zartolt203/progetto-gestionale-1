"""
Authentication module: define Admin and routes for login and logout.
"""

from flask import Blueprint, request, redirect, url_for, flash, current_app
from flask_login import UserMixin, login_user, logout_user, login_required
from app import login_manager



auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# Define an AdminUser class that inherits from UserMixin
class AdminUser(UserMixin):
    def get_id(self):
        return 'admin'
    

@login_manager.user_loader
def load_user(user_id):
    if user_id == 'admin':
        return AdminUser()
    return None



@auth_bp.route('/login', methods=['GET', 'POST'])
def login():

    """Manage admin login: check password and log in the user if correct."""

    if request.method == 'POST':

        password = request.form.get('password')

        if password == current_app.config['ADMIN_PASSWORD']:

            user = AdminUser()
            login_user(user)
            flash('Login effettutato con successo!', 'success')
            return redirect(url_for('main.index'))
        else:
            flash('Password sbagliata! Riprova.', 'danger')


@auth_bp.route('/logout')
@login_required
def logout():

    """Logout the user: clear session and redirect to index."""
    
    logout_user()
    flash('Logout effettuato con successo!', 'success')
    return redirect(url_for('main.index'))