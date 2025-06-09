from random import randint
from time import sleep

from django import forms
from django.shortcuts import render

from djecharts.core.filter import EChartsFilterForm
from djecharts.core.view import EChartsView


def index(request):
    return render(
        request,
        "index.html",
        {
            "test_chart1": TestChartView01.data(),
            "test_chart2": TestChartView02.data(),
        },
    )


class FilterForm(EChartsFilterForm):
    arg1 = forms.IntegerField(required=False)
    arg2 = forms.CharField(required=False)
    arg3 = forms.BooleanField(required=False)
    arg4 = forms.ChoiceField(
        choices=[
            ("a", "AAA"),
            ("b", "BBB"),
            ("c", "CCC"),
        ],
        initial="c",
        required=False,
    )


class TestChartView01(EChartsView):
    title = "Test Chart 01"
    filter_form_class = FilterForm

    top = "30"  # space for the legend.

    def get(self, request):
        form = self.get_form()

        self.title += f" {form.cleaned_data!r}"
        xaxis_values = [str(x) for x in range(1, 1500 + 1)]
        yaxis_values = [randint(100, 500) for _ in range(1500)]

        sleep(1)

        return self.json_response(
            {
                "color": "#a1ffa8",
                "dataZoom": [
                    {
                        "type": "inside",
                        "start": 0,
                        "end": 5,
                    },
                ],
                "xAxis": {
                    "type": "category",
                    "data": xaxis_values,
                },
                "yAxis": {"type": "value"},
                "series": [
                    {
                        "name": "Something",
                        "data": yaxis_values,
                        "type": "bar",
                    }
                ],
            },
        )


class TestChartView02(EChartsView):
    title = "Test Chart 02"
    filter_form_class = FilterForm

    top = "30"  # space for the legend.

    def get(self, request):
        form = self.get_form()

        self.title += f" {form.cleaned_data!r}"
        xaxis_values = [str(x) for x in range(1, 11000 + 1)]
        yaxis_values = [randint(100, 500) for _ in range(11000)]

        sleep(0.5)

        return self.json_response(
            {
                "color": "#f16188",
                "dataZoom": [
                    {
                        "type": "inside",
                        "start": 0,
                        "end": 5,
                    },
                ],
                "xAxis": {
                    "type": "category",
                    "data": xaxis_values,
                },
                "yAxis": {
                    "type": "value",
                    "axisLabel": {
                        "formatter": "{value} ton.",
                    },
                },
                "tooltip": {
                    "trigger": "axis",
                    "axisPointer": {"type": "line"},
                },
                "series": [
                    {
                        "name": "Tonnage",
                        "type": "line",
                        "data": yaxis_values,
                    },
                ],
            }
        )
