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

Puis installons babel

> npm i -D @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties

Puis React

>  npm i react react-dom prop-types

Pour utiliser les presets et plugin de babel nous devon creer un fichier a la racine du projet

> .babelrc

dans ce fichier ajoutez : 

```json
{
"presets": ["@babel/preset-env", "@babel/preset-react"],
"plugins": ["transform-class-properties"]
}
```

Ensuite creer un fichier webpack.config.js a la racine du projet et ajoutez dans ce fichier

```json
module.exports = {
    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loarder: "babel-loader"
                }
            }
        ]
    }
}
```

dans package.json remplacer 

> "test": "echo \"Error: no test specified\" && exit 1"

 par 

> "dev" : "webpack --mode development --watch ./leadmanager/frontend/src/index.js --output ./leadmanager/frontend/static/frontend/main.js"

et ajoutez en dessous 

> "build" : "webpack --mode production ./leadmanager/frontend/src/index.js --output ./leadmanager/frontend/static/frontend/main.js"

creer ensuite le fichier index.js et importer le App.js component dans ce fichier 

```js
import App from './components/App';
```

creer un fichier App.js dans components et importer react

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    render() {
        return <h1>Hello world</h1>;
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

creer un fichier html dans templates/frontend et ajoutez ces lignes :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Lead Manager</title>
    <link href="https://bootswatch.com/4/cosmo/bootstrap.min.css">
</head>
<body>
    <div id="app"></div>
    {% load static %}
    <script src="{% static "frontend/main.js" %}"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
</body>
</html>
```

dans le fichier settings.py se trouvant dans leadmanager ajoutez l'app frontend :

```json
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'leads',
    'rest_framework'
    'frontend'
]
```

Pour charger les templates allez dans leadmanager/frontend et ajoutez :

```python
    def index(request):
     return render(request, 'frontend/index.html')
```

Une fois la vue créé attachez un url a cette vue

dans le dossier leadmanager/frontend creer un fichier urls.py

```python
from django.urls import path
from . import views
urlpatterns = [
    path('',views.index)
]
```

dans le fichier urls.py se trouvant dans leadmanager/leadmanager ajoutez:

```Python
path('', include('frontend.urls')),
```

Dans le dossier Component creer un dossier layout contenant un fichier Header.js

Ajoutez ce code dans le fichier Header.js

```javascript
import React, { Component } from 'react'

export class Header extends Component {
  render() {
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <a className="navbar-brand" href="#">Lead manager</a>
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header
```

Puis importez le dans votre App.js

```javascript
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Header from "./layout/header"

class App extends Component {
    render() {
        return (
            <Header />
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

Creez 3 nouveaux components dans components/leads
 