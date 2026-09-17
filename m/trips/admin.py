from django.contrib import admin

from .models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'departure_date', 'price')
    search_fields = ('title', 'destination')