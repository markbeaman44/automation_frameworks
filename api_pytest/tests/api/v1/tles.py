import requests
from tests.api.types.interface import params
from tests.api.constant import base_url

def get_tles_api(id: str, parameters: params):
	return requests.request(
		'GET',
		f'{base_url}/v1/satellites/{id}/tles',
		params=parameters
	)
