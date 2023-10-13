from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.models import Class

# Create your views here.
def main(request):
    return HttpResponse("<h1>CampusLink</h1>")

# handles POST request to save class list
@csrf_exempt
def save_class_list(request):
    if request.method == 'POST':
        class_list = request.POST.getlist('classList[]')
        Class.objects.all().delete()   # Delete all existing classes
        for class_data in class_list:
            class_obj = Class(**class_data)
            class_obj.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})