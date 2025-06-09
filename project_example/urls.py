from django.urls import path

from project_example import views

urlpatterns = [
    path("", views.index, name="index"),
    views.TestChartView01.path("test-chart-view-01"),
    views.TestChartView02.path("test-chart-view-02"),
]
