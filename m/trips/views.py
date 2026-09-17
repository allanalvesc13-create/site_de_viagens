import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Trip


def api_response(data, status=200):
    result = JsonResponse(data, status=status)
    result['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5173'
    result['Access-Control-Allow-Credentials'] = 'true'
    result['Access-Control-Allow-Headers'] = 'Content-Type'
    return result


def serialize_trip(trip):
    return {
        'id': trip.id,
        'title': trip.title,
        'destination': trip.destination,
        'description': trip.description,
        'price': str(trip.price),
        'departure_date': trip.departure_date.isoformat(),
    }


@csrf_exempt
def trip_list_create(request):
    if request.method == 'OPTIONS':
        return api_response({}, status=204)
    if request.method == 'GET':
        return api_response({'trips': [serialize_trip(trip) for trip in Trip.objects.all()]})
    if request.method != 'POST':
        return api_response({'error': 'Método não permitido.'}, status=405)
    if not request.user.is_authenticated:
        return api_response({'error': 'Faça login para cadastrar uma viagem.'}, status=401)

    try:
        data = json.loads(request.body or '{}')
        trip = Trip.objects.create(
            title=str(data.get('title', '')).strip(),
            destination=str(data.get('destination', '')).strip(),
            description=str(data.get('description', '')).strip(),
            price=data.get('price', 0),
            departure_date=data.get('departure_date', ''),
        )
    except (ValueError, TypeError):
        return api_response({'error': 'Preencha os dados da viagem corretamente.'}, status=400)

    if not trip.title or not trip.destination:
        trip.delete()
        return api_response({'error': 'Título e destino são obrigatórios.'}, status=400)
    return api_response({'trip': serialize_trip(trip)}, status=201)