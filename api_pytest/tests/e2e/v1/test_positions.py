import pytest
import json

from tests.api.helpers import calculate_value
from tests.api.types.interface import params
from tests.api.v1.positions import get_positions_api

@pytest.mark.parametrize(
    "id,status_codes,parameters",
    [
        ("25544", 200, { 'timestamps': '1436029892' }),
        ("25544", 400, {}),
        ("25543", 404, { 'timestamps': '1436029892' })
    ],
)
def test_satelite_positions_status_code(id, status_codes, parameters):
	response = get_positions_api(id, parameters)
	print(response.json())
	assert response.status_code == status_codes

def test_return_response_data_for_specific_timestamp():
	response = get_positions_api('25544', { 'timestamps': '1436029902' })
	with open('./tests/fixtures/p_ts_1436029902.json') as json_file:
		jsonResults = json.load(json_file)
	assert response.json() == jsonResults

@pytest.mark.parametrize('increment', [i for i in range(1,10)])
def test_comma_delimited_list_of_timestamps(increment: int):
	timestamp = [f"{i}436029902" for i in range(increment)]
	response = get_positions_api('25544', { 'timestamps': timestamp })
	if (increment <= 10):
		assert response.status_code == 200
	else:
		assert response.status_code == 404

@pytest.mark.parametrize(
    "id, eq, parameter_one, parameter_two",
    [
        (
			'25544',
      		'divide',
			{ 'timestamps': '1036029892', 'units': 'miles' },
      		{ 'timestamps': '1036029892', 'units': 'kilometers' }
		),
        (
			'25544',
      		'multiply',
      		{ 'timestamps': '1136044729', 'units': 'kilometers' },
      		{ 'timestamps': '1136044729', 'units': 'miles' }
		)
    ],
)
def test_return_correct_unit_measurement_check_converted_calculations(id, eq, parameter_one, parameter_two):
	response_one = get_positions_api(id, parameter_one)
	assert response_one.json()[0]['units'] == parameter_one['units']

	response_two = get_positions_api(id, parameter_two)
	assert response_two.json()[0]['units'] == parameter_two['units']

	assert round(response_one.json()[0]['altitude'], 2) == round(calculate_value(eq, response_two.json()[0]['altitude']) , 2)
