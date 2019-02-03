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

Dans le dossier leads , creer un fichier serializers.py et ajoutez 

```python
from rest_framework import serializers
from leads.models import Lead

# Lead Serializer
class LeadSerializer(serializers.ModelSerializer)
    class Meta:
        model= Lead 
        fields = '__all__'
```

# Creation de l'api

Creer un fichier api.py dans le dossier leads et ajoutez 

```python
from leads.models import Lead
from rest_framework import viewsets , permissions
from .serializers import LeadSerialiser
```

## Viewsets

https://www.django-rest-framework.org/api-guide/viewsets/

Le viewset permet de creer une CRUD API sans avoir a spécifier les méthodes pour les fonctionnalitées

Pour l'instant nous allons donner l'acces de cette api a tout le monde

Dans le fichier api.py ajoutez :

```python
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serialiser_class = LeadSerializer
```

Creons ensuite l'url, dans le fichier leadmanager/urls.py changez :

```python
from django.urls import path , include

urlpatterns = [
    path('', include('leads.urls')),
]
```

Ensuite creons le fichier urls se trouvant dans leads

```python
from rest_framework import routers
from .api import LeadViewSet

router = routers.DefaultRouter()
router.register('api/leads', LeadViewSet, 'leads')

urlpatterns = router.urls
```

Lancez le serveur : 

> python manage.py runserver

## Accedez aux données via Postman 

https://www.getpostman.com/downloads/

dans GET rentrez l'url de votre api après avoir lancé votre serveur pour lire vos données

http://localhost:8000/api/leads/

Utilisez la méthode Post pour ajoutez des données , exemple :

```json
{
    "id": 2,
    "name": "Jordan Fievet",
    "email": "jordanfievet@outlook.fr",
    "message": "Please contact Jordan",
    "created_at": "2019-02-03T09:44:34.255195Z"
}
```

# frontend

entrer dans l'environnement virtuel

> pipenv shell

puis creer une app

> cd leadmanager

> python manage.py startapp frontend

puis creer un dossier components

> mkdir -p ./frontend/src/components

et deux dossiers static et templates ayant un dossier frontend

> mkdir -p ./frontend/{static,templates}/frontend

Installons webpack

> npm init -y

> npm i -D webpack webpack-cli
