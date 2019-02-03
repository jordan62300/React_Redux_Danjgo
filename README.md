# Installation

https://www.python.org/downloads/

Verifier que python est bien installer

> python3 -v

Puis installer pour creer un environement virtuel :

> pip3 install pipenv

> pipenv shell

Ensuite installer django

> pipenv install django djangorestframework django-rest-knox

Generer un nouveau django projet

> cd leadmanager

> django-admin startproject leadmanager

Creer une nouvelle app

> python manage.py startapp leads

Dans le fichier setting ce trouvant dans leadmanager/leadmanager changez ce code :

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
 ```

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'leads',
    'rest_framework'
```

# Creation de la BDD 

Le model représente les différents champs que l'on veut avoir

dans le fichier models.py se trouvant dans leadmanager/leads ajoutez :

```python
class Lead(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    message = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

Pour creer une version que l'on pourra migreer vers notre DB :

> python manage.py makemigrations leads

puis envoyer les donnéees vers la DB : 

> python manage.py migrate

.