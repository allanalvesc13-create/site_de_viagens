from django.db import models


class Trip(models.Model):
    title = models.CharField(max_length=120)
    destination = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    departure_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['departure_date', 'title']

    def __str__(self):
        return f'{self.title} - {self.destination}'