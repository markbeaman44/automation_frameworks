### Cypress (API Testing)
**Latest Versions (as of 2026):**
- cypress: ^13.x.x (or latest)
- typescript: ^5.x.x

**Structure:**
```
api_cypress/
├── cypress.config.js
├── package.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── cypress/
    ├── e2e/
    │   └── *.cy.js
    ├── fixtures/
    │   └── *.json
    └── support/
        ├── commands.js
        ├── helpers.js
        └── v1/
            └── users.js
```

**Custom Commands (cypress/support/v1/users.js):**
```javascript
import { BASE_URL } from '../helpers';

export function getUsers(page = 1) {
  return cy.request({
    method: 'GET',
    url: `${BASE_URL}/api/users`,
    qs: { page },
  });
}

export function createUser(userData) {
  return cy.request({
    method: 'POST',
    url: `${BASE_URL}/api/users`,
    body: userData,
  });
}

export function updateUser(userId, userData) {
  return cy.request({
    method: 'PUT',
    url: `${BASE_URL}/api/users/${userId}`,
    body: userData,
  });
}

export function deleteUser(userId) {
  return cy.request({
    method: 'DELETE',
    url: `${BASE_URL}/api/users/${userId}`,
  });
}
```

**Test Example (cypress/e2e/users.cy.js):**
```javascript
import { getUsers, createUser } from '../support/v1/users';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', () => {
      getUsers(1).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
        expect(response.body.data.length).to.be.greaterThan(0);
        expect(response.body.page).to.eq(1);
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', () => {
      const userData = {
        name: 'John Doe',
        job: 'Developer',
      };

      createUser(userData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.name).to.eq(userData.name);
        expect(response.body.job).to.eq(userData.job);
        expect(response.body.id).to.exist;
        expect(response.body.createdAt).to.exist;
      });
    });
  });
});
```
