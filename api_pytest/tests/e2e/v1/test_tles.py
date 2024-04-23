import pytest

from tests.api.types.interface import params
from tests.api.v1.tles import get_tles_api

@pytest.mark.parametrize(
    "id,status_codes,parameters",
    [
		("25544", 200, { 'format': 'json' }),
        ("25544", 200, { 'format': 'text' }),
        ("25543", 404, { 'format': 'json' })
    ],
)
def test_satelite_tles_status_code(id, status_codes, parameters):
	response = get_tles_api(id, parameters)
	assert response.status_code == status_codes

@pytest.mark.parametrize(
    "id,parameters,content_type",
    [
		("25544", { 'format': 'json' }, 'application/json'),
    	("25544", { 'format': 'text' }, 'text/plain')
    ],
)
def test_satelite_tles_content_type(id, parameters, content_type):
	response = get_tles_api(id, parameters)
	assert response.headers['content-type'] == content_type
