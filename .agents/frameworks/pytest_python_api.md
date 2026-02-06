### Pytest + Python (API Testing)
**Latest Versions (as of 2026):**
- pytest: ^8.x.x (or latest)
- requests: ^2.x.x
- python: ^3.10+

**Structure:**
```
api_pytest/
├── Dockerfile
├── docker-compose.yaml
├── Makefile
├── requirements.txt
├── README.md
└── tests/
    ├── __init__.py
    ├── api/
    │   ├── __init__.py
    │   ├── test_users.py
    │   ├── helpers.py
    │   ├── constant.py
    │   └── types/
    │       ├── __init__.py
    │       └── interface.py
    └── fixtures/
        └── *.json
```

**requirements.txt:**
```
pytest>=8.0.0
requests>=2.31.0
pytest-html>=4.0.0
```

**Type Definitions (tests/api/types/interface.py):**
```python
from typing import TypedDict, Optional, List

class User(TypedDict):
    id: int
    email: str
    first_name: str
    last_name: str
    avatar: str

class ApiResponse(TypedDict):
    data: List[User]
    page: Optional[int]
    per_page: Optional[int]
    total: Optional[int]
    total_pages: Optional[int]

class CreateUserRequest(TypedDict):
    name: str
    job: str

class CreateUserResponse(CreateUserRequest):
    id: str
    createdAt: str
```

**Helper Functions (tests/api/helpers.py):**
```python
import requests
from typing import Dict, Any
from .constant import BASE_URL

def get_request(endpoint: str, params: Dict[str, Any] = None) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.get(url, params=params)
    return response

def post_request(endpoint: str, data: Dict[str, Any]) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.post(url, json=data)
    return response

def put_request(endpoint: str, data: Dict[str, Any]) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.put(url, json=data)
    return response

def delete_request(endpoint: str) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.delete(url)
    return response
```

**Test Example (tests/api/test_users.py):**
```python
import pytest
from .helpers import get_request, post_request
from .types.interface import User, CreateUserRequest

class TestUsersAPI:
    
    def test_get_users_returns_list(self):
        response = get_request('/api/users', params={'page': 1})
        
        assert response.status_code == 200
        data = response.json()
        assert 'data' in data
        assert isinstance(data['data'], list)
        assert len(data['data']) > 0
        assert data['page'] == 1
    
    def test_create_user_successfully(self):
        user_data: CreateUserRequest = {
            'name': 'John Doe',
            'job': 'Developer'
        }
        
        response = post_request('/api/users', user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data['name'] == user_data['name']
        assert data['job'] == user_data['job']
        assert 'id' in data
        assert 'createdAt' in data
```

**Makefile:**
```makefile
.PHONY: install test test-verbose clean

install:
	pip install -r requirements.txt

test:
	pytest tests/

test-verbose:
	pytest tests/ -v -s

test-report:
	pytest tests/ --html=reports/report.html --self-contained-html

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
```
