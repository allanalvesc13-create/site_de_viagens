import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def response(data, status=200):
    result = JsonResponse(data, status=status)
    result['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5173'
    result['Access-Control-Allow-Credentials'] = 'true'
    result['Access-Control-Allow-Headers'] = 'Content-Type'
    return result


def request_data(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return None


@csrf_exempt
def register(request):
    if request.method == 'OPTIONS':
        return response({}, status=204)
    if request.method != 'POST':
        return response({'error': 'Método não permitido.'}, status=405)

    data = request_data(request)
    if data is None:
        return response({'error': 'Envie os dados em JSON.'}, status=400)

    username = str(data.get('username', '')).strip()
    email = str(data.get('email', '')).strip()
    password = str(data.get('password', ''))

    if not username or not email or not password:
        return response({'error': 'Preencha nome, e-mail e senha.'}, status=400)
    if len(password) < 8:
        return response({'error': 'A senha precisa ter pelo menos 8 caracteres.'}, status=400)
    if User.objects.filter(username=username).exists():
        return response({'error': 'Esse usuário já está cadastrado.'}, status=400)
    if User.objects.filter(email=email).exists():
        return response({'error': 'Esse e-mail já está cadastrado.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return response({'user': {'username': user.username, 'email': user.email}}, status=201)


@csrf_exempt
def login_view(request):
    if request.method == 'OPTIONS':
        return response({}, status=204)
    if request.method != 'POST':
        return response({'error': 'Método não permitido.'}, status=405)

    data = request_data(request)
    if data is None:
        return response({'error': 'Envie os dados em JSON.'}, status=400)

    username = str(data.get('username', '')).strip()
    password = str(data.get('password', ''))
    user = authenticate(request, username=username, password=password)
    if user is None:
        return response({'error': 'Usuário ou senha inválidos.'}, status=401)

    login(request, user)
    return response({'user': {'username': user.username, 'email': user.email}})


def current_user(request):
    if not request.user.is_authenticated:
        return response({'user': None}, status=401)
    return response({'user': {'username': request.user.username, 'email': request.user.email}})


@csrf_exempt
def logout_view(request):
    if request.method == 'OPTIONS':
        return response({}, status=204)
    logout(request)
    return response({'message': 'Logout realizado.'})